angular.module('WakeNSkate.clock',[])


.controller('clockController', function($log, $location){
  $log.info($location.path());
  console.log('testasfd');
});