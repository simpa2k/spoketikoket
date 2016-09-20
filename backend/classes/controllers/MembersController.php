<?php

require_once('core/init.php');

/**
 *
 * Class for performing preparations
 * on a RESTful request for data from the
 * member table before it is
 * passed on to a model.
 *
 */

class MembersController extends BaseController {

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
            /* Not implemented */
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
        $firstname = $request->parameters['firstname'];
        $lastname = $request->parameters['lastname'];
        $primaryKey = "firstname = $firstname, lastname = $lastname";
        unset($request->parameters['firstname']);
        unset($request->parameters['lastname']);
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
        $primaryKey = $this->filterParameters(array('firstname', 'lastname'), $request->parameters);
        $this->getModel()->delete($this->formatParameters($primaryKey));
    }

}
