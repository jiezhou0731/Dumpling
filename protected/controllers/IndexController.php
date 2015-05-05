<?php 
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

?>
<?php

class IndexController extends Controller
{
	public function actionPostEvent($event_title,$event_detail,$event_extra_1,$event_extra_2=""){
		$event_extra_1 = str_replace("/", "%2F", $event_extra_1);
		
		$newRecord = new Event;   
		$newRecord->event_title =$event_title; 
		$newRecord->event_detail =$event_detail;
		$newRecord->event_extra_1 =$event_extra_1;
		$newRecord->event_extra_2 =$event_extra_2;
		$newRecord->event_time = time();
		$newRecord->event_ip = get_client_ip();
		$newRecord->save(); 
		echo "{}";
	}
	
	//pixelanimators.com/dumpling/index.php?r=index/interactionLogExport
	public function actionInteractionLogExport(){
		$sql='SELECT * FROM event';  
		$rows=Event::model()->findAllBySql($sql);  
		$content="";
		
		foreach ($rows as $row){ 
			$content.= $row['event_id'].',';
			$content.= $row['event_name'].',';
			$content.= $row['event_detail'].',';
			$content.= $row['event_ip'].',';
			$content.= $row['event_time'];
			$content.="\n";
		}  
		$filename = 'event_log_'.time().'.txt'; // of course find the exact filename.... 

		$myfile = fopen($filename, "w") or die("Unable to open file!");
		fwrite($myfile, $content);
		fclose($myfile);

		header('Pragma: public');
		header('Expires: 0');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Cache-Control: private', false); // required for certain browsers 
		header('Content-Type: application/txt');
		
		header('Content-Disposition: attachment; filename="'. basename($filename) . '";');
		header('Content-Transfer-Encoding: binary');
		header('Content-Length: ' . filesize($filename));
		
		readfile($filename);
		
		exit;
	}
	
	public function actionGetSessionNumber(){
		$intervalTime=60;
		$sql='SELECT * FROM event ORDER BY event_time ASC';  
		$rows=Event::model()->findAllBySql($sql);
		$sessions=array();  
		foreach ($rows as $row){
			$newSession=true;
			foreach ($sessions as $session){
				if ($session['event_ip']==$row['event_ip'] 
					&& ($row['event_time']-$session['event_time']<=$intervalTime)) {
					echo $session['event_time']."->";
					$session['event_time']=$row['event_time'];
					echo $session['event_time']."\n";
					$newSession=false;
					break;
				}
			} 
			if ($newSession==true){
				array_push($sessions,$row);
			}
		}  
		echo  count($sessions);
	}
	
	
}