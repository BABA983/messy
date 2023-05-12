  ce = class {
    constructor(e, r, i, n, o, s) {
      this.hasMessageHandler = !1;
      this.messageQueue = [];
      this.uncommittedMessageQueue = [];
      this._path = '';
      this.isNavigating = !1;
      this._lastTabError = null;
      this._title = m('desktop.tabs.untitled');
      this.isPreloaded = !1;
      this._saved = !0;
      this.mergingStatus = on.NOT_MERGING;
      this._locales = [];
      this._isFileLoading = !0;
      this._isInVoiceCall = !1;
      this._isUsingMicrophone = !1;
      this._isBranch = !1;
      this._isLibrary = !1;
      this._isPinned = !1;
      this.reloadTimer = null;
      this.cachedFonts = null;
      this.registeredCancelCallbackMap = new Map();
      this.fullscreenMenus = void 0;
      this._actionEnabledState = void 0;
      this.actionCheckedState = void 0;
      this.actionAccelerators = void 0;
      this._pluginMenuData = [];
      this.widgetMenuData = [];
      this.allowedPluginOrigins = new Map();
      this.startedFromPreloadedTab = !1;
      this.tabLoadedAt = null;
      this.analyticsMetadata = {};
      this.setTransparentBackgroundColorDebounced = Is(
        () => this.browserView.setBackgroundColor('#00000000'),
        500
      );
      this._hideNewTabCSSTokens = new Set();
      this.newTabAutoRefresher = null;
      this.onWillRedirect = (event, url, isInPlace, isMainFrame) => {
        if (this.isDestroyed()) {
          event.preventDefault();
          return;
        }
        isMainFrame &&
          (Kt.info(
            `${
              this.path
            } attempting to redirect from '${this.webContents.getURL()}' to '${url}'`
          ),
          wu(this, event, url, 'redirect'));
      };
      this.onNewWindow = (e, r) => {
        if (this.isDestroyed()) {
          e.preventDefault();
          return;
        }
        Kt.info(`${this.path} attempting to open window for '${r}'`),
          e.preventDefault(),
          wk(this, e, r, 'window');
      };
      this.onWillNavigate = (e, r) => {
        if (this.isDestroyed()) {
          e.preventDefault();
          return;
        }
        Kt.info(
          `${
            this.path
          } attempting to navigate from '${this.webContents.getURL()}' to '${r}'`
        ),
          wu(this, e, r, 'navigation');
      };
      this.onRenderProcessGone = (e, r) => {
        r.reason !== 'clean-exit' &&
          ((this.lastTabError = {
            type: 'crash',
            reason: r.reason,
          }),
          B(
            {
              eventName: 'Render Process Destroyed',
              params: {
                path: this.path,
                reason: r.reason,
                exitCode: r.exitCode,
                tabLoadedAt: this.tabLoadedAt,
                tabDestroyedAt: new Date(),
                ...this.analyticsMetadata,
              },
            },
            !0
          ));
      };
      if (
        (r.length > 0 && !r.startsWith('/')) ||
        (i && i.length > 0 && !i.startsWith('?')) ||
        (n && n.length > 0 && !n.startsWith('#'))
      )
        throw new Error('Invalid url args');
      (this.window = e),
        (this.browserView = new zt.BrowserView({
          webPreferences: {
            sandbox: !0,
            nodeIntegration: !1,
            contextIsolation: !0,
            preload: bu.join(__dirname, o),
          },
        })),
        (this.log = N.createPartition(r)),
        this.setupNavigationListeners(),
        this.webContents.on('will-navigate', this.onWillNavigate),
        this.webContents.on('will-redirect', this.onWillRedirect),
        this.webContents.on('new-window', this.onNewWindow),
        this.webContents.on(
          'console-message',
          this.log.logConsoleMessageEvent.bind(this.log)
        ),
        this.webContents.on('render-process-gone', this.onRenderProcessGone),
        this.webContents.on('before-input-event', Yn),
        this.webContents.on('destroyed', () => {
          this.registeredCancelCallbackMap.forEach((l) => {
            try {
              l();
            } catch (c) {
              console.error(c);
            }
          }),
            this.registeredCancelCallbackMap.clear();
        }),
        (this._path = r),
        (this.urlParams = i),
        (this.urlHash = n),
        (this.type = ce.getTypeForPath(this.path)),
        (this.locales = Zr()),
        this.type === 3 && this.updateBackgroundColorForLoadingScreen();
      let { tabId: a, createdAt: u } = s != null ? s : {};
      a && u
        ? ((this.tabId = a), (this.tabCreatedAt = u))
        : ((this.tabCreatedAt = Date.now()),
          (this.tabId = $n()),
          this.type !== 1 &&
            B({
              eventName: 'Desktop Tab Created',
              params: {
                ...this.baseTabAnalyticsParams(),
                windowId: this.window.id,
              },
            })),
        this.reload();
    }
    baseTabAnalyticsParams() {
      return {
        tabId: this.tabId,
      };
    }
    emitOSMenuInvalidated() {
      var r;
      let e;
      if (this.window.isNewTabShown()) e = $o;
      else if (this.type === 2) {
        if (!this.editorType) return;
        e = {
          type: 'fullscreen',
          fullscreenMenus: this.fullscreenMenus,
          actionAccelerators: this.actionAccelerators,
          actionEnabledState: this._actionEnabledState,
          actionCheckedState: this.actionCheckedState,
          pluginMenuData: this._pluginMenuData,
          widgetMenuData: this.widgetMenuData,
          editorType: this.editorType,
        };
      } else e = $o;
      (r = St) == null || r.updateMenus(e, this.locales);
    }
    invalidateOSMenuIfNeeded() {
      this.window.browserWindow.isFocused() &&
        this.isVisible() &&
        this.emitOSMenuInvalidated();
    }
    updateGlobalStateIfFocused(e) {
      (e || this.window.browserWindow.isFocused()) &&
        this.isVisible() &&
        (va(this.locales),
        this.emitOSMenuInvalidated(),
        this.window.updateShellAppLocales(this.locales));
    }
    updateFullscreenMenuState(e) {
      if (
        (e.menus && (this.fullscreenMenus = e.menus),
        e.actionEnabledState &&
          (this._actionEnabledState = Object.assign(
            this._actionEnabledState || {},
            e.actionEnabledState
          )),
        e.actionCheckedState &&
          (this.actionCheckedState = Object.assign(
            this.actionCheckedState || {},
            e.actionCheckedState
          )),
        e.actionShortcuts)
      ) {
        this.actionAccelerators = {};
        for (let r of Object.keys(e.actionShortcuts))
          this.actionAccelerators[r] = Xm(e.actionShortcuts[r]);
      }
      e.pluginMenuData && (this._pluginMenuData = Lo(e.pluginMenuData)),
        e.widgetMenuData && (this.widgetMenuData = Lo(e.widgetMenuData)),
        e.editorType && (this.editorType = e.editorType),
        this.invalidateOSMenuIfNeeded();
    }
    get actionState() {
      return this._actionEnabledState;
    }
    set actionState(e) {
      (this._actionEnabledState = e), this.invalidateOSMenuIfNeeded();
    }
    get path() {
      return this._path;
    }
    set path(e) {
      (this._path = e),
        (this.type = ce.getTypeForPath(e)),
        this.log.setName(e),
        Wt();
    }
    get title() {
      return this._title;
    }
    set title(e) {
      this._title !== e &&
        ((this._title = e),
        this.window.updateShellAppTab(this, {
          title: e,
          emoji: this.emoji(),
        }));
    }
    emoji() {
      var e;
      return (e = this._title.match(ad)) == null ? void 0 : e[0];
    }
    get saved() {
      return this._saved;
    }
    set saved(e) {
      this._saved !== e &&
        ((this._saved = e),
        e
          ? this.window.updateShellAppTab(this, {
              isSaved: this._saved,
            })
          : setTimeout(() => {
              this.window.updateShellAppTab(this, {
                isSaved: this._saved,
              });
            }, 500));
    }
    get locales() {
      return this._locales;
    }
    set locales(e) {
      if (!Jr(this._locales, e)) {
        let r = this._locales.length > 0;
        if (
          ((this._locales = e),
          this.updateGlobalStateIfFocused(),
          r && this !== this.window.preloadedTab)
        )
          for (let i of S.windows())
            i.preloadedTab &&
              ((i.preloadedTab.isPreloaded = !1), i.preloadedTab.reload());
      }
    }
    get lastTabError() {
      return this._lastTabError;
    }
    set lastTabError(e) {
      this._lastTabError !== e &&
        ((this._lastTabError = e),
        this.window.updateShellAppIfVisibleTab(this, {
          tabErrorInfo: e,
        }));
    }
    get isFileLoading() {
      return this._isFileLoading;
    }
    set isFileLoading(e) {
      this._isFileLoading !== e &&
        ((this._isFileLoading = e),
        this.window.updateShellAppTab(this, {
          isLoading: e,
        }));
    }
    get isInVoiceCall() {
      return this._isInVoiceCall;
    }
    set isInVoiceCall(e) {
      this._isInVoiceCall !== e &&
        ((this._isInVoiceCall = e),
        this.window.updateShellAppTab(this, {
          isInVoiceCall: e,
        }));
    }
    get isUsingMicrophone() {
      return this._isUsingMicrophone;
    }
    set isUsingMicrophone(e) {
      this._isUsingMicrophone !== e &&
        ((this._isUsingMicrophone = e),
        this.window.updateShellAppTab(this, {
          isUsingMicrophone: e,
        }));
    }
    get isBranch() {
      return this._isBranch;
    }
    set isBranch(e) {
      this._isBranch !== e &&
        ((this._isBranch = e),
        this.window.updateShellAppTab(this, {
          isBranch: e,
        }));
    }
    get isLibrary() {
      return this._isLibrary;
    }
    set isLibrary(e) {
      this._isLibrary !== e &&
        ((this._isLibrary = e),
        this.window.updateShellAppTab(this, {
          isLibrary: e,
        }));
    }
    get isPinned() {
      return this._isPinned;
    }
    set isPinned(e) {
      this._isPinned !== e &&
        ((this._isPinned = e),
        this.window.updateShellAppTab(this, {
          isPinned: e,
        }),
        this.window.validateTabOrder());
    }
    get editorType() {
      return this._editorType;
    }
    set editorType(e) {
      e !== this._editorType &&
        ((this._editorType = e),
        this.window.updateShellAppTab(this, {
          editorType: e,
        }),
        this.updateBackgroundColorForLoadingScreen(),
        this.invalidateOSMenuIfNeeded());
    }
    get pluginMenuData() {
      return this._pluginMenuData;
    }
    set pluginMenuData(e) {
      (this._pluginMenuData = e), this.invalidateOSMenuIfNeeded();
    }
    static fromWebContents(e) {
      for (let r of S.windows()) {
        if (e.id === r.fileBrowser.webContents.id) return r.fileBrowser;
        for (let i of r.tabs) if (e.id === i.webContents.id) return i;
        if (r.preloadedTab && e.id === r.preloadedTab.webContents.id)
          return r.preloadedTab;
      }
      return null;
    }
    static getTypeForPath(e) {
      return ui.test(e)
        ? 1
        : e.startsWith('/file/') ||
          e.startsWith('/jam') ||
          e.startsWith('/handoff')
        ? 2
        : e.startsWith('/proto/')
        ? 3
        : e === '/desktop_new_tab'
        ? 4
        : 20;
    }
    startPreloadedEditorTab(e) {
      (this.path = e.path),
        (this.urlParams = void 0),
        (this.urlHash = void 0),
        (this.startedFromPreloadedTab = !0),
        this.postMessageToWebBinding('startPreloadedTab', e);
    }
    updateParams(e, r) {
      (this.urlParams !== e || this.urlHash !== r) &&
        ((this.urlParams = e),
        (this.urlHash = r),
        this.postMessageToWebBinding('handleUrlParams', e, r));
    }
    isDestroyed() {
      return this.webContents == null || this.webContents.isDestroyed();
    }
    isVisible() {
      return this.window.activeView === this;
    }
    get webContents() {
      return this.browserView.webContents;
    }
    getBackgroundColor() {
      let e = I().theme,
        r = '#ffffff';
      return (
        this.type === 1
          ? e === 'dark'
            ? (r = '#1e1e1e')
            : (r = '#ffffff')
          : this.editorType === 'whiteboard'
          ? (r = '#ffffff')
          : this.editorType === 'design' || this.type === 2
          ? e === 'dark'
            ? (r = '#1e1e1e')
            : e === 'light'
            ? (r = '#f5f5f5')
            : (r = '#e5e5e5')
          : this.type === 3
          ? (r = '#000000')
          : this.type === 4 && (r = '#2c2c2c'),
        r
      );
    }
    updateBackgroundColorForLoadingScreen() {
      this.browserView.setBackgroundColor(this.getBackgroundColor());
      let e = () => {
        this.browserView.setBackgroundColor('#00000000');
      };
      this.startedFromPreloadedTab
        ? setTimeout(e, yu)
        : this.webContents.on('dom-ready', () => {
            setTimeout(e, 250);
          });
    }
    updateBackgroundColorForResize() {
      this.browserView.setBackgroundColor(this.getBackgroundColor()),
        this.setTransparentBackgroundColorDebounced();
    }
    setNewTabViewHidden(e) {
      try {
        if (e)
          this.webContents
            .insertCSS('.desktopNewTabViewHideable { visibility: hidden; }')
            .then((i) => {
              this.window.activeView !== this
                ? this._hideNewTabCSSTokens.add(i)
                : this.webContents.removeInsertedCSS(i);
            }),
            setTimeout(() => {
              this.window.activeView !== this &&
                !this.window.browserWindow.isDestroyed() &&
                !this.isDestroyed() &&
                this.window.browserWindow
                  .getBrowserViews()
                  .indexOf(this.browserView) !== -1 &&
                this.window.browserWindow.removeBrowserView(this.browserView);
            }, 250);
        else {
          for (let r of this._hideNewTabCSSTokens)
            this.webContents.removeInsertedCSS(r);
          this._hideNewTabCSSTokens = new Set();
        }
      } catch (r) {
        Kt.error('setNewTabViewHidden failed with error', r);
      }
    }
    startNewTabAutoRefresh() {
      this.newTabAutoRefresher = new Ur({
        reload: () =>
          !this.isDestroyed() &&
          this.reload({
            isAutoRefresh: !0,
          }),
        duration: () => vv,
        refreshAllowed: () => !this.window.isNewTabShown() && this.type === 4,
      });
    }
    stopNewTabAutoRefresh() {
      var e;
      (e = this.newTabAutoRefresher) == null || e.cancel(),
        (this.newTabAutoRefresher = null);
    }
    updateCachedFonts() {
      if (!this.cachedFonts)
        try {
          this.cachedFonts = jn();
        } catch (e) {
          e instanceof Error &&
            Ft({
              level: 'error',
              category: 'shell',
              name: 'Call to getFonts failed.',
              message: e.message,
              stack: e.stack,
            });
        }
      return this.cachedFonts;
    }
    getCachedFonts() {
      return this.cachedFonts || {};
    }
    postMessageToWebBindingOnceNavigationCompleted(e, ...r) {
      if (!this.hasMessageHandler) {
        this.messageQueue.push({
          method: e,
          args: r,
        }),
          this.isNavigating &&
            this.uncommittedMessageQueue.push({
              method: e,
              args: r,
            });
        return;
      }
      this.postMessageToWebBindingCommon(e, ...r);
    }
    postMessageToWebBinding(e, ...r) {
      if (!this.hasMessageHandler) {
        this.messageQueue.push({
          method: e,
          args: r,
        });
        return;
      }
      this.postMessageToWebBindingCommon(e, ...r);
    }
    postMessageToWebBindingCommon(e, ...r) {
      var i;
      this.window.browserWindow.isDestroyed() ||
        this.window.browserWindow.webContents.isDestroyed() ||
        this.isDestroyed() ||
        ((i = Kt.debug) == null ||
          i.call(Kt, `ipc send ${this.path}: ${e}`, Ke(r)),
        this.webContents.send(e, ...r));
    }
    handleMessageHandlerRegistered() {
      this.hasMessageHandler = !0;
      for (let { method: e, args: r } of this.messageQueue)
        this.postMessageToWebBinding(e, ...r);
      this.messageQueue = [];
    }
    destroy() {
      this.cancelPendingLoads(),
        setTimeout(() => {
          !this.window.browserWindow.isDestroyed() &&
            !this.isDestroyed() &&
            this.window.browserWindow
              .getBrowserViews()
              .indexOf(this.browserView) !== -1 &&
            this.window.browserWindow.removeBrowserView(this.browserView),
            this.browserView.webContents.destroy();
        }, 2e3);
    }
    updateBounds() {
      if (
        this.window.browserWindow.isDestroyed() ||
        this.isDestroyed() ||
        !this.isVisible()
      )
        return;
      let e = this.window.browserWindow.getContentBounds(),
        r = {
          x: 0,
          y: this.window.showTabBar ? vt : 0,
          width: e.width,
          height: e.height - (this.window.showTabBar ? vt : 0),
        };
      W || ((r.x += 1), (r.width -= 2), (r.height -= 1)),
        this.browserView.setBounds(r),
        W &&
          this.browserView.setAutoResize({
            width: !0,
            height: !0,
            horizontal: !1,
            vertical: !1,
          });
      let i = I().zoomStop;
      i != null && (this.browserView.webContents.zoomFactor = i / 100);
    }
    canLoadURL(e) {
      var r;
      return Wi(e, we)
        ? this.type === 1
          ? ui.test(e.pathname)
          : ((r = fr(e)) == null ? void 0 : r.path) === this.path
        : !1;
    }
    async reload(e) {
      let r = z(this.webContents.getURL()),
        i = e && e.url,
        n = r && this.canLoadURL(r) && !i;
      (e == null ? void 0 : e.clearContentsImmediately) &&
        (await this.webContents.loadURL('about:blank')),
        this.newTabAutoRefresher &&
          !(e == null ? void 0 : e.isAutoRefresh) &&
          this.newTabAutoRefresher.reset(),
        L.tabLoadingThrottler.cancel(this.webContents.id),
        L.tabLoadingThrottler.whenCalled(this.webContents.id, (o) => {
          if (this.isDestroyed()) o();
          else {
            let s = this.urlParams;
            this.path.includes('?') && s && (s = s.replace(/^\?/, '&'));
            let a = n
                ? r.href
                : i ||
                  new URL(`${this.path}${s || ''}${this.urlHash || ''}`, we),
              u = new URL(a);
            this.type === 1 && u.searchParams.set('login_locale', Do()),
              et != null && u.searchParams.set('commit-sha', et),
              this.webContents.loadURL(u.href).finally(() => {
                o();
              });
          }
        }),
        this.isVisible() && L.tabLoadingThrottler.call(this.webContents.id);
    }
    reloadIfNeeded() {
      !this.isNavigating && this.lastTabError && this.reload();
    }
    cancelPendingLoads() {
      L.tabLoadingThrottler.cancel(this.webContents.id),
        this.reloadTimer != null &&
          (clearTimeout(this.reloadTimer), (this.reloadTimer = null));
    }
    setupNavigationListeners() {
      this.webContents.on('did-start-navigation', (e, r, i, n) => {
        n && !i && this.handleStartedUncommittedNavigation();
      }),
        this.webContents.on('did-stop-loading', () => {
          this.handleFinishedUncommittedNavigation();
        }),
        this.webContents.on('did-navigate', (e, r, i) => {
          i === 200
            ? this.handleSuccessfulCommittedNavigation()
            : this.handleFailedCommittedNavigation({
                type: 'http',
                statusCode: i,
              });
        }),
        this.webContents.on('did-fail-provisional-load', (e, r, i, n, o) => {
          var s, a;
          o &&
            this.handleFailedCommittedNavigation({
              type: 'load',
              code: r,
              description: m('desktop.errors.navigation_failed_description', {
                url:
                  (a = (s = z(n)) == null ? void 0 : s.origin) != null ? a : n,
                error: i || r,
              }),
            });
        });
    }
    handleStartedUncommittedNavigation() {
      this.cancelPendingLoads(),
        (this.isNavigating = !0),
        (this.isFileLoading = !0);
    }
    handleFinishedUncommittedNavigation() {
      this.isNavigating &&
        ((this.isNavigating = !1),
        (this.uncommittedMessageQueue = []),
        (this.isFileLoading = !1));
    }
    handleSuccessfulCommittedNavigation() {
      this.cancelPendingLoads(),
        (this.isNavigating = !1),
        (this.lastTabError = null),
        (this.hasMessageHandler = !1),
        (this.messageQueue = this.uncommittedMessageQueue),
        (this.uncommittedMessageQueue = []),
        (this.tabLoadedAt = new Date()),
        (this.cachedFonts = null),
        (this.isUsingMicrophone = !1),
        (this.isInVoiceCall = !1);
    }
    handleFailedCommittedNavigation(e) {
      var r;
      if (
        (this.cancelPendingLoads(),
        (this.isNavigating = !1),
        (this.lastTabError = e),
        (this.isFileLoading = !1),
        this.type === 1 &&
          e.type === 'http' &&
          e.statusCode === 404 &&
          ((r = z(this.webContents.getURL())) == null ? void 0 : r.pathname) !==
            '/files')
      ) {
        // @BABA handleFailedCommittedNavigation
        let i = new URL('/files', we);
        this.webContents.stop(),
          this.reload({
            url: i.toString(),
          });
        return;
      }
      if (Kd(e)) {
        let i = 5e3 + 5e3 * Math.random();
        this.reloadTimer = setTimeout(() => this.reloadIfNeeded(), i);
      }
      this.webContents.stop();
    }
  };