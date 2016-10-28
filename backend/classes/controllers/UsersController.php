<?php

class UsersController extends BaseController {

    public function __construct($model) {
        parent::__construct($model);
    }

    public function getAction($request) {
        
        if(isset($request->urlElements[2])) {
            
            /* Not implemented */
            
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
            )

        );

        $user = $this->getModel()->get($where);
        
        if(password_verify($submittedPassword, $user->password)) {
            
            $currentToken = $this->getModel()->getToken($user->id);
            $currentDateTime = date('Y-m-d H:i:s');

            $updatedToken = array(
                'created' => $currentDateTime
            );

            if($currentToken == null) {

                $token = Token::generate();

                $updatedToken['userId'] = $user->id;
                $updatedToken['token'] = $token;

                $this->getModel()->insertToken($updatedToken);

            } else {

                // This check is just completely wrong, it needs to check if a certain time period has passed.
                if($currentDateTime > $currentToken->created) {

                    $token = Token::generate();
                    $updatedToken['token'] = $token;

                }

                $this->getModel()->updateToken($user->id, $updatedToken);

            }

            return $this->getModel()->getToken($user->id)->token;

        } else {
            http_response_code(401);
        }
    }
    
    public function post($request) {
        /* Not implemented */
    }    
    
    public function put($request) {
        /* Not implemented */
    }

    public function delete($request) {
        /* Not implemented */
    }

}
