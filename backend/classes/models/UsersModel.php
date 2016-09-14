<?php

require_once('core/init.php');

class UsersModel extends BaseModel {

    public function get($where) {
        return $this->getDB()->get('user', $where)->results();
    }

	public function getAll() {
        return $this->getDB()->getAll('user')->results();
    }
    
    public function insert($fields) {
        return $this->getDB()->insert('user', $fields);
    }

    public function update($primaryKey, $fields) {
        return $this->getDB()->update('user', $primaryKey, $fields);
    }

    public function delete($where) {
        return $this->getDB()->delete('user', $where);
    }
}
