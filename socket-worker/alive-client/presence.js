export function getPresenceKey(userId, presenceId) {
    return `${userId}:${presenceId}`;
}
export function decompressItem(data) {
    const [presenceId, connectionCount] = data.p.split('.');
    return {
        userId: data.u,
        presenceKey: getPresenceKey(data.u, presenceId),
        connectionCount: Number(connectionCount),
        metadata: data.m || []
    };
}
const presenceChannelPrefix = 'presence-';
export function isPresenceChannel(channelName) {
    return channelName.startsWith(presenceChannelPrefix);
}
class PresenceChannel {
    constructor() {
        this.presenceItems = new Map();
    }
    shouldUsePresenceItem(item) {
        const existingItem = this.presenceItems.get(item.presenceKey);
        return !existingItem || existingItem.connectionCount <= item.connectionCount;
    }
    addPresenceItem(item) {
        if (!this.shouldUsePresenceItem(item)) {
            return;
        }
        this.presenceItems.set(item.presenceKey, item);
    }
    removePresenceItem(item) {
        if (!this.shouldUsePresenceItem(item)) {
            return;
        }
        this.presenceItems.delete(item.presenceKey);
    }
    replacePresenceItems(items) {
        this.presenceItems.clear();
        for (const item of items) {
            this.addPresenceItem(item);
        }
    }
    getPresenceItems() {
        return Array.from(this.presenceItems.values());
    }
}
export class AlivePresence {
    constructor() {
        this.presenceChannels = new Map();
    }
    getPresenceChannel(channelName) {
        const channel = this.presenceChannels.get(channelName) || new PresenceChannel();
        this.presenceChannels.set(channelName, channel);
        return channel;
    }
    handleMessage(channelName, data) {
        const channel = this.getPresenceChannel(channelName);
        switch (data.e) {
            case 'pf':
                channel.replacePresenceItems(data.d.map(decompressItem));
                break;
            case 'pa':
                channel.addPresenceItem(decompressItem(data.d));
                break;
            case 'pr':
                channel.removePresenceItem(decompressItem(data.d));
                break;
        }
        return this.getChannelItems(channelName);
    }
    getChannelItems(channelName) {
        const channel = this.getPresenceChannel(channelName);
        return channel.getPresenceItems();
    }
    clearChannel(channelName) {
        this.presenceChannels.delete(channelName);
    }
}
