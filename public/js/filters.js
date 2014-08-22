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
.filter('selectByDate', function () {
  return function (events, date) {
    if (!date) {
      return [];
    }
    return _.filter(events[0], function (event) {
      var eventDate = event.start;
      return eventDate.year() == date.year() && eventDate.month() == date.month() && eventDate.date() == date.date();
    });
  };
})