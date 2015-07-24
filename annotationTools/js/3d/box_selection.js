function HighlightSelectedThreeDObject() {//now really only highlighting
    for (var i = 0; i < object_list.length; i++) {
        if (object_list[i].cube) changeColor(object_list[i].cube, 0xffffff);
        object_list[i].plane.material.visible = false;
    }
    if (window.select) {
        console.log("highlight");
        if (window.select.cube){
            changeColor(window.select.cube, 0xffff00);
            window.select.cube.traverse( function ( object ) { object.visible = true; } );
        }
        else{
            window.select.plane.material.visible = true;
        }
        if (window.select.hparent != "unassigned"){
            window.select.plane.material.visible = true;
        }
        toggle_cube_resize_arrows(true);
        gp_plane.material.visible = false;
        guide_Z_line.material.visible = false;
    } else if ((window.select) && !(window.select.cube)){//for planes
        main_threed_handler.LoadDifferentPlane(window.select.ID);
        window.select.plane.material.visible = true;
        guide_Z_line.material.visible = true;
        DisplayVPTools();
    }
    render();
}

function DisplayVPTools(){
    for (var i = 0; i < stage.children.length; i++) {// shows GP tools
            stage.children[i].show();
        }
    for (var i = intersect_box.children.length - 1; i > -1; i--){
        if ((typeof plane_cube != "undefined") && (intersect_box.children[i] != plane_cube)){
            intersect_box.remove(intersect_box.children[i]);
            plane_cube.material.visible = false;
        }
    }
}


function changeColor(container, color) {
    for (var i = 0; i < container.children.length; i++) {
        if (container.children[i].material) {
            if (container.children[i].material.color) {
                container.children[i].material.color.setHex(color);
            }
        }
    changeColor(container.children[i], color);
    }
}