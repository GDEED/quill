const angular = require("angular");
const swal = require("sweetalert");

angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    function($scope, $rootScope, $state, $http, currentUser, settings, Session, UserService) {

      // Set up the user
      $scope.user = currentUser.data;

      // Is the student from MIT?
      // $scope.isMitStudent = $scope.user.email.split('@')[1] == 'mit.edu';

      // If so, default them to adult: true
      // if ($scope.isMitStudent){
      //   $scope.user.profile.adult = true;
      // }

      // Populate the citizenship dropdown
      populateCountries();
      _setupForm();

      $scope.regIsClosed = Date.now() > settings.data.timeClose;

      // Setup the AR/VR Experience Checkboxes
      $scope.exps = [
        { name: '360 Video',    selected: false },
        { name: 'CryEngine',   selected: false },
        { name: 'Google ARCore',     selected: false },
        { name: 'Google Tango',     selected: false },
        { name: 'Google VR (Cardboard / Daydream)',     selected: false },
        { name: 'MagicLeap',     selected: false },
        { name: 'Vive',     selected: false },
        { name: 'Vive Pro',     selected: false },
        { name: 'Samsung Gear VR',     selected: false },
        { name: 'Sony Playstation VR',     selected: false },
        { name: 'Apple ARKit',     selected: false },
        { name: 'Meta 2 AR',     selected: false },
        { name: 'Microsoft Hololens',     selected: false },
        { name: 'Native (OpenGL Vulkan)',     selected: false },
        { name: 'Oculus Go',     selected: false },
        { name: 'Oculus Rift',     selected: false },
        { name: 'Vuforia',     selected: false },
        { name: 'WebVR / A-Frame',     selected: false },
        { name: 'Steam OpenVR (HTC Vive)',     selected: false },
        { name: 'Unity',     selected: false },
        { name: 'Unreal Engine',     selected: false },
        { name: 'WayRay',     selected: false },
        { name: 'Other', selected: false }
      ];
      // Selected boxes
      var currentExperiences = $scope.user.profile.experiences;
      if (currentExperiences) {
          for (var i in currentExperiences) {
              var x = $scope.exps.filter((exp) => exp.name == currentExperiences[i])[0];
              if (x) {
                  x.selected = true;
              }
          }
      } else {
          $scope.user.profile.experiences = [];
      }
      // Helper method to get selected boxes
      $scope.selectedExps = function selectedExps() {
        return filterFilter($scope.exps, { selected: true });
      };
      // Watch boxes for changes
      $scope.$watch('exps|filter:{selected:true}', function (nv) {
        $scope.user.profile.experiences = nv.map(function (exp) {
          return exp.name;
        });
      }, true);

      /**
       * TODO: JANK WARNING
       */
      function populateCountries(){
        // $http
        //   .get('/assets/schools.json')
        //   .then(function(res){
        //     var schools = res.data;
        //     var email = $scope.user.email.split('@')[1];
        //
        //     if (schools[email]){
        //       $scope.user.profile.school = schools[email].school;
        //       $scope.autoFilledSchool = true;
        //     }
        //   });

        $http
          .get('/assets/countries.csv')
          .then(function(res){
            $scope.citizenship = res.data.split('\n');
            $scope.citizenship.push('Other');

            var content = [];

            for(i = 0; i < $scope.citizenship.length; i++) {
              $scope.citizenship[i] = $scope.citizenship[i].trim();
              content.push({title: $scope.citizenship[i]})
            }

            $('#citizenship.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.user.profile.citizenship = result.title.trim();
                }
              })
          });
      }

      function _updateUser(e){
        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your application has been saved.", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });
      }

      function isMinor() {
        return !$scope.user.profile.adult;
      }

      function minorsAreAllowed() {
        return settings.data.allowMinors;
      }

      function minorsValidation() {
        // Are minors allowed to register?
        if (isMinor() && !minorsAreAllowed()) {
          return false;
        }
        return true;
      }

      function _setupForm(){
        // Custom minors validation rule
        // $.fn.form.settings.rules.allowMinors = function (value) {
        //   return minorsValidation();
        // };

        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
          fields: {
            firstname: {
              identifier: 'firstname',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your first name.'
                }
              ]
            },
            lastname: {
              identifier: 'lastname',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your last name.'
                }
              ]
            },
            location: {
              identifier: 'location',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your current location.'
                }
              ]
            },
            citizenship: {
              identifier: 'citizenship',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a country of citizenship.'
                }
              ]
            },
            education: {
              identifier: 'education',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter the degrees you\'ve obtained.'
                }
              ]
            },
            occupation: {
              identifier: 'occupation',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your occupation.'
                }
              ]
            },
            affiliation: {
              identifier: 'affiliation',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your affiliation.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender.'
                }
              ]
            },
            ethnicity: {
              identifier: 'ethnicity',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a race/ethnicity.'
                }
              ]
            },
            description: {
              identifier: 'description',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a role.'
                }
              ]
            }
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };
    }]);
