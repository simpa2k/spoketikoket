define(function() {

    let dynamicInput = function($compile) {

        let getStandardAttributes = function(field) {

            return {

                id: field,
                class: 'form-control',
                ngModel: 'model[field]',
                placeholder: field,

            }
        };

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

        let appendInput = function(parent, field, attributes, scope) {

            let standardAttributes = getStandardAttributes(field);
            standardAttributes.type = 'text';

            appendElement(parent, 'input', field, standardAttributes, scope);

        };

        let appendDateInput = function(parent, field, scope) {

            let standardAttributes = getStandardAttributes(field);

            standardAttributes.uibDatePickerPopup = "";
            standardAttributes.isOpen = "";
            standardAttributes.closeText = "";

            appendElement(parent, 'input', field, standardAttributes, scope);

        };

        let appendTimeInput = function(parent, field, scope) {

            let standardAttributes = getStandardAttributes(field);

            delete standardAttributes.class;

            standardAttributes.uibTimepicker = "";
            standardAttributes.showMeridian = false;

            appendElement(parent, 'div', field, standardAttributes, scope);

        };

        let appendElement = function(parent, element, field, attributes, scope) {

            let input = $compile('<' + element + '></' + element + '>')(scope);
            buildAttributes(input, attributes, scope);

            parent.append(input);

        };

        return {

            restrict: 'EA',
            scope: {
                field: '@',
                type: '@',
                model: '='
            },
            link: function(scope, element, attributes) {

                switch(attributes.type) {

                    case 'date':
                        appendDateInput(element, attributes.field, scope);
                        break;
                    case 'time':
                        appendTimeInput(element, attributes.field, scope);
                        break;
                    default:
                        appendInput(element, attributes.field, attributes, scope);
                        break;

                }
            }
        }
    };

    angular.module('coreModule')
        .directive('dynamicInput', dynamicInput);

});