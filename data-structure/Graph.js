class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  // addNode 将节点值作为参数，如果邻接列表没有键的话，就把节点值传入邻接链表作为键
  addNode(node) {
    if (!this.adjacencyList[node]) this.adjacencyList[node] = [];
  }
  // addConnection 将两个节点作为参数，并添加到每一个节点键对应的值的数组中
  addConnection(node1, node2) {
    this.adjacencyList[node1].push(node2);
    this.adjacencyList[node2].push(node1);
  }
  // removeConnection 方法将两个节点作为参数，并删除掉非自己节点对应数组里的值
  removeConnection(node1, node2) {
    this.adjacencyList[node1] = this.adjacencyList[node1].filter(
      (v) => v !== node2
    );
    this.adjacencyList[node2] = this.adjacencyList[node2].filter(
      (v) => v !== node1
    );
  }
  // removeNode 方法将节点作为参数，删除该节点所有的连接，并且删除列表中该节点相关的键
  removeNode(node) {
    while (this.adjacencyList[node].length) {
      const adjacentNode = this.adjacencyList[node].pop();
      this.removeConnection(node, adjacentNode);
    }
    delete this.adjacencyList[node];
  }
}

const Argentina = new Graph();
Argentina.addNode('Buenos Aires');
Argentina.addNode('Santa fe');
Argentina.addNode('Córdoba');
Argentina.addNode('Mendoza');
Argentina.addConnection('Buenos Aires', 'Córdoba');
Argentina.addConnection('Buenos Aires', 'Mendoza');
Argentina.addConnection('Santa fe', 'Córdoba');

console.log(Argentina);
