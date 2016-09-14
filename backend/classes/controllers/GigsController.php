<?php

require_once('core/init.php');

class GigsController extends BaseController {

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
        $id = $request->parameters['id'];
        $primaryKey = "id = $id";
        unset($request->parameters['id']);
        $this->getModel()->update($primaryKey, $request->parameters);
    }
    
    public function delete($request) {
        $id = $this->filterParameters(array('id'), $request->parameters);
        $this->getModel()->delete($this->formatParameters($id));
    }

}
