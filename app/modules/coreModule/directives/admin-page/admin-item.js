define(function() {

    let adminItem = function() {

        return {

            restrict: 'E',
            scope: {
                item: '=',
                fields: '='
            },
            link: function(scope, element, attributes) {

                angular.forEach(scope.$eval(attributes.item), function(value, key) {

                    if (scope.fields.indexOf(key) !== -1) {
                        element.append('<p>' + key + ': ' + value + '</p>');
                    }
                });
            }
        }
    };

    angular.module('coreModule')
        .directive('adminItem', adminItem);
});