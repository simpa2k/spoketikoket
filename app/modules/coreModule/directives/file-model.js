define(function() {

    /*
     * This code is the result of merging an example from https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
     * and one from https://scotch.io/tutorials/use-the-html5-file-api-to-work-with-files-locally-in-the-browser
     */

    var app = angular.module('coreModule');

    app.directive('fileModel', ['$parse', function($parse) {

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                let model = $parse(attrs.fileModel);
                let modelSetter = model.assign;
                let filesWithUrls = [];

                /*
                 * Setting the value property to null
                 * is necessary to enable the user to
                 * add an image after it was removed.
                 * Unless this is done, the input will have
                 * cached the image and won't let the user add it again.
                 * A side effect of this is that a single image
                 * can be uploaded several times even if it was
                 * not removed in between these times. Therefore,
                 * a check is needed when the file model is
                 * changed to make sure that no image that is already
                 * added is added again.
                 */
                element.bind('click', function() {

                    element[0].value = null;

                });

                element.bind('change', function() {

                    var readAndPushFileAndUrl = function(event, file) {

                        let fileWithUrl = {
                            url: event.target.result,
                            file: file 
                        };	

                        let alreadyAdded = false;
                        angular.forEach(filesWithUrls, function(existingFileWithUrl) {

                            if(angular.equals(fileWithUrl, existingFileWithUrl)) {

                                alreadyAdded = true;
                                return;

                            }

                        });

                        if(!alreadyAdded) {
                            filesWithUrls.push(fileWithUrl);
                        }

                        scope.$apply(function() {
                            modelSetter(scope, filesWithUrls);
                        });

                    };

                    angular.forEach(element[0].files, function(value) {

                        let reader = new FileReader();
                        reader.onload = function(event) {
                            readAndPushFileAndUrl(event, value);
                        };

                        reader.readAsDataURL(value);

                    });

                });
            }
        };

    }]);

});
