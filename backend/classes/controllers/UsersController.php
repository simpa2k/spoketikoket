<?php

/**
 * Created by PhpStorm.
 * User: simon
 * Date: 2016-07-28
 * Time: 18:53
 */
class UsersController extends BaseController
{
    public function __construct($model) {
        parent::__construct($model);
    }

    public function getAction($request) {
        
        if (isset($request->urlElements[2])) {
            
            return $request->urlElements[2];
            
        } else {
            $parameters = $request->parameters; 
            
            if(isset($parameters['username']) && isset($parameters['password'])) {
                
                return $this->login($parameters['username'], $parameters['password']);
                
            } else if(isset($parameters['username']) && isset($parameters['token'])) {
                
                if($this->checkToken($request->parameters)) {
                    http_response_code(200);
                }
            }
        }

    }
    
    private function login($username, $submittedPassword) {
        
        
        $where = array(
            0 => array(
                'username',
                '=',
                $username
            ));

        $user = $this->getModel()->get($where);
        
        if(password_verify($submittedPassword, $user->password)) {
            $token = Token::generate();
            $this->getModel()->updateToken($user->id, $token);
            return array('token' => $token);
        } else {
            http_response_code(401);
        }
    }
    
    public function post($request) {
        return $request->parameters;
    }    
    
    public function put($request) {

    }

    public function delete($request) {

    }

}