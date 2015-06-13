function add_box() {// adding a new box//
    add_box_internal(plane);
}

function add_box_internal(support_object) {
    if (window.location.pathname.split("/").pop() == "box_tester.php"){
        var box_label = "undefined";
    }else{
        var box_label = prompt("Please choose a label for the box", "Box");
        box_label = box_label.replace(/ /g,"_");
    }
    object_list.push(new object_instance);
    window.select = object_list[object_list.length-1];//window.select is now the new object
    window.select.hparent = "unassigned";
    if (object_list.length == 1) {
        window.select.ID = 1;
    }
    else {
        window.select.ID = object_list[object_list.length-2].ID + 1;
    } //making ID of object the max ID of object currently in list + 1
    ID_dict[window.select.ID] = window.select;
    var sp_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var sp_plane_geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
    sp_plane = new THREE.Mesh(sp_plane_geometry, sp_plane_material);
    sp_plane.matrixWorld = plane.matrixWorld;
    sp_plane.material.visible = false;
    //window.select.support_plane = empty_plane.clone();
    window.select.support_plane.matrixWorld = gp_plane.matrixWorld.clone();
    scene.add(window.select.support_plane);
    window.select.support_plane.add(object_list[object_list.length-1].cube);
    //scene.add(object_list[object_list.length-1].cube);
    object_list[object_list.length-1].cube.position.setX(0.95);
    object_list[object_list.length-1].cube.position.setY(0.95);
    object_list[object_list.length-1].cube.position.setZ(small_h/2);

    window.select.label = box_label;

    var tmp_button = add_icon(box_label);
    tmp_button.innerHTML = "<font size= '3'><b>"+tmp_button.innerHTML+"</b></font>";

    for (var i = 0; i < stage.children.length; i++) {
        stage.children[i].hide();
    }
    boxSelect();
    render()

}
function clone_box(){
    cloneOn = true;
}

function remove_box(){
    removeOn = true;
}

function remove_box_internal(object) {
    console.log(object.ID);
    if (object.hparent != "unassigned" && object.hparent != gp_plane){
        var index = object.hparent.hchildren.indexOf(window.select);
        object.hparent.hchildren.splice(index, 1);
    }
    if (object.parent == scene) {
        Apprise('You cannot remove the groundplane', okAlert);
        return;
    } else if (object.support_plane == plane || object.support_plane == gp_plane) {
        plane.remove(object.cube);
    } else {
        scene.remove(object.support_plane);
    }
    object_list.splice(object_list.indexOf(object),1);
    window.select = plane;
    remove_icon();
    render();
}