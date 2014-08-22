angular.module('woogleApp',
  [
    'woogleApp.services',
    'woogleApp.controllers',
    'woogleApp.directives',
    'woogleApp.filters',
    'ui.router',
    'ngRoute',
    'ui.bootstrap'
  ]
)

.config(function ($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrfToken';
  var interceptor = function ($location, $q) {
    var success = function (response) {
      return response;
    };
    var error = function (response) {
      if (response.status === 401 || response.status === 403) {
        $location.path('/');
      }
      return $q.reject(response);
    };
    return function (promise) {
      return promise.then(success, error);
    };
  };
  $httpProvider.responseInterceptors.push(interceptor);
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
  
  $stateProvider
    .state('woogle', {
      url: '',
      abstract: true,
      views: {
        '@': {
          templateUrl: 'partials/woogle.html'
        },
        'nav@woogle': {
          templateUrl: 'partials/nav.html'
        }
      }
    })
    .state('woogle.home', {
      url: '/home',
      views: {
        content: {
          templateUrl: 'partials/home.html',
          controller: 'HomeController'
        }
      }
    })
    .state('woogle.schedules', {
      url: '/schedules',
      views: {
        content: {
          templateUrl: 'partials/schedules.html',
          controller: 'SchedulesController'
        }
      }
    })
    
  $urlRouterProvider.otherwise('/home');
})
