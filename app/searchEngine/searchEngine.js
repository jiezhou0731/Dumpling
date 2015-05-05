var dumplingApp = angular.module('dumplingApp',['ngAnimate','ngSanitize']);
var solrQueryUrl = 'http://141.161.20.98:8080/solr/humantrafficking/winwin';

var phpUploadInteractionUrl='index.php?r=index/postEvent';
var phpGetFullPageUrl='index.php?r=searchEngine/downloadFullPage';

dumplingApp.service('phpService',function($http,$sce, $q){
	this.uploadInteraction = function (event){
		 var defer = $q.defer();
		 $http(
		            {method: 'json',
		             url: phpUploadInteractionUrl,
		             params:{
		            	 	'event_title': event.title,
		            	    'event_detail': event.detail,
		            	    'event_extra_1': escape(event.extra_1),
		            	    'event_extra_2': event.extra_2
		                    }
		            })
		            .success(function(data) {
		              	defer.resolve();
		            }).error(function() {
		            	defer.reject('Can not connect to PHP server');
		 });
		 return defer.promise;;
	}
	
	this.getFullPage = function (pageUrl){
		 var defer = $q.defer();
		 $http(
		            {method: 'json',
		             url: phpGetFullPageUrl,
		             params:{
		            	 'url':pageUrl
		                    }
		            })
		            .success(function(data) {
		              	defer.resolve(data);
		            }).error(function() {
		            	defer.reject('Can not connect to PHP server');
		 });
		 return defer.promise;;
	}
});

dumplingApp.service('solrService',function($http,$sce, $q){
	this.sendUpVote = function (doc){
		console.log("up vote sent");
	}
	this.sendDownVote = function (doc){
		console.log("down vote sent");
	}
	
	this.clearHistory = function (query){
		 var defer = $q.defer();
		 $http(
		            {method: 'JSONP',
		             url: solrQueryUrl,
		             params:{
		            	 	'q': 'content:'+"placeholder",
		            	    'json.wrf': 'JSON_CALLBACK',
		                    'wt':'json',
		                    'clearHistory':"true"
		                    }
		            })
		            .success(function(response) {
		              	defer.resolve();
		            }).error(function() {
		            	defer.reject('Can not get data from Solr');
		 });
		 return defer.promise;;
	}
	
	this.queryData = function (query,start){
		 var docs=[];
		 var defer = $q.defer();
		 $http(
		            {method: 'JSONP',
		             url: solrQueryUrl,
		             params:{
		            	 	'q': 'content:'+query,
		            	    'json.wrf': 'JSON_CALLBACK',
		                    'wt':'json',
		                    'hl':true,
		                    'hl.fl':'*',
		                    'hl.simple.pre':'',
		                    'hl.simple.post':'',
		                    'hl.fragsize':500,
		                    'row':10,
		                    'start':start
		                    }
		            })
		            .success(function(response) {
		            	userState = response.state;
		            	docs= response.response.docs;
		              	for (var prop in  response.highlighting) {
		            	  	for (var doc in docs){
		            		  	if (docs[doc].id==prop){
		            		  		try {
		            		  			docs[doc].highlighting=highlight(response.highlighting[prop].content[0],query);
		            		  		} catch (err){
		            		  			docs[doc].highlighting="";
		            		  		}
		            		  	}
		            	  	}
		              	}
		              	for (var i in docs) {
		      				// Convert NULL title to "No Title"
		      				if (docs[i].title==null ||docs[i].title=="") {
		      					docs[i].title="No Title";
		      				}
		      			
		      				// Unescape highlights' HTML 
		      				try{
		      					docs[i].highlighting=$sce.trustAsHtml(docs[i].highlighting.trim());
		      				} catch (err){
		      				}
		      				docs[i].escapedUlr=docs[i].url;
		      				docs[i].url=unescape(docs[i].url);
		      				$sce.trustAsResourceUrl(docs[i].url);
		      				docs[i].upVote=null;
		      				docs[i].downVote=null;
		      			}
		              	data = {userState:userState, docs:docs};
		              	defer.resolve(data);
		            }).error(function() {
		            	defer.reject('Can not get data from Solr');
		 });
		 return defer.promise;;
	}
});

// Search controller
dumplingApp.controller('searchBoxController', function($rootScope, $scope, $sce, solrService) {
	$rootScope.lastQuery="";
	
	$scope.clickSubmit=function(){
		$rootScope.lastQuery=$scope.query;
		$rootScope.page = 1;
		$rootScope.$broadcast('sendQuery',{query:$scope.query, start:($rootScope.page-1)*$rootScope.resultPerPage});
		$rootScope.$broadcast('interactionEmit',{title:"Send query", detail:"Query: "+$scope.query});
	};
	
	$scope.clearHistory=function(){
		solrService.clearHistory();
		$rootScope.stateHistory=[];
		$rootScope.readDocEvents=[]
		$rootScope.docs=[];
		$rootScope.$broadcast('interactionEmit',{title:"Clear history", detail:""});
	}
	
});

// Dynamic result controller
dumplingApp.controller('dynamicController', function($scope, $rootScope, $sce, solrService) {
	// Click doc content
	$scope.clickContent=function(doc){
		$rootScope.readDocEvents.push({id:doc.id,url:doc.escapedUlr, content:"", startTime:Date.now()});
		$rootScope.$broadcast('overlayDisplay',{title:doc.title, url:doc.url, content:doc.content});
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
	
	// Debug
	/*
	solrService.queryData("a").then(function (data){
		$rootScope.docs = data.docs;
		$rootScope.stateHistory.push({query:"a", transition: ""});
	});
	*/
	// Prepare to start
	$rootScope.readDocEvents=[];
	$rootScope.docs=[];
	
	// When user send a new query.
	$scope.$on('sendQuery',function(event, args){
		$rootScope.readDocEvents=[];
		solrService.queryData(args.query, args.start).then(function (data){
			var transition;
			if (data.userState=="RELEVANT_EXPLOITATION"){
				transition="Find out more";
			} else {
				transition="Next topic";
			}
			$rootScope.docs = data.docs;
			$rootScope.stateHistory.push({query:args.query, transition: transition});
		});
	});
	
	// When user send a new query.
	$scope.$on('changePage',function(event, args){
		$rootScope.readDocEvents=[];
		solrService.queryData(args.query, args.start).then(function (data){
			$rootScope.docs = data.docs;
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
	
	$scope.clickNextPage = function(){
		if ($rootScope.docs.length>=$rootScope.resultPerPage){
			$rootScope.page++;
			$rootScope.$broadcast('changePage',{query:$rootScope.lastQuery, start:($rootScope.page-1)*$rootScope.resultPerPage});
			$rootScope.$broadcast('interactionEmit',{title:"Change page", detail:"Query: "+$rootScope.lastQuery+", Page:"+$rootScope.page});
		}
	}
});

// User state track controller
dumplingApp.controller('userStateController', function($scope, $rootScope) {
	$rootScope.stateHistory=[];
	
	// Scroll down to button
	$rootScope.$watch("stateHistory",function(){
		$('#userStateController').animate({scrollTop:$('#userStateController')[0].scrollHeight}, '600');
	},true);
});

//User state track controller
dumplingApp.controller('feedbackController', function($scope, $rootScope) {
	$scope.noExplicitFeedback = function (){
		if (!$rootScope.docs) return true;
		for (var i=0; i<$rootScope.docs.length; i++){
			if ($rootScope.docs[i].upVote=="checked" 
				|| $rootScope.docs[i].downVote=="checked") 
				return false;
		}
		return true;
	}
	$scope.noImplicitFeedback = function (){
		if (!$rootScope.readDocEvents) return true;
		if ($rootScope.readDocEvents.length>0) return false;
		return true;
	}
	$scope.isRelevant = function(item){
	    return item.upVote;
	};
	$scope.isOffTopic = function(item){
	    return item.downVote;
	};
});


// User interaction track controller
dumplingApp.controller('userInteractionController', function($scope, $rootScope, phpService) {
	$scope.interactionHistory=[];
	
	// Other controllers emit interactions, and this controller will catch them.
	$scope.$on('interactionEmit',function(event, args){
		phpService.uploadInteraction(args);
		$scope.interactionHistory.push(args);
		var h=$("#userInteractionList").children().first().height();
		$("#userInteractionList").css('margin-top',-h);
		$( "#userInteractionList" ).animate({"margin-top": "0px"}, 300);
	});
});

// Preference controller
dumplingApp.controller('preferenceController', function($scope, $rootScope) {
	$rootScope.preference = {};
	
	$rootScope.preference.userStatePanelDisplay="checked";
	$rootScope.preference.userInteractionPanelDisplay="checked";
	
	$scope.switchCheckbox=function(event,item){
		if ($rootScope.preference[item] == "checked") {
			$rootScope.preference[item] = null;
		} else {
			$rootScope.preference[item] = "checked";
		}
		event.stopPropagation();
	};
});

// Overlay controller
dumplingApp.controller('overlayController', function($scope, $rootScope,$sce , phpService) {
	$rootScope.$on('overlayDisplay',function(event, args){
		$scope.doc={};
		$scope.doc.url = args.url;
		$scope.doc.title = args.title;
		var maxTitleLength=200;
		if ($scope.doc.title.length>maxTitleLength){
			$scope.doc.title=$scope.doc.title.substring(0, maxTitleLength)+"...";
		}
		
		$scope.fullPageLoading="LOADING";
		$scope.beginLoading();
		
		$scope.imageBlur = true;
		phpService.getFullPage(args.url).then(function (data){
			var path = unescape(data.path.dirname)+escape(data.path.basename);
			if (path!="//"){
				$scope.fullPagePath = path+ "?timestamp="+Date.now();
				$sce.trustAsResourceUrl($scope.fullPagePath);
			} else {
				$scope.failLoading();
			}
			//document.getElementById("full_webpage_iframe").contentDocument.location.reload(true);
		});
		
		$(".andrew-overlay").trigger('andrew_overlay_show');
	});

	$scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	}
	
	$scope.hideOverlay = function(){
		$rootScope.readDocEvents[$rootScope.readDocEvents.length-1].duration=
			((Date.now()-$rootScope.readDocEvents[$rootScope.readDocEvents.length-1].startTime)*1.0/ 1000)*1.0;
		var event = $rootScope.readDocEvents[$rootScope.readDocEvents.length-1];
		$rootScope.$broadcast('interactionEmit',
				{title:"Read Doc", detail:"Doc ID:"+event.id+"; "+" Duration: "+event.duration+"s", extra_1:event.url, extra_2:event.content});
	}
	
	$scope.blurImage = function (){
		$scope.imageBlur = true;
		$("iframe").contents().find('img').each(function(){
			$(this).foggy({
				 blurRadius: 8,          // In pixels.
				 opacity: 1, 
			});
		});
	}
	$scope.unBlurImage = function (){
		$scope.imageBlur = false;
		$("#full_webpage_iframe").contents().find('img').each(function(){
			$(this).foggy({
				 blurRadius: 0,          // In pixels.
				 opacity: 1, 
			});
		});
	}
	
	$scope.beginLoading = function(){
		$("#full_webpage_iframe").hide();
		$('.full_webpage_loading').show();
		$(".full_webpage_fail").hide();
	}
	
	$scope.finishLoading = function(){
		var height = $(".andrew-overlay-scene").css("height");
		height = height.replace("px","");
		height = height -200;
		height = ""+height+"px";
		$("#full_webpage_iframe").css("height",height);
		$("#full_webpage_iframe").show();
		$(".full_webpage_fail").hide();
		$('.full_webpage_loading').hide();
		
	}
	
	$scope.failLoading = function(){
		$("#full_webpage_iframe").hide();
		$(".full_webpage_fail").show();
		$('.full_webpage_loading').hide();
		
	}
	
	$("#full_webpage_iframe").on("load", function () {
		$scope.blurImage();
		$scope.finishLoading();
	})
	
	$scope.highlightContent = function(){
		$("#full_webpage_iframe")
			.contents().find("body").contents()
			.filter(function(){
				if ($(this).text().indexOf("a")!=-1) {
					return true;
				}
				return false;
			})
			.wrap("<div class='direwolf-tag'></div>");
		$("#full_webpage_iframe")
		.contents().find(".direwolf-tag").each(function(){
			$(this).html(highlight($(this).html(),"Aline"));
		});
	}
});

//Highlight all the keywords in target string.
var highlight_colors = ["#D35400","#663399", "#DB0A5B", "#1F3A93","#96281B","#D2527F","#674172"];
function highlight(target, keyword){
	if (target==undefined){
		return "";
	}
	if (target instanceof Array){
		target=target[0];
	}
	var keywords=keyword.split(" ");
	for (var i = 0; i < keywords.length; i++) {
		keyword=keywords[i];
		reg = new RegExp(keyword, 'gi');
		target = target.replace(reg, '<span class="highlight" style="color:'+highlight_colors[i%highlight_colors.length]+'">'+keyword+'</span>');
	}
	
	return target;
}

