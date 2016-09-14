<?php

require_once('core/init.php');

class MembersModel extends BaseModel {

    public function get($where) {
        return $this->getDB()->get('member', $where)->results();
    }

	public function getAll() {
        return $this->getDB()->getAll('member')->results();
    }
    
    public function insert($fields) {
        return $this->getDB()->insert('member', $fields);
    }

    public function update($primaryKey, $fields) {
        return $this->getDB()->update('member', $primaryKey, $fields);
    }

    public function delete($where) {
        return $this->getDB()->delete('member', $where);
    }
}
