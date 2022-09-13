class Node {
  //每一个节点包含两个属性，其值以及一个指向下一个节点的指针
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}


/**
 * 
 * O 和 Stack 一样
 */
class Queue {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }
  enqueue(val) {
    const newNode = new Node(val);
    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }
    return ++this.size;
  }
  dequeue() {
    if (!this.first) return null;

    const temp = this.first;
    if (this.first === this.last) {
      this.last = null;
    }
    this.first = this.first.next;
    this.size--;
    return temp.value;
  }
}

const queue = new Queue();

queue.enqueue('value1');
queue.enqueue('value2');
queue.enqueue('value3');

console.log(queue.first);
console.log(queue.last);
console.log(queue.size);

queue.enqueue('value4');
console.log(queue.dequeue());
