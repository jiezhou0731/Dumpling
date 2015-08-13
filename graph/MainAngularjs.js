var pythonGetGraphStructure = 'http://141.161.20.98/direwolf/pythonCgi/getGraph.cgi';

var dumplingApp = angular.module('dumplingApp',['ngSanitize','ngMaterial']);

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

  $rootScope.$on('showDialog', function(event, args) {
  	$scope.showDialog(event);
  });

  $scope.showDialog = function(event) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/template/dialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
    });
  };
});


dumplingApp.controller('graphCtrl', function($scope, $mdDialog,$rootScope) {
  $scope.clickSphere = function (event){
  	 $rootScope.$broadcast('showDialog', event);
  }
});


function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
};

