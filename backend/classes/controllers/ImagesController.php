<?php

require_once('core/init.php');

/**
 *
 * Class for performing preparations
 * on a RESTful request for images or galleries
 * before it is passed on to a model.
 *
 */

class ImagesController extends BaseController {

    public function __construct($model) {
        parent::__construct($model);
    }

    /**
     * Method for picking out
     * an extra url element, if there is one.
     *
     * @param Request $request A request object to be handled
     * @return string $urlElement A url element
     */

    private function getUrlElement($request, $index) {

        if(isset($request->urlElements[$index])) {
            return $request->urlElements[$index];
        } else {
            return null;
        }

    }

    /**
     *
     * Method for handling GET
     * requests. Currently does not handle
     * more than two url elements.
     *
     * @param Request $request An object representing a request to be handled.
     *
     */

    public function getAction($request) {
        return $this->handleQuery($request, $this->getUrlElement($request, 2));
    }

    /**
     * 
     * Method for organising incoming files in a neater format.
     * 
     * @param $files An array of file metadata, in the same format as $_FILES['file'].
     * @return $parsedFiles An array of file metadata, organised file by file.
     * 
     */
    
    private function parseIncomingFiles($files) {

        $parsedFiles = array();
        
        foreach ($files as $property => $fileSpecificInfo) {

            if(is_array(($fileSpecificInfo))) {
                
                foreach ($fileSpecificInfo as $index => $info) {

                    $parsedFiles[$index][$property] = $info;

                }
                
            } else {
                $parsedFiles[0][$property] = $fileSpecificInfo;
            }
            
        }
        
        return $parsedFiles;
        
    }
    
    /**
     *
     * Method for handling POST requests.
     *
     * @param Request $request An object representing a request to be handled.
     *
     */

    public function post($request) {
        
        $files = $request->parameters['files'];
        $request->parameters['files'] = $this->parseIncomingFiles($files);

        if($this->getModel()->insert($request->parameters)) {
            http_response_code(200);   
        }
        
    }

    /**
     *
     * Method for handling PUT requests.
     *
     * @param Request $request An object representing a request to be handled.
     *
     */

    public function put($request) {

        $parameters = $request->parameters;
        $primaryKey = null;

        if(isset($parameters['oldName']) && isset($parameters['newName'])) {
            $primaryKey = $parameters['oldName'];
            $parameters['name'] = $parameters['newName'];

            unset($parameters['oldName']);
            unset($parameters['newName']);

        } else if(isset($parameters['galleryname'])) {

            $primaryKey = $parameters['galleryname'];
            unset($parameters['galleryname']);

        } else {
            
            // Set response code accordingly
            return;

        }

        $this->getModel()->update($primaryKey, $parameters);

    }

    /**
     *
     * Method for handling DELETE requests.
     *
     * @param Request $request An object representing a request to be handled.
     *
     */

    public function delete($request) {
        $this->handleQuery($request, $this->getUrlElement($request, 2));
    }

}
