define(function() {

	var app = angular.module('coreModule');
	
	app.factory('VenuesService', ['$http', '$rootScope', function($http, $rootScope) {
	
	    var venuesEndpoint = $rootScope.serverRoot + 'venues';
	    var promise;

        var buildKeys = function(venues) {

			let venuesByName = {};

			angular.forEach(venues, function(value) {
                venuesByName[value.name] = value;
            });

			return venuesByName;
		};

        var venuesService = {
	        getVenues: function() {
	            if(!promise) {
	                promise = $http.get(venuesEndpoint).then(function(response) {
						return buildKeys(response.data);
	                });
	            } return promise;
	        },
			refreshVenues: function() {
	            promise = $http.get(venuesEndpoint).then(function(response) {
	                return buildKeys(response.data);
	            });
	            return promise;
	        }
	    };
	    return venuesService;
	
	}]);

});