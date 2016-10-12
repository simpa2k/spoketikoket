define(function() {

    var app = angular.module('coreModule');

    /*
     * From http://stackoverflow.com/questions/16207202/required-attribute-not-working-with-file-input-in-angular-js
     */

    app.directive('validFile', function() {

        return {

            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {

                element.bind('change', function() {

                    scope.$apply(function() {
                        ngModel.$setViewValue(element.val());
                        ngModel.$render();
                    });

                });

            }

        };

    });

});