class VirtualScroller {
  constructor({ element, height, rowHeight, pageSize, renderItem, loadMore }) {
    if (typeof element === 'string') {
      this.scroller = document.querySelector(element);
    } else if (element instanceof HTMLElement) {
      this.scroller = element;
    }

    if (!this.scroller) {
      throw new Error('VirtualScroller: element is not found');
    }

    if (!height || (typeof height !== 'number' && typeof height !== 'string')) {
      throw new Error('VirtualScroller: height is invalid');
    }

    if (
      !rowHeight ||
      (typeof rowHeight !== 'number' && typeof rowHeight !== 'string')
    ) {
      throw new Error('VirtualScroller: rowHeight is invalid');
    }

    if (typeof renderItem !== 'function') {
      throw new Error('VirtualScroller: renderItem is invalid');
    }

    if (typeof loadMore !== 'function') {
      throw new Error('VirtualScroller: loadMore is invalid');
    }

    this.height = height;
    this.rowHeight = rowHeight;
    this.pageSize =
      typeof pageSize === 'number' && pageSize > 0 ? pageSize : 50;
    this.renderItem = renderItem;
    this.loadMore = loadMore;
    this.data = [];

    const contentBox = document.createElement('div');
    this.contentBox = contentBox;
    this.scroller.append(contentBox);

    this.scroller.style.height =
      typeof height === 'number' ? `${height}px` : height;
    this.scroller.addEventListener('scroll', this._handleScroll);

    this._loadInitData();
  }

  _scrollTop;
  _topHiddenCount = 0;

  _handleScroll = (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    // 总距离 - 视窗高度 - 滚动高度
    const distance = scrollHeight - clientHeight - scrollTop;
    if (distance < 100) {
      const newData = this.loadMore(this.pageSize);
      this.data.push(...newData);
      this._renderNewData(newData);
    }
    const direction = scrollTop > this.scrollTop ? 'down' : 'up';
    this.scrollTop = scrollTop;
    this._toggleTopItem(direction);
    this._toggleBottomItem(direction);
  };

  _toggleTopItem(direction) {
    const { scrollTop } = this.scroller;
    const firstVisibleItemIndex = Math.floor(scrollTop / this.rowHeight);
    console.log(firstVisibleItemIndex);
    const rows = this.contentBox.children;
    if (direction === 'down') {
      for (let i = this._topHiddenCount; i < firstVisibleItemIndex; i++) {
        if (rows[0]) rows[0].remove();
      }
    }
    if (direction === 'up') {
      for (let i = this._topHiddenCount - 1; i >= firstVisibleItemIndex; i--) {
        const item = this.data[i];
        const row = this._renderRow(item);
        this.contentBox.prepend(row);
      }
    }
    this._topHiddenCount = firstVisibleItemIndex;
    const paddingTop = this._topHiddenCount * this.rowHeight;
    this.contentBox.style.paddingTop = `${paddingTop}px`;
  }

  _toggleBottomItem(direction) {
    const { scrollTop, clientHeight } = this.scroller;
    const lastVisibleItemIndex = Math.floor(
      (scrollTop + clientHeight) / this.rowHeight
    );
    console.log(lastVisibleItemIndex);
    const rows = [...this.contentBox.children];

    if (direction === 'up') {
      for (let i = lastVisibleItemIndex + 1; i < this.data.length; i++) {
        const row = rows[i - this._topHiddenCount];
        if (row) row.remove();
      }
    }
    if (direction === 'down') {
      for (
        let i = this._topHiddenCount + rows.length;
        i <= lastVisibleItemIndex;
        i++
      ) {
        const item = this.data[i];
        const row = this._renderRow(item);
        this.contentBox.append(row);
      }
    }
    this._bottomHiddenCount =
      this.data.length - this._topHiddenCount - this.contentBox.children.length;
    const paddingBottom = this._bottomHiddenCount * this.rowHeight;
    this.contentBox.style.paddingBottom = `${paddingBottom}px`;
  }

  _renderRow = (item) => {
    const rowContent = this.renderItem(item);
    const row = document.createElement('div');
    row.classList.add('row');
    row.style.height = `${this.rowHeight}px`;
    row.dataset.index = item;
    row.appendChild(rowContent);
    return row;
  };

  _renderNewData = (newData) => {
    newData.forEach((item) => {
      this.contentBox.append(this._renderRow(item));
    });
  };

  _loadInitData = () => {
    const newData = this.loadMore(this.pageSize);
    this.data.push(...newData);
    this._renderNewData(newData);
  };
}
