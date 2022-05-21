var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
/**
 *
 * 首先将最小的元素存放在序列的起始位置，再从剩余未排序元素中继续寻找最小元素，
 * 然后放到已排序的序列后面……以此类推，直到所有元素均排序完毕
 */
function selectSort(array) {
  const len = array.length;
  let temp;
  let minIndex;
  for (let i = 0; i < len - 1; i++) {
    minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (array[j] <= array[minIndex]) {
        minIndex = j;
      }
    }
    temp = array[i];
    array[i] = array[minIndex];
    array[minIndex] = temp;
  }
  return array;
}
console.log(selectSort(a));
