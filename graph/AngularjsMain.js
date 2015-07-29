angular.module('MyApp')

.controller('AppCtrl', function($scope, $window) {
    console.log($window.mySharedData);
});
