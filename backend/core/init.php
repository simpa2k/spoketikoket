<?php
session_start();

$GLOBALS['config'] = array(
    'mysql' => array(
        'host'      => '127.0.0.1',
        'username'  => 'root',
        'password'  => 'm432LzR33PQsaH',
        'db'        => 'spoketikoket_new'
    ),
    'session' => array(
        'session_name' => 'user',
        'token_name'   => 'token'
    )
);

spl_autoload_register(function($class) {

    if(preg_match('/[a-zA-Z]+Controller$/', $class)) {

        require_once 'classes/controllers/' . $class . '.php';

    } elseif(preg_match('/[a-zA-Z]+Model$/', $class)) {

        require_once 'classes/models/' . $class . '.php';

    } elseif(preg_match('/[a-zA-Z]+View$/', $class)) {

        require_once 'classes/views/' . $class . '.php';

    } else {

        require_once 'classes/' . $class . '.php';

    }

});