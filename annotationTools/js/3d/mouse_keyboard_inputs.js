function onDocumentDoubleClick(event){
    var label_list = [];
    var x = event.clientX;
    var y = event.clientY;
    var element = document.elementFromPoint(x, y).parentNode.parentNode;
    if (window.select == plane && element.id == "container" && lineOn == false){
        var rect = document.getElementById("container").getBoundingClientRect();
        var id = vp_s.length;
        vp_s[id] = new VP_s();
        vp_s[id].x2d[0] = x - rect.left;
        vp_s[id].x2d[1] = vp_s[id].x2d[0] + 100;
        vp_s[id].y2d[0] = y - rect.top;
        vp_s[id].y2d[1] = vp_s[id].y2d[0];
        vp_label[id] = 0;
        addVPline(id, vp_layer);
        stage.draw();
        update_plane();
        addVPline(id, vp_layer);
    }
    else if (typeof ID_dict[element.id] != 'undefined' && ID_dict[element.id] != plane){
        var box_label = prompt("Please choose a label for the box", ID_dict[element.id].label);
        box_label = box_label.replace(/ /g,"_");
        icon_container.children[element.id].value = box_label
        ID_dict[element.id].label = box_label;
        if (box_label in label_list){
            for (var j = 0; j < label_list.length; j++){
                if (box_label == label_list[j]) {
                    label_count++;
                }
            }
            label_list.push(box_label);
            box_label = box_label+" #" + (label_count+1).toString();
        }
    document.getElementById(element.id).innerHTML = "<b><font size=3>"+box_label+"</font><b>";
    }
}


/*function onDocumentMouseDown(event) {
    setupRay(event);
    if (event.target.tagName != "BUTTON" && event.target.tagName != "INPUT"){
        event.preventDefault;
    }
    if (event.target.id == "diffview_cnvs") {
        sidemode = (sidemode + 1) % 3;
        render();
    }
    if (nav_on == true){
        copy_camera();
        rotateStart.set( event.clientX, event.clientY );
        console.log('mouse down rotate');
        nav_toggle = true;
    }else {
        for (var i = 0; i < arrowHelper.arrow_list.length; i++) {
            resize_arrowhead_intersect = ray.intersectObject(arrowHelper.arrow_list[i].cone, false);
            if (resize_arrowhead_intersect.length){
                selected_arrow = arrowHelper.arrow_list[i];
                current_mode = RESIZE_MODE;
                arrowHelper.arrow_list[i].cone.material.color.setHex(0x0000ff);
                resize_x0 = event.clientX;
                resize_y0 = event.clientY;
                var vector1 = new THREE.Vector3(0, 0, 0).applyMatrix4(arrowHelper.arrow_list[i].matrixWorld);
                var vector2 = new THREE.Vector3(0, 1, 0).applyMatrix4(arrowHelper.arrow_list[i].matrixWorld);
                var proj2 = new THREE.Projector();
                var vector3 = new THREE.Vector3();
                vector3.subVectors(vector2, vector1);
                resize_vx = (vector3.x)*renderer.domElement.width/2;
                resize_vy = (-1*vector3.y)*renderer.domElement.height/2;
                var resize_norm = Math.sqrt(resize_vx*resize_vx+resize_vy*resize_vy);
                resize_vx = resize_vx / resize_norm;
                resize_vy = resize_vy / resize_norm;
                resize_scale0 = window.select.cube.scale.clone();
                resize_scale0_orig = window.select.cube.scale.clone();
                resize_pos0 = window.select.cube.position.clone();
                resize_dir = arrowHelper.arrow_list[i].direction;
                console.log(resize_dir);
            }else{
                arrowHelper.arrow_list[i].cone.material.color.setHex(0xff0000);
            }
        }
        if (typeof plane_cube != "undefined"){
            a = ray.intersectObject(plane_cube, true);
            if (a.length) {
                plane_cube.material.color.setRGB(0, 0, 1);
                resize_x0 = event.clientX;
                resize_y0 = event.clientY;
                var vector1 = new THREE.Vector3();
                var vector2 = new THREE.Vector3();
                var proj2 = new THREE.Projector();
                var M = window.select.support_plane.matrixWorld.clone().multiply(plane_cube.matrixWorld);
                proj2.projectVector(vector1.getPositionFromMatrix(M),camera);
                proj2.projectVector(vector2.getPositionFromMatrix(M.clone().multiply(new THREE.Matrix4().makeTranslation(0,1,0))),camera);
                resize_vx = (vector2.x-vector1.x)* renderer.domElement.width/2;
                resize_vy = (-vector2.y+vector1.y)*renderer.domElement.height/2;
                var resize_norm = Math.sqrt(resize_vx*resize_vx+resize_vy*resize_vy);
                resize_vx = resize_vx / resize_norm;
                resize_vy = resize_vy / resize_norm;
                resize_scale0 = window.select.cube.scale.clone();
                resize_pos0 = window.select.cube.position.clone();
                resize_dir = new THREE.Vector3(0, 0, 1);
                if (window.select.hparent != "unassigned" && window.select.hparent != gp_plane){//make this also not gp later
                    current_mode = VERTICAL_PLANE_MOVE_MODE;
                    console.log(current_mode);
                }
                var i_mat = new THREE.Matrix4().getInverse(window.select.support_plane.matrixWorld.clone());
                cube_position_0 = window.select.cube.position.clone();
                cube_position_0.setZ(window.select.cube.position.z - window.select.cube.scale.z*0.05/2);
                cube_position_0_static = window.select.cube.position.clone();
                cube_position_0_static.setZ(window.select.cube.position.z - window.select.cube.scale.z*0.05/2);
                cube_position_0.applyMatrix4(window.select.support_plane.matrixWorld.clone());
                cube_position_0_static.applyMatrix4(window.select.support_plane.matrixWorld.clone());
                //window.select.support_plane.matrixWorld.multiplyMatrices(window.select.hparent.support_plane.matrixWorld, (new THREE.Matrix4()).makeTranslation(0, 0, window.select.hparent.cube.scale.z*small_h));
                window.select.support_plane.material.visible = true;
                old_x = window.select.cube.scale.x;
                old_y = window.select.cube.scale.y;
                old_z = window.select.cube.scale.z;
                old_arrow_x = arrowHelper.arrow_box.scale.x;
                old_arrow_y = arrowHelper.arrow_box.scale.y;
                old_arrow_z = arrowHelper.arrow_box.scale.z;
            }
        }
        var cube_click = [];
        if (window.select.support_plane && current_mode != RESIZE_MODE && (current_mode != VERTICAL_PLANE_MOVE_MODE)) {
            cube_click = ray.intersectObject(window.select.cube, true);
        }
        if (cube_click.length > 0){
            for (var i = 0; i < cube_click.length; i++){
                console.log("box move");
                if (API_dict["mode"] != "model"){
                    current_mode = BOX_MOVE_MODE;
                }
                i_mat = new THREE.Matrix4().getInverse(window.select.support_plane.matrixWorld);
                if (window.select.hparent == "unassigned"){
                    plane_click = ray.intersectObject(vert_plane, false);
                }else{
                    plane_click = ray.intersectObject(window.select.support_plane, false);
                }
                    if (plane_click.length > 0){
                            click_original = plane_click[0].point.applyMatrix4(i_mat); // everything in support plane coordinates
                            //click_original = plane_click[0].point;
                            console.log(click_original);
                    }
                //click_offset.copy(cube_click[i].point.sub( window.select.cube.position.clone()));
                cube_original.copy(window.select.cube.position.clone());
            }
        }
        else if ((window.select.cube) && (current_mode != RESIZE_MODE) && (current_mode != BOX_MOVE_MODE) && (event.target.id == "") && (current_mode != VERTICAL_PLANE_MOVE_MODE)) {
            console.log("rotate");
            prevX = event.clientX;
            targetRotationOnMouseDown = window.select.cube.rotation.z;
            event.preventDefault();
            current_mode = ROTATE_MODE;
            return false;
        }
        render();
    }
    return true;
}*/

/*function onDocumentMouseMove(event) {
    setupRay(event);
    if ($('#im').has(event.target)){
        if (nav_toggle == true) {
            rotateEnd.set( event.clientX, event.clientY );
            rotateDelta.subVectors( rotateEnd, rotateStart );
            rotateLeft( 2 * Math.PI * rotateDelta.x / renderer.domElement.clientWidth * rotateSpeed );
            // rotating up and down along whole screen attempts to go 360, but limited to 180
            rotateUp( 2 * Math.PI * rotateDelta.y / renderer.domElement.clientHeight * rotateSpeed );
            rotateStart.copy( rotateEnd );
            update(camera);
            render();
        }
        if (current_mode == ROTATE_MODE && (API_dict["mode"] != "location")){
            var radians = targetRotationOnMouseDown + (event.clientX - prevX)/500 * Math.PI;
            if (API_dict["mode"] == "model"){
                radians = targetRotationOnMouseDown + (event.clientX - prevX)/250 * Math.PI;
            }
            rotate_mode_indicators[1].material.visible = true;
            toggle_cube_rotate_indicators(true);
            cube_rotate(radians);
        }
        if (current_mode == VERTICAL_PLANE_MOVE_MODE) {
            toggle_cube_rotate_indicators(false);
            toggle_cube_move_indicators(false);
            var resize_x1 = event.clientX;
            var resize_y1 = event.clientY;
            var resize_dot = (resize_x1 - resize_x0)*resize_vx + (resize_y1 - resize_y0)*resize_vy;
            resize_x0 = resize_x1;
            resize_y0 = resize_y1;
            resize_dir = new THREE.Vector3(0, 0, -1);
            window.select.support_plane.matrixWorld.multiplyMatrices(window.select.support_plane.matrixWorld, (new THREE.Matrix4()).makeTranslation(0, 0, (-resize_dot*small_d*resize_dir.z)/50));
            calculate_box_location();
            render();
        }
        else if (current_mode == RESIZE_MODE && (API_dict["mode"] != "location")) {
            var resize_x1 = event.clientX;
            var resize_y1 = event.clientY;
            var resize_dot = ((resize_x1 - resize_x0)*resize_vx + (resize_y1 - resize_y0)*resize_vy)*0.3;
            resize_x0 = resize_x1;
            resize_y0 = resize_y1;
            window.select.cube.scale.set(resize_scale0.x+resize_dot*small_w*Math.abs(resize_dir.x), resize_scale0.y+resize_dot*small_h*Math.abs(resize_dir.y), resize_scale0.z-resize_dot*small_d*resize_dir.z);
            if (resize_dir.x < 0){
                window.select.cube.position.x = resize_pos0.x - small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.cos(window.select.cube.rotation.z) + small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.sin(window.select.cube.rotation.z);
                window.select.cube.position.y = resize_pos0.y - small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.sin(window.select.cube.rotation.z) - small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.cos(window.select.cube.rotation.z);
            }
            else if (resize_dir.x > 0){
                window.select.cube.position.x = resize_pos0.x + small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.cos(window.select.cube.rotation.z) - small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.sin(window.select.cube.rotation.z);
                window.select.cube.position.y = resize_pos0.y + small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.sin(window.select.cube.rotation.z) + small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.cos(window.select.cube.rotation.z);
            }
            if (resize_dir.y < 0){
                window.select.cube.position.x = resize_pos0.x - small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.cos(window.select.cube.rotation.z) + small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.sin(window.select.cube.rotation.z);
                window.select.cube.position.y = resize_pos0.y - small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.sin(window.select.cube.rotation.z) - small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.cos(window.select.cube.rotation.z);
            }
            else if (resize_dir.y > 0 ){
                window.select.cube.position.x = resize_pos0.x + small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.cos(window.select.cube.rotation.z) - small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.sin(window.select.cube.rotation.z);
                window.select.cube.position.y = resize_pos0.y + small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.sin(window.select.cube.rotation.z) + small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.cos(window.select.cube.rotation.z);
            }
            window.select.cube.position.z = resize_pos0.z - small_d*0.5*(window.select.cube.scale.z - resize_scale0.z);
            resize_scale0 = window.select.cube.scale.clone();
            resize_pos0 = window.select.cube.position.clone();
            render();
        }
        else if ($(event.target).parents('div#im_resizable').length && (API_dict["mode"] != "location")) { //event.target.id != "icon_wrapper" && event.target.tagName != "BUTTON" && event.target.tagName != "FONT") && (event.target.id != "icon_container")) { // && (event.target.tagName == "canvas")) {
            var cube_hover = [];
            if (window.select.support_plane) {
                cube_hover = ray.intersectObject(window.select.cube, true);
            }
            cube_hover_toggle = false;
            for (var i = 0; i < cube_hover.length; i++){
                if (cube_hover.length > 0){
                    cube_hover_toggle = true;
                }
            }
            if (((!addOn) && (!removeOn) && (cube_hover_toggle) && (current_mode != ROTATE_MODE) && (current_mode != VERTICAL_PLANE_MOVE_MODE) && (API_dict["mode"] != "location")) || (current_mode == BOX_MOVE_MODE) ) {
                instruct("<b>Current mode: Translation</b><br> Click and drag on support plane to <i><b>move</b></i> box.<br><br>Move a cursor outside of the support plane to switch to Rotation mode.");
                if (API_dict["mode"] != "model"){
                    toggle_cube_move_indicators(true);
                }
                toggle_cube_rotate_indicators(false);
            }
            else if (((!addOn) && (!removeOn) && (plane_indicator_on == false) && (current_mode != BOX_MOVE_MODE) && (window.select != plane) && (current_mode != VERTICAL_PLANE_MOVE_MODE) && (API_dict["mode"]) != "location") || (current_mode == ROTATE_MODE)) {
                instruct("<b>Current mode: Rotation</b><br> Click and drag to <i><b>rotate</b></i> box.<br><br>Move a cursor outside of the support plane to switch to Movement mode.");
                toggle_cube_move_indicators(false);
                toggle_cube_rotate_indicators(true);
                rotate_mode_indicators[1].material.visible = true;
            }
            cube_hover_toggle = false;
            for (var i = 0; i < arrowHelper.arrow_list.length; i++) {
                a = ray.intersectObject(arrowHelper.arrow_list[i].cone, false);
                if (a.length) {
                    arrowHelper.arrow_list[i].cone.material.color.setHex(0x0000ff);
                    instruct("Resize mode: Click and drag to <i><b>resize</b></i> box.");
                    toggle_cube_move_indicators(false);
                    toggle_cube_rotate_indicators(false);
                }
                else {
                    arrowHelper.arrow_list[i].cone.material.color.setHex(0xff0000);
                }
            }
            if (typeof plane_cube != "undefined"){
                b = ray.intersectObject(plane_cube, true);
                if (b.length){
                    plane_cube.material.color.setRGB(0, 0, 1);
                }else{
                    plane_cube.material.color.setRGB(1, 0, 0);
                }
            }
            render();

            // check if the mode is 3D box labeling
            draggable = true;// stuff to make sure that dragging while clicking buttons doesn't trigger the box to move
            window.x = event.clientX;
            window.y = event.clientY;
            elementMouseIsOver = document.elementFromPoint(window.x,window.y);
            icon_container = document.getElementById("icon_container");
            inputs = document.getElementsByTagName("input");
            buttons = document.getElementsByTagName("button");
            //TODO: check if draggable at mousedown than mousemove (so that check if dragging happened within the 3D canvas or outside)
            for (i = 0; i < buttons.length; i++){
                if (elementMouseIsOver == buttons[i]){
                    draggable = false;
                }
            }
            for (i = 0; i< inputs.length; i++){
                if (elementMouseIsOver == inputs[i]) {
                    draggable = false;
                }
            }
            if (elementMouseIsOver == document.getElementById("input") || elementMouseIsOver == document.getElementById("icon_wrapper") || elementMouseIsOver == document.getElementById("model_column")) {
                draggable = false;
            }
            var rect = document.getElementById("im").getBoundingClientRect();
            if ((current_mode == BOX_MOVE_MODE) && (elementMouseIsOver != icon_container)) {
                var current_plane = window.select.support_plane;
                if (window.select.hparent == "unassigned"){
                    a = ray.intersectObject(vert_plane, false);
                }else{
                    a = ray.intersectObject(window.select.support_plane, false);
                }
                for (var i = 0; i < a.length; i++) {
                    var i_mat = new THREE.Matrix4().getInverse(window.select.support_plane.matrixWorld);
                    a[i].point.applyMatrix4(i_mat);
                    //var z_holder = window.select.cube.position.z;
                    window.select.cube.position.copy(cube_original.clone().add(a[i].point.sub(click_original)))
                }
                if (window.select.hparent != "unassigned"){
                    diagonal = Math.sqrt(Math.pow(window.select.cube.scale.x*small_w/2, 2) + Math.pow(window.select.cube.scale.y*small_d/2, 2));
                    if (Math.tan(window.select.cube.rotation.z) >= 0 && Math.cos(window.select.cube.rotation.z) >= 0){//only working from -pi/2 to +pi/2
                        if (window.select.cube.position.x + diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)) > 1){
                            window.select.cube.position.setX(1 - diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)));
                        }
                        if (window.select.cube.position.y + diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)) > 1){
                            window.select.cube.position.setY(1 - diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)));
                        }
                    }
                    if (Math.tan(window.select.cube.rotation.z) < 0 && Math.cos(window.select.cube.rotation.z) >= 0){
                        if (window.select.cube.position.x + diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)) > 1){
                            window.select.cube.position.setX(1 - diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)));
                        }
                        if (window.select.cube.position.y + diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)) > 1){
                            window.select.cube.position.setY(1 - diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)));
                        }
                    }
                    if (Math.tan(window.select.cube.rotation.z) >= 0 && Math.cos(window.select.cube.rotation.z) < 0){
                        if (window.select.cube.position.x - diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)) > 1){
                            window.select.cube.position.setX(1 + diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)));
                        }
                        if (window.select.cube.position.y - diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)) > 1){
                            window.select.cube.position.setY(1 + diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)));
                        }
                    }
                    if (Math.tan(window.select.cube.rotation.z) < 0 && Math.cos(window.select.cube.rotation.z) < 0){
                        if (window.select.cube.position.x - diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)) > 1){
                            window.select.cube.position.setX(1 + diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)));
                        }
                        if (window.select.cube.position.y - diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)) > 1){
                            window.select.cube.position.setY(1 + diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)));
                        }
                    }
                }
                render()
            }
        }
        else {
            instruct(DEFAULT_INSTR);
        }
    }
}*/

function onDocumentMouseUp(event) {
    plane_indicator_on = false;
    rotate_indicator_on = false;
    var anyRerendering = false;
    current_mode = 0;
    if (typeof plane_cube != "undefined"){
        plane_cube.material.color.setHex(0xff0000);
    }

    if ((document.getElementById("navigation")) && (document.getElementById("navigation").checked === false))
    {
        if (DEBUG_MODE) {
            console.log('mouse up');
        }
    }
    else if (nav_toggle == true){
        nav_toggle = false
        camera = old_camera;
    }

    for (var i = 0; i < arrowHelper.arrow_list.length; i++){
        arrowHelper.arrow_list[i].cone.material.color.setHex(0xff0000);
    }



    if (anyRerendering){
        render();
    }
}

function onDocumentKeyDown(evt) {
    var keyCode = evt.keyCode;
    switch (keyCode) {
        case 90:
            if (window.select == plane){
                console.log("zoom");
                toggle_zoom();
            }
            break;
        console.log(evt.keyCode);
            /*case 46:
                if (typeof selected_line_id != "undefined"){
                    var layer = vp_layer;
                    var counter = 0;
                    for (var i = 0; i < vp_label.length; i++){
                        if (vp_label[i] == vp_label[selected_line_id]){
                            counter = counter + 1;
                        }
                    }
                    console.log(counter);
                    if (counter > 2){
                        vp_label.splice(selected_line_id, 1);
                        layer.get('.l' + (selected_line_id)).each(function(shape){
                            shape.remove();
                        });
                        layer.get('.p' + (selected_line_id)*2).each(function(shape){
                            shape.remove();
                        });
                        layer.get('.p' + ((selected_line_id)*2 + 1)).each(function(shape){
                            shape.remove();
                        });
                        stage.draw();
                    }
                    else{
                        alert("There must always be at least two lines of the same color.");
                    }
                }
                break;*/
        case 71:
            var id = vp_s.length;
            vp_s[id] = new VP_s();
            vp_s[id].x2d[0] = vp_s[id].x2d[0] - 100;//constants are arbitrary for initial lines.
            vp_s[id].x2d[1] = vp_s[id].x2d[1] - 50;
            vp_s[id].y2d[0] = vp_s[id].y2d[0] - 60;
            vp_s[id].y2d[1] = vp_s[id].y2d[1] - 50;
            vp_label[id] = 1;
            addVPline(id, vp_layer);
            stage.draw();
            update_plane()
            break;
        case 82:
            var id = vp_s.length;
            vp_s[id] = new VP_s();
            vp_s[id].x2d[0] = vp_s[id].x2d[0] + 100;//constants are arbitrary for initial lines.
            vp_s[id].x2d[1] = vp_s[id].x2d[1] + 50;
            vp_s[id].y2d[0] = vp_s[id].y2d[0] - 60;
            vp_s[id].y2d[1] = vp_s[id].y2d[1] - 50;
            vp_label[id] = 2;
            addVPline(id, vp_layer);
            stage.draw();
            update_plane();
            break;
    }
}

function makeDoubleClick (doubleClickCallback, singleClickCallback) {
    return (function () {
        var clicks = 0, timeout;
        return function () {
            clicks++;
            if (clicks == 1) {
                singleClickCallback && singleClickCallback.apply(this, arguments);
                timeout = setTimeout(function() { clicks = 0; }, 400);
            } else {
            timeout && clearTimeout(timeout);
            doubleClickCallback && doubleClickCallback.apply(this, arguments);
            clicks = 0;
            }
        };
    }());
}
