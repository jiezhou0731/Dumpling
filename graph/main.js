var createCompanies = function(list,objectContainer){
	var centers=[
		new THREE.Vector3(12, 12, 15),
		new THREE.Vector3(12, -12, 5),
		new THREE.Vector3(-12, -12, -15),
		new THREE.Vector3(-12, 12, -5)
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
		new THREE.Vector3(50, 20, 10),
		new THREE.Vector3(50, -20, 2),
		new THREE.Vector3(-50, -20, -10),
		new THREE.Vector3(-50, 20, -2),
		new THREE.Vector3(0, 40, -2),
		new THREE.Vector3(0, -40, -2)
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
    var newObject= andrewThree.Link();
    //objectContainer.push(newObject);
     //   scene.add(arrow);
}