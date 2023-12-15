// index.js
const fs = require("fs");

// https://chromium.googlesource.com/chromium/blink/+/master/Source/core/frame/DOMTimer.cpp#93
setTimeout(() => console.log("this is setTimeout 10"), 10);
setTimeout(() => console.log("this is setTimeout 0"), 0);

fs.readFile(__filename, () => {
  console.log("this is readFile 1");
});
