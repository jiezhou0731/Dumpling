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

    var material = new THREE.LineBasicMaterial( {
                    color:0xF9690E,
                    blending: THREE.AdditiveBlending,
                    transparent: true
                } );

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      s,
      s,
      t
    );

    var line = new THREE.Line( geometry, material );

    link.sprite=line;

    link.addTo = function(scene){
        scene.add(link.sprite);
    }

    link.render = function(){
        
    }      
    
    return link;
}