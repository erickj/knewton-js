Artist = Object.extend({
  name: null,
  lines: null,

  init: function() {
    this.lines = [];
  },

  appendLine: function(line) {
    this.lines.push(line);
  },

  numLines: function() {
    return this.lines.length;
  }
});
