if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer, particles, geometry, material, i, h, color, sprite, size;
var mouseX = 0, mouseY = 0;
var raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;

var windowX = $( '#canvas' ).width();
var windowY = $('#canvas').height();
var windowHalfX = windowX/ 2;
var windowHalfY = windowY / 2;

var resetCavas=function(topics){
	var obj, i;
	for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
	    obj = scene.children[ i ];
	    if ( obj !== camera) {
	        scene.remove(obj);
	    }
	}
	
	lines=Array();
	var geometry = new THREE.Geometry();
	for ( var i=0; i<1; i++){
		var topicVertex = new THREE.Vector3();
		topicVertex.x = 0;
		topicVertex.y = 0.2*windowY;
		topicVertex.z = 200 * Math.random();
		geometry.vertices.push( topicVertex );
		topics[i].vertex=topicVertex;
		
		var yOffset=-80;
		labelExploration = makeTextSprite("Account", 
				{ fontsize: 20, borderColor: {r:46, g:204, b:113, a:1}, backgroundColor: {r:46, g:204, b:113, a:1}} );
		labelExploration.position.set(topicVertex.x,topicVertex.y+yOffset,topicVertex.z);
		labelExploration.typeForIntersection="label";
		scene.add(labelExploration);
		
		for (var j=0; j<topics[i].subtopics.length; j++) {
			var subtopicVertex = new THREE.Vector3();
			subtopicVertex.x = 2*windowX * Math.random() - windowX;
			subtopicVertex.y = 2*windowY  * Math.random() - windowY;
			subtopicVertex.z = 200 * Math.random() - 100;
			geometry.vertices.push( subtopicVertex );
			topics[i].subtopics[j].vertex=subtopicVertex;
			
			labelExploration = makeTextSprite(topics[i].subtopics[j].text, 
					{ fontsize: 20, borderColor: {r:46, g:204, b:113, a:1}, backgroundColor: {r:46, g:204, b:113, a:1}} );
			labelExploration.position.set(subtopicVertex.x,subtopicVertex.y+yOffset,subtopicVertex.z);
			scene.add(labelExploration);
			
			var line = {};
			line.startPoint=new THREE.Vector3(subtopicVertex.x, subtopicVertex.y, subtopicVertex.z);
			line.endPoint=new THREE.Vector3(topicVertex.x,topicVertex.y, topicVertex.z);
			lines.push(line);
		}	
	}
	material = new THREE.PointCloudMaterial( { size: 35, sizeAttenuation: false, map: sprite, alphaTest: 0.5, transparent: true } );
	material.color=new THREE.Color( 0x36D7B7 );

	particles = new THREE.PointCloud( geometry, material );
	scene.add( particles );

	for (var i=0; i<lines.length; i++){
		spline = new THREE.SplineCurve3(
			[lines[i].startPoint
			,lines[i].endPoint]);
		var material2 = new THREE.LineBasicMaterial({
		    color: 0x36D7B7,
		});

		var geometry = new THREE.Geometry();
		var splinePoints = spline.getPoints(2);

		for(var j= 0; j < splinePoints.length; j++){
		    geometry.vertices.push(splinePoints[j]);  
		}

		var line = new THREE.Line(geometry, material2);
		line.typeForIntersection="line";
		scene.add(line);
	}
}

init();
animate();

var topics;
var lines;



function init() {
	console.log("II");
	container = document.getElementById( 'canvas' );


	camera = new THREE.PerspectiveCamera( 55, windowX / windowY, 2, 2000 );
	camera.position.z = 1000;


	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

	geometry = new THREE.Geometry();

	sprite = THREE.ImageUtils.loadTexture( "img/disc.png" );

	

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff, 1);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( windowX, windowY );
	container.appendChild( renderer.domElement );

	//

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	//container.appendChild( stats.domElement );

	//

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

	raycaster = new THREE.Raycaster();
}

function onWindowResize() {

	windowHalfX = windowX / 2;
	windowHalfY = windowY / 2;

	camera.aspect = windowX / windowY;
	camera.updateProjectionMatrix();

	renderer.setSize( windowX, windowY );

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}


function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();
	update();
}
var flag=false;
function update(){
	// find intersections

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( scene.children );

	for (var i=0; i<intersects.length; i++){
		console.log(intersects[i].object.typeForIntersection);
	}

	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
/*
			if ( INTERSECTED ) 
				INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );
*/
		}

	} else {

		//if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

	}

}

function render() {

	var time = Date.now() * 0.00005;

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	//material.color.setHSL( h, 0.5, 0.5 );s

	renderer.render( scene, camera );

}

function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 20;
	
	for (var i=0; i<(36-message.length)*1.5; i++){
		message=" "+message;
	}
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:0, g:0, b:0, a:1.0 };

	
		
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;//message.length*fontsize+50
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = new THREE.Color( 0x36D7B7 );

	context.lineWidth = borderThickness;
	
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = new THREE.Color( 0x36D7B7 );

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: true});
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(300,300,1.0);
	return sprite;	
}