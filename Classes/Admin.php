<?php
Class Admin {
    private $_textareaWidth = 33;
    private $_db;
    private $_gigs;


    public function __construct() {
        
        $this->_db = DB::getInstance();
        $this->_gigs = new Gigs();

    }

    public function reload() {

        $this->_db = DB::getInstance();
        $this->_gigs = new Gigs();

    }

    private function printDeleteButton($id, $table) {

        echo "<div class='col-md-1'><button type='button' id='$id' class='btn btn-danger delete $table'>Ta bort</button></div>";

    }

    private function printDatePicker($name, $placeholder) {

        echo "<div class='col-md-2'><div class='form-group'><label for='$name'>Datum</label></br><input class='form-control name='$name' id='$name' value='$placeholder' placeholder='$placeholder'></div></div>";

    } 

    private function printFormFields($databaseEntries, $printDeleteButton = false, $fieldsToIgnore = array(), $table = null) {

        foreach($databaseEntries as $databaseEntry) {
            
            echo "<div class='row'>";
            
            $vars = get_object_vars($databaseEntry);
            
            foreach($vars as $field => $value) {
                
                if(!(in_array($field, $fieldsToIgnore))) {
             
                    $length = strlen($value) + 1;
                    $uniqueName = $databaseEntry->id . "_" . $field;

                    if($field == 'Datum') {

                        $this->printDatePicker($uniqueName, $value);

                    } else {

                        echo "<div class='col-md-2'><label for='$uniqueName'>$field</label><textarea class='form-control' rows='1' cols='$this->_textareaWidth' name='$uniqueName' id='$uniqueName'>$value</textarea></div>";
                    }
                    
                }
            }
            if($table != null && $printDeleteButton) {

                $this->printDeleteButton($databaseEntry->id, $table);

            }
    
            echo "</div>";
        }

    }

    public function printFieldsForNewEntry($table, $fieldsToIgnore = array()) {
            
        $columns = $this->_db->getColumns($table);
        
        echo "<div class='row'>";
        
        foreach($columns as $column) {

            if(!in_array($column, $fieldsToIgnore)) {

                if($column == 'Datum') {

                    $this->printDatePicker('Datum', '');

                } else {

                    echo "<div class='col-md-2'><label for='$column'>$column</label><textarea class='form-control' rows='1' cols='$this->_textareaWidth' name='$column' id='$column'></textarea></div>";
                }

            }
    
        }

        echo "</div>";
    }
    
    public function printGigForms() {

        $gigsInDatabase = $this->_gigs->getAllGigs();

        $this->printFormFields($gigsInDatabase, 
                                true, 
                                array("id"),
                                "konserter");
    }
    
    public function printDescription() {
        
        $description = $this->_db->getAll('beskrivning')->results();
        
        $this->printFormFields($description, false, array("id"));
        
    }
    
    public function printMembers() {
        
        $members = $this->_db->getAll('medlemmar')->results();
        
        $this->printFormFields($members, 
                               true, 
                               array("id"), 
                               "medlemmar");
        
    }
    
    public function printContactInformation() {
        
        $contactInfo = $this->_db->getAll('kontakt')->results();

        $this->printFormFields($contactInfo, false, array("id"));
        
    }

    public function checkForEntriesToAddAndUpdate($post) {

        $table = $post['table'];
        unset($post['table']);

        // Checking if the posted information is intended for an existing database entry (i.e. it has an id)
        $postKeys = array_keys($post);
        $sampleKey = $postKeys[0];

        $hasId = is_numeric($sampleKey[0]);

        if($hasId) {

            foreach($post as $textArea => $value ) {

                $idAndColumn = explode("_", $textArea);

                $id = $idAndColumn[0];
                $column = $idAndColumn[1];

                $this->_db->update($table, $id, array(
                    $column => $post[$textArea])
                );
            }            

        } else {

            $this->_db->insert($table, $post);

        }

    }

    public function checkForEntriesToDelete($id, $table) {

        $this->_db->delete($table, array("id", "=", $id));

    }

    public function checkForUpdates($post) {

        $postKeys = array_keys($post);

        if(in_array('id', $postKeys)) {

            $this->checkForEntriesToDelete($post['id'], $post['table']);

        } else {

            $this->checkForEntriesToAddAndUpdate($post);

        }

    }

}
?>