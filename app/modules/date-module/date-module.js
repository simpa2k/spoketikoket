define(function() {

    var dateModule = angular.module('DateModule', []);

    dateModule.service('DateService', ['$filter', function($filter) {
        var self = this;

        self.getCurrentDatetime = function(callback) {
            var date = new Date();
            callback(date);
        };

        self.laterThan = function(date1, date2) {

            return self.compareYearMonthDay(date1, date2, (date1Year, date1Month, date1Day, date2Year, date2Month, date2Day) => {

                if(date1Year === date2Year) {

                 if(date1Month === date2Month) {

                     return date1Day >= date2Day;

                 } else if (date1Month > date2Month) {

                     return true;

                 }
               } else if(date1Year > date2Year) {
                     return true;
               }
               return false;

            })
        };

        self.earlierThan = function(date1, date2) {

            return self.compareYearMonthDay(date1, date2, (date1Year, date1Month, date1Day, date2Year, date2Month, date2Day) => {

                if(date1Year === date2Year) {

                    if(date1Month === date2Month) {

                        return date1Day <= date2Day;

                    } else if (date1Month < date2Month) {

                        return true;

                    }
                } else if(date1Year < date2Year) {
                    return true;
                }
                return false;

            })
        };

        self.compareYearMonthDay = function(date1, date2, comparisonFunction) {
            date1Year = date1.getFullYear();
            date2Year = date2.getFullYear();

            date1Month = date1.getMonth();
            date2Month = date2.getMonth();

            date1Day = date1.getDate();
            date2Day = date2.getDate();

            return comparisonFunction(date1Year, date1Month, date1Day, date2Year, date2Month, date2Day);

        };

        self.parseDate = function(date) {
            var splitDate = date.split('-');
            var year = splitDate[0];
            var month = parseInt(splitDate[1]) - 1; // Since JavaScript counts months from 0-11
            var day = splitDate[2];

            date = {
                'year': year,
                'month': month,
                'day': day
            };

            return date;

        };

        self.parseTime = function(time) {
            var splitTime = time.split(':');
            var hours = splitTime[0];
            var minutes = splitTime[1];

            time = {
                'hours': hours,
                'minutes': minutes
            };

            return time;

        };

        self.stringifyDate = function(date, format) {
            return $filter('date')(date, format);
        };

    }]);

});