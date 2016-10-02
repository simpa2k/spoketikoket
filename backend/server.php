<?php
/**
 * Created by PhpStorm.
 * User: simpa2k
 * Date: 2016-05-15
 * Time: 16:28
 */

require_once 'core/init.php';

$request = new Request();

$debug = fopen('debug.txt', 'a');
fwrite($debug, var_export($request->parameters, true));
fclose($debug);

$prefix = ucfirst($request->urlElements[1]);
$controllerName = $prefix . 'Controller';
$modelName = $prefix . 'Model';

if(class_exists($controllerName) && class_exists($modelName)) {
    $controller = new $controllerName(new $modelName());
    $actionName = strtolower($request->verb) . 'Action';
    $results = $controller->$actionName($request);
    
    $viewName = ucfirst($request->format) . 'View';
    if(class_exists($viewName)) {
        $view = new $viewName();
        $view->render($results);
    }

}
