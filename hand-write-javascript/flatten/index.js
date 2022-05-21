function flatten(arr) {
  return arr.reduce(function (prev, item) {
    return prev.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

console.log(flatten([1, 2, 3, [4, 5, 6, [7, 8, [9], [10, [11, 12, 13]]]]]));
