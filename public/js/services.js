var apiBase = '/api/1/';

angular.module('woogleApp.services', ['ngCookies'])

.factory('AccessControl', function ($cookieStore, $rootScope) {
  $rootScope.$watch(
    function () {
      return $cookieStore.get('userRole');
    },
    function (userRole) {
      $rootScope.userRole = Number(userRole);
    }
  );
  $rootScope.userRole = $cookieStore.get('userRole');
  var authorize = function (accessLevel) {
    var userRole = $rootScope.userRole;
    if (!accessLevel && !userRole) {
      return true;
    }
    return userRole & accessControl.accessLevels[accessLevel];
  };
  return {
    authorize: authorize
  };
})

.factory('ScheduleService', function ($http) {

  var schedules = [];
  var addSchedule = function (title, start, end, allDay) {
    schedules.push({
      scheduleId: schedules.length + 1,
      title: title,
      start: start,
      end: end,
      allDay: allDay,
      location: title + '장소',
      description: title + '설명'
    });
  };

  addSchedule('Schedule 8/20-1', moment('2014-08-20'), moment('2014-08-21'), true);
  addSchedule('Schedule 8/20-2', moment('2014-08-20'), moment('2014-08-20'), true);
  addSchedule('Schedule 8/22-1', moment('2014-08-22'), moment('2014-08-22'), false);
  addSchedule('Schedule 8/22-2', moment('2014-08-22'), moment('2014-08-22'), true);
  addSchedule('Schedule 8/22-3', moment('2014-08-22'), moment('2014-08-22'), true);
  addSchedule('Schedule 8/23-1', moment('2014-08-23'), moment('2014-08-23'), true);

  var convertSchedule = function (schedule) {
    schedule.scheduleId = schedule.schedule_id;
    schedule.start = schedule.start_date;
    schedule.end = schedule.end_date;
    schedule.allDay = schedule.allday;
    return schedule;
  };

  var convertSchedules = function (schedules) {
    for (var i = 0; i < schedules.length; i++) {
      schedules[i] = convertSchedule(schedules[i]);
    }
  };

  return {
    readAll: function (cb) {
      $http.get('/schedule')
      .success(function (data) {
        convertSchedules(data);
        cb(data);
      });
    },
    readByDate: function (year, month, date) {
      $http.get('/schedule')
      .success(function (data) {
        convertSchedules(data);
        _.filter(data, function (schedule) {
          return schedule.getFullYear() == year && schedules.getMonth() == month && schedules.getDate() == date;
        });
      })
    },
    readById: function (scheduleId, cb) {
      $http.get('/schedule/' + scheduleId)
      .success(function (data) {
        cb(data);
      });
    },
    create: function (body, cb) {
      console.log(body);
      $http.post('/schedules', body)
      .success(function () {
        cb(null);
      })
      .error(function () {
        cb(true);
      });
    }
  };
})
