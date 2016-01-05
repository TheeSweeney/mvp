
angular.module('WakeNSkate',[
  'ngRoute',
  'WakeNSkate.clock',
  'WakeNSkate.main'
])
.config(function ($routeProvider){
  $routeProvider

  .when('/clock', {
    templateURL: 'app/pages/clock.html',
    controller: 'clockContoller'
  })
  .when('/home', {
    templateURL: 'app/home/home.html',
    controller: 'mainController'
  })
  .otherwise({redirectTo:'/home'});
});