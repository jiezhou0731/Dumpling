// Popup Window controller
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

