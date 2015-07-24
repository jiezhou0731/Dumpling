if(andrewThree === undefined) {
  var andrewThree = {};
}
/*
test= andrewThree.Link(1,3);
test.addTo(scene);
*/
andrewThree.Link=function(arg){
    var link={};

    if (arg==undefined) {
        arg={};
    }
    link.sourceId=arg.sourceId;
    link.targetId=arg.targetId;
    var s = objectContainer.searchByDataId(link.sourceId).center; //new THREE.Vector3(0, 0, 0);
    var t = objectContainer.searchByDataId(link.targetId).center; // THREE.Vector3(10, 10, 0);
    var dx2 = (s.x-t.x)*(s.x-t.x);
    var dy2 = (s.y-t.y)*(s.y-t.y);
    var dz2 = (s.z-t.z)*(s.z-t.z);
    var dy = s.y-t.y;

    link.radiusTop = arg.radiusTop || 0.5;
    link.radiusBottom = arg.radiusTop || 0.5;
    link.height = Math.sqrt(dx2+dy2+dz2); 
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

    link.sprite.rotation.x = Math.acos(dy/Math.sqrt(dy2+dz2));
    link.sprite.rotation.z = Math.acos((dy2+dz2)/(Math.sqrt(dy2+dz2)*Math.sqrt(dx2+dy2+dz2)));
    link.sprite.position.x=(s.x+t.x)/2;
    link.sprite.position.y=(s.y+t.y)/2;
    link.sprite.position.z=(s.z+t.z)/2;

    link.addTo = function(scene){
        scene.add(link.sprite);
    }

    link.render = function(){
        
    }      
    
    return link;
}