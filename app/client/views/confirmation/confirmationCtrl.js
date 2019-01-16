const angular = require("angular");
const swal = require('sweetalert');

angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    function($scope, $rootScope, $state, currentUser, settings, Session, UserService){

      // Set up the user
      $scope.user = currentUser.data;
      var userId = Session.getUserId()

      $scope.pastConfirmation = Date.now() > settings.timeConfirm;

      _setupForm();

      $scope.fileName = userId + "_" + $scope.user.profile.firstname + "_" + $scope.user.profile.lastname;

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      $scope.rests = [
        { name: 'None', selected: true },
        { name: 'Gluten Free', selected: false },
        { name: 'Lactose Intolerant', selected: false },
        { name: 'Vegetarian', selected: false },
        { name: 'Vegan', selected: false }
      ];
      // Selected boxes
      var currentRests = $scope.user.confirmation.dietaryRestrictions;
      if (currentRests) {
          for (var i in currentRests) {
              var x = $scope.rests.filter((rests) => rests.name == currentRests[i])[0];
              if (x) {
                  x.selected = true;
              }
          }
      } else {
          $scope.user.confirmation.dietaryRestrictions = [];
      }
      // Helper method to get selected boxes
      $scope.selectedRests = function selectedRests() {
        return filterFilter($scope.rests, { selected: true });
      };
      // Watch boxes for changes
      $scope.$watch('rests|filter:{selected:true}', function (nv) {
        $scope.user.confirmation.dietaryRestrictions = nv.map(function (rest) {
          return rest.name;
        });
      }, true);

      // -------------------------------

      function _updateUser(e){
        UserService
          .updateConfirmation(userId, $scope.user.confirmation)
          .then(response => {
            swal("Woo!", "You're confirmed!", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
          fields: {
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a phone number.'
                }
              ]
            },
            github: {
              identifier: 'github',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your github.'
                }
              ]
            },
            line1: {
              identifier: 'addressLine1',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter an address.'
                }
              ]
            },
            signatureRelease: {
              identifier: 'signatureRelease',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
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
