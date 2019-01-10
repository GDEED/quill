// Connect to mongodb
require('dotenv').load();
var mongoose        = require('mongoose');
var database        = process.env.DATABASE || process.env.MONGODB_URI || { url: "mongodb://localhost:27017"};
mongoose.connect(database.url);

var UserController = require('../app/server/controllers/UserController');

// SUBMIT APPLICATIONS ------------------------------------------------------
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
            var profile = {
              // Basic info
              firstname: user['firstName'],
              lastname: user['lastName'],
              student: (user['student'] == 'Yes' ? true : false),
              rvTeamName: user['teamName'],
              location: user['currentLocation'],
              citizenship: user['citizenship'],
              education: user['degree'],
              occupation: user['occupation'],
              affiliation: user['affiliation'],

              gender: 'N',
              ethnicity: 'N',
              description: (user['hackrole'] ? user['hackrole'].split(' ').join('_') : 'Other'),

              github: user['github'],
              twitter: user['twitter'],
              facebook: user['facebook'],
              website: user['website'],
              personalApp: user['app'],
              essay: user['motives'],

              experiences: [
                  user['360video'], user['unity'], user['vive'], user['unrealEngine'],
                  user['googleVR'], user['oculusRift'], user['vuforia'], user['arCore'],
                  user['webVR'], user['magicLeap'], user['steamOpenVR'], user['microsoftHololens'],
                  user['cryEngine'], user['sonyPlaystationVR'], user['vivePro'], user['samsungGearVr'],
                  user['oculusGo'], user['meta2Ar'], user['appleARKit'], user['nativeOpenGL'],
                  user['googleTango'], user['WayRay'], user['other']
              ],

              referral: 'wordOfMouth',
              referrerEmail: user['mitrefer'],
            };

            switch (user['gender']) {
                case 'Male':
                    profile['gender'] = 'M';
                    break;
                case 'Female':
                    profile['gender'] = 'F';
                    break;
                case 'Non Binary':
                    profile['gender'] = 'O';
                    break;
                case 'Prefer not to identify':
                    profile['gender'] = 'N';
                    break;
                default:
                    profile['gender'] = 'N';
                    break;
            }

            const eth = user['ethnicity'];
            if (eth == 'White/ Native Alaskan') {
                profile['ethnicity'] = 'AI/A'
            } else if (eth == 'Asian/Other' || eth == 'Asian/Chinese' || eth == 'Asian / Chinese' || eth == 'Asian' || eth == 'East Asian' || eth == 'Han' || eth == 'asian' || eth == 'Indian' || eth == 'Hindu' || eth == 'South Asian' || eth == 'south asian' || eth == 'South Asian' || eth == 'Chinese' || eth == 'Asian American' || eth == 'Don\'t identify, but classified as Asian' || eth == 'Singaporean Chinese' || eth == 'Asian/Japanese') {
                profile['ethnicity'] = 'AS';
            } else if (eth == 'African' || eth == 'Black') {
                profile['ethnicity'] = 'B';
            } else if (eth == 'Filipino') {
                profile['ethnicity'] = 'HW/PI';
            } else if (eth == 'Hispanic' || eth == 'hispanic' || eth == 'Latin' || eth == 'LATINO' || eth == 'Latina' || eth == 'LATINA' || eth == 'Hispanic/Latina' || eth == 'Mexican American' || eth == 'Bi-racial- Latino/Caucasian' || eth == 'Latina Jew') {
                profile['ethnicity'] = 'HS/LT';
            } else if (eth == 'White' || eth == 'White/American' || eth == 'white' || eth == 'white/caucasian' || eth == 'Caucasian' || eth == 'caucasian (Canadian, Italian-Scottish)' || eth == 'Caucasian/Italian' || eth == 'Middle Eastern' || eth == 'White guy' || eth == 'Turkish') {
                profile['ethnicity'] = 'W';
            } else if (eth == 'Mixed' || eth == 'Two or more (SE Asian, Caucasian)') {
                profile['ethnicity'] = 'TWO';
            } else {
                profile['ethnicity'] = 'N';
            }

            switch (user['referredFrom']) {
                case 'By Email':
                    profile['referral'] = 'email';
                    break;
                case 'I attended Reality Virtually 2016':
                    profile['referral'] = 'RV2016';
                    break;
                case 'I attended Reality Virtually 2017':
                    profile['referral'] = 'RV2017';
                    break;
                case 'Facebook':
                    profile['referral'] = 'facebook';
                    break;
                case 'Twitter':
                    profile['referral'] = 'twitter';
                    break;
                case 'A group I belong to':
                    profile['referral'] = 'group';
                    break;
                case 'Word of mouth':
                    profile['referral'] = 'wordOfMouth';
                    break;
                default:
                    profile['referral'] = 'wordOfMouth';
                    break;
            }

            UserController.updateProfileByEmail( userEmail, profile, function(err) {
                if(err) {
                    return console.log(err);
                }
                if (count == userTotal) {
                    console.log("Applications done");
                }
            });
        }
    }
});
