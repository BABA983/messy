export class TabManager {
  private title = 'untitled';

  private isPinned = false;

  messageQueue = [];
  uncommittedMessageQueue = [];
  isNavigating = false;
  reloadTimer = null;
  registeredCancelCallbackMap = new Map();
  constructor() {}

}
