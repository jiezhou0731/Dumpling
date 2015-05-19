function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	delta = clock.getDelta(); 
	ballUpdate();
	floorUpdate();
	wordSpriteParticleGroupUpdate();
	controls.update();
}

function render() 
{
	renderer.render( scene, camera );
}

function createBackground(){
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH =$( '#ThreeJS' ).width(), SCREEN_HEIGHT = $( '#ThreeJS' ).height();
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 10000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,0,400);
	camera.lookAt(scene.position);	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	
	// EVENTS
	//THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 400;
	controls.maxDistance = 400;
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	scene.add(skyBox);
	
	// FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'img/floor.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 40, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(floorLength, 500, 10, 10);
	
	for (var i=0; i<3; i++){
		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.position.y = 0;
		floor.position.x = floorLength*(i-1);
		floor.rotation.x = Math.PI / 2+0.05;
		floor.name = "Checkerboard Floor";
		floors.push(floor);
		scene.add(floor);
	}
	
	// State
	labelExploration = makeTextSprite("Exploration", 
			{ fontsize: 50} );
	labelExploration.position.set(-800,120,0);
	labelExploration.scale.set(150,150,1.0);
	scene.add(labelExploration);
	
	labelExploitation = makeTextSprite("Exploitation", 
			{ fontsize: 50} );
	labelExploitation.position.set(-800,-100,0);
	labelExploitation.scale.set(150,150,1.0);
	scene.add(labelExploitation);
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

	var spriteAlignment = THREE.SpriteAlignment.topLeft;
		
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
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

function wordSpriteParticleGroupUpdate(){
	var rotateAngle = -Math.PI / 2 * delta;
	for ( var c = 0; c < particleGroup.children.length; c ++ ) 
	{
		var sprite = particleGroup.children[ c ];
		var a = particleAttributes.randomness[c] + 1;
		
		sprite.angle+=rotateAngle*sprite.speed;
		sprite.position.x = sprite.radiusRange*Math.cos(sprite.angle);
		sprite.position.z = 100*Math.sin(sprite.angle);
		console.log(sprite.position.z);
	}
}

//	Ball
function createBall(){
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/face.jpg' ) }));
	var movingBallMat = new THREE.MeshFaceMaterial(materialArray);
	var movingBallGeom = new THREE.SphereGeometry( 50, 50, 50 );//THREE.BallGeometry( 50, 50, 50, 1, 1, 1, materialArray );
	movingBall = new THREE.Mesh( movingBallGeom, movingBallMat );
	movingBall.position.set(0, 0, 0);
	scene.add( movingBall );	
}

function ballUpdate(){
	var moveDistance = 200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
	movingBall.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	
	// move the ball up
	if (moveBallToDirection==1){
		if (movingBall.position.y<70){
			movingBall.position.y+=moveDistance;
			particleGroup.position.y+=moveDistance;
		} 
	}
	
	// move the ball down
	if (moveBallToDirection==2){
		if (movingBall.position.y>-70){
			movingBall.position.y-=moveDistance;
			particleGroup.position.y-=moveDistance;
		} 
	}
}

function moveBallToAbove(){
	moveBallToDirection=1;
}

function moveBallToBelow(){
	moveBallToDirection=2;
}

function changeStateLabel(state){
	scene.remove(labelExploration);
	scene.remove(labelExploitation);
	if (state==1){
		labelExploration = makeTextSprite("Exploration", 
				{ fontsize: 50, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8}} );
		labelExploration.position.set(-800,120,0);
		labelExploration.scale.set(150,150,1.0);
		scene.add(labelExploration);
		
		labelExploitation = makeTextSprite("Exploitation", 
				{ fontsize: 50} );
		labelExploitation.position.set(-800,-100,0);
		labelExploitation.scale.set(150,150,1.0);
		scene.add(labelExploitation);
	} else {
		labelExploration = makeTextSprite("Exploration", 
				{ fontsize: 50} );
		labelExploration.position.set(-800,120,0);
		labelExploration.scale.set(150,150,1.0);
		scene.add(labelExploration);
		
		labelExploitation = makeTextSprite("Exploitation", 
				{ fontsize: 50, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8}} );
		labelExploitation.position.set(-800,-100,0);
		labelExploitation.scale.set(150,150,1.0);
		scene.add(labelExploitation);
	}
}

//	Floor
var floorLength=5000;
function floorUpdate(){
	var moveDistance = -70 * delta; // 200 pixels per second
	for (var i=0; i<3; i++){
		floors[i].translateX( moveDistance);
		if (floors[i].position.x < -floorLength*2){
			floors[i].position.x = floorLength+floors[i].position.x+floorLength*2;
		}
	}
}

