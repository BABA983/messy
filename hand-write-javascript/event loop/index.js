/**
 * first 进栈，然后执行，打印 1 ，然后出栈
 * second 进栈，然后执行，遇到 setTimeout 函数，开启一个计时器，并将匿名函数推入队列，setTimeout 出栈，second 出栈
 * third 进栈，然后执行，打印 3 ，然后出栈
 * 事件循环检查队列中有没有挂起的消息，找到一个来自 setTimeout 的匿名函数，入栈执行，然后出栈
 */
function first() {
  console.log(1);
}
function second() {
  setTimeout(() => {
    console.log(2);
  }, 0);
}
function third() {
  console.log(3);
}
