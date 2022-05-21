var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
/**
 *
 * 工作原理是通过构建有序序列，对于未排序数据，
 * 在已排序序列中从后向前扫描，找到相应位置并插入，从而达到排序的效果
 */
function insertSort(array) {
  const len = array.length;
  let current;
  let prev;
  for (let i = 1; i < len; i++) {
    current = array[i];
    prev = i - 1;
    while (prev >= 0 && array[prev] > current) {
      array[prev + 1] = array[prev];
      prev--;
    }
    array[prev + 1] = current;
  }
  return array;
}
console.log(insertSort(a));
