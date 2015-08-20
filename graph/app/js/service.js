var pythonGetGraphStructure = 'http://141.161.20.98/direwolf/pythonCgi/getGraph.cgi';

app.service('pythonService',function($http,$sce, $q,$rootScope){
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