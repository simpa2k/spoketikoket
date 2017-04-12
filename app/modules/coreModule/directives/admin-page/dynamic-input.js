define(function() {

    let dynamicInput = function($compile) {

        let controller = ['$scope', function($scope) {

            $scope.datePopup = {
                opened: false
            };

            $scope.openDatePopup = function() {
                $scope.datePopup.opened = true;
            };

            $scope.$watch(function() {
                return $scope.datePopup.opened;
            }, function(value) {
                console.log(value);
            });

        }];

        let getStandardAttributes = function(field) {

            return {

                id: field,
                class: 'form-control',
                ngModel: 'model.' + field,
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

            let p = $compile('<p class="input-group"></p>')(scope);

            let standardAttributes = {

                id: 'date',
                class: 'form-control',
                ngModel: 'model.' + field,
                placeholder: 'date',

            };

            standardAttributes.type = 'text';
            standardAttributes.uibDatepickerPopup = 'd/M, yyyy';
            standardAttributes.isOpen = 'datePopup.opened';
            standardAttributes.closeText = 'Stäng';

            appendElement(p, 'input', field, standardAttributes, scope);
            let btn = $compile('<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="openDatePopup()"><i class="glyphicon glyphicon-calendar"></i></button></span>')(scope);

            p.append(btn);
            $compile(p)(scope);

            parent.append(p);


        };

        let appendTimeInput = function(parent, field, scope) {

            let standardAttributes = getStandardAttributes(field);

            delete standardAttributes.class;

            standardAttributes.uibTimepicker = "";
            standardAttributes.showMeridian = false;

            appendElement(parent, 'div', field, standardAttributes, scope);

        };

        let createElement = function(element, field, attributes, scope) {

            let input = $compile('<' + element + '></' + element + '>')(scope);
            buildAttributes(input, attributes, scope);

            return input;

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
            controller: controller,
            link: function(scope, element, attributes) {

                switch(attributes.type) {

                    case 'datetime':
                        appendDateInput(element, attributes.field, scope);
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