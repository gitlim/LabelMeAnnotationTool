function object_instance(){
    this.hparent;
    this.hchildren = [];
    this.ID;
    this.label;
    this.model;
    this.holder; //for the parent ID in the load function

    var cubeGeometry = new THREE.CubeGeometry(small_w, small_h, small_d);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

    this.support_plane = empty_plane.clone();
    this.support_plane.material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    this.support_plane.matrixWorld.matrixAutoUpdate=true;
    this.support_plane.slider_value = 60;
    this.icon;

    this.cube = new THREE.Object3D();
    this.cube.add(cube);
}

function check_oldest_ancestor(oldest_ancestor){
    while (oldest_ancestor != "unassigned" && oldest_ancestor != gp_plane && typeof oldest_ancestor != "undefined"){
        oldest_ancestor = oldest_ancestor.hparent;
    }
    return oldest_ancestor;
}