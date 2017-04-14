define(function() {

    /**
     * Directive for defining an admin page. Expects a set of data items to
     * display and make available for modification and an array of objects
     * defining the structure of the form needed to modify and create such
     * items. Each object in the array should describe one form-group by
     * specifying a label for the form-group and providing an object of field
     * names mapped to a specific input type. For example:
     *
     * let $scope.formStructure = [
     *  {
     *      label: 'Meta data:',
     *      fields: {
     *          datetime: 'datetime',
     *          author: 'text'
     *      }
     *  },
     *  {
     *      label: 'Content:',
     *      fields: {
     *          content: 'textfield'
     *      }
     *  }
     *]
     */
    let adminPage =  function() {

        let controller = ['$scope', 'SendObjectService', 'ValidationService',
            function($scope, SendObjectService, ValidationService) {

            /**
             * Function to populate form fields with information from one data
             * item, for modification.
             *
             * @param item The item to modify.
             */
            $scope.setPutState = function(item) {

                // Copying selected item to ensure nothing is changed before the confirm button is clicked.
                $scope.objectToSend = angular.copy(item);

                $scope.addingNew = false; // Display the confirm and delete buttons.
                $scope.action = "Bekräfta ändringar";

                /*
                 * $scope.send is the function actually called on clicking the
                 * button on the page. Since we're preparing for a PUT, the
                 * $scope.send is set to refer to the appropriate function.
                 */
                $scope.send = $scope.put;

            };

            /**
             * Function to empty form fields and prepare for creating a new
             * data item.
             */
            $scope.setPostState = function() {

                $scope.objectToSend = $scope.createObject(); // Resetting the object to be POSTed.

                $scope.action = "Lägg till";
                $scope.addingNew = true; // Hide the confirm and delete buttons.

                /*
                 * $scope.send is the function actually called on clicking the
                 * button on the page. Since we're preparing for a POST, the
                 * $scope.send is set to refer to the appropriate function.
                 */
                $scope.send = $scope.post;

            };

            /**
             * Function to refresh data and reset form validation after a
             * request has been performed.
             *
             * @param data The data to be used for the refresh.
             * @param formName The form to be reset.
             */
            let refresh = function(data, formName) {

                $scope.refreshCallback(data);
                ValidationService.resetForm(formName);

            };

            /**
             * Function to perform a PUT on a data item.
             *
             * @param formName The name of the form to be reset upon completion of
             * the request.
             */
            $scope.put = function(formName) {

                SendObjectService.putObject($scope.entityName, $scope.objectToSend, (data) => {
                    refresh(data, formName);
                });
            };

            /**
             * Function to POST a data item.
             *
             * @param formName The name of the form to be reset upon completion of
             * the request.
             */
            $scope.post = function(formName) {

                SendObjectService.postObject($scope.entityName, $scope.objectToSend, (data) => {
                    refresh(data, formName);
                });
            };

            /**
             * Function to DELETE a data item.
             *
             * @param formName The name of the form to be reset upon completion of
             * the request.
             */
            $scope.delete = function(formName) {

                SendObjectService.deleteObject($scope.entityName, $scope.objectToSend, (data) => {
                    refresh(data, formName);
                });
            };

            $scope.setPostState(); // Initializing the admin page with an empty form.

        }];

        /**
         * Function to parse a form structure and from it determine what fields
         * should be displayed on each admin item.
         *
         * @param formStructure The form structure to parse.
         * @returns {Array} The name of the fields to display.
         */
        let pickoutFieldsToDisplay = function(formStructure) {

            let fieldsToDisplay = [];

            angular.forEach(formStructure, function(formGroup) {

                angular.forEach(formGroup.fields, function(type, fieldName) {
                    fieldsToDisplay.push(fieldName);
                })
            });
            return fieldsToDisplay;

        };

        return {

            restrict: 'E',
            replace: true,
            scope: {
                items: '=',
                formStructure: '=',
                formName: '@',
                entityName: '@',
                refreshCallback: '&',
                createObject: '&'
            },
            templateUrl: 'app/modules/coreModule/directives/admin-page/admin-page.html',
            controller: controller,
            link: function(scope, element, attributes) {

                scope.fields = pickoutFieldsToDisplay(scope.$eval(attributes.formStructure));

            }
        }
    };

    angular.module('coreModule')
        .directive('adminPage', adminPage);
});