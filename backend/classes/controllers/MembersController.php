<?php

require_once('core/init.php');

class MembersController extends BaseController {

    public function __construct($model) {
        parent::__construct($model);
    }

    public function getAction($request) {
        
        if (isset($request->urlElements[2])) {
            return $request->urlElements[2];
        } else {
            return $this->handleQuery($request);
        }
        
    }
    
    public function post($request) {
        $this->getModel()->insert($request->parameters);
    }
    
    public function put($request) {
        $firstname = $request->parameters['firstname'];
        $lastname = $request->parameters['lastname'];
        $primaryKey = "firstname = $firstname, lastname = $lastname";
        unset($request->parameters['firstname']);
        unset($request->parameters['lastname']);
        $this->getModel()->update($primaryKey, $request->parameters);
    }
    
    public function delete($request) {
        $id = $this->filterParameters(array('id'), $request->parameters);
        $this->getModel()->delete($this->formatParameters($id));
    }

}
