<?php

Class DateUtilities {

    private function monthConversion($month) {
        
        $months = array(
            '01' => 'Januari',
            '02' => 'Februari',
            '03' => 'Mars',
            '04' => 'April',
            '05' => 'Maj',
            '06' => 'Juni',
            '07' => 'Juli',
            '08' => 'Augusti',
            '09' => 'September',
            '10' => 'Oktober',
            '11' => 'November',
            '12' => 'December',        
            );
        
        return $months[$month];

    }

    private function singleDigitDay($twoDigitDay) {
         
        return $twoDigitDay[1];

    }

    private function dateSplit($date) {

        $explodedDate = explode('-', $date);

        $dateArray = array('year'   => $explodedDate[0],
                           'month'  => $this->monthConversion($explodedDate[1]),
                           'day'    => $explodedDate[2][0] == '0' ? $this->singleDigitDay($explodedDate[2]) : $explodedDate[2]);

        return $dateArray;

    }

    public function dayAndMonth($date) {

        $splitDate = $this->dateSplit($date);

        $dateString = $splitDate['day'] . " " . $splitDate['month'];

        return $dateString;

    }

    public function year($date) {

        $explodedDate = explode('-', $date);

        return $explodedDate[0];

    }

}

