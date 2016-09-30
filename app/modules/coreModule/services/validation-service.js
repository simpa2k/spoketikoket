define(function() {

    var app = angular.module('coreModule');

    app.service('validationService', function() {

        var self = this;

        /**
         *
         * @param form An instance of FormController
         * @param nestedForms An array of form controllers nested inside form
         * @returns The most nested form controller
         *
         */

        var getDeepestForm = function(form, nestedForms) {

            let deepestForm = form;

            if(nestedForms.length != 0) {
                angular.forEach(nestedForms, function(nestedForm) {

                    deepestForm = deepestForm[nestedForm]

                });
            }

            return deepestForm;

        };

        var getFormControl = function(form, control, nestedForms) {

            let deepestForm = getDeepestForm(form, nestedForms);
            return deepestForm[control];

        };

        self.isSubmitted = function(form, nestedForms) {

            let deepestForm = getDeepestForm(form, nestedForms);

            return deepestForm.$submitted;

        };

        self.isRequired = function(form, control, nestedForms) {

            return getFormControl(form, control, nestedForms).$error.required;

        };

        self.isTouched = function(form, control, nestedForms) {

            return getFormControl(form, control, nestedForms).$touched;

        };

    });

});