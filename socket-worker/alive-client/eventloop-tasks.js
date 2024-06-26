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
export async function wait(ms, signal) {
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
function rand(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
export async function retry(fn, attempts, maxDelay = Infinity, signal) {
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
