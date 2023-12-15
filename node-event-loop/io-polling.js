// index.js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);
setImmediate(() => console.log("this is setImmediate 1"));

// for (let i = 0; i < 2000000000; i++) { }
// io polling occurs between io queue and check queue
// io poll check if io operation complete, if completed then add to io queue
// but it already pass the io queue execution phase and it have to wait to the next loop
