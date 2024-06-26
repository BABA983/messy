export const IDLE_METADATA_KEY = '_i';
function markMetadataAsLocal(metadata) {
    return Object.assign(Object.assign({}, metadata), { isLocal: true });
}
class PresenceMetadataForChannel {
    constructor() {
        this.subscriberMetadata = new Map();
    }
    setMetadata(subscriber, value) {
        this.subscriberMetadata.set(subscriber, value);
    }
    removeSubscribers(subscribers) {
        let found = false;
        for (const subscriber of subscribers) {
            found = this.subscriberMetadata.delete(subscriber) || found;
        }
        return found;
    }
    getMetadata(localizationOptions) {
        if (!localizationOptions) {
            const allMetadata = [];
            let idle;
            for (const subscriberMetadata of this.subscriberMetadata.values()) {
                for (const metadata of subscriberMetadata) {
                    if (IDLE_METADATA_KEY in metadata) {
                        const subscriberIsIdle = Boolean(metadata[IDLE_METADATA_KEY]);
                        idle = idle === undefined ? subscriberIsIdle : subscriberIsIdle && idle;
                    }
                    else {
                        allMetadata.push(metadata);
                    }
                }
            }
            if (idle !== undefined) {
                allMetadata.push({ [IDLE_METADATA_KEY]: idle ? 1 : 0 });
            }
            return allMetadata;
        }
        const metadata = [];
        const { subscriber, markAllAsLocal } = localizationOptions;
        for (const [fromSubscriber, subscriberMetadata] of this.subscriberMetadata) {
            const shouldLocalizeMetadata = markAllAsLocal || fromSubscriber === subscriber;
            const metadataToAdd = shouldLocalizeMetadata ? subscriberMetadata.map(markMetadataAsLocal) : subscriberMetadata;
            metadata.push(...metadataToAdd);
        }
        return metadata;
    }
    hasSubscribers() {
        return this.subscriberMetadata.size > 0;
    }
}
export class PresenceMetadataSet {
    constructor() {
        this.metadataByChannel = new Map();
    }
    setMetadata({ subscriber, channelName, metadata }) {
        let channelMetadata = this.metadataByChannel.get(channelName);
        if (!channelMetadata) {
            channelMetadata = new PresenceMetadataForChannel();
            this.metadataByChannel.set(channelName, channelMetadata);
        }
        channelMetadata.setMetadata(subscriber, metadata);
    }
    removeSubscribers(subscribers) {
        const channelsWithSubscribers = new Set();
        for (const [channelName, channelMetadata] of this.metadataByChannel) {
            const channelHadSubscriber = channelMetadata.removeSubscribers(subscribers);
            if (channelHadSubscriber) {
                channelsWithSubscribers.add(channelName);
            }
            if (!channelMetadata.hasSubscribers()) {
                this.metadataByChannel.delete(channelName);
            }
        }
        return channelsWithSubscribers;
    }
    getChannelMetadata(channelName, localizationOptions) {
        const channelMetadata = this.metadataByChannel.get(channelName);
        return (channelMetadata === null || channelMetadata === void 0 ? void 0 : channelMetadata.getMetadata(localizationOptions)) || [];
    }
}
