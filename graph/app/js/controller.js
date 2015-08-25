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
	var delay=50;
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
	    	$scope.isTalking=false;
	    	$scope.$apply();
	    }
	}

	$scope.addText = function(text){
		$scope.remainText+=text+"<br/><br/>";
		$scope.isTalking=true;
		$scope.addTextByDelay(elem,delay);
	}

	$scope.addText("Good morning, my friend. My name is <hlt>Minerva</hlt>. I will help you with your search task.");	
	//$rootScope.$broadcast('MinervaSpeak',arg);
	$scope.$on("MinervaSpeak",function(event, args){
		$scope.addText(args.text);
	},true);
});

app.controller('SearchResultDocListCtrl', function($scope, $mdDialog) {
  $scope.people = [
    { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
    { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
    { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
  ];
  $scope.goToPerson = function(person, event) {
  };
});


app.controller('SearchBoxCtrl', function(pythonService, rootCookie, $rootScope, $cookies, $scope, $sce, solrService) {
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
	        	$rootScope.stateHistory.push({query:batchQueries[i], transition: "Relevant. Find out more."});
	        }
	        $rootScope.$apply();
	        rootCookie.put("stateHistory",$rootScope.stateHistory);
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
		$rootScope.queryRegular=$rootScope.outterControllerQuery;
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
		rootCookie.put("lastQuery",$rootScope.lastQuery);
		$rootScope.page = 1;
		$rootScope.$broadcast('sendQuery',{query:$rootScope.query, start:($rootScope.page-1)*$rootScope.resultPerPage});
		$rootScope.$broadcast('interactionEmit',{title:"Send query", detail:"Query: "+$rootScope.query});
	};
	
	$scope.clearHistory=function(){
		$rootScope.numFound=0;
		$rootScope.queryEmail={};
		$rootScope.queryAddress={};
		$rootScope.queryAdvanced={};
		$rootScope.queryStructural={};
		$rootScope.query="";
		rootCookie.put("lastQuery","");
		solrService.clearHistory();
		$rootScope.stateHistory=[];
		rootCookie.put("stateHistory",$rootScope.stateHistory);
		$rootScope.readDocEvents=[]
		$rootScope.docs=[];
		$rootScope.$broadcast('interactionEmit',{title:"Clear history", detail:""});
	}
	
	$scope.lastGraphGraph = {};

	$scope.clickShowGraph = function(){
		$rootScope.$broadcast('clickShowGraph',{title:"Clear history", detail:""});
	}
});

app.controller('SearchResultDocDetailCtrl', function($scope) {
	
});
