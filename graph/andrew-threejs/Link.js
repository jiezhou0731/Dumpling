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
    //console.log(objectsContainer.searchByDataId(link.sourceId).center);
    //console.log(objectsContainer.searchByDataId(link.targetId).center);

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
}