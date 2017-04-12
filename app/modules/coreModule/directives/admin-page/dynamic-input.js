define(function() {

    let dynamicInput = function($compile) {

        let controller = ['$scope', function($scope) {

            $scope.datePopup = {
                opened: false
            };

            $scope.openDatePopup = function() {
                $scope.datePopup.opened = true;
            };

        }];

        let getStandardAttributes = function(fieldName) {

            return {

                id: fieldName,
                class: 'form-control',
                ngModel: 'model.' + fieldName,
                placeholder: fieldName,

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

        let appendInput = function(parent, fieldName, attributes, scope) {

            let standardAttributes = getStandardAttributes(fieldName);
            standardAttributes.type = 'text';

            appendElement(parent, 'input', standardAttributes, scope);

        };

        let appendDateInput = function(parent, fieldName, scope) {

            let p = $compile('<p class="input-group"></p>')(scope);

            let standardAttributes = {

                id: 'date',
                class: 'form-control',
                ngModel: 'model.' + fieldName,
                placeholder: 'date',

            };

            standardAttributes.type = 'text';
            standardAttributes.uibDatepickerPopup = 'd/M, yyyy';
            standardAttributes.isOpen = 'datePopup.opened';


            standardAttributes.currentText = 'Dagens datum';
            standardAttributes.clearText = 'Rensa';
            standardAttributes.closeText = 'Stäng';

            appendElement(p, 'input', standardAttributes, scope);
            let btn = $compile('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="openDatePopup()"><i class="glyphicon glyphicon-calendar"></i></button></span>')(scope);

            p.append(btn);
            $compile(p)(scope);

            parent.append(p);

        };

        let appendTimeInput = function(parent, fieldName, scope) {

            let standardAttributes = getStandardAttributes(fieldName);

            delete standardAttributes.class;

            standardAttributes.uibTimepicker = "";
            standardAttributes.showMeridian = false;

            appendElement(parent, 'div', standardAttributes, scope);

        };

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
                    default:
                        appendInput(element, attributes.fieldName, attributes, scope);
                        break;

                }
            }
        }
    };

    angular.module('coreModule')
        .directive('dynamicInput', dynamicInput);

});