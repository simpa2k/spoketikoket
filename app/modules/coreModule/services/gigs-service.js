define(function() {

	var app = angular.module('coreModule');
	
	app.factory('GigsService', ['$http', '$rootScope', 'DateService', function($http, $rootScope, DateService) {
		var instantiateGigDate = function(gig) {
			var splitDateTime = gig.datetime.split(' ');
			var date = splitDateTime[0];
			var time = splitDateTime[1];

			date = DateService.parseDate(date);
			time = DateService.parseTime(time);

			gig.datetime = new Date(date['year'], date['month'], date['day'], time['hours'], time['minutes'])
		};

		var handlePriceSetToZero = function(gig) {
			if( (gig.price == null) || (gig.price == '0') ) {
				gig.price = 'Gratis!';
			}
		};

		var formatGigs = function(gigs) {
			for(var i = 0; i < gigs.length; i++) {
				instantiateGigDate(gigs[i])
				handlePriceSetToZero(gigs[i])
			}
		};

	    var gigsEndpoint = $rootScope.serverRoot + 'gigs';
	    var promise;
	
	    var gigsService = {
	        getGigs: function() {
	            if(!promise) {
	                promise = $http.get(gigsEndpoint).then(function(response) {
	                    formatGigs(response.data);

	                    return response.data
	                });
	            } return promise;
	        },
			refreshGigs: function() {
	            promise = $http.get(gigsEndpoint).then(function(response) {
					formatGigs(response.data);

	                return response.data
	            });
	            return promise;
	        }
	    };
	    return gigsService;
	
	}]);

});