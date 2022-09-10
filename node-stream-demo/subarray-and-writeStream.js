const fs = require('fs');

const buffer = fs.readFileSync('./5M.json');
// console.log(buffer.length);
const writableStream = fs
  .createWriteStream('./new5M.json', { highWaterMark: 64 * 1024 })
  .on('finish', () => console.log('finish'))
  .on('error',() => console.log('error'))

function splitBufferToChunks(buffer) {
  const chunks = [];
  let index = 0;
  const chunkSize = 64 * 1024;
  while (index < buffer.length) {
    chunks.push(buffer.subarray(index, index + chunkSize));
    index += chunkSize;
  }
  return chunks;
}

const chunks = splitBufferToChunks(buffer);

let times = 0;
const cb = () => console.log('end');
function write() {
  // console.log(process.memoryUsage())
  var ok = true;
  while (times < chunks.length && ok) {
    if (times === chunks.length - 1) {
      writableStream.end(chunks[times], 'utf8', cb);
    } else {
      ok = writableStream.write(chunks[times], 'utf8');
    }
    times += 1;
  }
  if (times < chunks.length) {
    writableStream.once('drain', write);
  }
}
write();
