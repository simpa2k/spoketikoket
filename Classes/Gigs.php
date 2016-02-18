<?php
Class Gigs {
    
    private $_db;
    private $_allGigs = array();
    private $_noGigs = array();
    private $_dateUtilities;
    
    public function __construct() {
        
        $this->_db = DB::getInstance();
        $this->_allGigs = $this->_db->getAll('konserter')->results();
        $this->_noGigs = $this->_db->get('admin_main_page', array('type', '=', 'noGigs'))->first();
        $this->_dateUtilities = new DateUtilities();
        
    }
    
    public function sortArrayByDate($array) {
            
        //Sorting the entries recorded in the database,
        //so they can be displayed in the correct order regardless of when they were entered
        for($i = 1; $i < count($array); $i++) {
            //Storing current entry
            $entry = $array[$i];
                                    
            //Storing date of current entry
            $date = $array[$i]->{'Date'};
                                    
            //Storing $i in separate variable $j for manipulation
            $j = $i;
                                    
            //As long as $j is greater than zero (index of the first entry) and the date of the entry in the previous iteration
            //is less than that of the current entry
            while($j > 0 && $array[$j - 1]->{'Date'} < $date) {
                                        
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


    
    public function getAllGigs() {

        $this->_allGigs = $this->sortArrayByDate($this->_allGigs);

        return $this->_allGigs;
        
    }
    
    private function displayGigsToBePlayed() {
        
        $counter = 0;
        $currentDate = date('Y-m-d');
        
        $this->_allGigs = $this->sortArrayByDate($this->_allGigs);
        
        foreach($this->_allGigs as $index => $gig) {
            
            $dayAndMonth = $this->_dateUtilities->dayAndMonth($gig->{'Date'});
                
            //Formatting the next gig differently. The formatting is based on the info of the
            //first gig that was displayed on the web site and the division into several fields 
            //in the database structure was done so that the gig could be displayed with less 
            //info once it had been played.
            if( ($gig->{'Date'} > $currentDate) && ($counter == 0) ) {
                
                echo '<p id="current-gig">' . $dayAndMonth .
                ' - ' . $this->_allGigs[0]->{'Venue'} . ', ' . $this->_allGigs[0]->{'Address'} .
                ' ' . $this->_allGigs[0]->{'Info'} . '</p>';
                
                if($this->_allGigs[0]->{'Ticketlink'}) {
                
                    echo '<a class="small-small-heading" href="' . $gig->{'Ticketlink'} .
                    '">Klicka här för att köpa biljetter!</a></p>';    
                }
                
                unset($this->_allGigs[$index]);
                
            } else if ( ($gig->{'Date'} < $currentDate) && ($counter == 0) ) {
                
                //If there are no upcoming gigs
                echo '<p id="current-gig">' . $this->_noGigs->content . '</p>';  
              
                
            } else if ( $gig->{'Date'} > $currentDate && ($counter > 0) ) {
                //All the rest of the gigs that are yet to be played
                echo '<p class="upcoming-gig">' . $dayAndMonth . ", " . $gig->{"Venue"} . '</p>';
                    
                if($gig->{'Ticketlink'}) {
                    echo '<a class="small-small-heading" href="' . $gig->{'Ticketlink'} .
                    '">Klicka här för att köpa biljetter!</a></p>';    
                }
                
                unset($this->_allGigs[$index]);

            }
            
            $counter++;   
            
        }
        
    }
    
    private function getGigYears() {
        
        $years = array();
                
        foreach($this->_allGigs as $gig) {
    
            $year = $this->_dateUtilities->year($gig->{'Date'});
                            
            if(!in_array($year, $years)) {
    
                $years[] = $year;
                
            }
        }
        return $years;
    }
    
    private function displayGigsAlreadyPlayed() {
        
        $years = $this->getGigYears();
        
         //Displaying gigs that have already been played in a kind of dropdown menu
        echo '<br/><p class="small-heading" id="dropdown-menu-button">Här har vi spelat tidigare &raquo;</p>';
        foreach($years as $year) {
            echo '<h5 class="dropdown-menu-item">' . $year . '</h5>';
            foreach($this->_allGigs as $gig) {
                
                $entryDate = $gig->{'Date'};
                $entryYear = $this->_dateUtilities->year($entryDate);

                if($entryYear == $year) {
                    echo '<p class="dropdown-menu-item">' . $this->_dateUtilities->dayAndMonth($entryDate);

                    if($gig->{'Venue'}) {

                        echo ", " . $gig->{'Venue'};
                    }

                    echo "</p>";
                }
            }
        }
    }
    
    public function displayGigs() {
        
       $this->sortArrayByDate($this->_allGigs);
       $this->displayGigsToBePlayed();
       $this->displayGigsAlreadyPlayed();
        
    }
    
}  
?>