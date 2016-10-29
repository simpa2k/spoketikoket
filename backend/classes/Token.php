<?php
class Token {
    public static function generate() {
        //return Session::put(Config::get('session/token_name'), md5(uniqid()));
        /* Contrary to md5 and uniqid, openssl_random_pseudo_bytes is
         * cryptographically secure, since it does not
         * depend on the system clock
         */
        return bin2hex(openssl_random_pseudo_bytes(16));
    }
    
    public static function check($token) {
        $tokenName = Config::get('session/token_name');
        
        if(Session::exists($tokenName) && $token === Session::get($tokenName)) {
            Session::delete($tokenName);
            return true;
        }
        
        return false;
    }
}
