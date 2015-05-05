<?php

//for store picture. Post a thread including image in the forum and look for the address at database.
define("DOMAIN_FOR_PICTURE","192&#46;168&#46;242&#46;143");

//renderJSON($yourData);
function renderJSON($data)
{
    header('Content-type: application/json');
    echo CJSON::encode($data);

    foreach (Yii::app()->log->routes as $route) {
        if($route instanceof CWebLogRoute) {
            $route->enabled = false; // disable any weblogroutes
        }
    }
    Yii::app()->end();
}

function jsonEscape($st,$stopWord=""){
	$re=str_replace('\\', '\\\\', $st);
	$re=str_replace('"', '\"', $re);
	$re=str_replace('&quot', '\"', $re);
	$carriage_return = chr(13);
	$re=str_replace($carriage_return,' ', $re);
	$newLine = chr(10);
	$re=str_replace($newLine,' ', $re);
	if ($stopWord!="") 
		$re=str_replace($stopWord,'', $re);
	return $re;
}

//find how many $obj[$name] in $arr
function count_equal($arr,$name, $obj){
	if (is_null($arr)) return 0;
	$ans = 0;
	foreach ($arr as $iter){
		if ($iter[$name]==$obj) {
			$ans++;
		}
	}
	return $ans;
}

//redirectTo(Yii::app()->request->baseUrl."/index.php?r=inside/production/list");
function redirectTo($url){
	echo '<script language="javascript" type="text/javascript"> window.location.href="'.$url.'"; </script>';
}

/*
	$arr['type']='Company';
	$arr['fields']=array('company_email','company_password');
	post_create($arr);
 */
function post_create($arr){
	$newRow = new $arr['type']();
	foreach ($arr['fields'] as $field){
		if (!is_null($_POST[$field]))
			$newRow->$field=$_POST[$field];
	}
	$newRow->save();
}

/*
	$arr['type']='Company';
	$arr['id']['name']='company_id';
	$arr['id']['value']=Yii::app()->user->company_id;
	$arr['fields']=array('company_discription','company_website','company_location');
	post_update($arr);
 */
function post_update($arr){
	$type = new $arr['type']();
	$row = $type->model()->find($arr['id']['name'].'=:value', array(':value'=>$arr['id']['value']));
	foreach ($arr['fields'] as $field){
		if (!is_null($_POST[$field]))
			$row->$field=$_POST[$field];
	}
	$row->save();
}

// $ip = get_client_ip();
function get_client_ip(){
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
	    $ip = $_SERVER['HTTP_CLIENT_IP'];
	} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
	    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	} else {
	    $ip = $_SERVER['REMOTE_ADDR'];
	}
	return $ip;
}

// remove all files and folders in that directory
// removeFiles("/var/www/direwolf/dfdf");
function removeFiles($dir, $root=true) {
    if (!file_exists($dir)) {
        return true;
    }
    if (!is_dir($dir)) {
        return unlink($dir);
    }
    foreach (scandir($dir) as $item) {
    	if ($item == '.' || $item == '..') {
    		continue;
    	}
    	if (is_dir($dir.DIRECTORY_SEPARATOR.$item)){
    		removeFiles($dir.DIRECTORY_SEPARATOR.$item,false);
    	} else {
        	unlink($dir . DIRECTORY_SEPARATOR . $item);
    	}
    }
    
    if ($root!=true){
    	return rmdir($dir);
    }
    return true;
}
	
// search a file recursively in a directory.
// searchFileInFoler("/var/www/direwolf",'#^(?:[A-Z]:)?(?:/(?!\.Trash)[^/]+)+/[^/]+\.(?:php|html)$#Di');
function searchFileInFoler($folder, $pattern) {
	$directory = new RecursiveDirectoryIterator ( $folder );
	$flattened = new RecursiveIteratorIterator ( $directory );
	
	// Make sure the path does not contain "/.Trash*" folders and ends eith a .php or .html file
	$files = new RegexIterator ( $flattened,  $pattern);
	return $files;
}

//strip_html_tags($content);
function strip_html_tags( $text )
{
	// PHP's strip_tags() function will remove tags, but it
	// doesn't remove scripts, styles, and other unwanted
	// invisible text between tags.  Also, as a prelude to
	// tokenizing the text, we need to insure that when
	// block-level tags (such as <p> or <div>) are removed,
	// neighboring words aren't joined.
	$text = preg_replace(
			array(
					// Remove invisible content
					'@<head[^>]*?>.*?</head>@siu',
					'@<style[^>]*?>.*?</style>@siu',
					'@<script[^>]*?.*?</script>@siu',
						'@<object[^>]*?.*?</object>@siu',
						'@<embed[^>]*?.*?</embed>@siu',
						'@<applet[^>]*?.*?</applet>@siu',
						'@<noframes[^>]*?.*?</noframes>@siu',
						'@<noscript[^>]*?.*?</noscript>@siu',
						'@<noembed[^>]*?.*?</noembed>@siu',

								// Add line breaks before & after blocks
								'@<((br)|(hr))@iu',
										'@</?((address)|(blockquote)|(center)|(del))@iu',
										'@</?((div)|(h[1-9])|(ins)|(isindex)|(p)|(pre))@iu',
										'@</?((dir)|(dl)|(dt)|(dd)|(li)|(menu)|(ol)|(ul))@iu',
								
	'@</?((table)|(th)|(td)|(caption))@iu',
						'@</?((form)|(button)|(fieldset)|(legend)|(input))@iu',
						'@</?((label)|(select)|(optgroup)|(option)|(textarea))@iu',
						'@</?((frameset)|(frame)|(iframe))@iu',
						),
								array(
										' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
										"\n\$0", "\n\$0", "\n\$0", "\n\$0", "\n\$0", "\n\$0",
										"\n\$0", "\n\$0",
	),
	$text );

	// Remove all remaining tags and comments and return.
	$text = strip_tags( $text );
		return $text;
}

// rename all folders named "ad", because chrome don't show html under ad.
function renameAllAdFolder($dir){
	if (!file_exists($dir)) {
		return true;
	}
	if (!is_dir($dir)) {
		return true;
	}
	foreach (scandir($dir) as $item) {
		if ($item == '.' || $item == '..') {
			continue;
		}
		if (is_dir($dir.DIRECTORY_SEPARATOR.$item)){
			renameAllAdFolder($dir.DIRECTORY_SEPARATOR.$item);
		} 
	}
	
	if (basename($dir)=="ad"){
		rename ( $dir,$dir."_chrome_friendly123/" );
	}
	return true;
}
