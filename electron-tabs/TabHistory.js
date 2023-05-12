const MAX_RECENTLY_CLOSED_TABS_RETAINED = 100;

export class TabHistoryManager {

  constructor() {
    this._tabs = [];
  }

  get tabs() {
    return this._tabs;
  }

  set tabs(tabs) {
    this._tabs = tabs;
    this.notifyChange();
  }

  addRecord(record) {
    this.tabs.push(record);
    if (this.tabs.length > MAX_RECENTLY_CLOSED_TABS_RETAINED) {
      this.tabs.splice(0, this.tabs.length - MAX_RECENTLY_CLOSED_TABS_RETAINED);
    }
    this.notifyChange();
  }

  popRecord(index = -1) {
    const [tab] = this.tabs.splice(index, 1);
    this.notifyChange();
    return tab;
  }

  getTabHistory(count, start) {
    const tabs = this.tabs.map((value, index) => [index, value]).reverse();
	// do some verify logic
	// tabs.filter(Boolean)
    return tabs.slice(start, start + count);
  }

  notifyChange() {
    // notify logic
  }
}
