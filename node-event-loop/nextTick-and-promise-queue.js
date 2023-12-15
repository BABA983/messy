const fs = require('fs')
const fsPromise = require('fs/promises')
// index.js
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
Promise.resolve().then(() => {
  console.log("this is Promise.resolve 3")
  const array = [1, 2, 3]
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    process.nextTick(() => {
      console.log(index)
      Promise.resolve().then(() => console.log(`promise.resolve in nextTick ${index}`))
    })
    Promise.resolve().then(() => console.log(`promise.resolve ${index}`))
  }
});

const filePath = require('path').join(__dirname, '../node-cluster-demo/index.js')
fs.readFile(filePath, () => {
  console.log('read ../index.js')
  Promise.resolve().then(() => {
    console.log('promise inside fs.readFile')
  })
});
(async () => {
  console.log(process.cwd())
  await fsPromise.readFile(filePath)
  console.log('read ../index.js2')
})()
