function HighlightSelectedThreeDObject() {//now really only highlighting
    //if (!LMgetObjectField(LM_xml, window.select.ID, "ispartof")){

    //}
    for (var i = 0; i < object_list.length; i++) {
        if (object_list[i].cube) changeColor(object_list[i].cube, 0xffffff);
        object_list[i].plane.material.visible = false;
    }
    if (window.select) {
        var idx = window.select.ID;
        var parent = LMgetObjectField(LM_xml, idx, 'ispartof');
        while (!isNaN(parent) && main_canvas.GetAnnoByID(parent).GetType() != 0 && main_canvas.GetAnnoByID(parent).GetType() != 1){
            idx = LMgetObjectField(LM_xml, idx, 'ispartof');
            parent = LMgetObjectField(LM_xml, idx, 'ispartof');
        }
        if(!isNaN(LMgetObjectField(LM_xml, idx, "ispartof"))){
            CreatePolygonClip(LMgetObjectField(LM_xml, idx, "ispartof"));
        }else{
            ClearCanvas();
        }
        if (window.select.cube){
            for (var i = 0; i < stage.children.length; i++) {
                    stage.children[i].hide();
            }
            console.log("highlight");
            changeColor(window.select.cube, 0xffff00);
            window.select.cube.traverse( function ( object ) { object.visible = true; } );
            /*if (!isNaN(LMgetObjectField(LM_xml, window.select.ID, "ispartof")) && !clip_on ){
                CreatePolygonClip(LMgetObjectField(LM_xml, window.select.ID, "ispartof"));
            }*/
        }
        else{
           main_threed_handler.LoadDifferentPlane(window.select.ID);
            /*if (!isNaN(LMgetObjectField(LM_xml, window.select.ID, "ispartof")) && !clip_on ){
                CreatePolygonClip(LMgetObjectField(LM_xml, window.select.ID, "ispartof"));
            }else if ((window.select.hparent != "unassigned" && !isNaN(LMgetObjectField(LM_xml, window.select.hparent.ID, "ispartof")))){
                CreatePolygonClip(LMgetObjectField(LM_xml, window.select.hparent.ID, "ispartof"));
            }*/
            window.select.plane.material.visible = true;
            guide_Z_line.material.visible = true;
            DisplayVPTools();
        }
        if (window.select.hparent != "unassigned"){
            window.select.plane.material.visible = true;
        }
        toggle_cube_resize_arrows(true);
        guide_Z_line.material.visible = false;
    } /*else if ((window.select) && !(window.select.cube)){//for planes
        main_threed_handler.LoadDifferentPlane(window.select.ID);
        if (LMgetObjectField(LM_xml, window.select.ID, "ispartof")){
            CreatePolygonClip(LMgetObjectField(LM_xml, window.select.ID, "ispartof"));
        }
        window.select.plane.material.visible = true;
        guide_Z_line.material.visible = true;
        DisplayVPTools();
    }*/
    render();
}

function DisplayVPTools(){
    for (var i = 0; i < stage.children.length; i++) {// shows GP tools
            stage.children[i].show();
        }
    for (var i = intersect_box.children.length - 1; i > -1; i--){
            intersect_box.remove(intersect_box.children[i]);
    }
    stage.draw();
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