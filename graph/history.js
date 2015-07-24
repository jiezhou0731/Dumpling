 /*
    test= andrewThree.SurroundedSphere();
    test.addTo(scene);
    */
    SurroundedSphere:function(){
        surroundedSphere = {};

        surroundedSphere.numberOfChildren=5;
        
        // create father sphere
        surroundedSphere.father = andrewThree.Sphere({
            text:"text here", 
            sphereRadius:5, 
            backgroundColor:"#5f9ab8", 
            position:new THREE.Vector3(0, 0, 0)
        });
        
        // create children spheres
        surroundedSphere.children=[];
        for (var i=0; i<surroundedSphere.numberOfChildren; i++) {
            newChildren = andrewThree.Sphere({
                text:"text here", 
                sphereRadius:3, 
                backgroundColor:"#d8e6bc",
                position:new THREE.Vector3(
                    (5+3)*Math.cos(i*2*Math.PI/surroundedSphere.numberOfChildren),
                    (5+3)*Math.sin(i*2*Math.PI/surroundedSphere.numberOfChildren), 
                     0
                )
            });
            surroundedSphere.children.push(newChildren);
        }

        surroundedSphere.addTo = function(scene){
            scene.add(surroundedSphere.father.sprite);
            for (var i=0; i<surroundedSphere.children.length; i++) {
                scene.add(surroundedSphere.children[i].sprite);
            }
        }

        surroundedSphere.render = function(){
            surroundedSphere.father.render();
            for (var i=0; i<surroundedSphere.children.length; i++) {
                surroundedSphere.children[i].render();
            }
        }

        return surroundedSphere;
    },

/*
    json={data:"bb"};
    andrewThree.Cluster(json);
    test.addTo(scene);
    
    Cluster:function(arg){
        var cluster = {};

        if (arg==undefined) {
            arg={};
        }
        cluster.center = arg.center || new THREE.Vector3(0, 0, 0);
        cluster.data = arg.data || "N/A";

        cluster.create = function(){
            if (objectDepth(cluster.data)==1){
                var newSphere = andrewThree.Sphere({
                    text:"text here", 
                    sphereRadius:3, 
                    backgroundColor:"#d8e6bc",
                    position:cluster.center
                });
                cluster.sprite=newSphere;
            } else if (objectDepth(cluster.data)==2){
                var newSphere = andrewThree.Sphere({
                    text:"text here", 
                    sphereRadius:3, 
                    backgroundColor:"#d8e6bc",
                    position:cluster.center
                });
                cluster.sprite=newSphere;

                cluster.children=[];
                var numberOfChildren=0;
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        numberOfChildren++;
                    }
                }
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        var childrenData={};
                        childrenData.data=object[property];
                        childrenData.center=new THREE.Vector3(
                            (5+3)*Math.cos(i*2*Math.PI/numberOfChildren),
                            (5+3)*Math.sin(i*2*Math.PI/numberOfChildren), 
                             0
                        );
                        andrewThree.Cluster(childrenData);
                        test.addTo(scene);
                    }
                }
                for (var i=0; i<surroundedSphere.numberOfChildren; i++) {
                    newChildren = andrewThree.Sphere({
                        text:"text here", 
                        sphereRadius:3, 
                        backgroundColor:"#d8e6bc",
                        position:new THREE.Vector3(
                            (5+3)*Math.cos(i*2*Math.PI/surroundedSphere.numberOfChildren),
                            (5+3)*Math.sin(i*2*Math.PI/surroundedSphere.numberOfChildren), 
                             0
                        )
                    });
                    surroundedSphere.children.push(newChildren);
                }

            }
        }

        cluster.addTo = function(scene){
            if (cluster.sprite!=undefined) {
                cluster.sprite.addTo(scene);
            }
        }

        cluster.render = function(){
            if (cluster.sprite!=undefined) {
                cluster.sprite.render(scene);
            }
        }

        cluster.create();

        return cluster;
    }
    */  