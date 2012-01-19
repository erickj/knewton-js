/*
 * Safe logger
 */
LogBase = Object.extend({
  LOG_LEVEL: 15, // 1 | 2 | 4 | 8
  LOG_LEVELS: {
    debug: 8,
    info: 4,
    warn: 2,
    error: 1
  },

  clear: function() { /* noop */ },

  log: function(level,msg) {
    if (this.LOG_LEVEL & this.LOG_LEVELS[level]) this._log.apply(this,arguments);
  },

  _log: function() {
    // override in subclass
  },

  debug: function() { this.log.apply(this, ['debug'].concat(Array.from(arguments))); },
  info: function() { this.log.apply(this, ['info'].concat(Array.from(arguments))); },
  warn: function() { this.log.apply(this, ['warn'].concat(Array.from(arguments))); },
  error: function() { this.log.apply(this, ['error'].concat(Array.from(arguments))); }
});

ConsoleLog = LogBase.extend({
  console: console,
  _log: function(level,msg) {
    if (!this.console) return;

    var console = this.console;
    var args = Array.from(arguments);
    var method = console.log;

    if (console[level]) {
      method = console[level];
      args = Array.from(arguments).slice(1);
    }

    method.apply(console,args);
  }
});

DOMLog = LogBase.extend({
  id: null,
  console: null,

  clear: function() {
    this.console.clear();
  },

  _log: function() {
    if (!this.console) {
      var el = document.getElementById(this.id);
      if (!el) throw new Error('cannot find log element with id: ' + this.id);
      this.console = this._Console.create({
        el: el
      });
    }

    this.console.log.apply(this.console,arguments);
  },

  _Console: Object.extend({
    el: null,
    msgEl: 'div',
    msgClass: 'log-message',
    lvlClass: 'log-level',

    clear: function() {
      this.el.innerHTML = "";
    },

    log: function(level,msg) {
      var msgEl = document.createElement(this.msgEl);
      msg = level + ": " + Array.from(arguments).slice(1).join(", ");

      msgEl.setAttribute("class",this.msgClass);
      msgEl.innerHTML = msg;

      this.el.appendChild(msgEl);
    }
  })
});

Log = ConsoleLog.create();

/*
 * Ajax handler
 */
Ajax = Object.extend({
  url: null,
  callbacks: null,

  _defaultCallbacks: {
    onSuccess: function(response, responseText, responseXML, xhr, event) {
      Log.debug('xhr success',arguments);
    },
    onError: function(xhr, event) {
      Log.error('xhr error',arguments, "status code:", xhr.status);
    }
  },

  get: function(url, callbacks) {
    url = url || this.url;
    var xhr = this._initXHR(url,'GET',callbacks);
    xhr.send();
  },

  _initXHR: function(url, method, callbacks) {
    callbacks = Object.mixin({},this._defaultCallbacks,this.callbacks,callbacks);

    var x = new XMLHttpRequest();
    x.open(method,url,true);
    x.onreadystatechange = this._onReadStateChange.curry(x,callbacks);
    return x;
  },

  _onReadStateChange: function(xhr, callbacks, evt) {
    Log.debug('xhr.readyState changed to',xhr.readyState);
    if (xhr.readyState !== 4) return;

    callbacks = callbacks || {};
    if (xhr.status && xhr.status >= 200 && xhr.status < 300 && callbacks.onSuccess) {
      callbacks.onSuccess(xhr.response, xhr.responseText, xhr.responseXML, xhr,evt);
    } else if (xhr.status && xhr.status >= 300 && callbacks.onError) { // no redirects in this simple handler
      callbacks.onError(xhr,evt);
    }
  }
});

Ajax.get = function(url, callbacks) {
  var a = Ajax.create({
    url: url,
    callbacks: callbacks
  });
  a.get();
}
