<?php

require_once 'core/init.php';

$request = new Request();

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
