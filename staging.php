<?php 
require_once 'core/init.php';

// Setting header
header('Content-Type: text/html; charset=utf-8');
header("Content-Security-Policy: script-src 'self'");
header('Strict-Transport-Security: max-age=3600');

// Instantiating database
$db = DB::getInstance('utf8');

// Initializing variables

$gigs = new Gigs();

$members = $db->getAll('medlemmar')->results();

$description = $db->getAll('beskrivning')->results();
$description = $description[0];

$contact = $db->getAll('kontakt')->results();
$contact = $contact[0];

?>

<!DOCTYPE html>
<html>
    <head>
        <title>Spöket i köket</title>
        <!--Setting viewport for mobile devices-->
        <meta name="viewport" content="width=device-width, initial-scale=0.5">
        <link rel="stylesheet" type="text/css" href="static/css/alternate.css">

        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

        <!-- Latest compiled and minified JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    </head>
    <body id="body">
        <div id="background"></div>
        
        <div id="main">
            <nav class="navbar">
                <div class="container">
                    <p class="heading">KONSERTER</p>
                    <p class="heading">OM SPÖKET</p>
                    <p class="heading">MUSIK OCH MEDIA</p>
                    <p class="heading">KONTAKT</p>
                    <a id="facebook" href="http://www.facebook.com/spoketikoket"><img src="static/images/sociala_medier/facebooklogga_liten.jpg"></a>
                    <a id="soundcloud" href="http://www.soundcloud.com/sp-ket-i-k-ket"><img src="static/images/sociala_medier/soundcloudlogga_liten.jpg"></a>
                    <a id="youtube" href="https://www.youtube.com/channel/UCBnvUMnm1tU1O2ioTnUNJNw"><img src="static/images/sociala_medier/youtubelogga_liten.jpg"></a>
                </div>
            </nav>
            
            <div class="section" id="shows">
                <p class="section-heading">KONSERTER</p>
                    <?php $gigs->displayGigs(); ?>
            </div>
            
            <div class="section" id="about">
                <p class="section-heading">OM SPÖKET</p>
                    <a href="static/images/about.jpg"><img src="static/images/about.jpg"></a>
                    <?php echo "<p class='large-text'>$description->Beskrivning</p>" ;?>
                    
                    <p class="small-heading">Spöket i köket är:</p>
                    <?php foreach($members as $member) {
                        echo "<p>$member->Firstname $member->Lastname - $member->Instrument</p>";
                    }; ?>

            </div>
                
            <div class="section" id="musikochfilm">
                <p class="section-heading">MUSIK OCH MEDIA</p>
                    <p class="small-heading">Spöket på bild:</p>
                    <div id="album-container">
                        <a href="https://www.spoketikoket.com/gallery.php?folder=Pressfoto Mars - 15"><img class="medium-thumbnail" src="static/images/Pressfoto Mars - 15/albumcover/pressfoto0315_med.jpg"></a>
                        <p class="large-text">Pressfoto Mars - 15</p>
                    </div>
                    <div id="album-container">
                        <a href="https://www.spoketikoket.com/gallery.php?folder=Stallet Maj - 15"><img class="medium-thumbnail" src="static/images/Stallet Maj - 15/albumcover/spoketikoketStallet_med.jpg"></a>
                        <p class="large-text">Stallet Maj - 15</p>
                    </div>
                    <div id="album-container">
                        <a href="https://www.spoketikoket.com/gallery.php?folder=Folk at Heart - 15"><img class="medium-thumbnail" src="static/images/Folk at Heart - 15/albumcover/folkAtHeart15_med.jpg"></a>
                        <p class="large-text">Folk at Heart - 15</p>
                    </div>
                    
                    <p class="small-heading">Spöket i Köket på YouTube:</p>
                    <a href="https://www.youtube.com/channel/UCBnvUMnm1tU1O2ioTnUNJNw">https://www.youtube.com/channel/UCBnvUMnm1tU1O2ioTnUNJNw</a>
                    <br/>
                    <br/>
                    <iframe sandbox="allow-same-origin allow-scripts" 
                            width="560" height="315" 
                            src="https://www.youtube.com/embed/AWKObuONzvI" 
                            frameborder="0" 
                            allowfullscreen>
                    </iframe>
                    
                    <iframe sandbox="allow-same-origin allow-scripts"
                            width="560" height="315" 
                            src="https://www.youtube.com/embed/aFsEZgCkrxA" 
                            frameborder="0" 
                            allowfullscreen>
                    </iframe>
                    
                    <p class="small-heading">Spöket i Köket på Soundcloud:</p>
                    <a href="https://soundcloud.com/sp-ket-i-k-ket">https://soundcloud.com/sp-ket-i-k-ket</a>
                    <br/>
                    <br/>
                    
                    <div class="soundcloud-div">
                    <iframe sandbox="allow-same-origin allow-scripts" 
                            width="100%" height="166" 
                            scrolling="no" 
                            frameborder="no" 
                            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/193838040&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false">
                    </iframe>
                    
                    <iframe sandbox="allow-same-origin allow-scripts" 
                            width="100%" height="166" 
                            scrolling="no" 
                            frameborder="no" 
                            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188004270&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false">
                    </iframe>
                    </div>
                    
                    <iframe sandbox="allow-same-origin allow-scripts"
                            width="100%" height="332" 
                            scrolling="no" 
                            frameborder="no" 
                            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188004885&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true">
                    </iframe>
                    
            </div>
            
            <div class="section" id="kontakt">
                <p class="section-heading">KONTAKT</p>
                    <p class="small-heading">Bokning, press, säga hej och allting:</p>
                        <?php echo "<p>Mail: $contact->Email</p><p>Tel SE: $contact->TelSE</p><p>Tel DK: $contact->TelDK</p>";
                        ?>
            </div>
            
            <div id="footer">
                <p>Sidan byggd av Simon Olofsson</p>
            </div>
        </div>
        
        <input type="radio" name="to-top-radio" id="not-visible" checked />
        <input type="radio" name="to-top-radio" id="visible" />
        <div id="to-top">
            <p class="large-text">Upp igen</p>
        </div>
        
        <script src="js/jquery-1.12.0.min.js"></script> 
        <script type="text/javascript" src="js/mainjQuery.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
    </body>
</html>
