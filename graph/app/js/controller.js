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

	$scope.showDialog = function(event) {
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
	$scope.clickSphere = function (event){
		$rootScope.$broadcast('showDialog', event);
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


app.controller('conversationCtrl', function($scope) {
	var delay=50;
	$scope.remainText="";
	$scope.isTalking=false;
	$scope.addText = function(text){
		$scope.remainText+="\n"+text;
		$scope.isTalking=true;
		addTextByDelay(elem,delay);
	}

	$scope.addText("Good morning, my friend. My name is Minerva. I will help you with your search task.");
	var elem = $("#conversationPanel");

	addTextByDelay = function(elem,delay){
	    if($scope.remainText.length >0){ 
	        elem.append($scope.remainText[0]);
	        setTimeout(
	            function(){
	            	$scope.remainText=$scope.remainText.slice(1);
	                addTextByDelay(elem,delay);            
	             },delay                 
	            );
	    } else {
	    	$scope.isTalking=false;
	    }
	}

});

