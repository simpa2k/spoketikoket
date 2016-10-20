<?php
/**
 * Created by PhpStorm.
 * User: simpa2k
 * Date: 2016-05-15
 * Time: 18:30
 */

class JsonView {

    public function render($content) {

        header('Content-Type: application/json; charset=utf8');
        echo json_encode($content);
        return true;

    }

}
