<?php

require_once('core/init.php');

class UsersControllerTest extends \PHPUnit_Framework_TestCase {
    
    private $db,
            $username,
            $password,
            $originalAutoIncrementCount = array();

    private function storeOriginalAutoIncrementCount() {

        $userTableAutoIncrementCount = $this->db->getTableData('AUTO_INCREMENT', 'user')->first()->AUTO_INCREMENT;
        $tokenTableAutoIncrementCount = $this->db->getTableData('AUTO_INCREMENT', 'token')->first()->AUTO_INCREMENT;

        $this->originalAutoIncrementCount['user'] = $userTableAutoIncrementCount;
        $this->originalAutoIncrementCount['token'] = $tokenTableAutoIncrementCount;
        
    }

    private function createDummyUser() {

        $this->username = 'testuser';
        $this->password = 'testpassword';
        $hashedPassword = password_hash($this->password, PASSWORD_BCRYPT);

        try {

            $this->db->insert('user', array(
                'username' => $this->username,
                'password' => $hashedPassword
            ));

        } catch(Exception $e) {
            die($e->getMessage());
        } 
        
    }

    private function getUserId() {

        $user = $this->db->get('user', array(0 => array('username', '=', $this->username)))->first();
        return $user->id;
        
    }

    private function deleteDummyUserAndToken() {

        $userId = $this->getUserId();
        $this->db->delete('token', array(0 => array('userId', '=', $userId)));
        $this->db->delete('user', array(0 => array('id', '=', $userId)));
        
    }

    private function restoreOriginalAutoIncrementCounts() {

        $this->db->setAutoIncrement('user', $this->originalAutoIncrementCount['user']);
        $this->db->setAutoIncrement('token', $this->originalAutoIncrementCount['token']);
        
    }

    protected function setUp() {

        $this->db = DB::getInstance();

        $this->storeOriginalAutoIncrementCount();
        $this->createDummyUser();

        $_SERVER['REQUEST_METHOD'] = 'GET';
        $_SERVER['PATH_INFO'] = 'users/';
        $_SERVER['QUERY_STRING'] = "username=$this->username&password=$this->password";
        
    }

    protected function tearDown() {

        $this->deleteDummyUserAndToken();
        $this->restoreOriginalAutoIncrementCounts();
        
    }

    public function testLoginReturnsLength32Token() {

        $request = new Request();

        $uc = new UsersController(new UsersModel());

        // getAction automatically attempts login if username and password are set
        $token = $uc->getAction($request)['token'];

        $this->assertTrue(strlen($token) == 32);

    }

    public function testCheckTokenReturnsTrueAfterLogin() {

        $request = new Request();

        $uc = new UsersController(new UsersModel());

        // getAction automatically attempts login if username and password are set
        $token = $uc->getAction($request)['token'];

        $checkTokenRequestParameters = array(
            "username" => $this->username,
            "token" => $token 
        );

        $this->assertTrue($uc->checkToken($checkTokenRequestParameters));

    }

    public function testCheckTokenReturnsNullOnExpiredToken() {

        $request = new Request();

        $uc = new UsersController(new UsersModel());

        // getAction automatically attempts login if username and password are set
        $token = $uc->getAction($request);

        // Setting existing token's created date to 40 minutes ago
        $userId = $this->getUserId();
        $tokenDataBaseEntry = $this->db->get('token', array(0 => array("userId", "=", $userId)))->first();

        $storedTokenCreationDate = new DateTime($tokenDataBaseEntry->created);
        $earlierStoredTokenCreationDate = $storedTokenCreationDate->sub(new DateInterval('PT' . 40 . 'M'))->format('Y-m-d H:i:s');

        $this->db->update('token', "userId = $userId", array("created" => $earlierStoredTokenCreationDate));

        $checkTokenRequestParameters = array(
            "username" => $this->username,
            "token" => $token 
        );

        $this->assertNull($uc->checkToken($checkTokenRequestParameters));
        
    }

}
