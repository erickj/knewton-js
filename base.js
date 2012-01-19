/**
 * Augment Array
 */
Array.from = function(arraylike) {
  var a = [];
  if (arraylike && arraylike.length) {
    for (var i=0,l=arraylike.length;i<l;i++) {
      a.push(arraylike[i]);
    }
  } else if (arraylike !== undefined) {
    a.push(arraylike);
  }
  return a;
};

/**
 * Augment Function.prototype
 */
Function.prototype.curry = function() {
  var curried = Array.from(arguments);
  var that = this;
  return function() {
    return that.apply(this,curried.concat(Array.from(arguments)));
  };
};

Function.prototype.bind = function(scope) {
  var that = this;
  return function() {
    return that.apply(scope,arguments);
  };
};

/**
 * Augment Object
 */
Object.mixin = function(receiver /*, sources,... */) {
  var sources = Array.from(arguments).slice(1);
  for (var i=0,l=sources.length;i<l;i++) {
    var source = sources[i];
    for (var p in source) if (source && source.hasOwnProperty(p) && source[p] !== undefined) {
      receiver[p] = source[p]; // property copying
    }
  };
  return receiver;
};

/**
 * setup prototype chain and copy additional properties to the instance
 */
Object.create = function(/* mixins */) {
  var instance = new this();
  Object.mixin.apply(Object, [instance].concat(Array.from(arguments)));
  return instance;
};

/**
 * create the prototype object of a new klass and mixin to the prototype
 */
Object.extend = function(/* mixins */) {
  var klass = new Function();
  klass.prototype = this.create.apply(this,arguments);

  klass.extend = Object.extend.bind(klass);
  klass.create = Object.create.bind(klass);

  return klass;
};
