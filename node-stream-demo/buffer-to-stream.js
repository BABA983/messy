const fs = require('fs');
const { pipeline, Readable } = require('stream');
const { Buffer } = require('buffer');

const obj = { name: 'BABA', age: 23 };
console.log(obj.toString());
const arr = [1, 2, 3, 4, 5];
const buf = Buffer.from(arr);
console.log(buf);
console.log(Buffer.from(buf));
const json = JSON.stringify(buf);
console.log(
  '%c [ json ]-7',
  'font-size:13px; background:pink; color:#bf2c9f;',
  json
);
// const unit8Buf = new Unit8Buf([1, 2, 3, 5]);
const stat = fs.statSync('./5M.json');
const fileSize = stat.size;
// console.log(
//   '%c [ fileSize ]-9',
//   'font-size:13px; background:pink; color:#bf2c9f;',
//   fileSize
// );
// console.log(
//   '%c [ buf ]-6',
//   'font-size:13px; background:pink; color:#bf2c9f;',
//   buf
// );
const readableStream = Readable.from(buf);
// const readableStream = Readable.from(unit8Buf);
// const readableStream = Readable.from('asoidnqwpidnqwipdjqwpiejqwpe');
const writableStream = fs.createWriteStream('./buffer-to-stream.txt');
const size = readableStream.readableLength;
console.log(
  '%c [ size ]-14',
  'font-size:13px; background:pink; color:#bf2c9f;',
  size
);
console.log(buf.byteLength);
readableStream.on('data', (chunk) => {
  console.log(chunk.length);
});

writableStream.on('pipe', (src) => {
  // console.log(src)
});
pipeline(readableStream, writableStream, (err) => {});
