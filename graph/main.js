var createCompanies = function(list,objectContainer){
	var centers=[
		new THREE.Vector3(-12, 12, -5),
		new THREE.Vector3(30, -12, 5),
		new THREE.Vector3(-12, -12, -30),
		new THREE.Vector3(12, 12, 45)
	];
	for (var i=0; i<list.length; i++){
		var arg={};
	    arg.data = list[i];
	    arg.data.fatherNodeName=arg.data.type;
	    delete arg.data.type;

	    arg.center = centers[i];
	    var newObject = andrewThree.SurroundedSphere(arg);
	    objectContainer.push(newObject);
    }
}

var createProducts = function(list,objectContainer){
	var centers=[
		new THREE.Vector3(50, 20, -20),
		new THREE.Vector3(50, -20, 20),
		new THREE.Vector3(-50, -20, -20),
		new THREE.Vector3(-50, 20, -10),
		new THREE.Vector3(0, 40, -60),
		new THREE.Vector3(0, -40, -20)
	];
	for (var i=0; i<list.length; i++){
		var arg={};
	    arg.data = list[i];
	    arg.data.fatherNodeName="Product";
	    delete arg.data.type;

	    arg.center = centers[i];
	    var newObject = andrewThree.SurroundedSphere(arg);
	    objectContainer.push(newObject);
    }
}

var createLinks = function(list,objectContainer){

	for (var i=0; i<list.length; i++){
    	var newObject= andrewThree.Link({
    		sourceId : list[i]['sourceid'],
    		targetId : list[i]['destid']
    	});
    	objectContainer.push(newObject);
    }

    /* Find good links
    for (var i=1; i<=4; i++){
    	for (var j=5;j<=10;j++){
    		var newObject= andrewThree.Link({
    		sourceId : j,
    		targetId : i
	    	});
	    	objectContainer.push(newObject);	
    	}
    }*/
}