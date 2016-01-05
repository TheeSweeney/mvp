
angular.module('WakeNSkate',[
  'ngRoute',
  'WakeNSkate.main',
  'WakeNSkate.clock'
  ])

.config(function($routeProvider){
  $routeProvider

  .when('/clock', {
    templateURL: 'app/pages/clock.html',
    controller: 'clockContoller'
  })
  .when('/home', {
    templateURL: 'app/pages/home.html',
    controller: 'mainController'
  })
  .otherwise({redirectTo:'/home'});
})
.run(function(){

});