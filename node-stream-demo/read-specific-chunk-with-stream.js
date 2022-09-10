const fs = require('fs');

let buffer;
const readableStream = fs
  .createReadStream('./5M.json', { highWaterMark: 1 * 1024 * 1024 })
  .on('readable', function () {
    readableStream.read();
  })
  .on('data', function (chunk) {
    console.log(chunk.length);
    buffer = chunk;
    readableStream.destroy();
  })
  .on('end', function () {
    console.log('end');
    console.log(buffer);
  })
  .on('close', function () {
    console.log('close');
    console.log(buffer);
  });
