function curry(fn) {
  const judge = (...args) => {
    if (args.length === fn.length) return fn(...args);
    return (...arg) => judge(...args, ...arg);
  };
  return judge;
}

function sum(a, b, c) {
  return a + b + c;
}

const curFn = curry(sum);

console.log(curFn(1)(2)(3));
