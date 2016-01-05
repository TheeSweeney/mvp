angular.module('WakeNSkate.main', [])


.controller('mainController', function ($scope, $log, $location){
  $log.info($location.path());
  console.log('testasfd');
});
