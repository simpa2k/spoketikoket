<?php

require_once('core/init.php');

/**
 *
 * Class for performing preparations
 * on a RESTful request for data from the
 * image table before it is
 * passed on to a model.
 *
 */

class ImagesController extends BaseController {

    public function __construct($model) {
        parent::__construct($model);
    }

    /**
     *
     * Method for handling GET
     * requests. Currently does not handle
     * more than one url element.
     *
     * @param Request $request An object representing a request to be handled.
     *
     */

    public function getAction($request) {
        
        if (isset($request->urlElements[2])) {

            $qualifiedAction = ucfirst($request->urlElements[2]);
            return $this->handleQuery($request, $qualifiedAction);
            
        } else {
            return $this->handleQuery($request);
        }
        
    }

    /**
     *
     * Method for handling POST requests.
     *
     * @param Request $request An object representing a request to be handled.
     *
     */

    public function post($request) {
        $this->getModel()->insert($request->parameters);
    }

    /**
     *
     * Method for handling PUT requests.
     *
     * @param Request $request An object representing a request to be handled.
     *
     */

    public function put($request) {
        $imagepath = $request->parameters['imagepath'];
        $thumbnailpath = $request->parameters['thumbnailpath'];
        $primaryKey = "imagepath = $imagepath, thumbnailpath = $thumbnailpath";
        unset($request->parameters['imagepath']);
        unset($request->parameters['thumbnailpath']);
        $this->getModel()->update($primaryKey, $request->parameters);
    }

    /**
     *
     * Method for handling DELETE requests.
     *
     * @param Request $request An object representing a request to be handled.
     *
     */

    public function delete($request) {
        $primaryKey = $this->filterParameters(array('imagepath', 'thumbnailpath'), $request->parameters);
        $this->getModel()->delete($this->formatParameters($primaryKey));
    }

}
