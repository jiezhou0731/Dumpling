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
    surroundedSphere.father.sprite.surroundedSphere=surroundedSphere;

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

        // Create the following nodes
        // If only one node follows
        var sphereRadius=3;
        if (typeof surroundedSphere.data[property] == "string") {
            pickedColor=pickGradientColor(rowColor,10,8);
            var position = new THREE.Vector3(
                    (sphereRadius*2*(0+1)+6+3)*Math.cos(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.x,
                    (sphereRadius*2*(0+1)+6+3)*Math.sin(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.y, 
                    surroundedSphere.center.z
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
        } else {
            // If array of nodes follow
            var arr=surroundedSphere.data[property];
            for (var j=0; j<arr.length; j++){
                pickedColor=pickGradientColor(rowColor,arr.length,j);
                var position = new THREE.Vector3(
                        (sphereRadius*2*(j+1)+6+3)*Math.cos(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.x,
                        (sphereRadius*2*(j+1)+6+3)*Math.sin(i*2*Math.PI/surroundedSphere.numberOfChildren+angleOffset)+surroundedSphere.center.y,
                        surroundedSphere.center.z
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
        surroundedSphere.father.sprite.clicked = function(){
            surroundedSphere.father.highlight();
        }
        return surroundedSphere.father.sprite;
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
