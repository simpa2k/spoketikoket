<?php

/**
 * Created by PhpStorm.
 * User: simon
 * Date: 2016-07-28
 * Time: 18:53
 */
class UsersModel extends BaseModel
{
    public function get($where)
    {
        return $this->getDB()->get('user', $where)->first();
    }

    public function getAll()
    {
        // TODO: Implement getAll() method.
    }
    
    public function updateToken($id, $token) {
        $fields = array('token' => $token);
        $this->getDB()->update('user', $id, $fields); 
    }

}
