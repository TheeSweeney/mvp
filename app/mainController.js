angular.module('WakeNSkate.main',[])


.controller('mainController', function($log, $location){
  $log.info($location.path());
  console.log('testasfd');
});
