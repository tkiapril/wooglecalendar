angular.module('woogleApp.directives', [] )

.directive('accessLevel', function ($rootScope, AccessControl) {
  return {
    link: function (scope, element, attrs) {
      var prevDisp = element.css('display');
      $rootScope.$watch('userRole', function (userRole) {
        if (!AccessControl.authorize(attrs.accessLevel)) {
          element.css('display', 'none');
        } else {
          element.css('display', prevDisp);
        }
      });
    }
  };
})