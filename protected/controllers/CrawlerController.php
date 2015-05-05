<?php 
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

?>
<?php

class CrawlerController extends Controller
{
	public function actionIndex(){
		$this->render('index');
	}
	
	public function actionGenerateCrawlerModel(){
		$crawlerFolder=$_SERVER['DOCUMENT_ROOT']."direwolf/components/ache-master";
		$trainingFolder=$crawlerFolder."/config/crawler_training_data";
		$positiveFoler=$trainingFolder."/positive";
		$negativeFoler=$trainingFolder."/negative";
		$modelFolder = $crawlerFolder."/config/crawler_model";
		
		// Create positives
		$sql='SELECT * FROM event WHERE event_title="Vote Up" OR event_title="Read Doc" ';
		$rows=Event::model()->findAllBySql($sql);
		removeFiles($positiveFoler);
		foreach ($rows as $row){
			$content = "";//$row['event_extra_2'];
			$fp = fopen($positiveFoler."/". $row['event_extra_1'],"wb");
			fwrite($fp,$content);
			fclose($fp);
			chmod($positiveFoler."/". $row['event_extra_1'], 0777);
		}
	
		// Create negatives
		$sql='SELECT * FROM event WHERE event_title="Vote Down"';
		$rows=Event::model()->findAllBySql($sql);
		removeFiles($negativeFoler);
	
		foreach ($rows as $row){
			$content = "";//$row['event_extra_2'];
			$fp = fopen($negativeFoler."/". $row['event_extra_1'],"wb");
			fwrite($fp,$content);
			fclose($fp);
			chmod($negativeFoler."/". $row['event_extra_1'], 0777);
		}
		
		// Generate Model
		//echo exec("cd /var/www/direwolf/components/ache-master/; ./script/build_model.sh config/sample_training_data  config/sample_model > gen.log");
		sleep(2);
		
		$response=array();
		
		$positiveFiles=array();
		foreach (scandir($positiveFoler) as $item) {
			if ($item!="." && $item!="..") {
				array_push($positiveFiles,$item);
			}
		}
		$response['positive']=$positiveFiles;
		
		$negativeFiles=array();
		foreach (scandir($negativeFoler) as $item) {
			if ($item!="." && $item!="..") {
				array_push($negativeFiles,$item);
			}
		}
		$response['negative']=$negativeFiles;
		
		$response['model']=["pageclassifier.features","pageclassifier.model"];
		
		echo json_encode($response);
		
	}
	
	public function actionFetchFromMemexLiveStream($limit=3){
		$foldername=$_SERVER['DOCUMENT_ROOT']."direwolf/components/memex-api";
		$port="8080";
		
		$json=exec("cd /var/www/direwolf/components/memex-api/; /usr/bin/curl -H 'Authorization:Token 578a75e30a006c5448eb1f7903e13d1b09d9ec23'  https://memexproxy.com/ist-memex-api/v2/artifacts?limit=".$limit, $a,$b);
		$hashs=json_decode($json);
		$urls=array();
		foreach ($hashs as $hash){
			$json=exec("curl -H 'Authorization:Token 578a75e30a006c5448eb1f7903e13d1b09d9ec23'  https://memexproxy.com/ist-memex-api/v2/artifacts/$hash",$a,$b);
			$doc=json_decode($json);
			$title_pos_s=strpos ( $doc->response->body, "<title>" );
			$title_pos_e=strpos ( $doc->response->body, "</title>" );
			if ($title_pos_s==false || $title_pos_e==false){
				$title = "No Title";
			} else {
				$title =  substr($doc->response->body,$title_pos_s+7, $title_pos_e-$title_pos_s-7);
			}
			$timestamp = date("Y-m-d H:i:s",$doc->timestamp/1000);
			
			
			$commit_json=array();
			$commit_json["id"]=$doc->key;
			$commit_json["title"]=$title;
			$commit_json["timestamp"]=$timestamp;
			$commit_json["url"]=$doc->url;
			$commit_json["content"]=strip_html_tags($doc->response->body);
			$commit_json["source"]="https://memexproxy.com/ist-memex-api/v2/artifacts/";
			
			$content = '['.json_encode($commit_json).']';
			$filename=$commit_json["id"];
			$fp = fopen($foldername."/". $filename,"wb");
			fwrite($fp,$content);
			fclose($fp);
			chmod($foldername."/". $filename, 0777);
			$json=exec("cd /var/www/direwolf/components/memex-api/; /usr/bin/curl 'http://localhost:$port/solr/memex/update?commit=true' --data-binary @/var/www/direwolf/components/memex-api/$filename -H 'Content-type:application/json'" , $a,$b);
			
			array_push ( $urls , $doc->url);
		}
		
		$response["urls"]=$urls;
		echo json_encode($response);
		
		removeFiles($foldername);
	}
	
	
}