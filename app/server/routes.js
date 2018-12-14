var User = require('./models/User');

module.exports = function(app) {

  // Application ------------------------------------------
  app.get('/', function(req, res){
    res.sendFile("/client/index.html", {"root": __dirname});
  });

  // Wildcard all other GET requests to the angular app
  app.get('*', function(req, res){
    res.sendFile("/client/index.html", {"root": __dirname});
  });

};
