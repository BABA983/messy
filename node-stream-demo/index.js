const fs = require('fs');

const buffer = Buffer.from(fs.readFileSync('./5M.json'));

console.log(buffer.subarray(5242880,5247008123))

const buf = Buffer.from('Hello World!');

console.log(buf.length)
console.log(buf.toJSON())