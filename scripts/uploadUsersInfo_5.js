// Connect to mongodb
require('dotenv').load();
var mongoose        = require('mongoose');
var database        = process.env.DATABASE || process.env.MONGODB_URI || { url: "mongodb://localhost:27017"};
// mongoose.connect(database.url);
mongoose.connect(database);

var UserController = require('../app/server/controllers/UserController');

// SUBMIT CONFIRMATIONS ------------------------------------------------------

var fs = require('fs');
var csv = require('csvtojson')
csv().fromFile('confirmations.csv')
.then((usersJSON)=>{
    var userSet = {};

    var count = 0;
    var userTotal = 446;
    for (var user of usersJSON) {
        var userEmail = user['email'].toLowerCase();

        if (!userSet.hasOwnProperty(userEmail)) {
            userSet[userEmail] = true;
            var dietNeeds = (user['dietaryNeeds'] == "-" ? 'None' : user['dietaryNeeds']);
            var confirmation = {
              // Basic info
              phone: user['contact'],
              dietaryRestrictions: [dietNeeds],
              address: {
                name: user['firstName'] + ' ' + user['lastName'],
                line1: user['street'],
                line2: "",
                city: user['city'],
                state: user['state'],
                zip: user['code'],
                country: user['country']
              },
              github: user['githubUser'],
              hardware: user['equipment'],
              inviteNeeded: (user['visaInformation'] == 'Yes' ? true : false),
              openRoom: (user['roomshare'] == 'Yes' ? true : false),
              childcare: (user['childcare'] == 'Yes' ? true : false),
              signatureRelease: user['releaseDriveLocation'],
              notes: ""
            };

            UserController.updateConfirmationByEmail( userEmail, confirmation, function(err) {
                if(err) {
                    return console.log(err);
                }
                if (count == userTotal) {
                    console.log("Confirmations done");
                }
            });
        }
    }
});
