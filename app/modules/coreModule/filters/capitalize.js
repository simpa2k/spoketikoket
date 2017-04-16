define(function () {

    /*
     * From http://stackoverflow.com/questions/30207272/capitalize-the-first-letter-of-string-in-angularjs
     */
    let app = angular.module('coreModule');

    app.filter('capitalize', function() {

        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })
});