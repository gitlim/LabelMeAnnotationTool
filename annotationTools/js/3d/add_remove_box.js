/*function add_box() {// adding a new box//
    add_box_internal(plane);
}*/

function add_box_internal() {
    if (wait_for_input){
        alert("You must finish adding this box first.");
        return;
    }
    var numItems = $(LM_xml).children('annotation').children('object').length;
    threed_anno = new annotation(numItems);
    threed_anno.SetType(3);
    object_list.push(new object_instance);
    window.select = object_list[object_list.length-1];//window.select is now the new object
    window.select.ID = numItems; // making the 3d objects ID in sync with LabelMe system
    ID_dict[window.select.ID] = window.select;
    mkThreeDPopup(1, 1);
    /*var sp_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var sp_plane_geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
    sp_plane = new THREE.Mesh(sp_plane_geometry, sp_plane_material);
    sp_plane.matrixWorld = plane.matrixWorld.clone();
    sp_plane.material.visible = false;*/
    var new_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var new_plane_geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    var new_plane = new THREE.Mesh(new_plane_geometry, new_plane_material.clone());
    new_plane.matrixAutoUpdate = false;
    console.log(new_plane.matrixWorld);
    new_plane.matrixWorld = plane.matrixWorld.clone();
    console.log(new_plane.matrixWorld);
    console.log(new_plane.matrixWorld.clone());
    new_plane.material.visible = false;
    window.select.plane = new_plane;
    var cubeGeometry = new THREE.CubeGeometry(small_w, small_h, small_d);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    window.select.cube = new THREE.Object3D();
    window.select.cube.add(cube);
    console.log(plane.matrixWorld);
    //window.select.plane.matrixWorld.copy(plane.matrixWorld);
    console.log(window.select.plane.matrixWorld);
    scene.add(window.select.plane);
    window.select.plane.add(window.select.cube);
    var projector = new THREE.Projector();
    var mouse3D = projector.unprojectVector(new THREE.Vector3(  0, 0, 1 ), camera );
    var direction = mouse3D.sub(camera.position).normalize();
    var position = direction.clone();
    //position = position.applyMatrix4(plane.matrixWorld);
    var i_mat = new THREE.Matrix4().getInverse(window.select.plane.matrixWorld.clone());
    position = position.applyMatrix4(i_mat);
    window.select.cube.position.setX(position.x);
    window.select.cube.position.setY(position.y);
    window.select.cube.position.setZ(position.z);
    window.select.plane.matrixWorldNeedsUpdate = false;
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
    } else if (object.plane.parent == scene){
        scene.remove(object.plane);
    }if (object.cube.parent.parent == box_scene){
        box_scene.remove(object.cube.parent);
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
    if (wait_for_input){
        alert("You must finish adding this plane first.");
        return;
    }
    var numItems = $(LM_xml).children('annotation').children('object').length;
    threed_anno = new annotation(numItems);
    threed_anno.SetType(2);
    object_list.push(new object_instance);
    window.select = object_list[object_list.length-1];//window.select is now the new object
    window.select.ID = numItems; // making the 3d objects ID in sync with LabelMe system
    ID_dict[window.select.ID] = window.select;
    mkThreeDPopup(1, 1);
    var new_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var new_plane_geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    var new_plane = new THREE.Mesh(new_plane_geometry, new_plane_material.clone());
    new_plane.material.visible = true;
    new_plane.matrixAutoUpdate = false;
    window.select.plane = new_plane;
    scene.add(new_plane);
    HighlightSelectedThreeDObject();
    main_threed_handler.LoadDifferentPlane(groundplane_id);//loads the info of the groundplane
    window.select.plane.matrixWorld = plane.matrixWorld.clone();
    main_threed_handler.PlaneAutoSave(window.select.ID); //saves the info to the new plane so that the info is initially the same as groundplane
    update_plane(); // renders new plane with info
    render();
}

function add_cube_to_new_scene(idx, new_scene){
    var cube_object = ID_dict[idx];
    var new_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var new_plane_geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    var new_plane = new THREE.Mesh(new_plane_geometry, new_plane_material.clone());
    new_plane.matrixWorld = cube_object.plane.matrixWorld.clone();
    new_plane.matrixAutoUpdate = false;
    new_plane.matrixWorldNeedsUpdate = false;
    if (new_scene == box_scene){
        box_scene.add(new_plane);
        new_plane.material.visible = false;
    }
    var cubeGeometry = new THREE.CubeGeometry(small_w, small_h, small_d);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    var new_cube = new THREE.Object3D();
    ID_dict[idx].cube.traverse(function(object){ID_dict[idx].cube.remove(object);})
    new_cube = ID_dict[idx].cube.clone();
    new_cube.add(cube);
    if (new_scene == box_scene){
        new_plane.add(new_cube);
    }else{
        ID_dict[idx].plane.add(new_cube);
    }
    ID_dict[idx].cube = new_cube;
    var new_position = ID_dict[idx].cube.position.clone().applyMatrix4(ID_dict[idx].plane.matrixWorld.clone());
    var rotation = ID_dict[idx].cube.rotation.z;
    var i_mat = new THREE.Matrix4().getInverse(ID_dict[idx].cube.parent.matrixWorld.clone());
    new_position = new_position.applyMatrix4(i_mat);
    new_cube.position.set(new_position.x, new_position.y, new_position.z);
    new_cube.rotation.set(0, 0, rotation);
    new_cube.matrixAutoUpdate = false;
}