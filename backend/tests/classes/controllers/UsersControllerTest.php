<?php

require_once('core/init.php');

class UsersControllerTest extends \PHPUnit_Framework_TestCase {
    
    protected function setUp() {

        $_SERVER['REQUEST_METHOD'] = 'GET';
        $_SERVER['PATH_INFO'] = 'users/';
        $_SERVER['QUERY_STRING'] = 'username=admin&password=adminpassword';
        
    }

    public function testLoginReturnsLength32Token() {

        $request = new Request();

        $uc = new UsersController(new UsersModel());

        // getAction automatically attempts login if username and password are set
        $token = $uc->getAction($request);

        $this->assertTrue(strlen($token) == 32);

    }

    public function testCheckTokenReturnsTrueAfterLogin() {

        $request = new Request();

        $uc = new UsersController(new UsersModel());

        // getAction automatically attempts login if username and password are set
        $token = $uc->getAction($request);

        $checkTokenRequestParameters = array(
            "username" => "admin",
            "token" => "token"
        );

        $this->assertTrue($uc->checkToken($checkTokenRequestParameters));

    }

}
