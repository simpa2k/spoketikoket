define(function() {
    var app = angular.module('coreModule');

    app.filter('priceFilter', function() {

        return function(price) {

            let filteredPrice = price;

            if(price == '0') {
                filteredPrice = 'Gratis!';
            }

            return filteredPrice;

        };

    });
});