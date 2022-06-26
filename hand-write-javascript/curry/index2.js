function curry(fn, arity = fn.length) {
  return function nextCurried(prev) {
    return function curried(next) {
      let args = [...prev, next];
      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  };
}
function sum(a, b, c) {
  return a + b + c;
}

const curFn = curry(sum);

console.log(curFn(1)(2)(3));
