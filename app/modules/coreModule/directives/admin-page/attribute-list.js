define(function() {

    /**
     * Directive to set HTML element attribute keys and values dynamically.
     */
    let attributeList = function($compile) {

        return {

            scope: {},
            link: function(scope, element, attributes) {

                angular.forEach(scope.$eval(attributes.attributeList), function(value, key) {

                    /*
                     * You'd have thought that snake casing would be more complicated.
                     * From a comment on the second answer at:
                     * http://stackoverflow.com/questions/24357288/how-to-convert-dash-case-to-camelcase-in-angularjs
                     */
                    let snakeCasedKey = key.replace(/[A-Z]/g, function(c) {
                        return '-' + c.toLowerCase();
                    });

                    element.attr(snakeCasedKey, value);

                });

                element.removeAttr('attribute-list');
                //$compile(element)(scope);

            }
        }
    };

    angular.module('coreModule')
        .directive('attributeList', attributeList);
});