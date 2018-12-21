var User = require('./models/User');

module.exports = function(app) {

  // Application ------------------------------------------
  // app.get('/*', function(req, res){
  //   res.sendFile('/app/client/index.html', {"root": '.'});
  // });

  app.use('/dist', express.static(path.join(__dirname, 'dist')));

  // Wildcard all other GET requests to the angular app
  // app.get('*', function(req, res){
  //   res.sendFile('/app/client/index.html', {"root": '.'});
  // });

};
