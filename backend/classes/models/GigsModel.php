<?php

class GigsModel extends BaseModel {

    public function get($where = array()) {
        $action = 'SELECT *';
        $table = 'gig, venue';
        $joinCondition = array(0 => array('venue_name', 'name'));

        return $this->getDB()->action($action, $table, $where, $joinCondition)->results();
    }

    public function getAll() {

        return $this->get();
        
    }
    
    public function insert($fields) {
        return $this->getDB()->insert('gig', $fields);
    }

    public function update($primaryKey, $fields) {
        return $this->getDB()->update('gig', $primaryKey, $fields);
    }

    public function delete($where) {
        return $this->getDB()->delete('gig', $where);
    }
}
