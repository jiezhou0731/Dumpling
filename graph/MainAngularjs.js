var pythonGetGraphStructure = 'http://141.161.20.98/direwolf/pythonCgi/getGraph.cgi';

var dumplingApp = angular.module('dumplingApp',['ngSanitize','ngMaterial']).config(function($mdIconProvider) {
	$mdIconProvider
	.iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
	.iconSet("social", 'img/icons/sets/social-icons.svg', 24);
});

dumplingApp.service('pythonService',function($http,$sce, $q,$rootScope){
	this.getGraphStructure = function (args){
		var defer = $q.defer();
		console.log("!!to cgi:");
		console.log(JSON.stringify(args));
		$.ajax({
			method: 'post',
			url: pythonGetGraphStructure,
			data:
			{
				text: JSON.stringify(args)
			},
			success: function(response){
		 		//response=angular.fromJson(response);
		 		console.log("from cgi:");
		 		console.log(response);
		 		defer.resolve(response);
		 	},
		 	error: function(){
		 		defer.reject('Can not connect to server');
		 	}
		 });
		return defer.promise;;
	}
});

// Popup Window controller
dumplingApp.controller('popupWindowController', function(pythonService, $window, $scope, $rootScope) {
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

dumplingApp.controller('dialogCtrl', function($scope, $mdDialog, $rootScope) {
	$scope.alert = '';

	$scope.$on('showDialog', function(event, args) {
		$scope.showDialog(event);
	},true);

	$scope.showDialog = function(event) {
		trackballControls.enabled = false;
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'app/template/docDetail.html',
			parent: angular.element(document.body),
			targetEvent: event,
		});
	};

});


dumplingApp.controller('graphCtrl', function($scope, $mdDialog,$rootScope) {
	$scope.clickSphere = function (event){
		$rootScope.$broadcast('showDialog', event);
	}
	$scope.rightClickSphere = function (event,mousePos){
		$rootScope.$broadcast('rightClickSphere', mousePos);
	}
});


function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
		trackballControls.enabled = true;
		$mdDialog.hide();
	};
};


dumplingApp.controller('sphereClickedDropdownMenuCtrl', function($scope) {
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-fling';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'up';

	$scope.$on('rightClickSphere', function(event, mousePos) {
		mousePos.x-=50;
		mousePos.x+="px";
		mousePos.y+="px";
		$scope.mousePos=mousePos;
		$scope.isOpen = true;
		$scope.$apply();
	},true);

	$scope.openAll=function(){
		objectContainer.openAll();
	}

	$scope.closeAll=function(){
		objectContainer.closeAll();
	}
});
