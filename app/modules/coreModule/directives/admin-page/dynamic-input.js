define(function() {

    let dynamicInput = function($compile) {

        let buildAttributes = function(element, attributes, scope) {

            angular.forEach(attributes, function(value, key) {

                /*
                 * From a comment on the second answer at:
                 * http://stackoverflow.com/questions/24357288/how-to-convert-dash-case-to-camelcase-in-angularjs
                 */
                let snakeCasedKey = key.replace(/[A-Z]/g, function(c) {
                    return '-' + c.toLowerCase();
                });

                element.attr(snakeCasedKey, value);

            });
            $compile(element)(scope);

        };

        let appendLabel = function(element, field, scope) {

            let label = $compile('<label for="{{ field }}">{{ field }}</label>')(scope);
            element.append(label);

        };

        let appendInput = function(element, field, attributes, scope) {

            let input = $compile('<input id="{{ field }}" class="form-control" name="{{ field }}" ng-model="model[field]" placeholder="{{ field }}"></input>')(scope);
            buildAttributes(input, attributes, scope);

            element.append(input);

        };

        let appendCustomElement = function(element, field, attributes, scope) {

            let input = $compile('<' + attributes.element + ' id="{{ field }}"></' + attributes.element + '>')(scope);
            buildAttributes(input, attributes.additionalAttributes, scope);

            element.append(input);

        };

        return {

            restrict: 'E',
            scope: {
                field: '@',
                model: '=',
                attributes: '='
            },
            template: '<div></div>',
            replace: true,
            link: function(scope, element, attributes) {

                let evaluatedAttributes = scope.$eval(attributes.attributes);

                let field = attributes.field;
                appendLabel(element, field, scope);

                if (typeof evaluatedAttributes.element !== 'undefined') {
                    appendCustomElement(element, field, evaluatedAttributes, scope);
                } else {
                    appendInput(element, field, evaluatedAttributes.additionalAttributes, scope);
                }
            }
        }
    };

    angular.module('coreModule')
        .directive('dynamicInput', dynamicInput);

});