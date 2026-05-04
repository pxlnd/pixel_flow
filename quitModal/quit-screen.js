(function(global) {
  'use strict';

  var DEFAULT_HIDE_DELAY_MS = 220;

  function joinUrl(base, file) {
    if (!file) return base;
    if (/^(?:https?:)?\/\//i.test(file) || file.indexOf('data:') === 0 || file.charAt(0) === '/') {
      return file;
    }
    var normalized = String(base || './assets').replace(/\/+$/, '');
    return normalized + '/' + String(file).replace(/^\/+/, '');
  }

  function resolveScriptBase(scriptFileName) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i -= 1) {
      var src = scripts[i].getAttribute('src') || '';
      if (!src) continue;
      if (src.indexOf(scriptFileName) !== -1) {
        var idx = src.lastIndexOf('/');
        return idx >= 0 ? src.slice(0, idx + 1) : './';
      }
    }
    return './';
  }

  function ensureStylesheet(href) {
    if (!href) return;
    if (document.querySelector('link[data-quit-screen-style="1"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-quit-screen-style', '1');
    document.head.appendChild(link);
  }

  function QuitScreen(options) {
    var opts = options || {};
    this._scriptBase = resolveScriptBase('quit-screen.js');

    this.assetBasePath = opts.assetBasePath || joinUrl(this._scriptBase.replace(/\/$/, ''), 'assets');
    this.stylesheetPath = opts.stylesheetPath || joinUrl(this._scriptBase.replace(/\/$/, ''), 'quit-screen.css');
    this.injectStyles = opts.injectStyles !== false;

    this.handlers = {
      onShow: opts.onShow,
      onHide: opts.onHide,
      onClose: opts.onClose,
      onQuit: opts.onQuit,
      onStateChange: opts.onStateChange
    };

    this.state = {
      coinsCount: Math.max(0, parseInt(opts.coins, 10) || 0),
      heartsCount: Math.max(0, parseInt(opts.hearts, 10) || 0),
      visible: false
    };

    this.copy = {
      title: typeof opts.title === 'string' && opts.title ? opts.title : 'QUIT LEVEL?',
      warning: typeof opts.warning === 'string' && opts.warning ? opts.warning : 'You will lose a life!',
      quitButton: typeof opts.quitButtonText === 'string' && opts.quitButtonText ? opts.quitButtonText : 'QUIT'
    };

    this._hideTimer = null;

    if (this.injectStyles) ensureStylesheet(this.stylesheetPath);

    this.mountNode = opts.mount && opts.mount.nodeType === 1 ? opts.mount : document.body;
    this.root = this._createMarkup();
    this.mountNode.appendChild(this.root);

    this.refs = this._collectRefs();
    this._hydrateAssets();
    this._bindEvents();
  }

  QuitScreen.prototype._createMarkup = function() {
    var container = document.createElement('div');
    container.className = 'qs-overlay';
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = [
      '<div class="qs-modal" role="dialog" aria-modal="true" aria-label="Quit level">',
        '<div class="qs-title"></div>',
        '<div class="qs-panel">',
          '<img data-qs-src="heart_broken.png" alt="Broken heart">',
          '<div class="qs-warning"></div>',
        '</div>',
        '<button type="button" class="qs-quit"></button>',
        '<button type="button" class="qs-close" aria-label="Close">',
          '<img data-qs-src="btn_close.png" alt="Close">',
        '</button>',
      '</div>'
    ].join('');

    return container;
  };

  QuitScreen.prototype._collectRefs = function() {
    var refs = {
      closeButton: this.root.querySelector('.qs-close'),
      quitButton: this.root.querySelector('.qs-quit'),
      title: this.root.querySelector('.qs-title'),
      warning: this.root.querySelector('.qs-warning')
    };

    refs.title.textContent = this.copy.title;
    refs.warning.textContent = this.copy.warning;
    refs.quitButton.textContent = this.copy.quitButton;

    return refs;
  };

  QuitScreen.prototype._hydrateAssets = function() {
    var scope = this;
    var nodes = this.root.querySelectorAll('[data-qs-src]');
    nodes.forEach(function(node) {
      var file = node.getAttribute('data-qs-src');
      node.src = joinUrl(scope.assetBasePath, file);
      node.removeAttribute('data-qs-src');
    });
  };

  QuitScreen.prototype._emit = function(name, payload) {
    var cb = this.handlers[name];
    if (typeof cb !== 'function') return undefined;
    try {
      return cb(payload, this);
    } catch (error) {
      setTimeout(function() {
        throw error;
      }, 0);
      return undefined;
    }
  };

  QuitScreen.prototype._notifyStateChange = function() {
    this._emit('onStateChange', this.getState());
  };

  QuitScreen.prototype._bindEvents = function() {
    var scope = this;

    this.refs.closeButton.addEventListener('click', function() {
      var result = scope._emit('onClose', scope.getState());
      if (result !== false) scope.hide();
    });

    this.refs.quitButton.addEventListener('click', function() {
      var result = scope._emit('onQuit', scope.getState());
      if (result !== false) scope.hide();
    });
  };

  QuitScreen.prototype.bindBackButton = function(target) {
    var node = typeof target === 'string' ? document.querySelector(target) : target;
    if (!node || typeof node.addEventListener !== 'function') return false;

    var scope = this;
    node.addEventListener('click', function() {
      scope.show();
    });

    return true;
  };

  QuitScreen.prototype.show = function() {
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }

    this.state.visible = true;
    this.root.style.display = 'flex';
    this.root.setAttribute('aria-hidden', 'false');

    var scope = this;
    requestAnimationFrame(function() {
      if (!scope.state.visible) return;
      scope.root.style.opacity = '1';
    });

    this._emit('onShow', this.getState());
  };

  QuitScreen.prototype.hide = function() {
    if (!this.state.visible) return;
    this.state.visible = false;
    this.root.style.opacity = '0';

    var scope = this;
    this._hideTimer = setTimeout(function() {
      scope._hideTimer = null;
      if (scope.state.visible) return;
      scope.root.style.display = 'none';
      scope.root.setAttribute('aria-hidden', 'true');
      scope._emit('onHide', scope.getState());
    }, DEFAULT_HIDE_DELAY_MS);
  };

  QuitScreen.prototype.setHandlers = function(handlers) {
    if (!handlers || typeof handlers !== 'object') return;
    for (var key in handlers) {
      if (!Object.prototype.hasOwnProperty.call(handlers, key)) continue;
      this.handlers[key] = handlers[key];
    }
  };

  QuitScreen.prototype.setCoins = function(value) {
    this.state.coinsCount = Math.max(0, parseInt(value, 10) || 0);
    this._notifyStateChange();
  };

  QuitScreen.prototype.setHearts = function(value) {
    this.state.heartsCount = Math.max(0, parseInt(value, 10) || 0);
    this._notifyStateChange();
  };

  QuitScreen.prototype.getState = function() {
    return {
      coinsCount: this.state.coinsCount,
      heartsCount: this.state.heartsCount,
      visible: this.state.visible
    };
  };

  QuitScreen.prototype.destroy = function() {
    this.hide();

    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }

    if (this.root && this.root.parentNode) {
      this.root.parentNode.removeChild(this.root);
    }
  };

  global.QuitScreen = QuitScreen;
})(window);
