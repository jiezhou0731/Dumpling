var createCompanies = function(list,objectContainer){
	var centers=[
		new THREE.Vector3(-12, 12, -60),
		new THREE.Vector3(30, -12, -40),
		new THREE.Vector3(-12, -12, -20),
		new THREE.Vector3(12, 30, 0),
        new THREE.Vector3(-20, -20, 10),
        new THREE.Vector3(30, 0, 20),
        new THREE.Vector3(-20, -12, 45),
        new THREE.Vector3(-30, -12, 45),
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
		new THREE.Vector3(-40, 22, -37), //5
		new THREE.Vector3(0, 22, -37),//6
		new THREE.Vector3(0, -10, -50), //2
		new THREE.Vector3(20, 10, -20), //8
        new THREE.Vector3(50,0, -70),//3
        new THREE.Vector3(20,0, -70),//10
        new THREE.Vector3(-60, -10, 0),//21
        new THREE.Vector3(21, -21, -11),//102
        new THREE.Vector3(0,0, 0),
        new THREE.Vector3(0,0, 0),
        new THREE.Vector3(0,0, 0),
        new THREE.Vector3(0,0, 0)
	];

	for (var i=0; i<8; i++){//i<list.length; i++){
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
        try {
    	var newObject= andrewThree.Link({
    		sourceId : list[i]['sourceid'],
    		targetId : list[i]['destid']
    	});
    	objectContainer.push(newObject);
        } catch (exception) {

        }
    }
}


var test;
var clock;
var camera;
var scene;
var objectContainer;
var trackballControls;

function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xFFFFFF, 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = true;

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 150;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    trackballControls = new THREE.TrackballControls(camera);

    trackballControls.rotateSpeed = 0.5;
    trackballControls.zoomSpeed = 1.0;
    trackballControls.panSpeed = 1.0;
    trackballControls.staticMoving = false;


    objectContainer=andrewThree.ObjectContainer();        

   

    document.getElementById("graph").appendChild(webGLRenderer.domElement);

    var projector = new THREE.Projector();
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);


    // Tween
    /*
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    var rabbit = { x: 0, y: -20 };
    new TWEEN.Tween( rabbit ).to( { x: 0, y: 20 }, 3000 ).easing(TWEEN.Easing.Circular.InOut).onUpdate( function() {
        console.log(this);
                plane.position.x = this.x;
                plane.position.y = this.y;
            } ).start();
    scene.add(plane);
    */

    render();

    function render() {
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);

        var delta = clock.getDelta();
        trackballControls.update(delta);

        objectContainer.render();
    }
}
//window.onload = init;


var projector = new THREE.Projector();

var touchedFingerNumber=0;
var lastTouchTime;
function onDocumentTouchStart(event) {
    touchedFingerNumber++;
    var currentTouchTime = Date.now();
    if (lastTouchTime!=undefined && (currentTouchTime - lastTouchTime<300) && touchedFingerNumber<2){
        trackballControls.reset();
    } 
    lastTouchTime=currentTouchTime;
}
function onDocumentTouchEnd(event) {
    touchedFingerNumber--;
}

var lastClickTime=0;
function onDocumentMouseDown(event) {
    var currentClickTime = Date.now();
    if (currentClickTime-lastClickTime<300){
        trackballControls.reset();
    } 
    lastClickTime=currentClickTime;
    /*
    // Click disappear 
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(objectContainer.clickableList);
    if (intersects.length > 0) {
        intersects[0].object.clicked();
    }*/
}

var updateStructure = function(){
    init();
    objectContainer.removeAll(scene);

    var createObjects=function (){
        createCompanies(json["companies"],objectContainer);
        createProducts(json["products"],objectContainer);
        createLinks(json["links"],objectContainer);
    }
    $.when(createObjects()).then(function(){
        objectContainer.addTo(scene);

    });
}