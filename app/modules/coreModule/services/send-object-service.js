define(function() {

	var app = angular.module('coreModule');
	
	app.service('SendObjectService', ['$http', function($http) {
	    var self = this;

	    var constructUriFromObject = function(object) {

	        let uri = '';
			let first = true;

	        angular.forEach(object, function(value, key) {

				if(first) {
					first = false;
				} else {
					uri += '&';
				}

				uri += key;

				if(value != null && value.hasOwnProperty('length') && value.length > 0) {

					let encodedValue = encodeURIComponent(value);
					uri += '=' + encodedValue;

				}

	        });

	        return uri;

	    };
	
	    self.appendToUri = function(uri, object) {
	        return uri + '&' + constructUriFromObject(object);
	    };
	
	    self.createUri = function(endpoint, object) {
	        var uri = endpoint + '?';
	        return uri + constructUriFromObject(object);
	    };
	
	    self.putObject = function(endpoint, object, callback) {
	        $http.put(self.createUri(endpoint, object)).then(function(response) {
	            callback(response.data);
	        });
	    };
	
	    self.postObject = function(endpoint, object, callback) {
	        $http.post(self.createUri(endpoint, object)).then(function(response) {
	            callback(response.data);
	        });
	    };
	
	    self.deleteObject = function(endpoint, object, callback) {
	        $http.delete(self.createUri(endpoint, object)).then(function(response) {
	            callback(response.data);
	        });
	    };
	}]);

});