export function* eachSlice(values, size) {
    for (let i = 0; i < values.length; i += size) {
        yield values.slice(i, i + size);
    }
}
