function object_instance(){
    this.hparent = "unassigned";
    this.hchildren = [];
    this.ID;
    this.label;
    this.model;
    this.holder; //for the parent ID in the load function

    this.plane = empty_plane.clone();
    this.plane.material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    this.plane.matrixWorld.matrixAutoUpdate=true;
    this.plane.slider_value = 60;
    this.icon;

    this.cube;
}

function check_oldest_ancestor(oldest_ancestor){
    while (oldest_ancestor != "unassigned" && oldest_ancestor != gp_plane && typeof oldest_ancestor != "undefined"){
        oldest_ancestor = oldest_ancestor.hparent;
    }
    return oldest_ancestor;
}