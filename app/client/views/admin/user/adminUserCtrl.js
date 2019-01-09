const swal = require('sweetalert');

angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    function($scope, $http, User, UserService){
      $scope.selectedUser = User.data;

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
      var currentExperiences = $scope.selectedUser.profile.experiences;
      if (currentExperiences) {
          for (var i in currentExperiences) {
              var x = $scope.exps.filter((exp) => exp.name == currentExperiences[i])[0];
              if (x) {
                  x.selected = true;
              }
          }
      } else {
          $scope.selectedUser.profile.experiences = [];
      }
      // Helper method to get selected boxes
      $scope.selectedExps = function selectedExps() {
        return filterFilter($scope.exps, { selected: true });
      };
      // Watch boxes for changes
      $scope.$watch('exps|filter:{selected:true}', function (nv) {
        $scope.selectedUser.profile.experiences = nv.map(function (exp) {
          return exp.name;
        });
      }, true);

      $scope.updateTeam = function(){
        UserService
          .adminJoinOrCreateTeam($scope.selectedUser.teamCode, $scope.selectedUser._id)
          .then(response => {
              console.log(response);
            $selectedUser = response.data;
            swal("Updated!", "Team updated.", "success");
          }, response => {
            swal("Oops, team change failed.");
          });
      };

      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };

      $scope.updateConfirmation = function(){
        UserService
          .updateConfirmation($scope.selectedUser._id, $scope.selectedUser.confirmation)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Confirmation updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };
    }]);
