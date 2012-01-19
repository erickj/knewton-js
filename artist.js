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
  },

  skipArtist: function(artistName) {
    return artistName == this.name;
  },

  getArtistListWithNCollisions: function(n) {
    if (this.numLines() < n) return [];

    var ret = [];
    var artistCounts = {};

    var crntLine,crntArtistName;
    for (var i=0,l=this.numLines();i<l;i++) {
      crntLine = this.lines[i];
      for (var j=0,jl=crntLine.length;j<jl;j++) {
        crntArtistName = crntLine[j];

        if (this.skipArtist(crntArtistName)) continue;

        if (!artistCounts[crntArtistName]) artistCounts[crntArtistName] = 0;
        artistCounts[crntArtistName]++;

        if (artistCounts[crntArtistName] >= n && ret.indexOf(crntArtistName) < 0) {
          ret.push(crntArtistName);
        }
      }
    }

    return ret;
  }
});
