/*function add_box() {// adding a new box//
    add_box_internal(plane);
}*/

function add_box_internal() {
    var numItems = $(LM_xml).children('annotation').children('object').length;
    threed_anno = new annotation(numItems);
    threed_anno.SetType(3);
    object_list.push(new object_instance);
    window.select = object_list[object_list.length-1];//window.select is now the new object
    window.select.ID = numItems; // making the 3d objects ID in sync with LabelMe system
    ID_dict[window.select.ID] = window.select;
    mkThreeDPopup(1, 1);
    var sp_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var sp_plane_geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
    sp_plane = new THREE.Mesh(sp_plane_geometry, sp_plane_material);
    sp_plane.matrixWorld = plane.matrixWorld;
    sp_plane.material.visible = false;
    var cubeGeometry = new THREE.CubeGeometry(small_w, small_h, small_d);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    window.select.cube = new THREE.Object3D();
    window.select.cube.add(cube);
    window.select.plane.matrixWorld = gp_plane.matrixWorld.clone();
    scene.add(window.select.plane);
    window.select.plane.add(object_list[object_list.length-1].cube);
    object_list[object_list.length-1].cube.position.setX(0.95);
    object_list[object_list.length-1].cube.position.setY(0.95);
    object_list[object_list.length-1].cube.position.setZ(small_h/2);
    for (var i = 0; i < stage.children.length; i++) {
        stage.children[i].hide();
    }
    setup_arrowheads_rescaling();
    HighlightSelectedThreeDObject();
    render();
}
function clone_box(){
    cloneOn = true;
}

/*function remove_box(){
    removeOn = true;
}*/

function remove_object_internal(object) {//change to remove_object_internal to support planes
    console.log(object.ID);
    if (object.hparent != "unassigned" && object.hparent != gp_plane){
        var index = object.hparent.hchildren.indexOf(window.select);
        object.hparent.hchildren.splice(index, 1);
    }
    if (object.parent == scene) {
        Apprise('You cannot remove the groundplane', okAlert);
        return;
    } else {
        scene.remove(object.plane);
    }
    for (var i = 0; i < object.hchildren.length; i++){
        object.hchildren[i].hparent = "unassigned";
    }
    object_list.splice(object_list.indexOf(object),1);
    window.select = null;
    toggle_cube_resize_arrows(false);
    toggle_cube_rotate_indicators(false);
    toggle_cube_move_indicators(false);
    main_threed_handler.GotoFirstAnnoObject();
    render();
}

function add_plane(){
    var numItems = $(LM_xml).children('annotation').children('object').length;
    threed_anno = new annotation(numItems);
    threed_anno.SetType(2);
    object_list.push(new object_instance);
    window.select = object_list[object_list.length-1];//window.select is now the new object
    window.select.ID = numItems; // making the 3d objects ID in sync with LabelMe system
    ID_dict[window.select.ID] = window.select;
    mkThreeDPopup(1, 1);
    var new_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var new_plane_geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
    var new_plane = new THREE.Mesh(new_plane_geometry, new_plane_material.clone());
    new_plane.matrixWorld = plane.matrixWorld.clone();
    new_plane.material.visible = true;
    new_plane.matrixAutoUpdate = false;
    window.select.plane = new_plane;
    scene.add(new_plane);
    HighlightSelectedThreeDObject();
    main_threed_handler.LoadDifferentPlane(groundplane_id);
    main_threed_handler.PlaneAutoSave();
    update_plane();
    render();
}

