<?php 
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
?>
<?php

class CounterfeitController extends Controller
{
	public function actionIndex(){
		$this->render('index');
	}
	
	public function actionTest(){
		$this->render('indexTest');
	}
	
	public function actionUserState(){
		$this->render('userState');
	}
	
	public function actionSubtopicTest(){
		echo '
				{"topics": [{"text": "Facebook Accounts", "subtopics": [{"text": "Selleraas"}, {"text": "Prices"}, {"text": "Mode of Payments"}]}, {"text": "Twitter Accounts", "subtopics": [{"text": "buyes"}, {"text": "individuals selling/offering/trading"}, {"text": "pros and cons of buying"}, {"text": "Business selling/offering"}]}]}
				';
	}
	
	public function actionDownloadFullPage($url="http://localhost/direwolf/index.php?r=crawler"){
		$url=stripslashes($url);
		$base_folder = "/var/www/direwolf/components/download-temperary-webpage";
		$folder="";
		$item = CachedUrl::model()->find('cached_url_address=:cached_url_address', array(':cached_url_address'=>$url));
		if ($item==null){
			$newRecord = new CachedUrl;
			$newRecord->cached_url_address =$url ;
			$newRecord->save();
			$folder=$base_folder.'/'.$newRecord->cached_url_id;
			exec('mkdir '.$folder,$a,$b);
			exec('/usr/bin/./wget --directory-prefix='.$folder.' -E -H -k -K -p '.$url,$a,$b);
			renameAllAdFolder($folder);
		} else {
			$folder=$base_folder.'/'.$item->cached_url_id;
		}
		$htmlPath= $this->getHtmlPath($url,$folder);
		$response['path'] = $htmlPath;
		echo json_encode($response);
	}
	
	public function getHtmlPath($url,$folder){
		$url=str_replace("http://","",$url);
		$url=str_replace("https://","",$url);
		$url=str_replace("/ad/", "/ad_chrome_friendly123/", $url);
		
		$files=searchFileInFoler($folder,'#^(?:[A-Z]:)?(?:/(?!\.Trash)[^/]+)+/[^/]+\.(?:php|html|htm)$#Di');
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