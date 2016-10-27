<?php

class UsersModel extends BaseModel {

    public function get($where) {
        // SELECT * FROM user, token WHERE $id = userId
        /*
         * $action = 'SELECT *';
         * $table = 'user, token';
         * $joinCondition = array(0 => array('id', 'userId'));
         *
         * return $this->getDB->get($action, $table, $where, $joinCondition);
         */
        return $this->getDB()->get('user', $where)->first();
    }

    public function getAll() {
        // ToDo: Implement getAll() method.
    }
    
    public function getToken($userId) {

        $where = array(0 => array('userId', '=', $userId));
        return $this->getDB()->get('token', $where)->first();

    }

    public function insertToken($token) {
        $this->getDB()->insert('token', $token);
    }

    public function updateToken($userId, $token) {

        $userId = "userId = $userId";
        $this->getDB()->update('token', $userId, $token); 
        
        //$fields = array('token' => $token);
        //$this->getDB()->update('user', $id, $fields); 
        // INSERT INTO token VALUES(NULL, $id, $token, $currentDateTime)
        // UPDATE token SET token = $token, created = $currentDateTime WHERE userId = $id
        // $this->getDB()->update()

    }

}
