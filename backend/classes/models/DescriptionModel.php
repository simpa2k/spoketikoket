<?php

require_once('core/init.php');

class DescriptionModel extends BaseModel {

    public function get($where) {
        return $this->getDB()->get($where)->results();
    }

	public function getAll() {
        return $this->getDB()->getAll('description')->results();
    }
    
    public function insert($fields) {
        /*Not implemented*/
    }

    public function update($primaryKey, $fields) {
        return $this->getDB()->update('description', $primaryKey, $fields);
    }

    public function delete($where) {
        /*Not implemented*/
    }
}
