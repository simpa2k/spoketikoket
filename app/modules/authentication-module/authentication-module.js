define(function() {

    var authenticationModule = angular.module('AuthenticationModule', []);

    authenticationModule.service('AuthenticationService', ['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
        var self = this;

        self.login = function(username, password, callback) {
            $http.get($rootScope.serverRoot + 'users?username=' + username + '&password=' + password).then(function(response) {
                callback(response.data);
            });
        };

        self.checkToken = function(username, token, callback) {
            $http.get($rootScope.serverRoot + 'users?username=' + username + '&token=' + token).error(function(response) {
                callback(response);
            });
        };

    }]);
    
});
