define(function() {

    var app = angular.module('coreModule');

    app.service('ValidationService', function() {

        var self = this;

        /**
         *
         * @param form An instance of FormController
         * @param nestedForms An array of form controllers nested inside the specified form
         * @returns The most nested form controller
         *
         */

        var getDeepestForm = function(form, nestedForms) {

            if( (nestedForms == null) || (typeof(nestedForms) == 'undefined') ) {
                return form;
            }

            let deepestForm = form;

            if(nestedForms.length != 0) {
                angular.forEach(nestedForms, function(nestedForm) {

                    deepestForm = deepestForm[nestedForm]

                });
            }

            return deepestForm;

        };

        var getNestedFormControl = function(form, control, nestedForms) {

            let deepestForm = getDeepestForm(form, nestedForms);
            return deepestForm[control];

        };

        self.isSubmitted = function(form, nestedForms) {

            return getDeepestForm(form, nestedForms).$submitted;

        };

        self.isRequired = function(form, control, nestedForms) {

            return getNestedFormControl(form, control, nestedForms).$error.required;

        };

        self.isTouched = function(form, control, nestedForms) {

           return getNestedFormControl(form, control, nestedForms).$touched;

        };

        self.isSubmittedOrTouched = function(form, control, nestedForms) {

            let submitted = self.isSubmitted(form, nestedForms);
            let touched = self.isTouched(form, control, nestedForms);

            return submitted || touched;

        };

        self.isRequiredAndSubmittedOrTouched = function(form, control, nestedForms) {

            let submittedOrTouched = self.isSubmittedOrTouched(form, control, nestedForms);
            let required = self.isRequired(form, control, nestedForms);

            return required && submittedOrTouched;

        };

        self.resetForm = function(form) {

            form.$setPristine();
            form.$setUntouched();

        };
        

    });

});