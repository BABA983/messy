const fs = require('fs');
const crypto = require('crypto');
const { pipeline, Readable, PassThrough, Duplex } = require('stream');

const hashStream = crypto.createHash('sha256');
hashStream.setEncoding('base64');

// const inputStream = fs.createReadStream('./4gb_file');
// const inputStream = new PassThrough();
// inputStream.end(fs.readFileSync('./5M.json'));
// inputStream.end(fs.readFileSync('./1gb_file'));
function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
const inputStream = bufferToStream(fs.readFileSync('./5M.json'));
// const inputStream = Readable.from(fs.readFileSync('./5M.json'), {
//   highWaterMark: 65536,
//   objectMode: false,
// });
// const inputStream = fs.createReadStream("./5M.json")
const outputStream = fs.createWriteStream('./checksum.txt');
// console.log(inputStream)

inputStream.on('data', (chunk) => {
  console.log(chunk.length);
});

pipeline(inputStream, hashStream, outputStream, (err) => {
  err && console.error(err);
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
});
