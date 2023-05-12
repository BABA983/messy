export class Tab {
	private title = 'untitled';

	private isPinned = false;

	messageQueue = [];
	uncommittedMessageQueue = [];
	isNavigating = false;
	reloadTimer = null;
	registeredCancelCallbackMap = new Map();
	tabLoadedAt = null
	constructor() {}
	onWillRedirect(){}
	onNewWindow(){

	}
	onWillNavigate(){}
	onRenderProcessGone(){}
	setupNavigationListeners(){}
  }
