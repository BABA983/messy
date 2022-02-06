// const curry = (fn) => {
//   const args = [].slice.call(arguments, 1);
//   console.log(args);
//   return function () {
//     const newArgs = args.concat([].slice.call(arguments));
//     return fn.apply(this, newArgs);
//   };
// };
/**
 *
 * 现在调用：如果传入的 args 长度与原始函数所定义的（func.length）相同或者更长，那么只需要将调用传递给它即可。
 *
 * 获取一个偏函数：否则，func 还没有被调用。取而代之的是，返回另一个包装器 pass，
 * 它将重新应用 curried，将之前传入的参数与新的参数一起传入。
 * 然后，在一个新的调用中，再次，我们将获得一个新的偏函数（如果参数不足的话），或者最终的结果。
 */
function curry(func) {
  return function curried(...args) {
    console.log(args.length);
    console.log(func.length);
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
function sum(a, b, c) {
  return a + b + c;
}
const currySum = curry(sum);

console.log(currySum(1)(2)(3)(4));
