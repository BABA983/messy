const virtualScroller = new VirtualScroller({
  element: '#virtual-scroller',
  height: '100vh',
  rowHeight: 60,
  pageSize: 1000,
  renderItem: function (dataItem) {
    const div = document.createElement('div');
    div.classList.add('row-content');
    div.textContent = dataItem;
    return div;
  },
  loadMore: function (pageSize) {
    const data = [];
    for (let i = 0; i < pageSize; i++) {
      const dataItem = `Item ${this.data.length + i}`;
      data.push(dataItem);
    }
    return data;
  },
});
