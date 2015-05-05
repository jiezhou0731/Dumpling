var dumplingApp = angular.module('dumplingApp',['ngAnimate','ngSanitize']);

var fetchFromMemexLiveStreamUrl='index.php?r=crawler/fetchFromMemexLiveStream';
var generateCrawlerModelUrl='index.php?r=crawler/generateCrawlerModel';

dumplingApp.service('phpService',function($http,$sce, $q){
	this.generateCrawlerModel = function (limit){
		 var defer = $q.defer();
		 $http(
		            {method: 'json',
		             url: generateCrawlerModelUrl,
		             params:{
		                    }
		            })
		            .success(function(response) {
		            	data=response;
		            	for (var i in data.positive) {
		            		data.positive[i]=unescape(data.positive[i]);
		      			}
		            	for (var i in data.negative) {
		            		data.negative[i]=unescape(data.negative[i]);
		      			}
		              	defer.resolve(data);
		            }).error(function() {
		            	defer.reject('Can not connect to PHP server');
		 });
		 return defer.promise;;
	}
	
	this.fetchFromMemexLiveStream = function (limit){
		 var defer = $q.defer();
		 $http(
		            {method: 'json',
		             url: fetchFromMemexLiveStreamUrl,
		             params:{
		            	 "limit":limit
		                    }
		            })
		            .success(function(response) {
		            	data=response;
		              	defer.resolve(data);
		            }).error(function() {
		            	defer.reject('Can not connect to PHP server');
		 });
		 return defer.promise;;
	}
});


// NYU crawler result controller
dumplingApp.controller('nyuCrawlerController', function($scope, $rootScope, $sce, phpService) {
	$scope.modelState = "NO";
	$scope.generateCrawlerModel=function(){
		$scope.modelState = "CREATING";
		phpService.generateCrawlerModel().then(function (data){
			$scope.reponse = data;
			$scope.modelState = "YES";
		});
	};
});


// Memex Live Stream controller
dumplingApp.controller('memexLiveStreamController', function($scope, $rootScope, $sce, phpService) {
	$scope.state = "NO";
	$scope.fetchFromMemexLiveStream=function(){
		$scope.state = "FETCHING";
		var limit=Math.round($('#slider').val().substring(0,$('#slider').val().length-2));
		phpService.fetchFromMemexLiveStream(limit).then(function (data){
			$scope.reponse = data;
			$scope.state = "YES";
		});
	};
});

