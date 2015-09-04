var solrQueryUrl = 'http://141.161.20.98:8080/solr/counterfeit/winwin';


app.controller('popupWindowController', function(pythonService, $window, $scope, $rootScope) {
	/*
    console.log($window.mySharedData);
    var msg = $window.mySharedData.queryInfo;
    pythonService.getGraphStructure(msg)
			.then(function(data){
				console.log(data);
				json =data;
				updateStructure();

		});
*/
json=initialGraphJson;
updateStructure();

});

app.controller('dialogCtrl', function($scope, $mdDialog, $rootScope) {
	$scope.alert = '';

	$scope.$on('showDialog', function(event, args) {
		$scope.showDialog(args);
	},true);

	$scope.showDialog = function(msg) {
		trackballControls.enabled = false;
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'app/view/spheres/docDetail.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose:true
		});
	};

});


app.controller('graphCtrl', function($scope, $mdDialog,$rootScope) {
	$scope.clickSphere = function (event,msg){
		$rootScope.$broadcast('showDialog', msg);
		var clickedObject=msg.clickedObject;
		var entity="";
		if (clickedObject.surroundedSphere!=undefined) {
			entity+=clickedObject.surroundedSphere.data.fatherNodeName;
		} 
		var args={};
		args.text="Hmm, you are interested in <hlt>"
			+entity
			+"</hlt>. Good, please go on."
		$rootScope.$broadcast('MinervaSpeak',args);
	}
	$scope.rightClickSphere = function (event,msg){
		$rootScope.$broadcast('rightClickSphere', msg);
	}
});


function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
		trackballControls.enabled = true;
		$mdDialog.hide();
	};
};


app.controller('sphereClickedDropdownMenuCtrl', function($scope) {
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-fling';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'down';

	$scope.$on('rightClickSphere', function(event, msg) {
		$scope.latestClickedObject = msg.clickedObject;
		mousePos = msg.mousePos;
		mousePos.x-=20;
		mousePos.y-=0;
		mousePos.x+="px";
		mousePos.y+="px";
		$scope.mousePos=mousePos;
		$scope.isOpen = true;
		$scope.$apply();
	},true);

	$scope.open = function(){
		$scope.latestClickedObject.surroundedSphere.open();
	}

	$scope.close= function(){
		$scope.latestClickedObject.surroundedSphere.close();
	}

	$scope.openAll=function(){
		objectContainer.openAll();
	}

	$scope.closeAll=function(){
		objectContainer.closeAll();
	}
});


app.controller('conversationCtrl', function($scope,$rootScope) {
	var delay=20;
	$scope.remainText="";
	$scope.isTalking=false;

	var elem = $("#conversationPanel");

	$scope.addTextByDelay = function(elem,delay){
	    if($scope.remainText.length >0){
	    	var newWord="";
	    	if ($scope.remainText[0]=='<'){
	    		$scope.remainText=$scope.remainText.slice(1);
	    		newWord="<";
	    		while ($scope.remainText[0]!='>') {
	    			newWord+=$scope.remainText[0];
	    			$scope.remainText=$scope.remainText.slice(1);
	    		}	
	    		newWord+=$scope.remainText[0];
	    		$scope.remainText=$scope.remainText.slice(1);

	    		if (newWord=="<br/>"){

	    		} else {
					while ($scope.remainText[0]!='>' ) {
		    			newWord+=$scope.remainText[0];
		    			$scope.remainText=$scope.remainText.slice(1);
		    		}	
		    		newWord+=$scope.remainText[0];
		    		$scope.remainText=$scope.remainText.slice(1);	    			
	    		}
	    	} else {
	    		newWord=$scope.remainText[0];
	    		$scope.remainText=$scope.remainText.slice(1);
	    	}
	        elem.append(newWord);
	        
	        setTimeout(
	            function(){
	                $scope.addTextByDelay(elem,delay);            
	             },delay                 
	            );
	    } else {
	    	if ($scope.screenshot!=undefined){
	    		$("#conversationPanel").append($scope.screenshot);
	    		$scope.screenshot=undefined;
	    	}
	    	$scope.isTalking=false;
	    	$scope.$apply();
	    	elem.animate({scrollTop:elem[0].scrollHeight+100}, '600');
	    }
	    //elem.animate({scrollTop:elem[0].scrollHeight}, '600');	
	}

	$scope.addText = function(text){
		$scope.remainText+=text+"<br/>";
		$scope.isTalking=true;
		$scope.addTextByDelay(elem,delay);
	}

	$scope.addText("Good morning, my friend. My name is <hlt>Minerva</hlt>. I will help you with your search task.");	
	//$rootScope.$broadcast('MinervaSpeak',arg);
	$scope.$on("MinervaSpeak",function(event, args){
		if (args.type=="screenshot") {
			$scope.addText(args.text);
	        html2canvas(document.body, {
			  onrendered: function(canvas) {
			  	var dataURL = canvas.toDataURL();
                var img = $(document.createElement('img'));
                img.attr('src', dataURL);
                img.width('8vw');
                $scope.screenshot = img;
			  }
			});
		} else if (args.type=="3d-graph-screenshot") {
			$scope.addText(args.text);
	        html2canvas(document.body, {
			  onrendered: function(canvas) {
			  	var extra_canvas = webGLRenderer.domElement;;
                var dataURL = webGLRenderer.domElement.toDataURL();
                var img = $(document.createElement('img'));
                img.attr('src', dataURL);
                img.width('8vw');
                $scope.screenshot = img;
			  }
			});
		}
		else {
			$scope.addText(args.text);
		}
	},true);

	$scope.$on("UserSpeak",function(event, args){
		 var bubble ="<div class='user-bubble'>"+args.text+"</div>";
		 elem.append(bubble);
		 elem.animate({scrollTop:elem[0].scrollHeight+100}, '600');
	},true);
});

app.controller('SearchResultDocListCtrl', function(solrService,$rootScope, $scope, $mdDialog) {
  $scope.people = [
    { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
    { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
    { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
  ];
  $scope.goToPerson = function(person, event) {
  };

  $rootScope.state="searchResult";
  $rootScope.beginning = "true";

  $rootScope.$watch('docs', function() {
   	  if ($rootScope.docs!=undefined && $rootScope.docs.length!=0) {
	  	$rootScope.$broadcast('displayNewDocOnDocDetailPanel',$rootScope.docs[0]);
	  }
   });
	// Click doc content
	$scope.clickContent=function(doc){
		$rootScope.readDocEvents.push({id:doc.id,url:doc.escapedUlr, content:"", startTime:Date.now()});
		//var popupWindow = window.open('app/counterfeit/popupWindow.html');
  		//popupWindow.mySharedData = doc;
		//$rootScope.$broadcast('overlayDisplay',{title:doc.title, url:doc.url, content:doc.content});
		$rootScope.$broadcast('displayNewDocOnDocDetailPanel',doc);
		$rootScope.$broadcast('clearHoverPannels');
	};

	// Click up vote button
	$scope.clickUpVote=function(event, doc){
		$rootScope.$broadcast('interactionEmit',{title:"Vote Up", detail:"Doc ID: "+doc.id, extra_1:doc.escapedUlr});
		
		// Send to server
		solrService.sendUpVote(doc);
		
		doc.upVote="checked";
		doc.downVote=null;
		event.stopPropagation();
	};
	
	// Click down vote button
	$scope.clickDownVote=function(event, doc){
		$rootScope.$broadcast('interactionEmit',{title:"Vote Down", detail:"Doc ID: "+doc.id, extra_1:doc.escapedUlr});
		doc.downVote="checked";
		solrService.sendDownVote(doc);
		doc.upVote=null;
		event.stopPropagation();
	};
	
	// Prepare to start
	$rootScope.readDocEvents=[];
	$rootScope.docs=[];
	//moveBallToDirection = 2;
	//changeWords(["haha","hahaaaa","hahaxxx"]);
	// When user send a new query.
	$scope.$on('sendQuery',function(event, args){
		
		$rootScope.readDocEvents=[];
		solrService.queryData(args.query, args.start, "newQuery").then(function (data){
			var subtopicPostJson={};
			subtopicPostJson.docno=new Array();
			for (var i=0; i<data.docs.length; i++){
				subtopicPostJson.docno.push(data.docs[i].id);
			}
			
			//topicService.getTopicTree(angular.toJson(subtopicPostJson));
			
			$rootScope.numFound = data.numFound;
			var transition;
			if ($rootScope.lastQueryIsRelevant==true){
				transition="Relevant. "
			} else {
				transition="Irrelevant. "
			}
			$rootScope.lastQueryIsRelevant = false;
			
			if (data.userState=="RELEVANT_EXPLOITATION"){
				transition+="Find out more";
				//changeStateLabel(0);
				//moveBallToAbove();
				//changeWords(args.query.split(" ").concat(["human","abuse","trafficking","sex","child"]));
			} else {
				transition+="Next topic";
				//changeStateLabel(1);
				//moveBallToBelow();
				//changeWords(args.query.split(" "));
			}
			$rootScope.docs = data.docs;
			//movingHistory.snapshot();
			if ($rootScope.doNotAddToUserStates==true){
				$rootScope.doNotAddToUserStates==false;
			} else {
				//$rootScope.stateHistory.push({query:args.query, transition: transition});
			}
			//rootCookie.put("stateHistory",$rootScope.stateHistory);
		});
	});
	
	// When user send a new query.
	$scope.$on('changePage',function(event, args){
		$rootScope.readDocEvents=[];
		solrService.queryData(args.query, args.start, "oldQuery").then(function (data){
			$rootScope.docs = data.docs;
			
			var subtopicPostJson={};
			subtopicPostJson.docno=new Array();
			for (var i=0; i<data.docs.length; i++){
				subtopicPostJson.docno.push(data.docs[i].id);
			}
			//topicService.getTopicTree(angular.toJson(subtopicPostJson));
		});
	});
	
	$scope.trustHtml = function(html) {
	    return $sce.trustAsHtml(html);
	}
	
	//Paging
	$rootScope.page=1;
	$rootScope.resultPerPage=10;
	
	$scope.clickPreviousPage = function(){
		if ($rootScope.page>1){
			$rootScope.page--;
			$rootScope.$broadcast('changePage',{query:$rootScope.lastQuery, start:($rootScope.page-1)*$rootScope.resultPerPage});
			$rootScope.$broadcast('interactionEmit',{title:"Change page", detail:"Query: "+$rootScope.lastQuery+", Page:"+$rootScope.page});
		}
	}
	
	$rootScope.queryMoreStart=0;
	$scope.clickNextPage = function(){
		$rootScope.cubeTestImageNumber=($rootScope.cubeTestImageNumber+1)%10;
		/*
		if ($rootScope.docs.length>=$rootScope.resultPerPage){
			$rootScope.page++;
			$rootScope.$broadcast('changePage',{query:$rootScope.lastQuery, start:($rootScope.page-1)*$rootScope.resultPerPage});
			$rootScope.$broadcast('interactionEmit',{title:"Change page", detail:"Query: "+$rootScope.lastQuery+", Page:"+$rootScope.page});
		}*/
		$rootScope.hackDoubleQuery="queryMore"+$rootScope.queryMoreStart;
		$rootScope.queryMoreStart++;
		solrService.queryMore("*", $rootScope.queryMoreStart, "oldQuery").then(function (data){
			$rootScope.docs = data.docs;
			var subtopicPostJson={};
			subtopicPostJson.docno=new Array();
			for (var i=0; i<data.docs.length; i++){
				subtopicPostJson.docno.push(data.docs[i].id);
			}
			//topicService.getTopicTree(angular.toJson(subtopicPostJson));

			//$rootScope.stateHistory.push({query:"Paw", transition: "Relevant. Find out more."});
	        $rootScope.$apply();
	        //rootCookie.put("stateHistory",$rootScope.stateHistory);
		});
	}
});


app.controller('ToolboxCtrl', function(pythonService, rootCookie, $rootScope, $cookies, $scope, $sce, solrService) {
	$scope.batchQueryFileChosen = function(){
        var fd = new FormData();
		fd.append("batchQuery", $('#batchQueryFile').prop('files')[0]);
		    

	    $.ajax({
	       url: parseBatchQueryUrl,
	       type: "POST",
	       data: fd,
	       processData: false,
	       contentType: false,
	       success: function(response) {
	        var batchQueries=angular.fromJson(response);
	        for (var i=0; i<batchQueries.length; i++) {
	        	//$rootScope.stateHistory.push({query:batchQueries[i], transition: "Relevant. Find out more."});
	        }
	        $rootScope.$apply();
	        //rootCookie.put("stateHistory",$rootScope.stateHistory);
	       }
	    });
	}


	$scope.searchboxMenu = {
		        topDirections: ['left', 'up'],
		        bottomDirections: ['down', 'right'],
		        isOpen: false,
		        availableModes: ['md-fling', 'md-scale'],
		        selectedMode: 'md-fling',
		        availableDirections: ['up', 'down', 'left', 'right'],
		        selectedDirection: 'down'
		      };
	
	$rootScope.numFound=0;
	$rootScope.queryPhone={};
	$rootScope.queryPhone.country="01";
	
	$rootScope.queryEmail={};
	
	$rootScope.queryAddress={};
	
	$rootScope.queryAdvanced={};
	
	$rootScope.queryMode="regular";
	
	$scope.$on("outterControllerClickSubmit",function(){
		$scope.clickSubmit();
	},true);

	$scope.clickSubmit=function(){
		$rootScope.nextInNavi="nextPage";
		if ($rootScope.queryMode=="phone"){
			$rootScope.query="";
			if ($rootScope.queryPhone.country!="01"){
				$rootScope.query+=$rootScope.queryPhone.country+" ";
			}
			$rootScope.query+=checkString($rootScope.queryPhone.area)+" ";
			$rootScope.query+=checkString($rootScope.queryPhone.prefix)+" ";
			$rootScope.query+=checkString($rootScope.queryPhone.line);
		} else if ($rootScope.queryMode=="email"){
			$rootScope.query="";
			$rootScope.query+=checkString($rootScope.queryEmail.part1)+" ";
			$rootScope.query+=checkString($rootScope.queryEmail.part2)+" ";
			$rootScope.query+=checkString($rootScope.queryEmail.part1)+"@"+checkString($rootScope.queryEmail.part2);
		} else if ($rootScope.queryMode=="address"){
			$rootScope.query="";
			$rootScope.query+=checkString($rootScope.queryAddress.part1)+" ";
			$rootScope.query+=checkString($rootScope.queryAddress.part2)+" ";
			$rootScope.query+=checkString($rootScope.queryAddress.part3)+" ";
			$rootScope.query+=checkString($rootScope.queryAddress.part4);
		} else if ($rootScope.queryMode=="structural"){
			$rootScope.query=$rootScope.queryStructural;
		} else if ($rootScope.queryMode=="regular"){
			$rootScope.query=$rootScope.queryRegular;
		}
		$rootScope.query=$rootScope.query.trim().replace(/\s\s+/g, ' ');
		$rootScope.lastQuery=$rootScope.query;
		//rootCookie.put("lastQuery",$rootScope.lastQuery);
		$rootScope.page = 1;
		$rootScope.$broadcast('sendQuery',{query:$rootScope.query, start:($rootScope.page-1)*$rootScope.resultPerPage});
		$rootScope.$broadcast('interactionEmit',{title:"Send query", detail:"Query: "+$rootScope.query});
		
		var args={};
		args.text=$rootScope.queryRegular;
		$rootScope.$broadcast('UserSpeak',args);

		var args={};
		args.type="screenshot";
		args.text="You searched <hlt>"+$rootScope.queryRegular+"</hlt>, and this is the screenshot."
		$rootScope.$broadcast('MinervaSpeak',args);
	};
	
	$scope.clearHistory=function(){
		$rootScope.numFound=0;
		$rootScope.queryEmail={};
		$rootScope.queryAddress={};
		$rootScope.queryAdvanced={};
		$rootScope.queryStructural={};
		$rootScope.query="";
		//rootCookie.put("lastQuery","");
		solrService.clearHistory();
		//$rootScope.stateHistory=[];
		//rootCookie.put("stateHistory",$rootScope.stateHistory);
		$rootScope.readDocEvents=[]
		$rootScope.docs=[];
		$rootScope.$broadcast('interactionEmit',{title:"Clear history", detail:""});
	}
	
	$scope.lastGraphGraph = {};

	$scope.clickShowGraph = function(){
		$rootScope.$broadcast('clickShowGraph',{title:"Clear history", detail:""});
	}

	$scope.$watch('state', function() {
		if ($rootScope.state=="graph"){
	       	var args={};
			args.text="Show me the 3D entities in the document.";
			$rootScope.$broadcast('UserSpeak',args);

			var args={};
			args.type="3d-graph-screenshot";
			args.text="OK. I am drawing the graph. The screenshot is below."
			$rootScope.$broadcast('MinervaSpeak',args);
		} else if ($rootScope.state=="searchResult" && $rootScope.beginning=="false"){
	       	var args={};
			args.text="Show me the search results.";
			$rootScope.$broadcast('UserSpeak',args);

			var args={};
			args.type="screenshot";
			args.text="Sure. I am retrieving the search results. The screenshot is below.";
			$rootScope.$broadcast('MinervaSpeak',args);
		}
		$rootScope.beginning="false";
   });
});

app.controller('SearchResultDocDetailCtrl', function($scope) {
	
});


//Highlight all the keywords in target string.
var highlight_colors = [ "#D35400","#F22613","#DB0A5B", "#1F3A93","#96281B","#D2527F","#674172"];
function highlight(target, keyword){
	if (target==undefined){
		return "";
	}
	keyword=keyword.replace(/\W/g, ' ');
	keyword=keyword.trim().replace(/\s\s+/g, ' ');
	if (target instanceof Array){
		target=target[0];
	}
	var keywords=keyword.split(" ");
	for (var i = 0; i < keywords.length; i++) {
		keyword=keywords[i];
		if (keyword.toUpperCase()=="AND" 
			|| keyword.toUpperCase()=="OR"
			|| keyword.toUpperCase()=="NOT") {
			continue;
		}
		reg = new RegExp(keyword, 'gi');
		target = target.replace(reg, '<span class="highlight" style="background-color:'+highlight_colors[i%highlight_colors.length]+'">'+keyword+'</span>');
	}
	
	return target;
}
