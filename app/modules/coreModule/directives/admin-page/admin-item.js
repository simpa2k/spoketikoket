define(function() {

    let item = function() {

        let ignore = ['id', '$$hashKey'];

        return {

            restrict: 'E',
            scope: {
                item: '='
            },
            link: function(scope, element, attributes) {

                angular.forEach(scope.$eval(attributes.item), function(value, key) {

                    if (ignore.indexOf(key) == -1) {
                        element.append('<p>' + key + ': ' + value + '</p>');
                    }
                });
            }
        }
    };

    angular.module('coreModule')
        .directive('item', item);
});