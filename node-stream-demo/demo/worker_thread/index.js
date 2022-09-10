const express = require('express');
const { Worker } = require('worker_threads');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const THREAD_COUNT = 1;

function test() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done');
    }, 1000);
  });
}
(async () => {
  console.log(1);
  console.log(await test());
  console.log(2);
})();

app.get('/non-blocking/', (req, res) => {
  res.status(200).send('This page is non-blocking');
});

function createWorker() {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: { thread_count: THREAD_COUNT },
    });
    worker.on('message', (data) => {
      resolve(data);
    });
    worker.on('error', (msg) => {
      reject(`An error ocurred: ${msg}`);
    });
  });
}

app.get('/blocking', async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }
  const thread_results = await Promise.all(workerPromises);
  const total =
    thread_results[0] +
    thread_results[1] +
    thread_results[2] +
    thread_results[3];
  res.status(200).send(`result is ${total}`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
