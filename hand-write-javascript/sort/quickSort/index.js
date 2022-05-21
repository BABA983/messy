var arr = [3, 1, 4, 6, 5, 7, 2];

/**
 * 
 （1）在数据集之中，找一个基准点
 （2）建立两个数组，分别存储左边和右边的数组
 （3）利用递归进行下次比较
 */
function quickSort(arr) {
  if (arr.length == 0) {
    return []; // 返回空数组
  }

  var cIndex = Math.floor(arr.length / 2);
  var c = arr.splice(cIndex, 1);
  var l = [];
  var r = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < c) {
      l.push(arr[i]);
    } else {
      r.push(arr[i]);
    }
  }

  return quickSort(l).concat(c, quickSort(r));
}

console.log(quickSort(arr));
