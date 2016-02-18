<?php
require_once 'core/init.php';

header('Content-Type: text/html; charset=utf-8');
header("Content-Security-Policy: script-src 'self'");
header('Strict-Transport-Security: max-age=3600');

if ( Input::exists() ) {
    if ( Token::check( Input::get( 'token' ) ) ) {
        $validate = new Validate();
        $validation = $validate->check( $_POST, array(
            'username' => array(
                'required'  => true,
                'min'       => 2,
                'max'       => 20,
                'unique'    => 'users'
            ),
            'password' => array(
                'required'  => true,
                'min'       => 6
            ),
            'password_again' => array(
                'required'  => true,
                'matches'   => 'password'
            )
        ));
        
        if ( $validation->passed() ) {
            $user = new User();
            
            $salt = Hash::salt(32);
            $salt = utf8_encode($salt)
            
            echo 'Validation passed';
            
            try {
                $user->create( array(
                    'username'   => Input::get( 'username' ),
                    'password'   => Hash::make( Input::get( 'password' ), $salt ),
                    'salt'       => $salt
                ));
            
                echo 'Success!';
                
            } catch( Exception $e ) {
                
                die( $e->getMessage() );
            
            }
        } else {
            
            foreach( $validation->errors() as $error ) {
                echo $error, '</br>';
            
            }
        }
    }
}

?>
<form action="" method="post">
    <div class="field">
        <label for="username">Användarnamn</label>
        <input type="text" name="username" id="username" value="<?php echo escape(Input::get('username')); ?>" autocomplete="off">
    </div>
    
    <div class="field">
        <label for="password">Välj ett lösenord</label>
        <input type="password" name="password" id="password">
    </div>
    
    <div class="field">
        <label for="password_again">Skriv in lösenordet igen</label>
        <input type="password" name="password_again" id="password_again">
    </div>
    
    <input type="hidden" name="token" value="<?php echo Token::generate(); ?>">
    <input type="submit" value="Skapa användare">
</form>