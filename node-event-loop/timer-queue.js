// index.js
setTimeout(() => {
  console.log("this is setTimeout 1")
  process.nextTick(() => {
    console.log("this in inner nextTick inside setTimeout 1")
  })
  Promise.resolve().then(() => {
    console.log("this in promise.resolve inside setTimeout 1")
  })
}, 0);
setTimeout(() => {
  console.log("this is setTimeout 2");
  process.nextTick(() =>
    console.log("this is inner nextTick inside setTimeout 2")
  );
}, 0);
setTimeout(() => console.log("this is setTimeout 3"), 0);

process.nextTick(() => console.log("this is process.nextTick 1"));
process.nextTick(() => {
  console.log("this is process.nextTick 2");
  process.nextTick(() =>
    console.log("this is the inner next tick inside next tick")
  );
});
process.nextTick(() => console.log("this is process.nextTick 3"));

Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
Promise.resolve().then(() => {
  console.log("this is Promise.resolve 2");
  process.nextTick(() =>
    console.log("this is the inner next tick inside Promise then block")
  );
});
Promise.resolve().then(() => console.log("this is Promise.resolve 3"));

console.log(__filename)
const filePath = require('path').join(__dirname, '../node-cluster-demo/index.js')
require('fs').readFile(filePath, () => {
  console.log('read ../index.js')
});

