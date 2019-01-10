// Connect to mongodb
require('dotenv').load();
var mongoose        = require('mongoose');
var database        = process.env.DATABASE || process.env.MONGODB_URI || { url: "mongodb://localhost:27017"};
mongoose.connect(database.url);

var UserController = require('../app/server/controllers/UserController');

// ADMIT USERS ------------------------------------------------------

var adminUser = { email: process.env.ADMIN_EMAIL };

var fs = require('fs');
var userEmailArray = fs.readFileSync('emails.txt').toString().split('\n');
var userSet = {};

userEmailArray.forEach(function (userEmail) {
    var lowerEmail = userEmail.toLowerCase();
  if (!userSet.hasOwnProperty(lowerEmail)) {
      userSet[lowerEmail] = true;
      UserController
        .admitUserWithEmail( lowerEmail, adminUser, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("user was admitted!");
        });
  }
});
