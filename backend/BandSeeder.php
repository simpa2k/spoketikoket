<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 2016-05-20
 * Time: 18:21
 */

require_once 'core/init.php';

class BandSeeder {

    private $_db;

    public function __construct() {

        echo('instantiating');
        $this->_db = DB::getInstance();

    }

    public function seed() {

        $this->seedContactPersons();
        $this->seedDescription();
        $this->seedGigs();
        $this->seedMembers();
        //$this->seedNewsItems();
        //$this->seedQuotes();

    }

    public function seedContactPersons() {

        $this->_db->insert('contactperson', array(
            'phonenumber' => 'xxx xxx xxx',
            'name' => 'Nisse Blomster',
            'country' => 'SE'
        ));

        $this->_db->insert('contactperson', array(
            'phonenumber' => 'xxx xxx xxx',
            'name' => 'Mads Kjøller-Henningsen',
            'country' => 'DK'
        ));

    }

    public function seedDescription() {

        $this->_db->insert('description', array('content' =>'This is a description!'));

    }

    public function seedGigs() {

        $this->seedVenues();

        for($i = 1; $i < 31; $i++) {

            $day = $i < 10 ? "0$i" : $i;
            $date = "2016-09-$day";

            $this->_db->insert('gig', array(
                'datetime' => "$date 21:00:00",
                'ticketlink' => 'http://www.ticket.link',
                'info' => 'Det här är ett gig ni bara måste gå på!',
                'venue_name' => 'Stället',
                'price' => '120'
            ));

        }

    }

    public function seedVenues() {

        $venues = array(
            0 => array(
                'name' => 'Stället',
                'city' => 'Stockholm',
                'address' => 'Ställegatan 29',
                'webpage' => 'www.stället.ställe'
            )
        );

        foreach($venues as $venue) {

            $this->_db->insert('venue', array(
                'name' => $venue['name'],
                'city' => $venue['city'],
                'address' => $venue['address'],
                'webpage' => $venue['webpage']
            ));

        }

    }

    public function seedMembers() {

        $members = array(
            0 => array(
                'firstname' => 'Clara',
                'lastname' => 'Tesch',
                'instrument' => 'fiol'
            ),
            1 => array(
                'firstname' => 'Mads',
                'lastname' => 'Kjøller-Henningsen',
                'instrument' => 'flöjter, vevlira, sång'
            ),
            2 => array(
                'firstname' => 'Emma',
                'lastname' => 'Engström',
                'instrument' => 'piano'
            ),
            3 => array(
                'firstname' => 'Erik',
                'lastname' => 'Bengtsson',
                'instrument' => 'bas'
            ),
            4 => array(
                'firstname' => 'Troels',
                'lastname' => 'Strange Lorentzen',
                'instrument' => 'dragspel'
            ),
            5 => array(
                'firstname' => 'Nisse',
                'lastname' => 'Blomster',
                'instrument' => 'gitarr, banjo, mandolin, stomp, sång'
            ),
            6 => array(
                'firstname' => 'Albin',
                'lastname' => 'Lagg',
                'instrument' => 'trumpet'
            ),
            7 => array(
                'firstname' => 'Ella',
                'lastname' => 'Wennerberg',
                'instrument' => 'trombon'
            ),
            8 => array(
                'firstname' => 'Henrik',
                'lastname' => 'Büller',
                'instrument' => 'barytonsax, altsax'
            ),
            9 => array(
                'firstname' => 'Erik',
                'lastname' => 'Larsson',
                'instrument' => 'tenorsax, klarinett'
            ),

        );

        foreach($members as $member) {

            $this->_db->insert('member', array(
                'firstname' => $member['firstname'],
                'lastname' => $member['lastname'],
                'instrument' => $member['instrument']
            ));

        }

    }

    /*public function seedNewsItems() {

        $newsItems = array(
            0 => array(
                'date' => date('Y-m-d'),
                'content' => 'Automatically generated news item.'
            )
        );

        foreach($newsItems as $newsItem) {

            $this->_db->insert('newsitem', array(
                'date' => $newsItem['date'],
                'content' => $newsItem['content']
            ));

        }

    }*/

    /*public function seedQuotes() {

        $quotes = array(
            0 => array(
                'review' => 'De kommer från trakten, men att döma av det medryckande, keltiskt klingande draget i ' .
                    'inledningen av denna trios debutalbum kunde de lika gärna höra hemma på musikpubarna i Dublin. ' .
                    'Och deras musik har större bredd än så, med personliga omtolkningar av melodier från ' .
                    'Eric Sahlström, jazzgitarristen Pat Metheny och rockgruppen Deep Purple, jämte eget material. ' .
                    'Ofta i mjuk lekfull ton, med stråkdrag av vemod.',
                'info' => 'UNT 2014-02-25, recension av "Hets med Folkgrupp"'
            ),
            1 => array(
                'review' => 'Vilde släpper in världen i sin svenska folkmusik. De påminner om de där gatumusikanterna ' .
                    'som man snubblade över någonstans i Europa. Gatumusikanterna som man aldrig glömde.',
                'info' => 'UNT 2011-08-10'
            ),
            2 => array(
                'review' => '…tack vare Erik Larsson, trots sin ungdom en mycket driven klarinettist, och med hjälp ' .
                    'av svängigt, ibland rockigt, gitarrspel av Nisse Blomster och Rikard Engbloms fina spel på ' .
                    'nyckelharpa anar jag att det finns hopp…',
                'info' => 'Skivrecension från LIRA, publicerad 2011-10-26'
            ),
            3 => array(
                'review' => 'Det här är folkmusik av idag, som dessutom svänger fint runt alla hörnen samtidigt.',
                'info' => ' www.blaskan.nu nr:101'
            ),
            4 => array(
                'review' => 'Vilde är en talangfull och lekfull folkmusiktrio som levererar bra egna varianter av ' .
                    'både ovanliga och välkända låtar och egna kompositioner. Med kombinationen klarinett, '.
                    'nyckelharpa och gitarr har de ett eget sound och man hör i deras spel influenserna av ' .
                    'traditionellt låtspel, jazz och rock.',
                'info' => 'Sonia Sahlström och Håkan Larsson, om "Trollstigen", April 2011'
            ),
        );

        foreach($quotes as $quote) {

            $this->_db->insert('quote', array(
                'review' => $quote['review'],
                'info' => $quote['info']
            ));

        }

    }*/

}


