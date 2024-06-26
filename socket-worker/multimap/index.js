export default class MultiMap {
    constructor(iterable) {
        this.map = new Map();
        if (iterable) {
            for (const [k, v] of iterable) {
                this.set(k, v);
            }
        }
    }
    get(key) {
        const values = this.map.get(key);
        return values ? values : new Set();
    }
    set(key, value) {
        let values = this.map.get(key);
        if (!values) {
            values = new Set();
            this.map.set(key, values);
        }
        values.add(value);
        return this;
    }
    has(key) {
        return this.map.has(key);
    }
    delete(key, value) {
        const values = this.map.get(key);
        if (!values)
            return false;
        if (!value)
            return this.map.delete(key);
        const deleted = values.delete(value);
        if (!values.size)
            this.map.delete(key);
        return deleted;
    }
    drain(value) {
        const empty = [];
        for (const key of this.keys()) {
            if (this.delete(key, value) && !this.has(key)) {
                empty.push(key);
            }
        }
        return empty;
    }
    keys() {
        return this.map.keys();
    }
    values() {
        return this.map.values();
    }
    entries() {
        return this.map.entries();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    clear() {
        this.map.clear();
    }
    get size() {
        return this.map.size;
    }
}
