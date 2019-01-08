// Connect to mongodb
require('dotenv').load();
var mongoose        = require('mongoose');
var database        = process.env.DATABASE || { url: "mongodb://localhost:27017"};
mongoose.connect(database.url);

var UserController = require('../app/server/controllers/UserController');

// ADMIT USERS ------------------------------------------------------

var fs = require('fs');
var userEmailArray = fs.readFileSync('emails.txt').toString().split('\n');
var userSet = {};

userEmailArray.forEach(function (userEmail) {

  if (!userSet.hasOwnProperty(userEmail)) {
      userSet[userEmail] = true;
      UserController
        .verifyByEmail(userEmail, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("user email was verified!");
        });
  }
});
