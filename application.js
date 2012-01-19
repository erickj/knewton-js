Application = Object.create({
  data: null,
  lines: null,

  didReceiveData: function(response,text,xml,xhr) {
    Log.info("received data, length:",response.length);
    this.init(response);
  },

  init: function(response) {
    this.data = response;
    this.lines = this.data.split("\n");
  }
});

