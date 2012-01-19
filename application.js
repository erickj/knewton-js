Application = Object.extend({
  N_LINES: null,

  data: null,
  lines: null,
  artists: null,

  didReceiveData: function(response,text,xml,xhr) {
    Log.info("received data, length:",response.length);
    this.run(response);
  },

  run: function(response) {
    this.data = response;
    this.lines = this.data.split("\n");
    this.artists = {};

    // parse lines and artists
    var lineArtists;
    for (var i=0,l=this.lines.length;i<l;i++) {
      lineArtists = this._getArtistsFromLine(this.lines[i]);
      for (var j=0,lj=lineArtists.length;j<lj;j++) {
        lineArtists[j].appendLine(this.lines[i]);
      }
    }

    // print
  },

  _getArtistsFromLine: function(line) {
    var artistNames = line.split(",");

    var crntArtist,crntName, lineArtists = [];
    for (var i=0,l=artistNames.length;i<l;i++) {
      crntName = artistNames[i];

      crntArtist = this.artists[crntName];
      if (!crntArtist) {
        crntArtist = Artist.create({name: crntName});
        crntArtist.init();
        this.artists[crntName] = crntArtist;
      }

      lineArtists.push(crntArtist);
    }
    return lineArtists;
  }
});

