var dumplingApp = angular.module('dumplingApp',['ngAnimate','ngSanitize','ngCookies', 'ngMaterial', 'ngDragDrop','countrySelect']);


var solrQueryUrl = 'http://141.161.20.98:8080/solr/counterfeit/winwin';
var solrSelectQueryUrl = 'http://141.161.20.98:8080/solr/counterfeit/select';
/*
var topicTreeUrl = "http://141.161.20.98/python_cgi/topicTree.cgi";
var subtopicUrl = "http://141.161.20.98/python_cgi/subtopic.cgi";
var parseBatchQueryUrl = "http://141.161.20.98/python_cgi/fileParse.cgi";
var parseBatchQueryUrl = "http://69.243.108.43/~jie/direwolf/pythonCgi/fileParse.cgi";
*/
var topicTreeUrl = "http://141.161.20.98/direwolf/pythonCgi/topicTree.cgi";
var subtopicUrl = "http://141.161.20.98/direwolf/pythonCgi/subtopic.cgi";
var parseBatchQueryUrl = "http://141.161.20.98/direwolf/pythonCgi/fileParse.cgi";
var pythonSearch = 'http://141.161.20.98/direwolf/pythonCgi/pattern_handler.cgi';


var phpUploadInteractionUrl='index.php?r=index/postEvent';
var phpGetFullPageUrl='index.php?r=searchEngine/downloadFullPage';

dumplingApp.service('phpService',function($http,$sce, $q,$rootScope){
	$rootScope.nextInNavi="search";
	$rootScope.clickEnter = function(){
		$rootScope.$broadcast('outterControllerClickSubmit');
	}

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

dumplingApp.service('pythonService',function($http,$sce, $q,$rootScope){
	this.queryData = function (args){
		 var defer = $q.defer();
		 console.log(args);
		 $.ajax({
		 	method: 'post',
		 	url: pythonSearch,
		 	data:
		 		{
		 		drop_str: args
		 		},
		 	success: function(response){
		 		response=angular.fromJson(response);

		 		docs= response.response.docs;
		 		for (var i in docs) {
		      				// Convert NULL title to "No Title"
		      				if (docs[i].title==null ||docs[i].title=="") {
		      					docs[i].title="No Title";
		      				}

		      				// Unescape highlights' HTML 
		      				try{
		      					docs[i].highlighting=getSnippet(docs[i].content, args);
		      				} catch (err){
		      				}

		      		
		      				docs[i].content=$sce.trustAsHtml(highlight(docs[i].content,args));
		      				docs[i].escapedUlr=docs[i].url;
		      				docs[i].url=unescape(docs[i].url);
		      				$sce.trustAsResourceUrl(docs[i].url);
		      				docs[i].upVote=null;
		      				docs[i].downVote=null;
		      			}
		      			data = {docs:docs, numFound:response.response.numFound};

		 		//$rootScope.$broadcast('gotTopicTree',response.topics);
            	//resetCavas(topics);
              	defer.resolve(data);
		 	},
		 	error: function(){
		 		defer.reject('Can not connect to server');
		 	}
		 });
		 return defer.promise;;
	}
});

dumplingApp.service('topicService',function($http,$sce, $q,$rootScope){
	this.getTopicTree = function (args){
		 var defer = $q.defer();
		 console.log(args);
		 $.ajax({
		 	method: 'post',
		 	url: topicTreeUrl,
		 	data:
		 		{
		 		data: args
		 		},
		 	success: function(response){
		 		console.log(response);
		 		response=angular.fromJson(response);
		 		$rootScope.$broadcast('gotTopicTree',response.topics);
            	//resetCavas(topics);
              	defer.resolve();
		 	},
		 	error: function(){
		 		defer.reject('Can not connect to server');
		 	}
		 });
		 return defer.promise;;
	}

	this.getSubtopicDocs = function (args){
		 var defer = $q.defer();
		 console.log(args);
		 $.ajax({
		 	method: 'post',
		 	url: subtopicUrl,
		 	data:
		 		{
		 		data: args
		 		},
		 	success: function(response){
		 		console.log(response);
		 		response=angular.fromJson(response);
		 		$rootScope.$broadcast('gotSubtopicDocs',response);
            	//resetCavas(topics);
              	defer.resolve();
		 	},
		 	error: function(){
		 		defer.reject('Can not connect to server');
		 	}
		 });
		 return defer.promise;;
	}
});

dumplingApp.service('solrService',function($http,$sce, $q,$rootScope){
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
	
	this.queryMore = function (query,start,status){
		 var defer = $q.defer();
		var url=solrQueryUrl;
		$http(
		            {method: 'JSONP',
		             url: url,
		             params:{
		            	 	'q': "*:*",
		            	    'json.wrf': 'JSON_CALLBACK',
		                    'wt':'json',
		                    'hl':true,
		                    'hl.fl':'*',
		                    'hl.simple.pre':'',
		                    'hl.simple.post':'',
		                    'hl.fragsize':500,
		                    'row':10,
		                    'start':start,
		                    'status':status
		                    }
		            })
		            .success(function(response) {
		            	docs= response.response.docs;
		              	for (var prop in  response.highlighting) {
		            	  	for (var doc in docs){
		            		  	if (docs[doc].id==prop){
		            		  		try {
		            		  			docs[doc].highlighting=docs[doc].content;
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
		      				docs[i].content=unescape(docs[i].content);
		      				docs[i].content=$sce.trustAsHtml(docs[i].content);
		      				docs[i].escapedUlr=docs[i].url;
		      				docs[i].url=unescape(docs[i].url);
		      				$sce.trustAsResourceUrl(docs[i].url);
		      				docs[i].upVote=null;
		      				docs[i].downVote=null;
		      			}
		              	data = {docs:docs, numFound:response.response.numFound};
		              	defer.resolve(data);
		            }).error(function() {
		            	defer.reject('Can not get data from Solr');
		 });
		 return defer.promise;;
	}

	this.queryData = function (query,start,status){
		if (status!="oldQuery" && query==$rootScope.hackDoubleQuery){
			return;
		}
		$rootScope.cubeTestImageNumber=($rootScope.cubeTestImageNumber+1)%10;
		$rootScope.nextInNavi="nextPage";
		$rootScope.hackDoubleQuery=query;
		
		 var docs=[];
		 var defer = $q.defer();
		 var excludeKeywords={};
		 excludeKeywords.content = null;
		 excludeKeywords.title = null;
		 /*
		 if ($rootScope.queryAdvanced.exclude!=undefined && $rootScope.queryAdvanced.exclude.length>0){
			 excludeKeywords.content="-content:";
			 excludeKeywords.title = "-title:";
			 excludeKeywords.content+=$rootScope.queryAdvanced.exclude.replace(/ /g, '+');
			 excludeKeywords.title+=$rootScope.queryAdvanced.exclude.replace(/ /g, '+');
		 }*/
		
		 var url=solrQueryUrl;
		 if ($rootScope.queryMode=="structural"){
			 var old=query;
			 query=convertStructuralQuery(query);
			 // only /select support structural query.
			 if (query!=old){
				 url=solrSelectQueryUrl;
			 } 
		 } else {
			 query='content:'+query;
		 }
		 
		 $http(
		            {method: 'JSONP',
		             url: url,
		             params:{
		            	 	'q': query,
		            	    'json.wrf': 'JSON_CALLBACK',
		                    'wt':'json',
		                    'hl':true,
		                    'fq':excludeKeywords.content,
		                    'fq':excludeKeywords.title,
		                    'hl.fl':'*',
		                    'hl.simple.pre':'',
		                    'hl.simple.post':'',
		                    'hl.fragsize':500,
		                    'row':10,
		                    'start':start,
		                    'status':status
		                    }
		            })
		            .success(function(response) {
		            	userState = response.state;
		            	docs= response.response.docs;
		            	/*
		            	if ($rootScope.docs.length!=$rootScope.resultPerPage){
		            		$rootScope.nextInNavi="search";
		            	} else {
		            		$rootScope.nextInNavi="nextPage";
		            	}*/
		            	$rootScope.nextInNavi="nextPage";
		            	console.log($rootScope.nextInNavi);
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
		      				docs[i].content=unescape(docs[i].content);
		      				docs[i].content=$sce.trustAsHtml(highlight(docs[i].content,query));
		      				docs[i].escapedUlr=docs[i].url;
		      				docs[i].url=unescape(docs[i].url);
		      				$sce.trustAsResourceUrl(docs[i].url);
		      				docs[i].upVote=null;
		      				docs[i].downVote=null;
		      			}
		              	data = {userState:userState, docs:docs, numFound:response.response.numFound};
		              	defer.resolve(data);
		            }).error(function() {
		            	defer.reject('Can not get data from Solr');
		 });
		 return defer.promise;;
	}
});

// Cookie
dumplingApp.service('rootCookie',function($rootScope,$cookies){
	this.get = function (key){
		var value = $cookies.getObject(key);
		if (value){
			return value;	
		} else {
			if (key=="interactionHistory" || key=="stateHistory") {
				return [];
			} else if (key=="lastQuery"){
				return "";
			}
			return {};
		}
	}
	this.put = function (key,value){
		if (key=="interactionHistory"){
			var maxLength=6
			if (value.length>maxLength) {
				var slicedValue = [];
				for (var i=value.length-maxLength; i<value.length; i++){
					slicedValue.push(value[i]);
				}
				$cookies.putObject(key,slicedValue);
			} else {
				$cookies.putObject(key,value);
			}
		} else {
			$cookies.putObject(key,value);
		}
	}
});


// Search controller
dumplingApp.controller('searchBoxController', function(rootCookie, $rootScope, $cookies, $scope, $sce, solrService) {
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
	        	console.log(batchQueries[i]);
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
	
});

// topics result controller
dumplingApp.controller('topicController', function(topicService, rootCookie,$scope, $rootScope, $sce, solrService) {

	$scope.$on('gotTopicTree',function(event, args){
		$scope.topics = args;
		$scope.$apply();
	});
	$scope.$on('gotSubtopicDocs',function(event, args){
		$scope.subtopicDocs = args;
		$scope.$apply();
	});

	$scope.$watch('topics', function() {
   	  if ($scope.topics!=undefined && $scope.topics[0]!=undefined
   	  	 && $scope.topics[0].subtopics!=undefined && $scope.topics[0].subtopics[0]!=undefined ) {
	  	 $scope.clickSubtopic( $scope.topics[0].subtopics[0].subtopic_id);
	  }
   });

	$scope.clickSubtopic = function(subtopic_id){
		var args={};
		args.subtopic_id=subtopic_id;
		topicService.getSubtopicDocs(angular.toJson(args));
	}
	$scope.clickSubtopicDoc = function(subtopic_id){
		var args={};
		args.subtopic_id=subtopic_id;
		topicService.getSubtopicDocs(angular.toJson(args));
	}
});

//doc detail
dumplingApp.controller('docDetailController', function(rootCookie,topicService, pythonService,$scope, $rootScope) {
	$scope.$on('displayNewDocOnDocDetailPanel',function(event, args){
		$("#docDetailPanel").scrollTop();
		$scope.doc=args;
	});

  	$scope.selectedText = "";
  	$scope.selectedTextPosition={};

  	$scope.droppedTextList = {};

	$scope.getSelectionText = function(event) {
		$scope.selectedTextPosition.left=event.offsetX;
		$scope.selectedTextPosition.top=event.offsetY+30;
		snapSelectionToWord();
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }	
        $scope.selectedText=text.trim();
        return text;
	};

	$scope.indicateDropPlace = function(turnOn){
		if (turnOn==true){
			$scope.dropCover=true;
			//$scope.coverBackgroundColor="red";
		} else {
			$scope.dropCover=false;
			//$scope.coverBackgroundColor="transparent";
		}
	}

	$scope.selectedText="";
    $scope.droppedTextArray=[];
    $scope.onDrop = function($event,$data){
    	$scope.indicateDropPlace(false);
    	$scope.selectedText = "";
        $scope.droppedTextArray.push($data);
        $('#dropTextBox').animate({scrollTop:$('#dropTextBox')[0].scrollHeight}, '600');
      };

    $scope.clickDroppedText=function(text){
    	pythonService.queryData(text).then(function (data){
			$rootScope.docs = data.docs;
			var subtopicPostJson={};
			subtopicPostJson.docno=new Array();
			for (var i=0; i<data.docs.length; i++){
				subtopicPostJson.docno.push(data.docs[i].id);
			}
			topicService.getTopicTree(angular.toJson(subtopicPostJson));

			$rootScope.stateHistory.push({query:text, transition: "Relevant. Find out more."});
	        //$rootScope.$apply();
	        rootCookie.put("stateHistory",$rootScope.stateHistory);
		});
    }
});

dropText = function(event, ui) {
  };
// Dynamic result controller
dumplingApp.controller('dynamicController', function(topicService, rootCookie,$scope, $rootScope, $sce, solrService) {
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
			
			topicService.getTopicTree(angular.toJson(subtopicPostJson));
			
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
				$rootScope.stateHistory.push({query:args.query, transition: transition});
			}
			rootCookie.put("stateHistory",$rootScope.stateHistory);
		});
	});
	
	// When user send a new query.
	$scope.$on('changePage',function(event, args){
		console.log("11111111111");
		$rootScope.readDocEvents=[];
		solrService.queryData(args.query, args.start, "oldQuery").then(function (data){
			$rootScope.docs = data.docs;
			
			console.log("dd");
			var subtopicPostJson={};
			subtopicPostJson.docno=new Array();
			for (var i=0; i<data.docs.length; i++){
				subtopicPostJson.docno.push(data.docs[i].id);
			}
			topicService.getTopicTree(angular.toJson(subtopicPostJson));
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
			topicService.getTopicTree(angular.toJson(subtopicPostJson));

			$rootScope.stateHistory.push({query:"Paw", transition: "Relevant. Find out more."});
	        $rootScope.$apply();
	        rootCookie.put("stateHistory",$rootScope.stateHistory);
		});
	}
});

// User state track controller
dumplingApp.controller('userStateController', function(solrService,topicService,rootCookie,$scope, $rootScope) {
	$rootScope.stateHistory=[];//rootCookie.get("stateHistory");
	
	// Scroll down to bottom
	$rootScope.$watch("stateHistory",function(){
		$('#userStateController').animate({scrollTop:$('#userStateController')[0].scrollHeight}, '600');
	},true);

	$scope.clickPreviousQuery= function(clickedQuery){
		if (clickedQuery=="Paw"){
			$rootScope.queryMoreStart++;
			solrService.queryMore("*", $rootScope.queryMoreStart, "oldQuery").then(function (data){
			$rootScope.docs = data.docs;
			var subtopicPostJson={};
			subtopicPostJson.docno=new Array();
			for (var i=0; i<data.docs.length; i++){
				subtopicPostJson.docno.push(data.docs[i].id);
			}
			topicService.getTopicTree(angular.toJson(subtopicPostJson));
	        rootCookie.put("stateHistory",$rootScope.stateHistory);
		});
	        return;
		}
		$rootScope.outterControllerQuery=clickedQuery;
		$rootScope.doNotAddToUserStates = true;
		$rootScope.$broadcast('outterControllerClickSubmit');
		console.log(clickedQuery);
	}
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
dumplingApp.controller('userInteractionController', function(rootCookie,$scope, $rootScope, phpService) {
	$scope.interactionHistory=rootCookie.get("interactionHistory");
	
	// Other controllers emit interactions, and this controller will catch them.
	$scope.$on('interactionEmit',function(event, args){
		// Set next query state to relevant;
		if (args.title=="Read Doc" || args.title=="Vote Up" || args.title=="Change page" ){
			$rootScope.lastQueryIsRelevant=true;
		}
		
		phpService.uploadInteraction(args);
		$scope.interactionHistory.push(args);
		rootCookie.put("interactionHistory",$scope.interactionHistory);
		var h=$("#userInteractionList").children().first().height();
		$("#userInteractionList").css('margin-top',-h);
		$( "#userInteractionList" ).animate({"margin-top": "0px"}, 300);
	});
});

// Preference controller
dumplingApp.controller('preferenceController', function(rootCookie, $scope, $rootScope) {
	if (rootCookie.get("preference").userStatePanelDisplay!==undefined 
		||rootCookie.get("preference").userInteractionPanelDisplay!==undefined ) {
		$rootScope.preference=rootCookie.get("preference");
	} else {
		$rootScope.preference = {};
		$rootScope.preference.userStatePanelDisplay="checked";
		$rootScope.preference.userInteractionPanelDisplay="checked";
		rootCookie.put("preference",$rootScope.preference);
	}
	
	$scope.switchCheckbox=function(event,item){
		if ($rootScope.preference[item] == "checked") {
			$rootScope.preference[item] = null;
		} else {
			$rootScope.preference[item] = "checked";
		}
		rootCookie.put("preference",$rootScope.preference);
		event.stopPropagation();
	};
});

// Preference controller
dumplingApp.controller('cubeTestImageController', function(rootCookie, $scope, $rootScope) {
	$rootScope.cubeTestImageNumber=0;
});

// Overlay controller
dumplingApp.controller('overlayController', function($scope, $rootScope,$sce , phpService) {
	$rootScope.$on('overlayDisplay',function(event, args){
		$scope.doc={};
		$scope.doc.url = args.url;
		$scope.doc.title = args.title;
		$scope.doc.content = args.content;
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
		
		htmlHighlighting($("#full_webpage_iframe").contents().find("body"),$rootScope.lastQuery);
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

function htmlHighlighting(target, query){
    var re;
    var terms = query.split(/[^\w\.]+/);
    for (i=0;i<terms.length;i++){
        //if (stopwords.indexOf(terms[i].toLowerCase()) == -1 && terms[i].length>=2){
    			target.find('script').remove();
    			re1 = new RegExp('(>[^<>]*)('+ terms[i] + ')([^<>]*>)','gi');
                re2 = new RegExp('(<[^<>]*)('+ terms[i] + ')([^<>]*<)','gi');
                re3 = new RegExp('(>[^<>]*)('+ terms[i] + ')([^<>]*<)','gi');
                target.html(target.html().replace(re1, '$1<span style="background-color:#DB0A5B;color:white;padding:2px;" >$2</span>$3').toString());
                target.html(target.html().replace(re2, '$1<span style="background-color:#DB0A5B;color:white;padding:2px;">$2</span>$3').toString());
                target.html(target.html().replace(re3, '$1<span style="background-color:#DB0A5B;color:white;padding:2px;">$2</span>$3').toString());
        //};
    };
};

function checkString(str){
	if (str==undefined) {
		return "";
	} else {
		return str;
	}
}

// Convert structural query
function convertStructuralQuery(st){
    var newSt="";
    var next =nextWord(st);
    while (next!=undefined){
        newSt+=next.word;
        next =nextWord(next.st);
    }
    return newSt;
}
function nextWord(st){
    if (st==undefined || st.length==0)
        return undefined;
    var next={};
    next.word="";
    next.st="";
    if (isIgnoreOnes(st[0])){
        next.word+=st[0];
        next.st = st.substring(1);
        return next;
    }
    var i=0;
    while (i<st.length && !isIgnoreOnes(st[i])){
        next.word+=st[i];
        i++;
    }
   if (next.word.toUpperCase()!="AND"
        && next.word.toUpperCase()!="OR"
        && next.word.toUpperCase()!="NOT") {
    next.word="content:"+next.word;
   }
   next.st=st.substring(i);
    return next;
}
function isIgnoreOnes(ch){
    if (ch==" " || ch=="(" || ch==")") {
     return true;
    }
    return false;
}

function checkAphabet(text){
	if ( /^[a-z]+$/i.test (text ) ) {
    	return true;
	}
	return false;
}
function getSnippet(content, keyword){
	var query=keyword;
	keyword=keyword.replace(/\W/g, ' ');
	keyword=keyword.trim().replace(/\s\s+/g, ' ');
	if (content instanceof Array){
		content=content[0];
	}
	var keywords=keyword.split(" ");

	var charCounter=0;
	var start = content.indexOf(keywords[0]);
	var end = start+keywords[0].length;
	while (start!=0) {
		if (charCounter>200 && (checkAphabet(content.charAt(start-1))==false)) break;
		start--;
		charCounter++;
	}

	charCounter=0;
	while (end<content.length) {
		if ((charCounter>200)&& (checkAphabet(content.charAt(end))==false)) break;
		end++;
		charCounter++;
	}

	var snippit = content.substring(start, end);
	
	return highlight(snippit,query);
}

function snapSelectionToWord() {
    var sel;

    // Check for existence of window.getSelection() and that it has a
    // modify() method. IE 9 has both selection APIs but no modify() method.
    if (window.getSelection && (sel = window.getSelection()).modify) {
        sel = window.getSelection();
        if (!sel.isCollapsed) {

            // Detect if selection is backwards
            var range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);
            var backwards = range.collapsed;
            range.detach();

            // modify() works on the focus of the selection
            var endNode = sel.focusNode, endOffset = sel.focusOffset;
            sel.collapse(sel.anchorNode, sel.anchorOffset);
            
            var direction = [];
            if (backwards) {
                direction = ['backward', 'forward'];
            } else {
                direction = ['forward', 'backward'];
            }

            sel.modify("move", direction[0], "character");
            sel.modify("move", direction[1], "word");
            sel.extend(endNode, endOffset);
            sel.modify("extend", direction[1], "character");
            sel.modify("extend", direction[0], "word");
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        if (textRange.text) {
            textRange.expand("word");
            // Move the end back to not include the word's trailing space(s),
            // if necessary
            while (/\s$/.test(textRange.text)) {
                textRange.moveEnd("character", -1);
            }
            textRange.select();
        }
    }
}