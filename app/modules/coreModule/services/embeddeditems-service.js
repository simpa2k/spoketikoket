define(function() {

	var app = angular.module('coreModule');
	
	app.factory('EmbeddeditemsService', ['$http', '$rootScope', function($http, $rootScope) {
	
	    var embeddeditemsEndpoint = $rootScope.serverRoot + 'embeddeditems';
		var videosEndpoint = embeddeditemsEndpoint + '?type=video';
		var soundsEndpoint = embeddeditemsEndpoint + '?type=sound';
        var spotifyEndpoint = embeddeditemsEndpoint + '?type=spotify';
	    var promise;
		var videosPromise;
		var soundsPromise;
        var spotifyPromise;

        let iframeAttributes = {

        	youtube: {

                width: "560",
                height: "315",
                frameborder: "0",

            },
            soundcloud: {

                width: "100%",
                height: "166",
                scrolling: "no",
                frameborder: "no",

            },
            spotify: {

                width: "100%",
                height: "380",
                frameborder: "0",
                allowtransparency: "true"

            },
			default: {

                width: "100%",
                height: "166",
                scrolling: "no",
                frameborder: "no",

			}
        };


        let determineType = function(embeddedItem) {

        	const anchor = document.createElement('a');
        	anchor.href = embeddedItem.src;

        	let hostname = anchor.hostname;
        	let hostnameElements = hostname.split('.');

        	// ToDo: this currently only handles urls with a subdomain, which is fine for the APIs currently used.
        	return hostnameElements.length >= 2 ? hostnameElements[1] : 'default';

		};

        const isPriority = function(type) {
        	return type === 'spotify';
		};

        /*
         * Note that this function both modifies the original
         * array and returns a new one, sorted by prioritized items.
         */
        let formatItems = function(embeddedItems) {

        	let sortedAndSet = [];

            angular.forEach(embeddedItems, function(embeddedItem) {

            	const type = determineType(embeddedItem);
            	Object.assign(embeddedItem, iframeAttributes[type]);

                if (isPriority(type)) {
                	sortedAndSet.unshift(embeddedItem);
                } else {
                	sortedAndSet.push(embeddedItem);
				}

			});

            return sortedAndSet;

		};

	    var embeddeditemsService = {
	        getEmbeddeditems: function() {
	            if(!promise) {
	                promise = $http.get(embeddeditemsEndpoint).then(function(response) {
	                    return response.data
	                });
	            } return promise;
	        },
			refreshEmbeddeditems: function() {
	            promise = $http.get(embeddeditemsEndpoint).then(function(response) {

	                // ToDo: attributes need to be set here
	                return formatItems(response.data);

	            });
	            return promise;
	        },
			getVideos: function() {
	        	if(!videosPromise) {
	        		videosPromise = $http.get(videosEndpoint).then(function(response) {

                        return formatItems(response.data);
	        			//return response.data;

					});
				}
				return videosPromise;
			},
			refreshVideos: function() {
				videosPromise = $http.get(videosEndpoint).then(function(response) {

                    return formatItems(response.data);
					//return response.data;

				});
				return videosPromise;
			},
			getSounds: function() {
				if(!soundsPromise) {
					soundsPromise = $http.get(soundsEndpoint).then(function(response) {

                        return formatItems(response.data);

					});
				}
				return soundsPromise;
			},
			refreshSounds: function() {
				soundsPromise = $http.get(soundsEndpoint).then(function(response) {

                    return formatItems(response.data);

				});
				return soundsPromise;
			}
	    };
	    return embeddeditemsService;
	
	}]);

});