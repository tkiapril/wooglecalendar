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
  var addSchedule = function (title, start, end, allDay, location, description, comments) {
    schedules.push({
      scheduleId: schedules.length + 1,
      title: title,
      start: start,
      end: end,
      allDay: allDay,
      location: location || (title + '장소'),
      description: description || (title + '설명'),
      comments: comments || [
        {
          author: '가나다',
          comment: '라마바'
        },
        {
          author: '사아자',
          comment: '차카타파하'
        }
      ]
    });
  };

  addSchedule('네트워킹 데이', moment('2014-08-22 08:00:00'), moment('2014-08-22 21:00:00'), false, '소프트웨어 마에스트로 연수 센터', '네트워킹 데이입니다', [
    {
      author: '네트워킹 데이 참여자 1',
      comment: '재미있겠다!'
    },
    {
      author: '네트워킹 데이 참여자 2',
      comment: '그렇지요!'
    }
  ]);

  addSchedule('광복절', moment('2014-08-15 00:00:00'), moment('2014-08-15 23:59:59'), true, '해당 없음', '광복절입니다.', []);

  addSchedule('Google Cloud를 이용한 서비스 개발', moment('2014-08-06 13:00:00'), moment('2014-08-06 15:00:00'), false, '해찬', 'python 언어기초<br />Google App Engine(GAE)을 통한 PaaS 이해 <br />GAE의 memcache 기능 <br />GAE의 sql 기능 <br />GAE의 nosql(ndb)기능, 테이블 설계 <br />ndb query 및 filter <br />GAE의 template 기능 <br />GAE의 taskqueue <br />GAE의 cron광복절입니다.', [
    {
      author: '연수생 1',
      comment: 'Google Cloud를 이용한 서비스 개발 최고!'
    },
    {
      author: '연수생 2',
      comment: '이 교육은 안 들을래요.'
    }
  ]);
 
  /*
  addSchedule('Schedule 8/20-1', moment('2014-08-20'), moment('2014-08-21'), true);
  addSchedule('Schedule 8/20-2', moment('2014-08-20'), moment('2014-08-20'), true);
  addSchedule('Schedule 8/22-1', moment('2014-08-22'), moment('2014-08-22'), false);
  addSchedule('Schedule 8/22-2', moment('2014-08-22'), moment('2014-08-22'), true);
  addSchedule('Schedule 8/22-3', moment('2014-08-22'), moment('2014-08-22'), true);
  addSchedule('Schedule 8/23-1', moment('2014-08-23'), moment('2014-08-23'), true);
  */

  var debug = true;

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

  var sumDateTime = function (date, time) {
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    return moment(date);
  };

  return {
    readAll: function (cb) {
      if (debug) {
        cb(schedules);
        return;
      }

      $http.get('/schedule')
      .success(function (data) {
        convertSchedules(data);
        cb(data);
      });
    },
    readById: function (scheduleId, cb) {
      console.log(scheduleId);
      if (debug) {
        console.log(schedules.length);
        cb(schedules[scheduleId - 1]);
        return;
      }
      $http.get('/schedule/' + scheduleId)
      .success(function (data) {
        data = convertSchedule(data);
        cb(data);
      });
    },
    create: function (body, cb) {
      console.log(body);
      body.start_date = sumDateTime(body.startDate, body.startTime);
      body.end_date = sumDateTime(body.endDate, body.endTime);
      if (debug) {
        body.title = body.title || '제목 없음';
        addSchedule(body.title, body.start_date, body.end_date, true, body.location, body.description);
        cb(null);
        return;
      }
      $http.post('/schedules', body)
      .success(function () {
        cb(null);
      })
      .error(function () {
        cb(true);
      });
    },
    post: function (scheduleId, body, cb) {
      if (debug) {
        schedules[scheduleId - 1].comments.push({
          author: '새 사용자',
          comment: body
        });
        return;
      }
      $http.post('/comment', {
        schedule_id: scheduleId,
        comment: body
      })
      .success(function (cb) {
        cb(null);
      });
    }
  };
})
