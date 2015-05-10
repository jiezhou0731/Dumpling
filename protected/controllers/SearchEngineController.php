<?php 
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

?>
<?php

class SearchEngineController extends Controller
{
	public function actionIndex(){
		$this->render('index');
	}
	
	public function actionUserState(){
		$this->render('userState');
	}
	
	public function actionDownloadFullPage($url="http://localhost/direwolf/index.php?r=crawler"){
		$url=stripslashes($url);
		$folder = "/var/www/direwolf/components/download-temperary-webpage";
		removeFiles($folder);
		exec('/usr/bin/./wget --directory-prefix='.$folder.' -E -H -k -K -p '.$url,$a,$b);
		renameAllAdFolder($folder);
		$htmlPath= $this->getHtmlPath($url);
		$response['path'] = $htmlPath;
		echo json_encode($response);
	}
	
	public function getHtmlPath($url){
		$url=str_replace("http://","",$url);
		$url=str_replace("https://","",$url);
		$url=str_replace("/ad/", "/ad_chrome_friendly123/", $url);
		
		$files=searchFileInFoler("/var/www/direwolf/components/download-temperary-webpage",'#^(?:[A-Z]:)?(?:/(?!\.Trash)[^/]+)+/[^/]+\.(?:php|html|htm)$#Di');
		$path="";
		foreach($files as $file) {
			$escapedFile=stripslashes($file);
			if (strpos($escapedFile, ".html")!=false || strpos($escapedFile, ".htm")!=false){
				$path = $file;
				if (strpos($escapedFile, $url)!=false){
					break;
				}
			}
		}
		$path=str_replace($_SERVER['DOCUMENT_ROOT'],"",$path);
		$path="/".$path;
		
		
		$path = str_replace("/ad/", "/ad_chrome_friendly123/", $path);
		$htmlPath['basename']=basename($path);
		$htmlPath['dirname']=dirname($path)."/";
		
		return $htmlPath;
	}
}