const fs = require('fs');

var CHUNK_SIZE = 1 * 1024 * 1024, // 10MB
  buffer = Buffer.alloc(CHUNK_SIZE),
  filePath = './5M.json';

fs.open(filePath, 'r', function (err, fd) {
  if (err) throw err;
  function readNextChunk() {
    fs.read(fd, buffer, 0, CHUNK_SIZE, null, function (err, nread) {
      console.log(fd);
      console.log(nread);
      if (err) throw err;

      if (nread === 0) {
        // done reading file, do any necessary finalization steps

        fs.close(fd, function (err) {
          if (err) throw err;
          console.log('close');
        });
        return;
      }

      var data;
      if (nread < CHUNK_SIZE) data = buffer.slice(0, nread);
      else data = buffer;
      console.log(data);

      // do something with `data`, then call `readNextChunk();`
    });
  }
  readNextChunk();
});
