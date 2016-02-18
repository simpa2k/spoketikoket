<?php
//
class DBUTF8 {
    private static $_utf8EncodedDBConnection = null;
    private $_pdo,
            $_query,
            $_error = false,
            $_results,
            $_count = 0;
            
    private function __construct() {
        try {
            $this->_pdo = new PDO('mysql:host=' . Config::get('mysql/host') . ';dbname=' . Config::get('mysql/db') . ';charset=utf8', Config::get('mysql/username'), Config::get('mysql/password'));
        } catch(PDOException $e) {
                die($e->getMessage());
        }
    }
    
    public static function getInstance() {
        
        if(!isset(self::$_utf8EncodedDBConnection)) {
                self::$_utf8EncodedDBConnection = new DBUTF8();
        }
        
        return self::$_utf8EncodedDBConnection;

    }
    
    public function query($sql, $params = array()) {
        $this->_error = false;
        if($this->_query = $this->_pdo->prepare($sql)) {
            $x = 1;
            if(count($params)) {
                foreach($params as $param) {
                    $this->_query->bindValue($x, $param);
                    $x++;
                }
            }
            
            if($this->_query->execute()) {
                $this->_results = $this->_query->fetchAll(PDO::FETCH_OBJ);
                $this->_count = $this->_query->rowCount();
            } else {
                $this->_error = true;
            }
        }
        return $this;
    }
    
    public function action($action, $table, $where = array()) {
        if(count($where == 3)) {
            $operators = array('=', '<', '>', '<=', '>=', 'REGEXP');
            
            $field      = $where[0];
            $operator   = $where[1];
            $value      = $where[2];
            
            if(in_array($operator, $operators)) {
                $sql = "{$action} FROM {$table} WHERE {$field} {$operator} ?";
            }
            
            if(!$this->query($sql, array($value))->error()) {
                return $this;
            } 
        }
        return false;
    }
    
    public function insert($table, $fields = array()) {
        $keys = array_keys($fields);
        $values = null;
        $x = 1;
        
        foreach($fields as $field) {
            $values .= '?';
            if($x < count($fields)) {
                $values .= ', ';
            }
            $x++;
        }
        
        $sql = "INSERT INTO {$table} (`" . implode('`, `', $keys) . "`) VALUES ({$values})";
        
        if(!$this->query($sql, $fields)->error()) {
            return true;
        }
        return false;
    }
    
    public function get($table, $where) {
        return $this->action('SELECT *', $table, $where);
    }
    
    public function getAll($table) {
        $sql = "SELECT * FROM {$table}";
        
        if(!$this->query($sql)->error()){
            return $this;
        }
    }
    
    public function delete($table, $where) {
        return $this->action('DELETE', $table, $where);
    }
    
    public function update($table, $id, $fields) {
        $set = '';
        $x = 1;
        
        foreach($fields as $name => $value) {
            $set .= "{$name} = ?";
            if($x < count($fields)) {
                $set .= ', ';
            }
            $x++;
        }
        
        $sql = "UPDATE {$table} SET {$set} WHERE id = {$id}";
        
        if(!$this->query($sql, $fields)->error()) {
            return true;
        }
        return false;
    }
    
    public function sortArrayByDate($array) {
        
        //Sorting the entries recorded in the database,
        //so they can be displayed in the correct order regardless of when they were entered
        for($i = 1; $i < count($array); $i++) {
            //Storing current entry
            $entry = $array[$i];
                                    
            //Storing date of current entry
            $date = $array[$i]->{'date'};
                                    
            //Storing $i in separate variable $j for manipulation
            $j = $i;
                                    
            //As long as $j is greater than zero (index of the first entry) and the date of the entry in the previous iteration
            //is less than that of the current entry
            while($j > 0 && $array[$j - 1]->{'date'} < $date) {
                                        
                //The entry at the index of the current iteration is assigned the value of the previous iteration
                $array[$j] = $array[$j - 1];
                                        
                //$j is decremented in order to move "left" in the array
                $j -= 1;
            }
                                    
            //When there are no longer any entries with earlier dates,
            //place the stored entry at the position we are currently in
            $array[$j] = $entry;
        }
        
        return $array;
    
    }

    public function getTableColumnCount($tableName) {

        $count = ("Select COUNT(*) totalColumns FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '$tableName' AND TABLE_SCHEMA = 'vilde'");
        $result = $this->_pdo->prepare($count);
        $result->execute();
        $number = $result->fetchColumn();
        
        return $number;

    }

    public function getColumns($tableName) {
        
        $columnStatement = ("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA` = 'spoketikoket_co' AND `TABLE_NAME` = '$tableName'");
        $result = $this->_pdo->prepare($columnStatement);
        $result->execute();
        $unformattedColumns = $result->fetchAll();

        $formattedColumns = array();

        foreach($unformattedColumns as $column => $name) {

            $formattedColumns[] = $name[0];

        }

        return $formattedColumns;

    }
    
    public function results() {
        return $this->_results;
    }
    
    public function first() {
        return $this->results()[0];
    }
    
    public function count() {
        return $this->_count;
    }
    
    public function error() {
        return $this->_error;
    }
}