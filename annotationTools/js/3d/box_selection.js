function HighlightSelectedThreeDObject() {//now really only highlighting
    for (var i = 0; i < object_list.length; i++) {
        if (object_list[i].cube) changeColor(object_list[i].cube, 0xffffff);
        object_list[i].plane.material.visible = false;
    }
    if (object_list.length && window.select.ID != 0) {
        if (window.select.cube) changeColor(window.select.cube, 0xffff00);
        if (window.select.hparent != "unassigned"){
            window.select.plane.material.visible = true;
            console.log("click");
        }
        toggle_cube_resize_arrows(true);
        gp_plane.material.visible = false;
        guide_Z_line.material.visible = false;
    } else if (window.select == plane){
        gp_plane.material.visible = true;
        guide_Z_line.material.visible = true;
    }
    render();
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