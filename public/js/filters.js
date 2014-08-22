angular.module('woogleApp.filters', [])

.filter('dateLocal', function () {
  return function (input) {
    return moment(input).format('YYYY-MM-DD');
  }
})

.filter('dateTimeLocal', function () {
  return function (input) {
    return moment(input).format('YYYY-MM-DD HH:mm:ss');
  }
})

.filter('dateTimeLocalMicro', function () {
  return function (input) {
    return moment(input).format('YYYY-MM-DD HH:mm:ss.SSS');
  }
})

.filter('trustAsHtml', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
})
.filter('trustAsUrl', function($sce) {
    return function(val) {
        return $sce.trustAsUrl(val);
    };
})
