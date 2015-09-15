if(andrewThree === undefined) {
  var andrewThree = {};
}

/*
test= andrewThree.Sphere();
test.addTo(scene);
*/
andrewThree.Sphere=function(arg){
    var sphere = {};

    if (arg==undefined) {
        arg={};
    }
    sphere.sphereRadius = arg.sphereRadius || 2;
    sphere.text = arg.text || "N/A";
    sphere.fontSize = arg.fontSize || "30";
    sphere.backgroundColor = arg.backgroundColor || {s:"#FDE3A7",t:"#FDE3A7"};
    sphere.position = arg.position || new THREE.Vector3(0, 0, 0);
    sphere.sphereRadius =0.6;

    sphere.createSprite=function(){
        var geom = new THREE.SphereGeometry(sphere.sphereRadius, 20, 20);

        var canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 200;
        var ctx=canvas.getContext("2d");
        ctx.rect(0, 0, canvas.width/2, canvas.height);
        //ctx.fillStyle=sphere.backgroundColor;
        var grd = ctx.createLinearGradient(0, 0, canvas.width/2, 0);
        grd.addColorStop(0, sphere.backgroundColor.s);//"rgb(250,245,187)");
        grd.addColorStop(1, sphere.backgroundColor.t);//'rgb(217,39,39)');
        ctx.fillStyle=grd;
        ctx.fillRect(0, 0, canvas.width/2, canvas.height);
        //ctx.fillStyle=sphere.backgroundColor;
        var grd = ctx.createLinearGradient(canvas.width/2, 0, canvas.width, 0);
        grd.addColorStop(0, sphere.backgroundColor.t);//"rgb(250,245,187)");
        grd.addColorStop(1, sphere.backgroundColor.s);//'rgb(217,39,39)');
        ctx.fillStyle=grd;
        ctx.fillRect(canvas.width/2, 0, canvas.width, canvas.height);

        ctx.fillStyle="black";
        ctx.font=sphere.fontSize+"px sans-serif";
        ctx.fillText("",40,110);

        var canvasMap = new THREE.Texture(canvas);
        var mat = new THREE.MeshBasicMaterial();
        mat.map = canvasMap;
        sphere.sprite = new THREE.Mesh(geom, mat);
        sphere.sprite.text = sphere.text;
        sphere.sprite.material.map.needsUpdate = true;


        var geom = new THREE.PlaneGeometry(8, 4, 1);

        var canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 80;
        var ctx=canvas.getContext("2d");
        ctx.rect(0, 0, canvas.width/2, canvas.height);
        ctx.font="40px sans-serif";
        ctx.fillText(sphere.text,2,50);
        var canvasMap = new THREE.Texture(canvas);
        var mat = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
        mat.map = canvasMap;
        mat.transparent = true;
        mat.opacity = 0.9;
        sphere.textSprite = new THREE.Mesh(geom, mat);
        sphere.textSprite.material.map.needsUpdate = true;
    }

    sphere.highlight=function(){
        objectContainer.removeHighlight();
        var geom = new THREE.TorusGeometry(
            sphere.sphereRadius+0.1,//radius
            0.1,  //tube, 
            20,  //radialSegments, 
            20, //tubularSegments, 
            Math.PI*2  //arc
        );
        var meshMaterial = new THREE.MeshBasicMaterial({color: 0xE08283});
        meshMaterial.side = THREE.DoubleSide;
        var meshMaterial = new THREE.MeshBasicMaterial({color: 0xE08283});
        meshMaterial.opacity=0.5;
        meshMaterial.transparent=true;
        sphere.highlightSphere = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, meshMaterial]);
        
        sphere.highlightSphere.position.x=sphere.sprite.position.x;
        sphere.highlightSphere.position.y=sphere.sprite.position.y;
        sphere.highlightSphere.position.z=sphere.sprite.position.z;
        if (sphere.scene!=undefined) {
            scene.add(sphere.highlightSphere);
        }
    }

    sphere.removeHighlight=function(){
        if (sphere.scene!=undefined && sphere.highlightSphere!=undefined) {
            scene.remove(sphere.highlightSphere);
        }
        sphere.highlightSphere = undefined;
    }

    sphere.addTo=function(scene){
        sphere.scene = scene;
        sphere.scene.add(sphere.sprite);
        sphere.scene.add(sphere.textSprite);
        if (sphere.highlightSphere!=undefined) {
            sphere.scene.add(sphere.highlightSphere);
        }
    }

    sphere.render=function(delta){
        var speed=2.5*delta;
        if (sphere.highlightSphere!=undefined){
            /*
            sphere.highlightSphere.rotateX(speed);
            sphere.highlightSphere.rotateY(speed);
            sphere.highlightSphere.rotateZ(speed);
            */
        }
       
        /*
        var a=sphere.sphereRadius*(camera.position.z-sphere.sprite.position.z);
        var b=sphere.sphereRadius*Math.sqrt(
            (camera.position.y-sphere.sprite.position.y)*(camera.position.y-sphere.sprite.position.y)
            +(camera.position.z-sphere.sprite.position.z)*(camera.position.z-sphere.sprite.position.z)
            );
        if (camera.position.z-sphere.sprite.position.z<0) {
            sphere.sprite.rotation.x =Math.PI*2-Math.acos(a/b);    
        } else {
            sphere.sprite.rotation.x =Math.acos(a/b);
        }
        //console.log(sphere.sprite.rotation.x+" "+a+" "+b);
        a=sphere.sphereRadius*(camera.position.z-sphere.sprite.position.z);
        b=sphere.sphereRadius*Math.sqrt(
            (camera.position.x-sphere.sprite.position.x)*(camera.position.x-sphere.sprite.position.x)
            +(camera.position.z-sphere.sprite.position.z)*(camera.position.z-sphere.sprite.position.z)
            );
        if (camera.position.x-sphere.sprite.position.x<0) {
            sphere.sprite.rotation.y =Math.PI*2-Math.acos(a/b);    
        } else {
            sphere.sprite.rotation.y =Math.acos(a/b);//Math.PI/4;;
        }
        */
        
        //sphere.sprite.rotation.z =0;//Math.PI/4;;
        //var a=(camera.position.x-sphere.sprite.position.x)
        //console.log(camera.position);
        //

        
        //sphere.sprite.lookAt(camera.position);
    }

    sphere.isShowing = true;
    sphere.show=function(){
        sphere.scene.add(sphere.sprite);
        sphere.isShowing = true;
    }

    sphere.hide=function(){
        sphere.scene.remove(sphere.sprite);
        sphere.isShowing = false;
    }

    sphere.toggle=function(){
        if (sphere.isShowing) {
            sphere.hide();
        } else {
            sphere.show();
        }
    }
    sphere.createSprite();
    sphere.sprite.position.x = sphere.position.x;
    sphere.sprite.position.y = sphere.position.y;
    sphere.sprite.position.z = sphere.position.z;

    sphere.textSprite.position.x = sphere.position.x;
    sphere.textSprite.position.y = sphere.position.y+1;
    sphere.textSprite.position.z = sphere.position.z-1;
    return sphere;
}