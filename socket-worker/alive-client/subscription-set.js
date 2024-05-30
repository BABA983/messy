import MultiMap from '@github/multimap';
export class SubscriptionSet {
    constructor() {
        this.subscriptions = new MultiMap();
        this.signatures = new Map();
    }
    add(...subscriptions) {
        const added = [];
        for (const { subscriber, topic } of subscriptions) {
            if (!this.subscriptions.has(topic.name)) {
                added.push(topic);
                this.signatures.set(topic.name, topic);
            }
            this.subscriptions.set(topic.name, subscriber);
        }
        return added;
    }
    delete(...subscriptions) {
        const removed = [];
        for (const { subscriber, topic } of subscriptions) {
            const deleted = this.subscriptions.delete(topic.name, subscriber);
            if (deleted && !this.subscriptions.has(topic.name)) {
                removed.push(topic);
                this.signatures.delete(topic.name);
            }
        }
        return removed;
    }
    drain(...subscribers) {
        const removed = [];
        for (const subscriber of subscribers) {
            for (const name of this.subscriptions.drain(subscriber)) {
                const topic = this.signatures.get(name);
                this.signatures.delete(name);
                removed.push(topic);
            }
        }
        return removed;
    }
    topics() {
        return this.signatures.values();
    }
    topic(name) {
        return this.signatures.get(name) || null;
    }
    subscribers(topic) {
        return this.subscriptions.get(topic).values();
    }
}