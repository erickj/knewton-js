Application = Object.extend({
  N_LINES: null,

  data: null,
  lines: null,

  artistHash: null,

  didReceiveData: function(response,text,xml,xhr) {
    Log.debug("received data, length:",response.length);
    this.run(response);
  },

  run: function(response) {
    this.data = response;
    this.lines = this.data.split("\n");
    this.artistHash = {};
    this.results = [];

    // parse lines and artists
    var lineArtists;
    for (var i=0,l=this.lines.length;i<l;i++) {
      this._buildArtistsFromLine(this.lines[i]);
    }

    // print artist pairs who appear on N_LINES with eachother
    var artist;
    for (var a in this.artistHash) if (this.artistHash.hasOwnProperty(a) && Artist.prototype.isPrototypeOf(this.artistHash[a])) {
      artist = this.artistHash[a];
      var list = artist.getArtistListWithNCollisions(this.N_LINES);
      this._addToResults(artist,list);
    }
  },

  getFormattedResults: function() {
    var str = "";
    for (var i=0,l=this.results.length;i<l;i++) {
      str += this.results[i].join(",") + "\n";
    }
    return str;
  },

  _addToResults: function(artist, pairList) {
    for (var i=0,l=pairList.length;i<l;i++) {
      this.results.push([artist.name,pairList[i]]);
    }
  },

  _buildArtistsFromLine: function(line) {
    var artistNames = line.split(",");

    var crntArtist,crntName, lineArtists = [];
    for (var i=0,l=artistNames.length;i<l;i++) {
      crntName = artistNames[i];

      crntArtist = this.artistHash[crntName];
      if (!crntArtist) {
        crntArtist = Artist.create({name: crntName});
        crntArtist.init();
        this.artistHash[crntName] = crntArtist;
      }

      crntArtist.appendLine(artistNames);
      lineArtists.push(crntArtist);
    }
    return lineArtists;
  }
});

