var WakeNSkate = angular.module('WakeNSkate',[
  'ngRoute'
  ])

// .config(function($routeProvider){
//   $routeProvider

//   .when('/clock', {
//     templateURL: 'templates/clock',
//     controller: 'clockContoller'
//   })
//   .when('/home', {
//     templateURL: 'templates/home',
//     controller: 'indexController'
//   })
//   .otherwise({redirectTo:'/home'});
// })

.controller('mainController', function($log, $location){
  $log.info($location.path());
});