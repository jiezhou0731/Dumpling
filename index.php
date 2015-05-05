<?php

// change the following paths if necessary
$yii=dirname(__FILE__).'/../yii/framework/yii.php';
$config=dirname(__FILE__).'/protected/config/main.php';


//for store picture. Post a thread including image in the forum and look for the address at database.
define("DOMAIN_FOR_PICTURE","192&#46;168&#46;242&#46;143");

// remove the following lines when in production mode
defined('YII_DEBUG') or define('YII_DEBUG',true);
// specify how many levels of call stack should be shown in each log message
defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL',3);

require_once($yii);
require_once('util.php');

Yii::createWebApplication($config)->run();
