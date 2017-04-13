define(function() {

    /**
     * Directive to generate an appropriate input based on a specified type.
     * Currently, the following types are supported:
     *
     *  * datetime
     *  * textarea
     *  * text
     *
     * The datetime type generates one uib-datepicker-popup and one
     * uib-timepicker from the UI Bootstrap library. The textarea type
     * generates a TinyMce HTML editor.
     */
    let dynamicInput = function($compile) {

        let controller = ['$scope', function($scope) {

            // Used by date inputs to control whether the popup should be displayed or not.
            $scope.datePopup = {
                opened: false
            };

            // Called on clicking the datepicker button.
            $scope.openDatePopup = function() {
                $scope.datePopup.opened = true;
            };

        }];

        /**
         * Function to get an object with standard attributes set based on a
         * given field name, to be used for programmatically setting the
         * attributes of an angular element.
         *
         * @param fieldName The name of the field that the input maps to.
         * @returns {{id: *, class: string, ngModel: string, placeholder: *}}
         * An object with a set of standard keys and values.
         */
        let getStandardAttributes = function(fieldName) {

            return {

                id: fieldName,
                class: 'form-control',
                ngModel: 'model.' + fieldName,
                placeholder: fieldName,

            }
        };

        /**
         * Function to programmatically set the attributes of an angular
         * element based on an object containing the relevant key-value
         * mappings. Will convert from camelCased key names to snake-cased
         * ones.
         *
         * @param element The element to set the attributes of.
         * @param attributes An object to extract key-value attributes from.
         * @param scope The current scope, needed to be able to compile the
         * element upon successful setting of the attributes.
         */
        let buildAttributes = function(element, attributes, scope) {

            angular.forEach(attributes, function(value, key) {

                /*
                 * Converting from camelCase to snake-case.
                 * From a comment on the second answer at:
                 * http://stackoverflow.com/questions/24357288/how-to-convert-dash-case-to-camelcase-in-angularjs
                 */
                let snakeCasedKey = key.replace(/[A-Z]/g, function(c) {
                    return '-' + c.toLowerCase();
                });

                element.attr(snakeCasedKey, value);

            });
            $compile(element)(scope); // This is needed to apply the performed changes.

        };

        /**
         * Function to create and append a standard input element to a given parent.
         *
         * @param parent The element to append the newly created input element
         * to.
         * @param fieldName The name of the field that the input maps to.
         * @param scope The current scope.
         */
        let appendInput = function(parent, fieldName, scope) {

            let standardAttributes = getStandardAttributes(fieldName);
            standardAttributes.type = 'text';

            appendElement(parent, 'input', standardAttributes, scope);

        };

        /**
         * Function to create and append a date input element to a given parent.
         * Will create a UI Bootstrap datepicker which means that if this
         * field is initialized with a model already containing a value, that
         * value has to be a javascript date object.
         *
         * @param parent The element to append the newly created date input to.
         * @param fieldName The name of the field that the input maps to.
         * @param scope The current scope.
         */
        let appendDateInput = function(parent, fieldName, scope) {

            // Creating a <p> to wrap the date input and the button in.
            let p = $compile('<p class="input-group"></p>')(scope);

            let standardAttributes = {

                id: 'date',
                class: 'form-control',
                ngModel: 'model.' + fieldName,
                placeholder: 'date',

            };

            standardAttributes.type = 'text';                    // Type should be set to 'text' to avoid browsers displaying their own datepickers.
            standardAttributes.uibDatepickerPopup = 'd/M, yyyy'; // "April 12th 2017" will be displayed as "12/4, 2017".
            standardAttributes.isOpen = 'datePopup.opened';      // Specifying the variable to store open/closed state.


            // Doing a bit of translating from the standard button texts.
            standardAttributes.currentText = 'Dagens datum';
            standardAttributes.clearText = 'Rensa';
            standardAttributes.closeText = 'Stäng';

            // Appending an input with the above attributes to the <p> created above. Creates a UI Bootstrap datepicker popup.
            appendElement(p, 'input', standardAttributes, scope);

            // Creating the  button that will actually display the popup on clicking it.
            let btn = $compile('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="openDatePopup()"><i class="glyphicon glyphicon-calendar"></i></button></span>')(scope);

            p.append(btn); // Append the button to the <p>.
            $compile(p)(scope); // Without this, the datepicker popup would not be displayed on clicking the button.

            parent.append(p); // Attach everything to the wrapping element.

        };

        /**
         * Function to create and append a time input element to a given parent.
         * Will create a UI Bootstrap timepicker which means that if this
         * field is initialized with a model already containing a value, that
         * value has to be a javascript date object.
         *
         * @param parent The element to append the newly created date input to.
         * @param fieldName The name of the field that the input maps to.
         * @param scope The current scope.
         */
        let appendTimeInput = function(parent, fieldName, scope) {

            let standardAttributes = getStandardAttributes(fieldName);

            delete standardAttributes.class; // The input should not have the form-group class.

            standardAttributes.uibTimepicker = ""; // No value needed.
            standardAttributes.showMeridian = false; // The default is null, but setting it for good measure.

            appendElement(parent, 'div', standardAttributes, scope); // Create the timepicker input.

        };

        /**
         * Function to create and append a textarea to a given parent.
         * Will create a TinyMce HTML editor.
         *
         * @param parent The element to append the newly create textarea to.
         * @param fieldName The name of the field that the input maps to.
         * @param scope The current scope.
         */
        let appendTextarea = function (parent, fieldName, scope) {

            let standardAttributes = getStandardAttributes(fieldName);
            delete standardAttributes.placeholder;

            standardAttributes.uiTinymce = '';

            appendElement(parent, 'textarea', standardAttributes, scope);

        };

        /**
         * Function to create and append an angular element to a given parent.
         *
         * @param parent The parent to append the newly created element to.
         * @param element The element to create in the form of a string.
         * @param attributes An object containing key-value mappings to extract
         * attributes and values from.
         * @param scope The current scope.
         */
        let appendElement = function(parent, element, attributes, scope) {

            let input = $compile('<' + element + '></' + element + '>')(scope);
            buildAttributes(input, attributes, scope);

            parent.append(input);

        };

        return {

            restrict: 'EA',
            scope: {
                fieldName: '@',
                type: '@',
                model: '='
            },
            controller: controller,
            link: function(scope, element, attributes) {

                switch(attributes.type) {

                    case 'datetime':
                        appendDateInput(element, attributes.fieldName, scope);
                        appendTimeInput(element, attributes.fieldName, scope);
                        break;
                    case 'textarea':
                        appendTextarea(element, attributes.fieldName, scope);
                        break;
                    default:
                        appendInput(element, attributes.fieldName, scope);
                        break;

                }
            }
        }
    };

    angular.module('coreModule')
        .directive('dynamicInput', dynamicInput);

});