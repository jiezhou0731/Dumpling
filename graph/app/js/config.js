var app = angular.module('dumplingApp',['ngSanitize','ngMaterial','ngRoute']).config(function($mdIconProvider) {
  $mdIconProvider
  .iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
  .iconSet("social", 'img/icons/sets/social-icons.svg', 24);
});


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/spheres', {
        templateUrl: 'app/view/spheres/index.html'
      }).
      otherwise({
        redirectTo: '/spheres'
      });
  }]);