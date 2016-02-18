<?php 
require_once 'core/init.php';

// Setting header
/*header('Content-Type: text/html; charset=utf-8');
header("Content-Security-Policy: script-src 'self'");
header('Strict-Transport-Security: max-age=3600');*/

$user = new User();

if ( $user->isLoggedIn() ) {
    
    $db = DB::getInstance();
    
    $admin = new Admin();

    if ( Input::exists() ) {
        
        $admin->checkForUpdates($_POST);
        $admin->reload();

    }


?>

<!DOCTYPE html>
<html>
    <head>
        <title>Spöket i köket</title>
        <!--Setting viewport for mobile devices-->
        <meta name="viewport" content="width=device-width, initial-scale=0.5">
        <link rel="stylesheet" type="text/css" href="static/css/admin.css">

        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

        <!-- Latest compiled and minified JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    </head>
    <body id="body">
        <div class="container-fluid" id="main">
            <div id="header">
                <p class="heading">KONSERTER</p>
                <p class="heading">OM SPÖKET</p>
                <p class="heading">MUSIK OCH MEDIA</p>
                <p class="heading">KONTAKT</p>
            </div>
            
            <div class="row">
                <div class="col-md-6"><p class="section-heading">KONSERTER</p></div>
            </div>
            
            <div class="konserter">
                <?php $admin->printGigForms(); ?>
                <div class="row">
                    <div class="col-md-10">
                        <button id="konserter" class="btn btn-primary update" type="button">Uppdatera</button>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6"><h3 class="text-left">Lägg till nytt gig:</h3></div>
            </div>

            <div class="konserter">
                <?php $admin->printFieldsForNewEntry('konserter', array('id')); ?>
                <div class="row">
                    <div class="col-md-10">
                        <button id="konserter" class="btn btn-success add" type="button">Lägg till gig</button>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6"><p class="section-heading">OM SPÖKET</p></div>
            </div>
            
            <div class="beskrivning">
                <?php $admin->printDescription(); ?>
                <div class="row">
                    <div class="col-md-2">
                        <button id="beskrivning" class="btn btn-primary update" type="button">Uppdatera</button>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6"><p class="section-heading">Medlemmar</p></div>
            </div>
            
            <div class="medlemmar">        
                <?php $admin->printMembers(); ?>
                <div class="row">
                    <div class="col-md-6">
                        <button id="medlemmar" class="btn btn-primary update" type="button">Uppdatera</button>
                    </div>
                </div>
            </div>

             <div class="row">
                <div class="col-md-6"><h3 class="text-left">Lägg till medlem:</h3></div>
            </div>

            <div class="medlemmar">
                <?php $admin->printFieldsForNewEntry('medlemmar', array('id')); ?>
                <div class="row">
                    <div class="col-md-6">
                        <button id="medlemmar" class="btn btn-success add" type="button">Lägg till medlem</button>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6"><p class="section-heading">KONTAKT</p></div>
            </div>
    
            <div class="kontakt">
                <?php $admin->printContactInformation(); ?>
                <div class="row">
                    <div class="col-md-6">
                        <button id="kontakt" class="btn btn-primary update" type="button">Uppdatera</button>
                    </div>
                </div>
            </div>
           
        </div>
        
        <input type="radio" name="to-top-radio" id="not-visible" checked />
        <input type="radio" name="to-top-radio" id="visible" />
        <div id="to-top">
            <p class="large-text">Upp igen</p>
        </div>
        
        <script src="js/jquery-1.12.0.min.js"></script>    
        <script src="js/jquery-ui/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/admin.js"></script>
    </body>
</html>
<?php
} else {
    Redirect::to('/');
}