<?php

require_once('core/init.php');

class ContactpersonsModel extends BaseModel {

    public function get($where) {
        return $this->getDB()->get($where)->results();
    }

	public function getAll() {
        return $this->getDB()->getAll('contactperson')->results();
    }
    
    public function insert($fields) {
        return $this->getDB()->insert('contactperson', $fields);
    }

    public function update($primaryKey, $fields) {
        return $this->getDB()->update('contactperson', $primaryKey, $fields);
    }

    public function delete($where) {
        return $this->getDB()->delete('contactperson', $where);
    }
}
