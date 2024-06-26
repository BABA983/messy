import { AlivePresence, getPresenceKey, isPresenceChannel } from './presence.js';
import { IDLE_METADATA_KEY, PresenceMetadataSet } from './presence-metadata.js';
import { StableSocket } from '@github/stable-socket';
import { SubscriptionSet } from './subscription-set.js';
import { eachSlice } from './iterables.js';
import { retry } from './eventloop-tasks.js';
var SocketDisconnectReasons;
(function (SocketDisconnectReasons) {
    SocketDisconnectReasons["Deploy"] = "Alive Redeploy";
    SocketDisconnectReasons["Reconnect"] = "Alive Reconnect";
})(SocketDisconnectReasons || (SocketDisconnectReasons = {}));
function generatePresenceId() {
    return `${Math.round(Math.random() * (Math.pow(2, 31) - 1))}_${Math.round(Date.now() / 1000)}`;
}
function getUserIdFromSocketUrl(url) {
    const match = url.match(/\/u\/(\d+)\/ws/);
    return match ? +match[1] : 0;
}
export class AliveSession {
    constructor(url, getUrl, inSharedWorker, notify, maxReconnectBackoff = 600000) {
        this.url = url;
        this.getUrl = getUrl;
        this.inSharedWorker = inSharedWorker;
        this.notify = notify;
        this.maxReconnectBackoff = maxReconnectBackoff;
        this.subscriptions = new SubscriptionSet();
        this.state = 'online';
        this.retrying = null;
        this.connectionCount = 0;
        this.presence = new AlivePresence();
        this.presenceMetadata = new PresenceMetadataSet();
        this.intentionallyDisconnected = false;
        this.lastCameOnline = 0;
        this.userId = getUserIdFromSocketUrl(url);
        this.presenceId = generatePresenceId();
        this.presenceKey = getPresenceKey(this.userId, this.presenceId);
        this.socket = this.connect();
    }
    subscribe(subscriptions) {
        const added = this.subscriptions.add(...subscriptions);
        this.sendSubscribe(added);
        for (const subscription of subscriptions) {
            const channel = subscription.topic.name;
            if (!isPresenceChannel(channel)) {
                continue;
            }
            this.notifyCachedPresence(subscription.subscriber, channel);
        }
    }
    unsubscribe(subscriptions) {
        const removed = this.subscriptions.delete(...subscriptions);
        this.sendUnsubscribe(removed);
    }
    unsubscribeAll(...subscribers) {
        const removed = this.subscriptions.drain(...subscribers);
        this.sendUnsubscribe(removed);
        const updatedPresenceChannels = this.presenceMetadata.removeSubscribers(subscribers);
        this.sendPresenceMetadataUpdate(updatedPresenceChannels);
    }
    requestPresence(subscriber, channels) {
        for (const channel of channels) {
            this.notifyCachedPresence(subscriber, channel);
        }
    }
    notifyCachedPresence(subscriber, channel) {
        const presenceItems = this.presence.getChannelItems(channel);
        if (presenceItems.length === 0) {
            return;
        }
        this.notifyPresenceChannel(channel, presenceItems);
    }
    updatePresenceMetadata(metadataUpdates) {
        const updatedChannels = new Set();
        for (const update of metadataUpdates) {
            this.presenceMetadata.setMetadata(update);
            updatedChannels.add(update.channelName);
        }
        this.sendPresenceMetadataUpdate(updatedChannels);
    }
    sendPresenceMetadataUpdate(channelNames) {
        if (!channelNames.size) {
            return;
        }
        const topics = [];
        for (const channelName of channelNames) {
            const topic = this.subscriptions.topic(channelName);
            if (topic) {
                topics.push(topic);
            }
        }
        this.sendSubscribe(topics);
    }
    online() {
        var _a;
        this.lastCameOnline = Date.now();
        this.state = 'online';
        (_a = this.retrying) === null || _a === void 0 ? void 0 : _a.abort();
        this.socket.open();
    }
    offline() {
        var _a;
        this.state = 'offline';
        (_a = this.retrying) === null || _a === void 0 ? void 0 : _a.abort();
        this.socket.close();
    }
    shutdown() {
        if (this.inSharedWorker) {
            self.close();
        }
    }
    get reconnectWindow() {
        const wasRecentlyOffline = Date.now() - this.lastCameOnline < 60 * 1000;
        if (this.connectionCount === 0 || this.intentionallyDisconnected || wasRecentlyOffline) {
            return 0;
        }
        return 10 * 1000;
    }
    socketDidOpen() {
        this.intentionallyDisconnected = false;
        this.connectionCount++;
        this.socket.url = this.getUrlWithPresenceId();
        this.sendSubscribe(this.subscriptions.topics());
    }
    socketDidClose(socket, code, reason) {
        if (this.redeployEarlyReconnectTimeout !== undefined) {
            clearTimeout(this.redeployEarlyReconnectTimeout);
        }
        if (reason === "Alive Reconnect") {
            this.intentionallyDisconnected = true;
        }
        else if (reason === "Alive Redeploy") {
            this.intentionallyDisconnected = true;
            const reconnectDelayMinutes = 3 + Math.random() * 22;
            const reconnectDelay = reconnectDelayMinutes * 60 * 1000;
            this.redeployEarlyReconnectTimeout = setTimeout(() => {
                this.intentionallyDisconnected = true;
                this.socket.close(1000, 'Alive Redeploy Early Client Reconnect');
            }, reconnectDelay);
        }
    }
    socketDidFinish() {
        if (this.state === 'offline')
            return;
        this.reconnect();
    }
    socketDidReceiveMessage(_, message) {
        const payload = JSON.parse(message);
        switch (payload.e) {
            case 'ack': {
                this.handleAck(payload);
                break;
            }
            case 'msg': {
                this.handleMessage(payload);
                break;
            }
        }
    }
    handleAck(ack) {
        for (const topic of this.subscriptions.topics()) {
            topic.offset = ack.off;
        }
    }
    handleMessage(msg) {
        const channel = msg.ch;
        const topic = this.subscriptions.topic(channel);
        if (!topic)
            return;
        topic.offset = msg.off;
        if ('e' in msg.data) {
            const presenceItems = this.presence.handleMessage(channel, msg.data);
            this.notifyPresenceChannel(channel, presenceItems);
            return;
        }
        if (!msg.data.wait)
            msg.data.wait = 0;
        this.notify(this.subscriptions.subscribers(channel), {
            channel,
            type: 'message',
            data: msg.data
        });
    }
    notifyPresenceChannel(channel, presenceItems) {
        var _a, _b;
        const userPresenceById = new Map();
        for (const presenceItem of presenceItems) {
            const { userId, metadata, presenceKey } = presenceItem;
            const userPresence = userPresenceById.get(userId) || { userId, isOwnUser: userId === this.userId, metadata: [] };
            if (presenceKey === this.presenceKey) {
                continue;
            }
            for (const data of metadata) {
                if (IDLE_METADATA_KEY in data) {
                    if (userPresence.isIdle !== false) {
                        userPresence.isIdle = Boolean(data[IDLE_METADATA_KEY]);
                    }
                    continue;
                }
                userPresence.metadata.push(data);
            }
            userPresenceById.set(userId, userPresence);
        }
        for (const subscriber of this.subscriptions.subscribers(channel)) {
            const userId = this.userId;
            const otherUsers = Array.from(userPresenceById.values()).filter(user => user.userId !== userId);
            const ownUserRemoteMetadata = (_b = (_a = userPresenceById.get(this.userId)) === null || _a === void 0 ? void 0 : _a.metadata) !== null && _b !== void 0 ? _b : [];
            const ownUserLocalMetadata = this.presenceMetadata.getChannelMetadata(channel, {
                subscriber,
                markAllAsLocal: !this.inSharedWorker
            });
            this.notify([subscriber], {
                channel,
                type: 'presence',
                data: [
                    {
                        userId,
                        isOwnUser: true,
                        metadata: [...ownUserRemoteMetadata, ...ownUserLocalMetadata]
                    },
                    ...otherUsers
                ]
            });
        }
    }
    async reconnect() {
        if (this.retrying)
            return;
        try {
            this.retrying = new AbortController();
            const url = await retry(this.getUrl, Infinity, this.maxReconnectBackoff, this.retrying.signal);
            if (url) {
                this.url = url;
                this.socket = this.connect();
            }
            else {
                this.shutdown();
            }
        }
        catch (e) {
            if (e.name !== 'AbortError')
                throw e;
        }
        finally {
            this.retrying = null;
        }
    }
    getUrlWithPresenceId() {
        const liveUrl = new URL(this.url, self.location.origin);
        liveUrl.searchParams.set('shared', this.inSharedWorker.toString());
        liveUrl.searchParams.set('p', `${this.presenceId}.${this.connectionCount}`);
        return liveUrl.toString();
    }
    connect() {
        const socket = new StableSocket(this.getUrlWithPresenceId(), this, { timeout: 4000, attempts: 7 });
        socket.open();
        return socket;
    }
    sendSubscribe(topics) {
        const entries = Array.from(topics);
        for (const slice of eachSlice(entries, 25)) {
            const subscribe = {};
            for (const topic of slice) {
                if (isPresenceChannel(topic.name)) {
                    subscribe[topic.signed] = JSON.stringify(this.presenceMetadata.getChannelMetadata(topic.name));
                }
                else {
                    subscribe[topic.signed] = topic.offset;
                }
            }
            this.socket.send(JSON.stringify({ subscribe }));
        }
    }
    sendUnsubscribe(topics) {
        const signed = Array.from(topics, t => t.signed);
        for (const slice of eachSlice(signed, 25)) {
            this.socket.send(JSON.stringify({ unsubscribe: slice }));
        }
        for (const topic of topics) {
            if (isPresenceChannel(topic.name)) {
                this.presence.clearChannel(topic.name);
            }
        }
    }
}
