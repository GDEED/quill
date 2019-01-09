// Connect to mongodb
require('dotenv').load();
var mongoose        = require('mongoose');
var database        = process.env.DATABASE || process.env.MONGODB_URI || { url: "mongodb://localhost:27017"};
mongoose.connect(database.url);

var UserController = require('../app/server/controllers/UserController');

var fs = require('fs');
var userEmailArray = fs.readFileSync('emails.txt').toString().split('\n');
var userSet = {};

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var stream = fs.createWriteStream("passwords.txt", {flags:'a'});

userEmailArray.forEach(function (userEmail) {
  console.log(userEmail);

  if (!userSet.hasOwnProperty(userEmail)) {
      userSet[userEmail] = true;
      const randPass = makeid();
      UserController
        .createUser(userEmail, randPass, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("created user");
            stream.write(userEmail + ': ' + randPass + '\n', function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("user password was saved!");
            });
        });
  }
});
