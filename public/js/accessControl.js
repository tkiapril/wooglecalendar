!function () {
  var accessControl = function (exports) {

    var r = exports.userRoles = {
      admin: 1,
      user: 2,
      guest: 4
    };

    exports.accessLevels = {
      everyone: r.admin | r.user | r.guest,
      user: r.admin | r.user,
      admin: r.admin
    };
  };

  if (typeof exports === 'undefined') {
    this['accessControl'] = {};
    accessControl(this['accessControl']);
  } else {
    accessControl(exports);
  };
}();