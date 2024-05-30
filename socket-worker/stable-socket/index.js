async function timeout(ms, signal) {
    let id;
    const done = new Promise((resolve, reject) => {
        id = self.setTimeout(() => reject(new Error('timeout')), ms);
    });
    if (!signal)
        return done;
    try {
        await Promise.race([done, whenAborted(signal)]);
    }
    catch (e) {
        self.clearTimeout(id);
        throw e;
    }
}
async function wait(ms, signal) {
    let id;
    const done = new Promise(resolve => {
        id = self.setTimeout(resolve, ms);
    });
    if (!signal)
        return done;
    try {
        await Promise.race([done, whenAborted(signal)]);
    }
    catch (e) {
        self.clearTimeout(id);
        throw e;
    }
}
async function retry(fn, attempts, maxDelay = Infinity, signal) {
    const aborted = signal ? whenAborted(signal) : null;
    for (let i = 0; i < attempts; i++) {
        try {
            const op = aborted ? Promise.race([fn(), aborted]) : fn();
            return await op;
        }
        catch (e) {
            if (e.name === 'AbortError')
                throw e;
            if (i === attempts - 1)
                throw e;
            const ms = Math.pow(2, i) * 1000;
            const vary = rand(ms * 0.1);
            await wait(Math.min(maxDelay, ms + vary), signal);
        }
    }
    throw new Error('retry failed');
}
function whenAborted(signal) {
    return new Promise((resolve, reject) => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        if (signal.aborted) {
            reject(error);
        }
        else {
            signal.addEventListener('abort', () => reject(error));
        }
    });
}
function rand(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function connect(url, ms, signal) {
    const socket = new WebSocket(url);
    const opened = whenOpen(socket);
    try {
        await Promise.race([opened, timeout(ms, signal)]);
        return socket;
    }
    catch (e) {
        shutdown(opened);
        throw e;
    }
}
async function shutdown(opened) {
    try {
        const socket = await opened;
        socket.close();
    }
    catch (_a) {
    }
}
function connectWithRetry(url, policy) {
    const fn = () => connect(url, policy.timeout, policy.signal);
    return retry(fn, policy.attempts, policy.maxDelay, policy.signal);
}
function whenOpen(socket) {
    return new Promise((resolve, reject) => {
        if (socket.readyState === WebSocket.OPEN) {
            resolve(socket);
        }
        else {
            socket.onerror = () => {
                socket.onerror = null;
                socket.onopen = null;
                reject(new Error('connect failed'));
            };
            socket.onopen = () => {
                socket.onerror = null;
                socket.onopen = null;
                resolve(socket);
            };
        }
    });
}

class StableSocket {
    constructor(url, delegate, policy) {
        this.socket = null;
        this.opening = null;
        this.url = url;
        this.delegate = delegate;
        this.policy = policy;
    }
    async open() {
        if (this.opening || this.socket)
            return;
        this.opening = new AbortController();
        const policy = Object.assign(Object.assign({}, this.policy), { signal: this.opening.signal });
        try {
            this.socket = await connectWithRetry(this.url, policy);
        }
        catch (_a) {
            this.delegate.socketDidFinish(this);
            return;
        }
        finally {
            this.opening = null;
        }
        this.socket.onclose = (event) => {
            this.socket = null;
            this.delegate.socketDidClose(this, event.code, event.reason);
            const fatal = this.delegate.socketShouldRetry
                ? !this.delegate.socketShouldRetry(this, event.code)
                : isFatal(event.code);
            if (fatal) {
                this.delegate.socketDidFinish(this);
            }
            else {
                setTimeout(() => this.open(), rand$1(100, 100 + (this.delegate.reconnectWindow || 50)));
            }
        };
        this.socket.onmessage = (event) => {
            this.delegate.socketDidReceiveMessage(this, event.data);
        };
        this.delegate.socketDidOpen(this);
    }
    close(code, reason) {
        if (this.opening) {
            this.opening.abort();
            this.opening = null;
        }
        else if (this.socket) {
            this.socket.onclose = null;
            this.socket.close(code, reason);
            this.socket = null;
            this.delegate.socketDidClose(this, code, reason);
            this.delegate.socketDidFinish(this);
        }
    }
    send(data) {
        if (this.socket) {
            this.socket.send(data);
        }
    }
    isOpen() {
        return !!this.socket;
    }
}
function rand$1(min, max) {
    return Math.random() * (max - min) + min;
}
function isFatal(code) {
    return code === POLICY_VIOLATION || code === INTERNAL_ERROR;
}
const POLICY_VIOLATION = 1008;
const INTERNAL_ERROR = 1011;

class BufferedSocket {
    constructor(socket) {
        this.buf = [];
        this.socket = socket;
        this.delegate = socket.delegate;
        socket.delegate = this;
    }
    open() {
        return this.socket.open();
    }
    close(code, reason) {
        this.socket.close(code, reason);
    }
    send(data) {
        if (this.socket.isOpen()) {
            this.flush();
            this.socket.send(data);
        }
        else {
            this.buf.push(data);
        }
    }
    isOpen() {
        return this.socket.isOpen();
    }
    flush() {
        for (const data of this.buf) {
            this.socket.send(data);
        }
        this.buf.length = 0;
    }
    socketDidOpen(socket) {
        this.flush();
        this.delegate.socketDidOpen(socket);
    }
    socketDidClose(socket, code, reason) {
        this.delegate.socketDidClose(socket, code, reason);
    }
    socketDidFinish(socket) {
        this.delegate.socketDidFinish(socket);
    }
    socketDidReceiveMessage(socket, message) {
        this.delegate.socketDidReceiveMessage(socket, message);
    }
    socketShouldRetry(socket, code) {
        return this.delegate.socketShouldRetry ? this.delegate.socketShouldRetry(socket, code) : !isFatal(code);
    }
}

export { BufferedSocket, StableSocket, connect, connectWithRetry };
