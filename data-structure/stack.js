class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * 插入 O(1)
 * 删除 O(1)
 * 查找 O(n)
 * 访问 O(n)
 */
class Stack {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  push(value) {
    const newNode = new Node(value);
    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      const temp = this.first;
      this.first = newNode;
      this.first.next = temp;
    }
    return ++this.size;
  }
  pop() {
    if (!this.first) return null;
    var temp = this.first;
    if (this.first === this.last) {
      this.last = null;
    }
    this.first = this.first.next;
    this.size--;
    return temp.value;
  }
}

const stack = new Stack();

stack.push('value1');
stack.push('value2');
stack.push('value3');
console.log(stack.first);
console.log(stack.last);
console.log(stack.size);

stack.push('value4');
console.log(stack.pop());
