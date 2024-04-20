var btn = document.querySelector(".btn");
var btn2 = document.querySelector(".btn2");
var container = document.querySelector(".container");

// If startTime outside task function, behavior seems like different
// const startTime = performance.now();
function task() {
  const startTime = performance.now();
  let span = document.createElement("span");
  span.innerText = 1;
  while (performance.now() - startTime < 1) {
    // block 1 ms
  }
  container.appendChild(span);
}

function pushHighPriorityTask() {
  const startTime = performance.now();
  let span = document.createElement("span");
  span.style.color = "red";
  span.innerHTML = "<strong>High Priority</strong>";

  while (performance.now() - startTime < 1) {
    // block 1 ms
  }
  container.appendChild(span);
}

const taskQueue = Array.from({ length: 100000 }, () => task);

btn2.onclick = () => {
  taskQueue.push(pushHighPriorityTask);
};

btn.onclick = () => {
  btn.innerHTML = "Loading";
  //   doWork();
  requestIdleCallback(doWork2);
};
function doWork() {
  setTimeout(() => {
    for (let i = 0; i < 100000; i++) {
      let span = document.createElement("span");
      span.innerText = 1;
      container.appendChild(span);
    }
    btn.innerText = "Click me!!!";
  }, 100);
}

function doWork2() {
  if (taskQueue.length === 0) {
    btn.innerText = "Click me!!!";
    return;
  }
  requestIdleCallback((deadline) => {
    let task;
    while (!deadline.didTimeout && deadline.timeRemaining() > 0) {
      if (taskQueue.length === 0) break;
      task = taskQueue.pop();
      task();
    }
    doWork2();
  });
}
