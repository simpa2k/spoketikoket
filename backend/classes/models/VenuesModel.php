<?php

require_once('core/init.php');

class VenuesModel extends BaseModel {

    public function get($where) {
        return $this->getDB()->get('venue', $where)->results();
    }

	public function getAll() {
        return $this->getDB()->getAll('venue')->results();
    }
    
    public function insert($fields) {
        return $this->getDB()->insert('venue', $fields);
    }

    public function update($primaryKey, $fields) {
        return $this->getDB()->update('venue', $primaryKey, $fields);
    }

    public function delete($where) {
        /*Not implemented*/
    }
}
