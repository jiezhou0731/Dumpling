if(andrewThree === undefined) {
  var andrewThree = {};
}

/*
test= andrewThree.SurroundedSphere();
test.addTo(scene);
*/
andrewThree.SurroundedSphere=function(arg){
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

    surroundedSphere.clickables=[];
    // create father sphere
    surroundedSphere.father = andrewThree.Sphere({
        text:surroundedSphere.data.fatherNodeName, 
        sphereRadius:5, 
        backgroundColor:{s:"#F9690E",t:"#F9690E"}, 
        position:surroundedSphere.center
    });
    surroundedSphere.father.sprite.surroundedSphere=surroundedSphere;
    surroundedSphere.clickables.push(surroundedSphere.father.sprite);

    // create children spheres
    surroundedSphere.children=[];
    surroundedSphere.lines=[];

    var rowColor={};
    rowColor.s="rgb(46, 204, 113)";
    rowColor.t="rgb(46, 204, 113)";
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
        pickedColor.s="rgb(154, 18, 179)";
        pickedColor.t="rgb(154, 18, 179)";
        var position =new THREE.Vector3(
                (6+3)*Math.cos(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.x,
                (6+3)*Math.sin(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.y, 
                surroundedSphere.center.z
        );
        var newSphere = andrewThree.Sphere({
            text:property, 
            sphereRadius:3, 
            fontSize:30, 
            backgroundColor:pickedColor,
            position: position
        });
        newSphere.originalPosition=position;
        newChildren.sphereArr.push(newSphere);
        surroundedSphere.clickables.push(newSphere.sprite);
        newSphere.sprite.surroundedSphere=surroundedSphere;
        var line = createLine(surroundedSphere.center, position,0x9A12B3);
        surroundedSphere.lines.push(line);

        // Create the following nodes
        // If only one node follows
        var firstSpherePosition = position;
        var maxDistance = 10;
        var minDistance = 2;
        var sphereRadius=3;
        if (typeof surroundedSphere.data[property] == "string") {
            pickedColor=pickGradientColor(rowColor,10,8);

            var position = new THREE.Vector3(
                    firstSpherePosition.x+randomDistance(minDistance,maxDistance),
                    firstSpherePosition.y+randomDistance(minDistance,maxDistance),
                    firstSpherePosition.z+randomDistance(minDistance,maxDistance)
            );
            var newSphere = andrewThree.Sphere({
                text:surroundedSphere.data[property], 
                sphereRadius:sphereRadius, 
                fontSize:20, 
                backgroundColor:pickedColor,
                position: position
            });
            newSphere.originalPosition=position;
            newChildren.sphereArr.push(newSphere);
            newSphere.sprite.surroundedSphere=surroundedSphere;
            surroundedSphere.clickables.push(newSphere.sprite);

            var line = createLine(firstSpherePosition, position, 0x2ECC71);
            surroundedSphere.lines.push(line);
        } else {
            // If array of nodes follow
            var arr=surroundedSphere.data[property];
            for (var j=0; j<arr.length; j++){
                pickedColor=pickGradientColor(rowColor,arr.length,j);
                var position = new THREE.Vector3(
                    firstSpherePosition.x+randomDistance(minDistance,maxDistance),
                    firstSpherePosition.y+randomDistance(minDistance,maxDistance),
                    firstSpherePosition.z+randomDistance(minDistance,maxDistance)
                );
                var newSphere = andrewThree.Sphere({
                    text:arr[j], 
                    sphereRadius:sphereRadius, 
                    fontSize:20, 
                    backgroundColor:pickedColor,
                    position:position
                });
                newSphere.originalPosition=position;
                newChildren.sphereArr.push(newSphere);
                newSphere.sprite.surroundedSphere=surroundedSphere;
                surroundedSphere.clickables.push(newSphere.sprite);

                var line = createLine(firstSpherePosition, position, 0x2ECC71);
                surroundedSphere.lines.push(line);
            }
        }
        surroundedSphere.children.push(newChildren);
    }

    surroundedSphere.addTo = function(scene){
        surroundedSphere.father.addTo(scene);
        for (var i=0; i<surroundedSphere.children.length; i++) {
            for (var j=0; j<surroundedSphere.children[i].sphereArr.length; j++) {
                surroundedSphere.children[i].sphereArr[j].addTo(scene);
            }
        }

        for (var i=0; i<surroundedSphere.lines.length; i++) {
            scene.add(surroundedSphere.lines[i])
        }
    }

    surroundedSphere.render = function(delta){
        surroundedSphere.father.render(delta);
        for (var i=0; i<surroundedSphere.children.length; i++) {
            for (var j=0; j<surroundedSphere.children[i].sphereArr.length; j++) {
                surroundedSphere.children[i].sphereArr[j].render(delta);
            }
        }
    }

    surroundedSphere.isOpen=true;

    // Scatter surrounding spheres to all directions
    surroundedSphere.close = function(){
        for (var i=0; i<surroundedSphere.children.length; i++) {
            surroundedSphere.children[i].sphereArr.forEach(function(animator){
                var from = { 
                        x:animator.sprite.position.x,
                        y:animator.sprite.position.y
                };
                var to ={
                        x:surroundedSphere.father.sprite.position.x,
                        y:surroundedSphere.father.sprite.position.y
                };

                new TWEEN.Tween( from ).to( to, 500 ).easing(TWEEN.Easing.Circular.InOut).onUpdate( function() {
                    animator.sprite.position.x = this.x;
                    animator.sprite.position.y = this.y;
                } ).start();
            });
        }
        surroundedSphere.isOpen=false;
    }
    surroundedSphere.open = function(){
        for (var i=0; i<surroundedSphere.children.length; i++) {
            surroundedSphere.children[i].sphereArr.forEach(function(animator){
                var from = { 
                        x:animator.sprite.position.x,
                        y:animator.sprite.position.y
                };
                var to ={
                        x:animator.originalPosition.x,
                        y:animator.originalPosition.y,
                };

                new TWEEN.Tween( from ).to( to, 500 ).easing(TWEEN.Easing.Circular.InOut).onUpdate( function() {
                    animator.sprite.position.x = this.x;
                    animator.sprite.position.y = this.y;
                } ).start();
            });
        }
        surroundedSphere.isOpen=true;
    }

    surroundedSphere.removeHighlight = function(){
        surroundedSphere.father.removeHighlight();
    }

    surroundedSphere.getClickable = function(){
        // Set click handler
        for (var i=0; i<surroundedSphere.clickables.length; i++){
            surroundedSphere.clickables[i].clicked=function(){
                surroundedSphere.father.highlight();
            };
        }
        return surroundedSphere.clickables;
    }

    return surroundedSphere;
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


function randomDistance(min,max){
    var sign = 1;
    if (Math.random()<0.6) {
        sign=-1;
    }
    return sign*Math.random()*max+min;
}

function createLine(s,t,color){
    var material = new THREE.LineBasicMaterial( {
                    color:color,
                    transparent: false,
                    linewidth: 4
                } );

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      s,
      s,
      t
    );

    var line = new THREE.Line( geometry, material );

    return line;
}