<?php

require_once('core/init.php');

class VenuesController extends BaseController {

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
        $name = $request->parameters['name'];
        $primaryKey = "name = $name";
        unset($request->parameters['name']);
        $this->getModel()->update($primaryKey, $request->parameters);
    }
    
    public function delete($request) {
        /*Not implemented*/
    }

}
