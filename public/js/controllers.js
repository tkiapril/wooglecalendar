angular.module('woogleApp.controllers', [])

.controller('HomeController', function ($scope, $state) {
})

.controller('SchedulesController', function ($scope, ScheduleService, $modal) {

  $scope.selectedDate = moment();
  var updateSelectedDate = function (date) {
    $scope.selectedDate = moment(date);
    $scope.$digest();
  };

  var dayClick = function (date, jsEvent, view) {
    updateSelectedDate(date);
  };

  var eventClick = function (event, jsEvent, view) {
    updateSelectedDate(event.start);
  };

  $scope.events = [];
  $scope.calendarConfig = {
    height: 550,
    editable: false,
    header: {
      left: 'title',
      center: '',
      right: 'today prev, next'
    },
    lang: 'ko',
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayClick: dayClick,
    eventClick: eventClick
  };

  var updateAll = function () {
    ScheduleService.readAll(function (events) {
      $scope.events = [events];
    });
  };

  $scope.clickDayEvent = function (event) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/viewEvent.html',
      controller: 'ViewEventController',
      size: 'lg',
      resolve: {
        event: function () {
          return event;
        }
      }
    });
    modalInstance.result.then(function (result) {
      if (result) {
        updateAll();
      }
    }, function () {});
  };

  $scope.clickNew = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/newEvent.html',
      controller: 'NewEventController',
      size: 'lg'
    });
    modalInstance.result.then(function (result) {
      if (result) {
        updateAll();
      }
    }, function () {});
  };

  updateAll();
})

.controller('ViewEventController', function ($scope, $modalInstance, event) {
  $scope.result = true;
  $scope.event = event;
  $scope.close = function () {
    $modalInstance.close($scope.result);
  };
})

.controller('NewEventController', function ($scope, $modalInstance, ScheduleService) {
  
  $scope.dt = {};
  $scope.dt.startDate = new Date();
  $scope.dt.startTime = new Date();
  $scope.dt.endDate = new Date();
  $scope.dt.endTime = new Date();

  $scope.close = function () {
    $modalInstance.close(false);
  };

  $scope.ok = function () {

    var title = $('#inputTitle').val();
    var startDate = $scope.dt.startDate;
    var startTime = $scope.dt.startTime;
    var endDate = $scope.dt.endDate;
    var endTime = $scope.dt.endTime;
    var allDay = !!$scope.allDay;
    var location = $('#inputLocation').val();
    var description = $('#inputDescription').val();

    ScheduleService.create({
      title: title,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      allDay: allDay,
      location: location,
      description: description
    }, function (err, result) {
      if (err) {
        alert('일정을 등록하는 도중 오류가 발생했습니다.');
        return $modalInstance.close(false);
      }
      $modalInstance.close(true);
    });
  };
})

