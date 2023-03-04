import express from "express";

const port = 4000;
const app = express();

// loadtest -n 1200 -c 200 -k http://localhost:4000/heavy
console.log(`worker pid=${process.pid}`);
// pm2 start index.js -i 0
// pm2 logs
// pm2 ls
// pm2 delete index.js
// pm2 ecosystem

app.get("/heavy", (req, res) => {
  let total = 0;
  for (let i = 0; i < 5_000_000; i++) {
    total++;
  }
  res.send(`The result of the CPU intensive task is ${total}\n`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});