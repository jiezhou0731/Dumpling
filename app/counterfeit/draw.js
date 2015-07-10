if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer, particles, geometry, material, i, h, color, sprite, size;
var mouseX = 0, mouseY = 0;

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
	for ( var i=0; i<topics.length; i++){
		var topicVertex = new THREE.Vector3();
		topicVertex.x = 0;
		topicVertex.y = 0.2*windowY;
		topicVertex.z = 200 * Math.random() - 100;
		geometry.vertices.push( topicVertex );
		topics[i].vertex=topicVertex;
		
		labelExploration = makeTextSprite(topics[i].text, 
				{ fontsize: 50, borderColor: {r:46, g:204, b:113, a:1}, backgroundColor: {r:46, g:204, b:113, a:1}} );
		labelExploration.position.set(topicVertex.x,topicVertex.y+20,topicVertex.z);
		labelExploration.scale.set(150,150,1.0);
		scene.add(labelExploration);
		
		for (var j=0; j<topics[i].subtopics.length; j++) {
			var subtopicVertex = new THREE.Vector3();
			subtopicVertex.x = 2*windowX * Math.random() - windowX;
			subtopicVertex.y = 2*windowY  * Math.random() - windowY;
			subtopicVertex.z = 200 * Math.random() - 100;
			geometry.vertices.push( subtopicVertex );
			topics[i].subtopics[j].vertex=subtopicVertex;
			
			labelExploration = makeTextSprite("Exploration", 
					{ fontsize: 50, borderColor: {r:46, g:204, b:113, a:1}, backgroundColor: {r:46, g:204, b:113, a:1}} );
			labelExploration.position.set(subtopicVertex.x,subtopicVertex.y+20,subtopicVertex.z);
			scene.add(labelExploration);
			
			var line = {};
			line.startPoint=new THREE.Vector3(subtopicVertex.x, subtopicVertex.y, subtopicVertex.z);
			line.endPoint=new THREE.Vector3(topicVertex.x,topicVertex.y, topicVertex.z);
			lines.push(line);
		}	
	}
	material = new THREE.PointCloudMaterial( { size: 35, sizeAttenuation: false, map: sprite, alphaTest: 0.5, transparent: true } );
	material.color.setHSL( 0.661, 0.643, 0.278 );

	particles = new THREE.PointCloud( geometry, material );
	scene.add( particles );

	for (var i=0; i<lines.length; i++){
		spline = new THREE.SplineCurve3(
			[lines[i].startPoint
			,lines[i].endPoint]);
		var material2 = new THREE.LineBasicMaterial({
		    color: 0x45B6B0,
		});

		var geometry = new THREE.Geometry();
		var splinePoints = spline.getPoints(2);

		for(var j= 0; j < splinePoints.length; j++){
		    geometry.vertices.push(splinePoints[j]);  
		}

		var line = new THREE.Line(geometry, material2);
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

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

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
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	
		
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
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false});
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}