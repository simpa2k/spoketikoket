<?php

require_once('core/init.php');

class UsersControllerTest extends \PHPUnit_Framework_TestCase {
    
    protected function setUp() {

        $_SERVER['REQUEST_METHOD'] = 'GET';
        $_SERVER['PATH_INFO'] = 'users/';
        $_SERVER['QUERY_STRING'] = 'username=admin&password=adminpassword';
        
    }

    public function testLoginReturnsToken() {

        $request = new Request();

        $uc = new UsersController(new UsersModel());
        $token = $uc->getAction($request);

        $this->assertFalse(empty($token));

    }

}
