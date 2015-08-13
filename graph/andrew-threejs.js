var andrewThree={
    sphereRadiuses:[6,5,4,3,2],

    /*
    test= andrewThree.Sphere();
    test.addTo(scene);
    */
    Sphere:function(arg){
        var sphere = {};

        if (arg==undefined) {
            arg={};
        }
        sphere.sphereRadius = arg.sphereRadius || 2;
        sphere.text = arg.text || "N/A";
        sphere.fontSize = arg.fontSize || "30";
        sphere.backgroundColor = arg.backgroundColor || {s:"#d8e6bc",t:"#d8e6bc"};
        sphere.position = arg.position || new THREE.Vector3(0, 0, 0);

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
            ctx.font=sphere.fontSize+"px Georgia";
            ctx.fillText(sphere.text,40,110);
            var canvasMap = new THREE.Texture(canvas);
            var mat = new THREE.MeshBasicMaterial();
            mat.map = canvasMap;
            sphere.sprite = new THREE.Mesh(geom, mat);
            sphere.sprite.material.map.needsUpdate = true;
        }

        sphere.addTo=function(scene){
            scene.add(sphere.sprite);
        }

        sphere.render=function(){
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

        sphere.createSprite();
        sphere.sprite.position.x = sphere.position.x;
        sphere.sprite.position.y = sphere.position.y;
        sphere.sprite.position.z = sphere.position.z;
        return sphere;
    },

    /*
    test= andrewThree.SurroundedSphere();
    test.addTo(scene);
    */
    SurroundedSphere:function(arg){
        var surroundedSphere = {};

        surroundedSphere.center = arg.center || new THREE.Vector3(0, 0, 0);
        surroundedSphere.data = arg.data || "N/A";

        surroundedSphere.numberOfChildren=0;
        surroundedSphere.sortedChildren=[];
        for (var property in surroundedSphere.data) {
            if (surroundedSphere.data.hasOwnProperty(property)) {
                if (property=="fatherNodeName"||property=="id") continue;
                surroundedSphere.numberOfChildren++;
                if( typeof surroundedSphere.data[property]=="string" ) {
                    surroundedSphere.sortedChildren.push({property:property,length:1});    
                } else {
                    surroundedSphere.sortedChildren.push({property:property,length:surroundedSphere.data[property].length});
                }
            }
        }

        //Sort the array to a bowl's shape
        for (var i=0; i<surroundedSphere.sortedChildren.length; i++) {
            var maxP=i;
            for (var j=i+1; j<surroundedSphere.sortedChildren.length; j++) {
                if (surroundedSphere.sortedChildren[maxP].length<surroundedSphere.sortedChildren[j].length) {
                    maxP=j;
                }
            }
            var temp=surroundedSphere.sortedChildren[maxP];
            surroundedSphere.sortedChildren[maxP]=surroundedSphere.sortedChildren[i];
            surroundedSphere.sortedChildren[i]=temp;
        }
        var tempArr = surroundedSphere.sortedChildren.slice();
        for (var i=0; i<surroundedSphere.sortedChildren.length; i++) {
            if (i%2==0){
                surroundedSphere.sortedChildren[(i/2).toFixed(0)]=tempArr[i];
            } else {
                surroundedSphere.sortedChildren[surroundedSphere.sortedChildren.length-(i/2).toFixed(0)]=tempArr[i];
            }
        }
        
        // create father sphere
        surroundedSphere.father = andrewThree.Sphere({
            text:surroundedSphere.data.fatherNodeName, 
            sphereRadius:5, 
            backgroundColor:{s:"rgb(95,154,184)",t:"rgb(141,198,227)"}, 
            position:surroundedSphere.center
        });
        
        // create children spheres
        surroundedSphere.children=[];
        var rowColor={};
        rowColor.s="rgb(252,247,187)";
        rowColor.t="rgb(230,84,71)";
        // Rotate an angle to ensure long tails are outward.
        var angleOffset=0;//Math.PI/2;;
        var a = surroundedSphere.center.x;
        var b = Math.sqrt(surroundedSphere.center.x*surroundedSphere.center.x
                +surroundedSphere.center.y*surroundedSphere.center.y);
        angleOffset=Math.acos(a/b);
        if (surroundedSphere.center.y<0) {
            angleOffset=2*Math.PI-angleOffset;
        }
        for (var i=0; i<surroundedSphere.sortedChildren.length; i++) {
            var property=surroundedSphere.sortedChildren[i].property;
            if (property=="fatherNodeName"||property=="id") continue;
            var newChildren={};
            newChildren.sphereArr=[];

            // Create the first node of a row
            var pickedColor={};    
            pickedColor.s="rgb(169,199,185)";
            pickedColor.t="rgb(255,255,255)";
            var newSphere = andrewThree.Sphere({
                text:property, 
                sphereRadius:3, 
                fontSize:30, 
                backgroundColor:pickedColor,
                position:new THREE.Vector3(
                    (5+3)*Math.cos(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.x,
                    (5+3)*Math.sin(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.y, 
                    surroundedSphere.center.z
                )
            });
            newChildren.sphereArr.push(newSphere);

            // Create the following nodes
            // If only one node follows
            var sphereRadius=3;
            if (typeof surroundedSphere.data[property] == "string") {
                pickedColor=pickGradientColor(rowColor,10,8);
                var newSphere = andrewThree.Sphere({
                    text:surroundedSphere.data[property], 
                    sphereRadius:sphereRadius, 
                    fontSize:20, 
                    backgroundColor:pickedColor,
                    position:new THREE.Vector3(
                        (sphereRadius*2*(0+1)+5+3)*Math.cos(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.x,
                        (sphereRadius*2*(0+1)+5+3)*Math.sin(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.y, 
                        surroundedSphere.center.z
                    )
                });
                newChildren.sphereArr.push(newSphere);
            } else {
                // If array of nodes follow
                var arr=surroundedSphere.data[property];
                for (var j=0; j<arr.length; j++){
                    pickedColor=pickGradientColor(rowColor,arr.length,j);
                    var newSphere = andrewThree.Sphere({
                        text:arr[j], 
                        sphereRadius:sphereRadius, 
                        fontSize:20, 
                        backgroundColor:pickedColor,
                        position:new THREE.Vector3(
                            (sphereRadius*2*(j+1)+5+3)*Math.cos(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.x,
                            (sphereRadius*2*(j+1)+5+3)*Math.sin(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.y,
                            surroundedSphere.center.z
                        )
                    });
                    newChildren.sphereArr.push(newSphere);
                }
            }
            surroundedSphere.children.push(newChildren);
        }

        surroundedSphere.addTo = function(scene){
            scene.add(surroundedSphere.father.sprite);
            for (var i=0; i<surroundedSphere.children.length; i++) {
                for (var j=0; j<surroundedSphere.children[i].sphereArr.length; j++) {
                    surroundedSphere.children[i].sphereArr[j].addTo(scene);
                }
            }
        }

        surroundedSphere.render = function(){
            surroundedSphere.father.render();
            for (var i=0; i<surroundedSphere.children.length; i++) {
                for (var j=0; j<surroundedSphere.children[i].sphereArr.length; j++) {
                    surroundedSphere.children[i].sphereArr[j].render();
                }
            }
        }

        return surroundedSphere;
    },

    /*
    test= andrewThree.Link(1,3);
    test.addTo(scene);
    */
    Link: function(arg){
        var link={};

        if (arg==undefined) {
            arg={};
        }
        link.sourceId=arg.sourceId;
        link.targetId=arg.targetId;
        console.log("link:");
        console.log(objectsContainer.searchByDataId(link.sourceId).center);
        console.log(objectsContainer.searchByDataId(link.targetId).center);

        link.radiusTop = arg.radiusTop || 0.5;
        link.radiusBottom = arg.radiusTop || 0.5;
        link.height = arg.height || 10; 
        link.radialSegments = arg.radialSegments || 10;
        link.heightSegments = arg.heightSegments || 10;
        link.openEnded = arg.openEnded || false;
        
        var geom = new THREE.CylinderGeometry(
            link.radiusTop, 
            link.radiusBottom, 
            link.height, 
            link.radialSegments, 
            link.heightSegments, 
            link.openEnded
        );
        var meshMaterial = new THREE.MeshBasicMaterial({color:0x6ca2b8});
        var cylinder = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

        link.sprite=cylinder;

        link.addTo = function(scene){
            scene.add(link.sprite);
        }

        link.render = function(){
            
        }      
        
        return link;
    },

    /*
    test= andrewThree.arrow();
    test.addTo(scene);
    */
    Arrow: function(arg){
        var arrow={};

        if (arg==undefined) {
            arg={};
        }
        console.log(objectsContainer.searchByDataId(1));
        arrow.source=arg.source || new THREE.Vector3(0, 0, 0);
        arrow.target=arg.target || new THREE.Vector3(0, 50, 0);

        var direction = new THREE.Vector3().sub(arrow.target, arrow.source);
        var arrow = new THREE.ArrowHelper(
            direction.clone().normalize(), 
            arrow.source, 
            direction.length(), 
            0x5f9ab8,
            2,
            2
        );

        arrow.sprite=arrow;

        arrow.addTo = function(scene){
            scene.add(arrow.sprite);
        }

        arrow.render = function(){
            
        }      
        
        return arrow;
    },
    /*
    test= andrewThree.objectsContainer();
    test.addTo(scene);
    test.render();
    */
    objectsContainer:function(){
        var objectsContainer={};
        objectsContainer.list=[];

        objectsContainer.push=function(object){
            objectsContainer.list.push(object);
        }

        objectsContainer.addTo = function(scene){
            for (var i=0; i<objectsContainer.list.length; i++) {
                objectsContainer.list[i].addTo(scene);
            }
        }

        objectsContainer.render = function(){
            for (var i=0; i<objectsContainer.list.length; i++) {
                objectsContainer.list[i].render();
            }
        }

        objectsContainer.searchByDataId = function(id){
            for (var i=0; i<objectsContainer.list.length; i++) {
                if (objectsContainer.list[i].data['id']==id) {
                    return objectsContainer.list[i];
                }
            } 
            return undefined;
        }
        return objectsContainer;
    }
}

objectDepth = function (object){
    if ((typeof object)=="string") return 1;
    var maxDepth=0;
    var currentDepth=0;
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            currentDepth=objectDepth(object[property]);
            if (maxDepth<currentDepth) {
                maxDepth=currentDepth;
            }
        }
    }
    return maxDepth+1;
}

pickGradientColor = function(color, length, index){
    var strToRgb = function (rgb){
        rgb = rgb.substring(4, rgb.length-1)
             .replace(/ /g, '')
             .split(',');
        return rgb;
    }
    var rgbToStr = function (rgb){
        rgb = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
        return rgb;
    }
    var s=strToRgb(color.s);
    var t=strToRgb(color.t);

    var ans={};
    ans.s=[0,0,0];
    ans.t=[235,235,225];
    for (var i=0; i<3; i++){
        var val=0;
        val=(index*(t[i]-s[i])+length*s[i])/length;
        val=val.toFixed(0);
        ans.s[i]=val;
    }
    var pickedColor={};
    pickedColor.s=rgbToStr(ans.s);
    pickedColor.t=rgbToStr(ans.t);
    return pickedColor;
}
