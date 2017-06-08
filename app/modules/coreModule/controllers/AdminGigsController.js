define(function() {

    var app = angular.module('coreModule');
    
    app.controller('AdminGigsController', function($scope, $rootScope, $http, $filter, SendObjectService, GigsService, VenuesService, DateService, ValidationService) {

        $scope.isSubmittedOrTouched = function(form, formControl) {
            return ValidationService.isSubmittedOrTouched(form, formControl);
        };

        $scope.isRequired = function(form, formControl) {
            return ValidationService.isRequired(form, formControl);
        };

        $scope.isRequiredAndSubmittedOrTouched = function(form, formControl) {
            return ValidationService.isRequiredAndSubmittedOrTouched(form, formControl);
        };

        $scope.hasError = function(form, formControl) {
            return $scope.isRequiredAndSubmittedOrTouched(form, formControl) ? 'has-error' : '';
        };

        $scope.gigsListDatePopup = {
            opened: false
        };

        $scope.gigFormDatePopup = {
            opened: false
        };

        $scope.openGigsListDatePopup = function() {
            $scope.gigsListDatePopup.opened = true;
        };

        $scope.openGigFormDatePopup = function() {
            $scope.gigFormDatePopup.opened = true;
        };

        $scope.datetime = $scope.currentDate;

        $scope.dateFilter = function() {
            return function(gig) {
                return DateService.laterThan(gig.datetime, $scope.datetime);
            }
        };

        var getVenues = function() {

            VenuesService.getVenues().then(function(venues) {
                $scope.venues = venues;
            });

        };
    
        $scope.gigToBeSent = {};

        /*
         foundVenueRecently tries to determine
         if the user is trying to add a new venue
         or is searching for an already added one.
         As it is now the address, city and webpage fields
         will be cleared if a venue was just found and the
         user continues to change the input field, but
         not if a venue wasn't found. This might not be the optimal solution, however.
         */
        var foundVenueRecently = false;

            $scope.searchVenues = function() {

                // Make sure to create a copy of the venue object
                var venue = jQuery.extend({}, $scope.venues[$scope.gigToBeSent.venue_name]);

                if(venue !== undefined) {

                    $scope.selectedVenue = venue;
                    foundVenueRecently = true;

                } else if(foundVenueRecently) {
                    $scope.selectedVenue = undefined;
                }

            };

            //Använd den här sen:
            /*var selectVenue = function(venueName) {
             $scope.selectedVenue = angular.copy($scope.venues[venueName]);
             };*/
        var selectVenue = function(venueName) {

            angular.forEach($scope.venues, function(value) {

                if(value.name == venueName) {
                    $scope.selectedVenue = jQuery.extend({}, value);
                }

            });

        };

        $scope.setPutState = function(gig) {

            $scope.gigToBeSent = angular.copy(gig);

            // Deleting properties of foreign key object
            delete $scope.gigToBeSent.city;
            delete $scope.gigToBeSent.address;
            delete $scope.gigToBeSent.webpage;
            delete $scope.gigToBeSent.name;

            selectVenue(gig.venue_name);
            $scope.sendGig = $scope.putGig;

            $scope.heading = 'Redigera gig';
            $scope.gigAction = 'Bekräfta ändringar';
            $scope.addingNewGig = false;

        };
    
        $scope.setPostState = function() {

            $scope.gigToBeSent = {};
            $scope.selectedVenue = undefined;

            $scope.sendGig = $scope.postGig;

            $scope.heading = 'Lägg till nytt gig';
            $scope.gigAction = 'Lägg till gig';
            $scope.addingNewGig = true;

        };

        var refreshVenues = function() {

            VenuesService.refreshVenues().then(function(venues) {
                $scope.venues = venues;
            });

        };

        var sendVenue = function() {

            if($scope.selectedVenue) {

                $scope.selectedVenue.name = $scope.gigToBeSent.venue_name;

                var venueForComparison = $scope.venues[$scope.selectedVenue.name];
                var venuesEndpoint = $scope.serverRoot + 'venues';

                if (venueForComparison == undefined) {
                   
                    // If there is no venue with the specified name, post the venue (i.e. create it).
                    SendObjectService.postObject(venuesEndpoint, $scope.selectedVenue, function() {
                        getVenues();
                    });

                } else if (JSON.stringify($scope.selectedVenue) != JSON.stringify(venueForComparison)) {

                    /*
                     If there is a venue with the specified name, but some of the other fields have been changed,
                     put the venue (i.e. update it).
                     */
                    SendObjectService.putObject(venuesEndpoint, $scope.selectedVenue, function() {
                        getVenues();
                    });

                }

                refreshVenues();

            }
        };
    
        var gigsEndpoint = $rootScope.serverRoot + 'gigs';
    
        var refreshGigs = function() {

            GigsService.refreshGigs().then(function(gigs) {
                $scope.gigs = gigs;
            });

        };

        $scope.makeRequest = function(form) {

            $scope.gigToBeSent.datetime = DateService.stringifyDate($scope.gigToBeSent.datetime, 'yyyy-MM-dd HH:mm:00');
            $scope.sendGig(form);

        };

        $scope.postGig = function(form) {

            sendVenue();

            SendObjectService.postObject(gigsEndpoint, $scope.gigToBeSent, function() {

                refreshGigs();
                $scope.setPostState();
                ValidationService.resetForm(form)

            });
        };
    
        $scope.putGig = function(form) {

            sendVenue();

            SendObjectService.putObject(gigsEndpoint, $scope.gigToBeSent, function() {

                refreshGigs();
                ValidationService.resetForm(form)

            });
        };
    
        $scope.deleteGig = function(form) {

            SendObjectService.deleteObject(gigsEndpoint, $scope.gigToBeSent, function() {

                refreshGigs();
                $scope.setPostState();
                ValidationService.resetForm(form);

            });

        };
    
        getVenues();
        $scope.setPostState();
    
    });

});
