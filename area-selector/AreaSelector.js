class AreaSelector {
  constructor({ element, target, datasetKeyForSelected, onSelect }) {
    this.element = element;
    this.target = target;
    this.datasetKeyForSelected = datasetKeyForSelected;
    this.onSelect = onSelect;
    this.selectedIds = [];
    this._createSelectArea();
    this._handleMouseDown();
    this._handleMouseUp();
  }

  _area;
  _startPoint;
  _endPoint;
  _mouseMoveHandler;
  _ctrlKeyPressed;
  _currSelectedIds;
  _prevSelectedIds;

  _createSelectArea = () => {
    const area = document.createElement('div');
    this.element.style.position = 'relative';
    area.style.position = 'absolute';
    area.style.border = '1px solid skyblue';
    area.style.background = 'rgba(18, 211, 211, 0.2)';
    this.element.appendChild(area);
    this._area = area;
  };

  _hasIntersection = (rect1, rect2) => {
    const rect1Left = rect1.left;
    const rect1Top = rect1.top;
    const rect1Right = rect1.right;
    const rect1Bottom = rect1.bottom;
    const rect2Left = rect2.left;
    const rect2Top = rect2.top;
    const rect2Right = rect2.right;
    const rect2Bottom = rect2.bottom;
    const rect1Width = rect1.width;
    const rect1Height = rect1.height;
    const rect2Width = rect2.width;
    const rect2Height = rect2.height;
    const hasIntersection = !(
      rect2Left > rect1Right ||
      rect1Left > rect2Right ||
      rect2Top > rect1Bottom ||
      rect1Top > rect2Bottom ||
      rect1Width <= 0 ||
      rect1Height <= 0 ||
      rect2Width <= 0 ||
      rect2Height <= 0
    );

    return hasIntersection;
  };

  _selectItems = () => {
    const areaRect = this._area.getBoundingClientRect();
    const items = this.element.querySelectorAll(this.target);
    for (const item of items) {
      const itemRect = item.getBoundingClientRect();
      const hasIntersection = this._hasIntersection(areaRect, itemRect);
      const itemId = item.dataset[this.datasetKeyForSelected];
      const index = this.selectedIds.indexOf(itemId);
      const currIndex = this._currSelectedIds.indexOf(itemId);

      let selected;
      if (this._prevSelectedIds.includes(itemId)) {
        selected = false;
      } else {
        if (this._ctrlKeyPressed) {
          if (index >= 0) {
            if (hasIntersection) {
              selected = false;
              this._prevSelectedIds.push(itemId);
            } else {
              selected = true;
            }
          } else {
            selected = hasIntersection;
          }
        } else {
          selected = hasIntersection;
        }
      }

      item.dataset.selected = selected;
      if (selected) {
        if (currIndex === -1) {
          this._currSelectedIds.push(itemId);
        }
      } else {
        if (currIndex !== -1) {
          this._currSelectedIds.splice(currIndex, 1);
        }
        if (index !== -1) {
          this.selectedIds.splice(index, 1);
        }
      }
    }
    // if (selectionChanged) {
    //   this.onSelect(this.selectedIds);
    // }
  };

  _updateSelectArea = () => {
    const top = Math.min(this._startPoint.y, this._endPoint.y);
    const left = Math.min(this._startPoint.x, this._endPoint.x);
    const width = Math.abs(this._startPoint.x - this._endPoint.x);
    const height = Math.abs(this._startPoint.y - this._endPoint.y);
    this._area.style.top = `${top}px`;
    this._area.style.left = `${left}px`;
    this._area.style.width = `${width}px`;
    this._area.style.height = `${height}px`;

    this._selectItems();
  };

  _hideSelectArea = () => {
    this._area.style.display = 'none';
  };

  _showSelectArea = () => {
    this._area.style.display = 'block';
  };

  _getRelativePositionInElement = (clientX, clientY) => {
    const rect = this.element.getBoundingClientRect();
    const { left, top } = rect;
    const { scrollLeft, scrollTop, scrollWidth, scrollHeight } = this.element;
    let x = clientX - left + scrollLeft;
    let y = clientY - top + scrollTop;
    if (x < 0) {
      x = 0;
    } else if (x > scrollWidth) {
      x = scrollWidth;
    }

    if (y < 0) {
      y = 0;
    } else if (y > scrollHeight) {
      y = scrollHeight;
    }
    return { x: Math.round(x), y: Math.round(y) };
  };

  _handleMouseDown = () => {
    this.element.addEventListener('mousedown', (e) => {
      const { clientX, clientY, altKey } = e;
      this._ctrlKeyPressed = altKey;
      this._currSelectedIds = [];
      this._prevSelectedIds = [];
      this._startPoint = this._getRelativePositionInElement(clientX, clientY);
      //   console.log(this._startPoint);
      this._endPoint = this._startPoint;

      this._showSelectArea();
      this._updateSelectArea();
      this._handleMouseMove();
    });
  };

  _handleMouseMove = () => {
    this._mouseMoveHandler = (e) => {
      const { clientX, clientY } = e;
      this._endPoint = this._getRelativePositionInElement(clientX, clientY);
      //   console.log(this._endPoint);
      this._updateSelectArea();
      this._scrollOnDrag(clientX, clientY);
    };
    window.addEventListener('mousemove', this._mouseMoveHandler);
  };

  _handleMouseUp = () => {
    window.addEventListener('mouseup', () => {
      //   this._updateSelectArea();
      window.removeEventListener('mousemove', this._mouseMoveHandler);
      this._hideSelectArea();

      const updated = Array.from(
        new Set([...this.selectedIds, ...this._currSelectedIds])
      );
      this.selectedIds = updated;
      this.onSelect(updated);
    });
  };

  _scrollOnDrag = (mouseX, mouseY) => {
    const { x, y, width, height } = this.element.getBoundingClientRect();
    let scrollX, scrollY;
    if (mouseX < x) {
      scrollX = mouseX - x;
    } else if (mouseX > x + width) {
      scrollX = mouseX - (x + width);
    }

    if (mouseY < y) {
      scrollY = mouseY - y;
    } else if (mouseY > y + height) {
      scrollY = mouseY - (y + height);
    }

    if (scrollX || scrollY) {
      this.element.scrollBy(scrollX, scrollY);
    }
  };
}
