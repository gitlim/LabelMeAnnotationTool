/*function add_icon(box_label) {// adding icons
    var icon_container = document.getElementById('icon_container');
    var tmp_button = document.createElement('button');
    tmp_button.value = box_label;
    tmp_button.className = "icon"
    tmp_button.id = object_list[object_list.length-1].ID;
    icon_container.appendChild(tmp_button);
    $( "#" + object_list[object_list.length-1].ID ).on( "click", function() { ThreeDObjectSelect(this); } );
    reset_icon();
    return tmp_button;
}*/

/*function ThreeDObjectSelect(event) {
    for (var i = 0; i < intersect_box.children.length; i++){
        if (typeof plane_cube != "undefined" && intersect_box.children[i] != plane_cube){
            intersect_box.children[i].material.color.setHex(0x0000ff);
        }
    }
    if (removeOn && (typeof ID_dict[event.id] != "undefined")){
        removeOn = false;
        remove_box_internal(ID_dict[event.id]);
    }else if (heightOn == true){
        heightOn = false;
        if (window.select.hparent != "unassigned" && window.select.hparent != gp_plane){
            var index = window.select.hparent.hchildren.indexOf(window.select);
            window.select.hparent.hchildren.splice(index, 1);
        }if (window.select == plane){
            Apprise("You cannot assign a support object to the groundplane", okAlert);
        }else if (event.id == "GP"){
            window.select.hparent = gp_plane;
            var i_mat = new THREE.Matrix4().getInverse(window.select.plane.matrixWorld.clone());
            cube_position_0 = window.select.cube.position.clone();
            cube_position_0.setZ(window.select.cube.position.z - window.select.cube.scale.z*small_h/2);
            cube_position_0_static = window.select.cube.position.clone();
            cube_position_0_static.setZ(window.select.cube.position.z - window.select.cube.scale.z*small_h/2);
            cube_position_0.applyMatrix4(window.select.plane.matrixWorld.clone());
            cube_position_0_static.applyMatrix4(window.select.plane.matrixWorld.clone());
            old_x = window.select.cube.scale.x;
            old_y = window.select.cube.scale.y;
            old_z = window.select.cube.scale.z;
            old_arrow_x = arrowHelper.arrow_box.scale.x;
            old_arrow_y = arrowHelper.arrow_box.scale.y;
            old_arrow_z = arrowHelper.arrow_box.scale.z;
            calculate_box_location();
        }else if (typeof ID_dict[event.id] != "undefined"){
            window.select.hparent = ID_dict[event.id];
            ID_dict[event.id].hchildren.push(window.select);
            for (var i = 0; window.select.hchildren.length; i++){
                if (window.select.hchildren[i] == ID_dict[event.id]){
                    var index = window.select.hchildren.indexOf(ID_dict[event.id]);
                    window.select.hchildren.splice(index, 1);
                }
            }
            var oldest_ancestor = check_oldest_ancestor(ID_dict[event.id]);
            if (oldest_ancestor == gp_plane){
                var i_mat = new THREE.Matrix4().getInverse(window.select.plane.matrixWorld.clone());
                cube_position_0 = window.select.cube.position.clone();
                cube_position_0.setZ(window.select.cube.position.z - window.select.cube.scale.z*small_h/2);
                cube_position_0_static = window.select.cube.position.clone();
                cube_position_0_static.setZ(window.select.cube.position.z - window.select.cube.scale.z*small_h/2);
                cube_position_0.applyMatrix4(window.select.plane.matrixWorld.clone());
                cube_position_0_static.applyMatrix4(window.select.plane.matrixWorld.clone());
                window.select.plane.material.visible = true;
                old_x = window.select.cube.scale.x;
                old_y = window.select.cube.scale.y;
                old_z = window.select.cube.scale.z;
                old_arrow_x = arrowHelper.arrow_box.scale.x;
                old_arrow_y = arrowHelper.arrow_box.scale.y;
                old_arrow_z = arrowHelper.arrow_box.scale.z;
                calculate_box_location();
            }
        }
        render();
    }else if (cloneOn == true) {
        cloneOn = false;
        temp_x = ID_dict[event.id].cube.scale.x;
        temp_y = ID_dict[event.id].cube.scale.y;
        temp_z = ID_dict[event.id].cube.scale.z;
        temp_rotation_z = ID_dict[event.id].cube.rotation.z;
        temp_z_pos = ID_dict[event.id].cube.position.z;
        add_box_internal(ID_dict[event.id].hparent);
        window.select.hparent = ID_dict[event.id].hparent;
        window.select.plane.matrixWorld = ID_dict[event.id].plane.matrixWorld.clone();
        window.select.cube.scale.x = temp_x;
        window.select.cube.scale.y = temp_y;
        window.select.cube.scale.z = temp_z;
        window.select.cube.rotation.z = temp_rotation_z;
        window.select.cube.position.setZ(temp_z_pos);
        window.select.plane.material.visible = true;
    }else if (event.id == "GP") {
        reset_icon();
        event.innerHTML = "<b><font size='3'>"+event.value+"</font></b>";
        window.select = plane;
        for (var i = 0; i < stage.children.length; i++) {
            stage.children[i].show();
        }
        for (var i = 0; i<object_list.length; i++){
            changeColor(object_list[i].cube, 0xffffff);
            if (object_list[i].hparent != "unassigned"){
                object_list[i].plane.material.visible = false;
            }
        }
        gp_plane.material.visible = true;
        guide_Z_line.material.visible = true;
        toggle_cube_move_indicators(false);
        toggle_cube_rotate_indicators(false);
        toggle_cube_resize_arrows(false);
    }else if ((event.id != "remove") && (event.id != "project") && (event.id != "add") && (event.id != "GP")){// if button is actually an icon for a box
        gp_plane.material.visible = false;
        reset_icon();
        icon_container.children[0].innerHTML = icon_container.children[0].value;
        event.innerHTML = "<b><font size='3'>"+event.innerHTML+"</font></b>";
        for (var i = 0; i < stage.children.length; i++) {
            stage.children[i].hide();
        }
        window.select = ID_dict[event.id];
        toggle_cube_move_indicators(true);
        toggle_cube_rotate_indicators(true);
        toggle_cube_resize_arrows(true);
        boxSelect();
    }
    var oldest_ancestor = check_oldest_ancestor(window.select);
    if (oldest_ancestor != "unassigned" && typeof oldest_ancestor != "undefined"){
        window.select.plane.material.visible = true;
        check_plane_box_collision();
    }
    for (var i=0; i<object_list.length; i++){
            object_list[i].cube.traverse( function ( object ) { object.visible = false; } );
    }
    if (window.select != plane){
        window.select.cube.traverse(function(object){object.visible = true;});
        holder = window.select.hparent
        while ((holder != gp_plane) && (holder != "unassigned")){
            holder.cube.traverse( function ( object ) { object.visible = true; } );
            holder = holder.hparent;
        }
    }
    render();
}*/

/*function hovering(){
    $(document).on('mouseover', function (event) {
        if (typeof ID_dict[event.target.id] != "undefined" && ID_dict[event.target.id] != window.select && event.target.id != "GP"){// hovering over icons that are not GP
            gp_plane.material.visible = false;
            guide_Z_line.material.visible = false;
            for (var i = 0; i < stage.children.length; i++) {// shows GP tools
                stage.children[i].hide();
            }
            for (var i = 0; i < object_list.length; i++){//turns every cube white and disappears groundplane of current selected object
                if (event.target.tagName != "FONT"){
                    if (object_list[i] != window.select){
                        changeColor(object_list[i].cube, 0xffffff);
                    }
                    if (object_list[i] != event.target.id){
                            object_list[i].plane.material.visible = false;
                    }
                }
            }
            var oldest_ancestor = check_oldest_ancestor(ID_dict[event.target.id]);
            if (oldest_ancestor != "unassigned"){
                check_plane_box_collision(ID_dict[event.target.id]);
                ID_dict[event.target.id].plane.material.visible = true;//shows groundplane of cube that is being hovered over
            }
            changeColor(ID_dict[event.target.id].cube, 0xff0000);//makes cube that is hovered over red
        }
        else if (event.target.id == "GP" && window.select != plane){// hovering over the GP icon
            toggle_cube_resize_arrows(false);
            toggle_cube_rotate_indicators(false);
            toggle_cube_move_indicators(false);
            for (var i = intersect_box.children.length - 1; i > -1; i--){
                if (typeof plane_cube != "undefined" && intersect_box.children[i] != plane_cube){
                    intersect_box.remove(intersect_box.children[i]);
                    plane_cube.material.visible = false;
                }
            }
            for (var i = 0; i < stage.children.length; i++) {// shows GP tools
                stage.children[i].show();
            }
            guide_Z_line.material.visible = true;
            for (var i=0; i<object_list.length; i++){// disappears cubes and all support planes
                object_list[i].cube.traverse( function ( object ) { object.visible = false; } );
                object_list[i].plane.material.visible = false;
            }
            gp_plane.material.visible = true;// shows GP
        }
        else{ // not hovering over any icon
            for (var i=0; i<object_list.length; i++){// making visible all cubes as white, dissappearing all of their support planes
                object_list[i].cube.traverse( function ( object ) { object.visible = true; } );
                changeColor(object_list[i].cube, 0xffffff);
                if (object_list[i].hparent != "unassigned"){
                    object_list[i].plane.material.visible = false;
                }
            }
            for (var i = intersect_box.children.length - 1; i > -1; i--){
                if (typeof plane_cube != "undefined" && intersect_box.children[i] != plane_cube){
                    intersect_box.remove(intersect_box.children[i]);
                    plane_cube.material.visible = false;
                }
            }
            if (window.select != plane){// hiding GP tools and making visible resize arrows if groundplane is not the selected object
                guide_Z_line.material.visible = false;
                for (var i = 0; i < stage.children.length; i++) {
                    stage.children[i].hide();
                }
                gp_plane.material.visible = false;
                toggle_cube_resize_arrows(true);
                var oldest_ancestor = check_oldest_ancestor(window.select);
                if (oldest_ancestor != "unassigned"){
                    window.select.plane.material.visible = true;
                    check_plane_box_collision();
                }
                changeColor(window.select.cube, 0xffff00);
            }else{
                for (var i = 0; i < stage.children.length; i++) {// shows GP tools
                    stage.children[i].show();
                }
                for (var i = intersect_box.children.length - 1; i > -1; i--){
                    if ((typeof plane_cube != "undefined") && (intersect_box.children[i] != plane_cube)){
                        intersect_box.remove(intersect_box.children[i]);
                        plane_cube.material.visible = false;
                    }
                }
                guide_Z_line.material.visible = true;
                gp_plane.material.visible = true;//if GP is selected, make GP visible
            }
        }
        render();
    });
}*/

function ThreeDHoverHighlight(object){// need third options for planes
    for (var i=0; i<object_list.length; i++){// making visible all cubes as white, dissappearing all of their support planes
        if (object_list[i].cube){
            object_list[i].cube.traverse( function ( object ) { object.visible = true; } );
            changeColor(object_list[i].cube, 0xffffff);
        }
        object_list[i].plane.material.visible = false;
    }
    for (var i = intersect_box.children.length - 1; i > -1; i--){
        if (typeof plane_cube != "undefined" && intersect_box.children[i] != plane_cube){
            intersect_box.remove(intersect_box.children[i]);
            plane_cube.material.visible = false;
        }
    }
    if (!(object)){
        if (window.select){
            if (!isNaN(LMgetObjectField(LM_xml, window.select.ID, "ispartof")) && !clip_on ){
                CreatePolygonClip(LMgetObjectField(LM_xml, window.select.ID, "ispartof"));
            }
            if (window.select.cube){// hiding GP tools and making visible resize arrows if groundplane is not the selected object
                console.log("hover")
                guide_Z_line.material.visible = false;
                for (var i = 0; i < stage.children.length; i++) {
                    stage.children[i].hide();
                }
                toggle_cube_resize_arrows(true);
                if (window.select.hparent != "unassigned" && IsHidingAllPlanes == false){
                    window.select.plane.material.visible = true;
                    check_plane_box_collision();
                }
                changeColor(window.select.cube, 0xffff00);
                toggle_cube_resize_arrows(true);
                toggle_cube_move_indicators(true);
                toggle_cube_rotate_indicators(true);
            }else{
                console.log("display");
                if (IsHidingAllPlanes == false){
                    window.select.plane.material.visible = true;
                    DisplayVPTools();
                    main_threed_handler.LoadDifferentPlane(window.select.ID);
                }
               
            }
            check_plane_box_collision();
        }else{
            main_threed_handler.GotoFirstAnnoObject();
        }
    }else if (object.cube){//for cube
        guide_Z_line.material.visible = false;
        for (var i = 0; i < stage.children.length; i++) {// shows GP tools
            stage.children[i].hide();
        }
        for (var i = 0; i < object_list.length; i++){//turns every cube white and disappears groundplane of current selected object
            if ((object_list[i] != window.select) && (object_list[i].cube)){
                console.log("hit");
                changeColor(object_list[i].cube, 0xffffff);
            }
            if (object_list[i] != object){
                object_list[i].plane.material.visible = false;
            }
        }
        if (object.hparent != "unassigned" && IsHidingAllPlanes == false){
            check_plane_box_collision(object);
            object.plane.material.visible = true;//shows groundplane of cube that is being hovered over
        }
        if (object != window.select) changeColor(object.cube, 0xff0000);//makes cube that is hovered over red
        else changeColor(object.cube, 0xffff00);
    }else{//for plane
        for (var i = 0; i < stage.children.length; i++) {// shows GP tools
            stage.children[i].show();
        }
        for (var i = intersect_box.children.length - 1; i > -1; i--){
            if ((typeof plane_cube != "undefined") && (intersect_box.children[i] != plane_cube)){
                intersect_box.remove(intersect_box.children[i]);
                plane_cube.material.visible = false;
            }
        }
        object.plane.material.visible = true;
        guide_Z_line.material.visible = true;
        main_threed_handler.LoadDifferentPlane(object.ID);
        if (IsHidingAllPlanes) ShowPlanes();
    }
    render();
}
/*function reset_icon() {
    var label_list = [];
    icon_container.children[0].innerHTML = icon_container.children[0].value;

    for (var i = 1; i < icon_container.children.length; i++) {
        box_label = icon_container.children[i].value;
        var label_count = 0;
        for (var j = 0; j < label_list.length; j++){
            if (box_label == label_list[j]) {
                label_count++;
            }
        }
        label_list.push(box_label);
        box_label = box_label+"#"+ (label_count+1).toString();
        icon_container.children[i].innerHTML = box_label;
    }
}

function remove_icon() {
    var icon_container = document.getElementById('icon_container');
    icon_container.innerHTML='<button id = "GP" class = "gp_icon"  value= "GP"><font size="3"><b>GP</b></font></button>';
    $("#GP").on("click", function() {
        ThreeDObjectSelect(this);
    });

    for (var i = 0; i < object_list.length; i++) {
        var tmp_button = document.createElement('button');
        tmp_button.id = object_list[i].ID;
        tmp_button.className = "icon";
        tmp_button.value = object_list[i].label;
        icon_container.appendChild(tmp_button);
        $( "#" + (object_list[i].ID) ).on( "click", function() { ThreeDObjectSelect(this); } );
    }
    reset_icon();
    ThreeDObjectSelect(document.getElementById('GP'));// select GP
}*/

function ShowPlanes(){
    IsHidingAllPlanes = false;
    RenderObjectList();
    if (window.select){
        object = window.select;
        document.getElementById('Link'+ window.select.ID).style.color = '#FF0000';
    }else if (hover_object){
        object = hover_object;
    }else{
        RenderObjectList();
        return;
    }
    if ((!(object.cube)) || object.hparent != "unassigned"){
        object.plane.material.visible = true;
        DisplayVPTools();
    }
    check_plane_box_collision();
    renderer.render(scene, camera);

}

function HideAllPlanes(){
    IsHidingAllPlanes = true;
    for (var i = 0; i < object_list.length; i++){
        object_list[i].plane.material.visible = false;
    }
    for (var i = 0; i < stage.children.length; i++) {
            stage.children[i].hide();
    }
    for (var i = 0; i < intersect_box.children.length; i++){
            intersect_box.children[i].material.visible = false;
    }
    RenderObjectList(); 
    renderer.render(scene, camera); 
}

function ShowThreeD(){
    IsHidingAllThreeD = false;
    $("#container").css('display', 'block');
    $("#cnvs").css('display', 'block');
    $("#boxCanvas").css('display', 'block');
    $("#container").css('z-index', '1');
    RenderObjectList();
    if (window.select){
        HighlightSelectedThreeDObject();
        document.getElementById('Link'+ window.select.ID).style.color = '#FF0000';
    }
}

function HideThreeD(){
    IsHidingAllThreeD = true;
    $("#container").css('display', 'none');
    $("#cnvs").css('display', 'none');
    $("#boxCanvas").css('display', 'none');
    $("#clipCanvas").css('display', 'none');
    $("#container").css('z-index', '-3');
    RenderObjectList();
}