// 函数节流的实现;
function throttle(fn, delay) {
  var preTime = Date.now();

  return function () {
    var context = this,
      args = arguments,
      nowTime = Date.now();

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - preTime >= delay) {
      preTime = Date.now();
      return fn.apply(context, args);
    }
  };
}

const fn = () => console.log(new Date());
const thFn = throttle(fn, 100);

for (let index = 0; index < 10000000; index++) {
  thFn();
}
