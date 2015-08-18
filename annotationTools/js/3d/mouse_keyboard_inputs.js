/*function onDocumentDoubleClick(event){
    var label_list = [];
    var x = event.clientX;
    var y = event.clientY;
    var element = document.elementFromPoint(x, y).parentNode.parentNode;
    if (window.select.plane == plane && element.id == "container" && lineOn == false){
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
    document.getElementById(element.id).innerHTML = "<b><font size='3'>"+box_label+"</font><b>";
    }
}*/


function onDocumentMouseDown(event) {
    if ((event.target.tagName != "canvas" && event.target.tagName != "div") || !(window.select)){
        return;
    }
    setupRay(event);
    setupBoxRay(event);
    var scale_factor = main_media.GetImRatio();
    var x = GetEventPosX(event);
    var y = GetEventPosY(event);
    var point = new Point(x, y);
    console.log(x,y);
    if (nav_on == true){
        rotateStart.set( event.clientX, event.clientY );
        console.log('mouse down rotate');
        nav_toggle = true;
        return;
    }
    for (var i = 0; i < arrowHelper.arrow_list.length; i++) {
        resize_arrowhead_intersect = ray.intersectObject(arrowHelper.arrow_list[i].cone, false);
        if (resize_arrowhead_intersect[0]){
            //window.select.cube.matrixAutoUpdate = true;
            arrow_index = i;
            //console.log("intersect");
            original_intersect_point = resize_arrowhead_intersect[0].point.clone();
            ray_vector_orig = resize_arrowhead_intersect[0].point.sub(camera.position);
            original_arrowhead_point = ray_vector_orig;
            arrowhead_object = resize_arrowhead_intersect[0].object;
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
            old_arrow_position = window.select.cube.position.clone();
            old_arrow_position.z = old_arrow_position.z + window.select.cube.scale.z*0.5*small_h;
            old_arrow_position.applyMatrix4(window.select.cube.parent.matrixWorld.clone());
            original_scale = window.select.cube.scale.clone();
           
            /*var projector = new THREE.Projector();
            var mouse3D = projector.unprojectVector(new THREE.Vector3(  0, 0, 1 ), camera );
            var direction = mouse3D.sub(camera.position).normalize();
            var normal = direction.clone().normalize();
            old_arrow_position = window.select.cube.position.clone();
            old_arrow_position.z = old_arrow_position.z + window.select.cube.scale.z*0.5*small_h;
            old_arrow_position.applyMatrix4(window.select.cube.parent.matrixWorld.clone());
            arrow_vector = arrowHelper.arrow_list[i].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[i].cone.parent.matrixWorld.clone());
            arrow_vector = arrow_vector.sub(old_arrow_position);//
            proj_vector = arrow_vector.clone().projectOnPlane(normal);
            old_scale = window.select.cube.scale.clone();
            var vector1 = new THREE.Vector3(0, 0, 0).applyMatrix4(resize_arrowhead_intersect[0].object.matrixWorld);
            var vector2 = new THREE.Vector3(0, 1, 0).applyMatrix4(resize_arrowhead_intersect[0].object.matrixWorld);
            var proj2 = new THREE.Projector();
            var M = arrowHelper.arrow_list[i].matrixWorld.clone();
            proj2.projectVector(vector1, camera);
            proj2.projectVector(vector2, camera);
            resize_vx = (vector2.x-vector1.x)* renderer.domElement.width/2;
            resize_vy = (-vector2.y+vector1.y)*renderer.domElement.height/2;
            //console.log(vector1, vector2);*/
            var resize_norm = Math.sqrt(resize_vx*resize_vx+resize_vy*resize_vy);
            resize_vx = resize_vx / resize_norm;
            resize_vy = resize_vy / resize_norm;
            resize_scale0_orig = window.select.cube.scale.clone();
            resize_pos0 = window.select.cube.position.clone();//
            resize_dir = arrowHelper.arrow_list[i].direction;
            var vert_plane_ray = ray.intersectObject(vert_plane, false);
            arrow_position = arrowHelper.arrow_box.position.clone();
            arrow_position.applyMatrix4(arrowHelper.arrow_box.parent.matrixWorld.clone());
            var i_mat = new THREE.Matrix4().getInverse(vert_plane.matrixWorld.clone());
            var projector = new THREE.Projector();
            var mouse3D = projector.unprojectVector(new THREE.Vector3(  0, 0, 1 ), camera );
            var direction = mouse3D.sub(camera.position).normalize();
            var normal = direction.clone().normalize();
            arrow_vector = arrowHelper.arrow_list[arrow_index].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[arrow_index].cone.parent.matrixWorld.clone());
            arrow_vector = arrow_vector.sub(arrow_position.clone());
            proj_vector = arrow_vector.clone().projectOnPlane(normal).normalize();
            resize_scale0 = window.select.cube.scale.clone();


            /*********************************************/
            normal_for_plane_for_projection = arrow_vector.clone().cross(proj_vector.clone());
            //old_ray_vector = arrowHelper.arrow_list[arrow_index].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[arrow_index].cone.parent.matrixWorld.clone()).sub(camera.position).projectOnPlane(normal_for_plane_for_projection);
            old_ray_vector = arrow_position.clone().sub(camera.position).projectOnPlane(normal_for_plane_for_projection);
            old_arrow_cone_position = arrowHelper.arrow_list[arrow_index].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[arrow_index].cone.parent.matrixWorld.clone());
            old_ray_cone_vector = old_arrow_cone_position.clone().sub(camera.position).projectOnPlane(normal_for_plane_for_projection);
            old_ray_length = old_ray_vector.length();
            /**********************************************/
            break;


            /*if (vert_plane_ray.length){
                console.log(vert_plane_ray[0].point);
                var change_vector = vert_plane_ray[0].point.clone().sub(arrow_position.clone());
                console.log(change_vector);
                change_vector.projectOnPlane(new THREE.Vector3(0, 0, 1));
                var projected_change_vector = change_vector.projectOnVector(proj_vector.clone());
                var angle_a = vert_plane_ray[0].point.clone().sub(camera.position.clone()).normalize().angleTo(arrow_vector.clone()); // these aren't on the right plane
                var angle_b = Math.PI - vert_plane_ray[0].point.clone().sub(camera.position.clone()).normalize().angleTo(proj_vector.clone());
                var scaling = projected_change_vector.length()/Math.sin(angle_a)*Math.sin(angle_b);
                //console.log(scaling);


                test_normal_for_plane_for_projection = arrow_vector.clone().cross(proj_vector.clone());
                test_old_ray_vector = arrow_position.clone().sub(camera.position).projectOnPlane(test_normal_for_plane_for_projection.clone());
                console.log(arrow_position.clone());
                test_old_ray_length = test_old_ray_vector.length();
                console.log(test_old_ray_length);
                //test_projected_new_vector_b = arrowHelper.arrow_list[i].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[i].cone.parent.matrixWorld.clone()).sub(camera.position);
                test_projected_new_vector = arrowHelper.arrow_list[i].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[i].cone.parent.matrixWorld.clone()).sub(camera.position).projectOnPlane(test_normal_for_plane_for_projection);
                var test_angle_c = test_projected_new_vector.angleTo(arrow_vector);
                var test_angle_d = test_projected_new_vector.angleTo(test_old_ray_vector);
                test_resize_amount = test_old_ray_length/Math.sin(test_angle_c)*Math.sin(test_angle_d);
                console.log(test_resize_amount);
                console.log(arrow_vector.length());
            }*/

    
            //console.log(resize_dir);
        }else{
            arrowHelper.arrow_list[i].cone.material.color.setHex(0xff0000);
        }
    }
    var cube_click = [];
    if (window.select && window.select.cube && current_mode != RESIZE_MODE && (current_mode != VERTICAL_PLANE_MOVE_MODE)) {
        if (window.select.cube.parent == box_scene){
            cube_click = box_ray.intersectObject(window.select.cube, true);
        }else{        
            cube_click = ray.intersectObject(window.select.cube, true);
        }
        if (polygon && !(polygon.pointInPoly(point)) && window.select.lock_inside_clip_area){
            console.log("point not in polygon");
            cube_click = [];
        }
        if (cube_click.length > 0){
            for (var i = 0; i < cube_click.length; i++){
                console.log("box move");
                window.select.cube.matrixAutoUpdate = true;
                if (window.select.hparent == "unassigned"){
                    plane_click = ray.intersectObject(vert_plane, false);
                }else{
                    plane_click = ray.intersectObject(collision_plane, false);
                }
                    if (plane_click.length > 0){
                            current_mode = BOX_MOVE_MODE;
                            click_original = plane_click[0].point; // everything in world coordinates
                            //click_original = plane_click[0].point;
                            console.log(click_original);
                    }
                //click_offset.copy(cube_click[i].point.sub( window.select.cube.position.clone()));
                cube_original.copy(window.select.cube.position.clone().applyMatrix4(window.select.cube.parent.matrixWorld.clone()));
            }
        }
    }
    if ((!(window.select.cube) || (window.select.hparent != "unassigned")) && (current_mode != RESIZE_MODE) && (current_mode != VERTICAL_PLANE_MOVE_MODE) && (current_mode != BOX_MOVE_MODE)){
        a = ray.intersectObject(window.select.plane, false);
        if (a.length) {
            CalculateNewOp(window.select.plane.matrixWorld.elements);
            prev_event_x = event.clientX;
            prev_event_y = event.clientY;
            var i_mat = new THREE.Matrix4().getInverse(window.select.plane.matrixWorld.clone());
            console.log(a[0].point);
            console.log(a[0].point.applyMatrix4(i_mat));
            resize_x0 = event.clientX;
            resize_y0 = event.clientY;
            plane_vector1 = new THREE.Vector3();
            plane_vector2 = new THREE.Vector3();
            var proj2 = new THREE.Projector();
            var M = window.select.plane.matrixWorld.clone().multiply(camera.matrixWorld.clone());
            proj2.projectVector(plane_vector1.getPositionFromMatrix(M),camera);
            proj2.projectVector(plane_vector2.getPositionFromMatrix(M.clone().multiply(new THREE.Matrix4().makeTranslation(0, 1, 0))),camera);
            resize_vx = (plane_vector2.x-plane_vector1.x)* renderer.domElement.width/2;
            resize_vy = (-plane_vector2.y+plane_vector1.y)*renderer.domElement.height/2;
            var resize_norm = Math.sqrt(resize_vx*resize_vx+resize_vy*resize_vy);
            var sign = Math.sign(resize_vy);
            resize_vx = resize_vx / resize_norm;
            resize_vy = resize_vy / resize_norm;
            resize_vy = sign/Math.pow(Math.abs(resize_vy), 1.005);

            /*************************************************************************/
             projected_normal = plane_vector2.clone().sub(plane_vector1.clone()).projectOnPlane(new THREE.Vector3(0, 0, 1));
             var projector = new THREE.Projector();
            var mouse3D = projector.unprojectVector(a[0].point.clone().normalize(), camera );
            var direction = mouse3D.sub(camera.position).normalize();
             var vert_plane_ray = new THREE.Raycaster(camera.position, mouse3D)
             vert_plane_ray.set(camera.position, direction);
             var vert_plane_intersection = ray.intersectObject(vert_plane, false);
             if (vert_plane_intersection[0]){
                old_vert_plane_intersect_point = vert_plane_intersection[0].point;
             }


            /*if (Math.abs(resize_vy > 4)){
                resize_vy = sign*2;
            }
            if (Math.abs(resize_vy) < 2){
                resize_vy = sign*2.5;
            }*/
            if (window.select.hparent != "unassigned"){
                resize_scale0 = window.select.cube.scale.clone();
                resize_pos0 = window.select.cube.position.clone();
                resize_dir = new THREE.Vector3(0, 0, 1);
                var i_mat = new THREE.Matrix4().getInverse(window.select.cube.parent.matrixWorld.clone()); // in world coordinates
                cube_position_0 = window.select.cube.position.clone();
                cube_position_0.setZ(window.select.cube.position.z - window.select.cube.scale.z*small_h/2);
                cube_position_0_static = window.select.cube.position.clone();
                cube_position_0_static.setZ(window.select.cube.position.z - window.select.cube.scale.z*small_h/2);
                cube_position_0.applyMatrix4(window.select.cube.parent.matrixWorld.clone());
                cube_position_0_static.applyMatrix4(window.select.cube.parent.matrixWorld.clone());
                //window.select.plane.matrixWorld.multiplyMatrices(window.select.hparent.plane.matrixWorld, (new THREE.Matrix4()).makeTranslation(0, 0, window.select.hparent.cube.scale.z*small_h));
                window.select.plane.material.visible = true;
                old_x = window.select.cube.scale.x;
                old_y = window.select.cube.scale.y;
                old_z = window.select.cube.scale.z;
                old_arrow_x = arrowHelper.arrow_box.scale.x;
                old_arrow_y = arrowHelper.arrow_box.scale.y;
                old_arrow_z = arrowHelper.arrow_box.scale.z;
            }
            current_mode = VERTICAL_PLANE_MOVE_MODE;
            //CalculateChildrenHeightDifferences(window.select);
        }
    }
    if ((window.select) && (window.select.cube) && (current_mode != RESIZE_MODE) && (current_mode != BOX_MOVE_MODE) && (event.target.id == "") && (current_mode != VERTICAL_PLANE_MOVE_MODE)) {
        console.log("rotate");
        prevX = event.clientX;
        targetRotationOnMouseDown = window.select.cube.rotation.z;
        event.preventDefault();
        current_mode = ROTATE_MODE;
    }
    console.log(current_mode);
    return;
}

function onDocumentMouseMove(event) {
    if ((event.target.tagName != "canvas" && event.target.tagName != "div") || !(window.select)){
        return;
    }
    setupRay(event);
    setupBoxRay(event);
    var scale_factor = main_media.GetImRatio();
    var x = GetEventPosX(event);
    var y = GetEventPosY(event);
    var point = new Point(x, y);
    var is_point_in_poly = true;
    if (nav_toggle == true && $('#im').has(event.target)) {
            rotateEnd.set( event.clientX, event.clientY );
            rotateDelta.subVectors( rotateEnd, rotateStart );
            rotateLeft( 2 * Math.PI * rotateDelta.x / renderer.domElement.clientWidth * rotateSpeed );
            rotateUp( 2 * Math.PI * rotateDelta.y / renderer.domElement.clientHeight * rotateSpeed );
            rotateStart.copy( rotateEnd );
            update(camera);
            renderer.render(scene, camera);
            box_renderer.render(box_scene, camera);
    }
    if (!window.select){
        return;
    }
    if (polygon){
        var is_point_in_poly = polygon.pointInPoly(point);
        if (BOX_MOVE_MODE && is_point_in_poly) window.select.lock_inside_clip_area = true;
    }
    if ($('#im').has(event.target)){
        if (current_mode == ROTATE_MODE){
            var radians = targetRotationOnMouseDown + (event.clientX - prevX)/500 * Math.PI;
            radians = targetRotationOnMouseDown + (event.clientX - prevX)/250 * Math.PI;
            rotate_mode_indicators[1].material.visible = true;
            toggle_cube_rotate_indicators(true);
            cube_rotate(radians);
            render_box_object(window.select);

        }
        if (current_mode == VERTICAL_PLANE_MOVE_MODE && IsHidingAllPlanes == false && (window.select.cube)) {
            toggle_cube_rotate_indicators(false);
            toggle_cube_move_indicators(false);
            //op_x = op_x + event.clientX - prev_event_x;
            console.log(op_y);
            op_y = op_y + event.clientY - prev_event_y;
            prev_event_x = event.clientX;
            prev_event_y = event.clientY;

            console.log(op_x, op_y);
            vert_plane_intersect = ray.intersectObject(vert_plane, false);
            if (vert_plane_intersect[0]){
                var change_vector = vert_plane_intersect[0].point.clone().sub(old_vert_plane_intersect_point);
                console.log(change_vector);
                change_vector.projectOnVector(projected_normal);
                var plane_scaling = change_vector.projectOnVector(plane_vector2.clone().sub(plane_vector1.clone())).length();
                old_vert_plane_intersect_point = vert_plane_intersect[0].point.clone();
            }
            var resize_x1 = event.clientX;
            var resize_y1 = event.clientY;
            var resize_dot = (-1*resize_y1 + resize_y0)*Math.abs(resize_vy);
            console.log(resize_vy);
            console.log(resize_y1 - resize_y0);
            resize_x0 = resize_x1;
            resize_y0 = resize_y1;
            resize_dir = new THREE.Vector3(0, 0, 1);
            console.log(plane_scaling);
            //window.select.plane.matrixWorld.multiplyMatrices(window.select.plane.matrixWorld, (new THREE.Matrix4()).makeTranslation(0, 0, (2*Math.sign(resize_dot)*plane_scaling*resize_dir.z)));
            /*if (window.select.hparent != "unassigned"){
                calculate_box_location(window.select, window.select);
            }*/
            update_plane();
            if(window.select.cube){
                /*arrow_box_position = ConvertPosition(window.select.cube, arrowHelper);
                indicator_box_position = ConvertPosition(window.select.cube, indicator_box.parent);*/
                if (window.select.cube.parent != window.select.plane){
                    window.select.cube.parent.matrixWorld = window.select.plane.matrixWorld.clone();
                }
                arrow_box_position = null;
                indicator_box_position = null;
                render_box_object(window.select);

            }
            render_plane_object(window.select);
            if (window.select.plane != plane) check_plane_box_collision();
            //SynchronizeSupportPlanes();
        }
        else if (current_mode == RESIZE_MODE) {
            console.log("box_resize");
            var resize_x1 = event.clientX;
            var resize_y1 = event.clientY;
            //console.log(resize_vx, resize_vy);
            //console.log((resize_x1 - resize_x0), (resize_y1 - resize_y0));
            var resize_dot = ((resize_x1 - resize_x0)*resize_vx + (resize_y1 - resize_y0)*resize_vy)*0.3;
            resize_x0 = resize_x1;
            resize_y0 = resize_y1;
            //resize_dot = resize_dot/resize_mag;
            //window.select.cube.scale.set(window.select.cube.scale.x-resize_dot*small_w*Math.abs(resize_dir.x), window.select.cube.scale.y-resize_dot*small_h*Math.abs(resize_dir.y), window.select.cube.scale.z-resize_dot*small_d*resize_dir.z);
             //console.log(resize_dot);
            var vert_plane_ray = ray.intersectObject(vert_plane, false);
            //arrow_position = arrowHelper.arrow_box.position.clone();
            ///arrow_position.applyMatrix4(arrowHelper.arrow_box.parent.matrixWorld.clone());
            var i_mat = new THREE.Matrix4().getInverse(vert_plane.matrixWorld.clone());
            var projector = new THREE.Projector();
            var mouse3D = projector.unprojectVector(new THREE.Vector3(  0, 0, 1 ), camera );
            var direction = mouse3D.sub(camera.position).normalize();
            var normal = direction.clone().normalize();
            //arrow_vector = arrowHelper.arrow_list[arrow_index].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[arrow_index].cone.parent.matrixWorld.clone());
            //arrow_vector = arrow_vector.sub(arrow_position.clone());
            //console.log(arrow_vector.length());

            //old_arrow_cone_position = arrowHelper.arrow_list[arrow_index].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[arrow_index].cone.parent.matrixWorld.clone());
            //old_ray_cone_vector = old_arrow_cone_position.clone().sub(camera.position).projectOnPlane(normal_for_plane_for_projection);
            //console.log(arrow_vector.clone().normalize());
            if (vert_plane_ray[0]){
                console.log(vert_plane_ray[0].point);
                var change_vector = vert_plane_ray[0].point.clone().sub(old_arrow_cone_position.clone());
                console.log(old_arrow_cone_position.clone());
                //console.log(change_vector);
                change_vector.projectOnPlane(normal);
                console.log("change vector");
                console.log(change_vector);
                sign = Math.sign(change_vector.clone().normalize().dot(proj_vector.clone().normalize())); // see if projection of change vector on proj vector is positive or negative
                console.log(change_vector.clone().normalize().dot(proj_vector.clone().normalize()));
                //console.log(sign);
                //if (vert_plane_ray[0].point.clone().sub(arrow_position.clone()).projectOnPlane(normal).length() > proj_vector.length()) return;
                //console.log(change_vector);
                //console.log(change_vector.clone().normalize().add(proj_vector.clone().normalize()).length());
                //console.log(change_vector.clone().length());
                projected_new_vector = vert_plane_ray[0].point.clone().sub(camera.position).projectOnPlane(normal_for_plane_for_projection);
                var projector = new THREE.Projector();
                ray_vector0 = old_arrow_cone_position.clone().sub(camera.position).projectOnPlane(normal_for_plane_for_projection);
                var mouse3D = projector.unprojectVector(ray_vector0.clone().normalize(), camera );
                var direction = mouse3D.sub(camera.position).normalize();
                distance_ray = new THREE.Raycaster(camera.position, mouse3D);
                distance_ray.set(camera.position, direction);
                var distance_ray_intersect = distance_ray.intersectObject(vert_plane, false);
                //old_vector_distance_to_arrow_origin = distance_ray_intersect[0].point.distanceTo(old_arrow_position);
                //new_vector_distance_to_arrow_origin = projected_new_vector.distanceTo(old_arrow_position);
               // console.log(old_vector_distance_to_arrow_origin);
                //console.log(new_vector_distance_to_arrow_origin);
                /*if (change_vector.clone().normalize().add(proj_vector.clone().normalize()).length() < 1){
                    sign_constant = -1
                }else{
                    sign_constant = 1;
                }*/
                /*var projected_change_vector = change_vector.projectOnVector(proj_vector.clone());
                var angle_a = vert_plane_ray[0].point.clone().sub(camera.position.clone()).normalize().angleTo(arrow_vector.clone());//opposite of projected_change_vector
                var angle_b = vert_plane_ray[0].point.clone().sub(camera.position.clone()).normalize().angleTo(proj_vector.clone());*/
                //var scaling = projected_change_vector.length()/Math.sin(angle_a)*Math.sin(angle_b);
                old_ray_vector = old_ray_cone_vector.clone().sub(camera.position);
                old_ray_vector.projectOnPlane(normal_for_plane_for_projection.clone());
                //console.log(old_ray_vector);

                /**********************************************************************************/
                /*normal_for_plane_for_projection = arrow_vector.clone().cross(proj_vector.clone());
                old_ray_vector = arrowHelper.arrow_list[arrow_index].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[arrow_index].cone.parent.matrixWorld.clone()).sub(camera.position);
                old_ray_vector.projectOnPlane(normal_for_plane_for_projection.clone());
                old_ray_length = old_ray_vector.length();
                projected_new_vector = vert_plane_ray[0].point.clone().sub(camera.position).projectOnPlane(normal_for_plane_for_projection);
                var angle_c = projected_new_vector.angleTo(arrow_vector);
                var angle_d = projected_new_vector.angleTo(old_ray_vector);
                var resize_amount = old_ray_length/Math.sin(angle_c)*Math.sin(angle_d);
                console.log(resize_amount);*/
                //console.log(test_old_ray_length);
                //test_projected_new_vector_b = arrowHelper.arrow_list[i].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[i].cone.parent.matrixWorld.clone()).sub(camera.position);
                var angle_c = projected_new_vector.angleTo(arrow_vector);// doesn't change
                var angle_d = projected_new_vector.angleTo(old_ray_vector); //this oscillates
                /*console.log(old_ray_vector.length());
                console.log(Math.sin(angle_c));
                console.log(Math.sin(angle_d));
                console.log(Math.sin(angle_d)/Math.sin(angle_c));*/
                var resize_amount = old_ray_vector.length()/Math.sin(angle_c)*Math.sin(angle_d);
                console.log(resize_amount);
                /**********************************************************************************/
                //console.log(projected_change_vector.length())
                //console.log(scaling);
                //sign_constant = 1;
                sign_constant = sign;
                var resize_constant_a = 20;
                var resize_constant_b = 20;
                var difference_factor = window.select.cube.position.clone().distanceTo(resize_pos0)/small_w;
                console.log(resize_pos0);
                if (resize_dir.x){
                    window.select.cube.scale.setX(original_scale.x + sign_constant*resize_amount/small_w);
                    if (window.select.cube.scale.x > 200){
                        window.select.cube.scale.x = 200;
                        return;
                    }
                    if (window.select.cube.scale.x < 0){
                        window.select.cube.scale.x = 0;
                        return;
                    }
                }else if (resize_dir.y){
                    window.select.cube.scale.setY(original_scale.y + sign_constant*resize_amount/small_w);
                    if (window.select.cube.scale.y > 200){
                        window.select.cube.scale.y = 200;
                        return;
                    }
                    if (window.select.cube.scale.y < 0){
                        window.select.cube.scale.y = 0;
                        return;
                    }
                }else if (resize_dir.z){
                    window.select.cube.scale.setZ(original_scale.z + sign_constant*resize_amount/small_w);
                    if (window.select.cube.scale.z > 200){
                        window.select.cube.scale.z = 200;
                        return;
                    }
                    if (window.select.cube.scale.y < 0){
                        window.select.cube.scale.y = 0;
                        return;
                    }
                    window.select.cube.position.z = resize_pos0.z + small_h*0.5*(window.select.cube.scale.z - resize_scale0.z);
                }
                //window.select.cube.scale.set(16*scaling*Math.abs(resize_dir.x), 16*scaling*Math.abs(resize_dir.y), 16*scaling*resize_dir.z);
                //console.log(scaling);
                /*********/
                /**********/
            }
            //resize_pos0 = window.select.cube.position.clone();

            //resize_pos0 = window.select.cube.position.clone();

            //console.log(resize_scale0);

            /*if (resize_dir.x < 0){
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
            }*/
            if (resize_dir.x < 0 || resize_dir.y < 0){
                window.select.cube.position.setX(resize_pos0.x - small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.cos(window.select.cube.rotation.z) + small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.sin(window.select.cube.rotation.z));
                window.select.cube.position.setY(resize_pos0.y - small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.sin(window.select.cube.rotation.z) - small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.cos(window.select.cube.rotation.z));
            }
            else if (resize_dir.x > 0 || resize_dir.y > 0){
                window.select.cube.position.setX(resize_pos0.x + small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.cos(window.select.cube.rotation.z) - small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.sin(window.select.cube.rotation.z));
                window.select.cube.position.setY(resize_pos0.y + small_w*0.5*(window.select.cube.scale.x - resize_scale0.x)*Math.sin(window.select.cube.rotation.z) + small_h*0.5*(window.select.cube.scale.y - resize_scale0.y)*Math.cos(window.select.cube.rotation.z));
            }

            //resize_scale0 = window.select.cube.scale.clone();
            vert_plane.matrixWorldNeedsUpdate = false;
            render_box_object(window.select);
        }
        else if ($(event.target).parents('div#main_media').length && !$(event.target).parents('div#icon_wrapper').length && event.target.id != "icon_wrapper" && window.select.cube) { //event.target.id != "icon_wrapper" && event.target.tagName != "BUTTON" && event.target.tagName != "FONT") && (event.target.id != "icon_container")) { // && (event.target.tagName == "canvas")) {
            var cube_hover = [];
            if (window.select.cube) {
                cube_hover = ray.intersectObject(window.select.cube, true);
            }
            cube_hover_toggle = false;
            for (var i = 0; i < cube_hover.length; i++){
                if (cube_hover.length > 0){
                    cube_hover_toggle = true;
                }
            }
            if (((!addOn) && (!removeOn) && (cube_hover_toggle) && (current_mode != ROTATE_MODE) && (current_mode != VERTICAL_PLANE_MOVE_MODE)) || (current_mode == BOX_MOVE_MODE) ) {
                toggle_cube_move_indicators(true);
                toggle_cube_rotate_indicators(false);
            }
            else if (((!addOn) && (!removeOn) && (plane_indicator_on == false) && (current_mode != BOX_MOVE_MODE) && (window.select != plane) && (current_mode != VERTICAL_PLANE_MOVE_MODE)) || (current_mode == ROTATE_MODE)) {
                toggle_cube_move_indicators(false);
                toggle_cube_rotate_indicators(true);
                rotate_mode_indicators[1].material.visible = true;
            }
            cube_hover_toggle = false;
            for (var i = 0; i < arrowHelper.arrow_list.length; i++) {
                a = ray.intersectObject(arrowHelper.arrow_list[i].cone, false);
                if (a.length) {
                    arrowHelper.arrow_list[i].cone.material.color.setHex(0x0000ff);
                    toggle_cube_move_indicators(false);
                    toggle_cube_rotate_indicators(false);
                }
                else {
                    arrowHelper.arrow_list[i].cone.material.color.setHex(0xff0000);
                }
            }
            render();

            // check if the mode is 3D box labeling
            draggable = true;// stuff to make sure that dragging while clicking buttons doesn't trigger the box to move
            window.x = event.clientX;
            window.y = event.clientY;
            elementMouseIsOver = document.elementFromPoint(window.x,window.y);
            icon_container = document.getElementById("icon_container");
            buttons = document.getElementsByTagName("button");
            //TODO: check if draggable at mousedown than mousemove (so that check if dragging happened within the 3D canvas or outside)
            for (i = 0; i < buttons.length; i++){
                if (elementMouseIsOver == buttons[i]){
                    draggable = false;
                }
            }
            if (elementMouseIsOver == document.getElementById("icon_wrapper") || elementMouseIsOver == document.getElementById("model_column")) {
                draggable = false;
            }
            var rect = document.getElementById("im").getBoundingClientRect();
            if ((current_mode == BOX_MOVE_MODE) && is_point_in_poly) {
                if (window.select.hparent == "unassigned"){
                    a = ray.intersectObject(vert_plane, false);
                }else{
                    a = ray.intersectObject(collision_plane, false);
                }
                for (var i = 0; i < a.length; i++) {
                    var i_mat = new THREE.Matrix4().getInverse(window.select.cube.parent.matrixWorld);
                    window.select.cube.position.copy(cube_original.clone().add(a[i].point.sub(click_original)).applyMatrix4(i_mat));
                }
                if (window.select.hparent != "unassigned"){
                    diagonal = Math.sqrt(Math.pow(window.select.cube.scale.x*small_w/2, 2) + Math.pow(window.select.cube.scale.y*small_d/2, 2));
                    if (Math.tan(window.select.cube.rotation.z) >= 0 && Math.cos(window.select.cube.rotation.z) >= 0){//only working from -pi/2 to +pi/2
                        if (window.select.cube.position.x + diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)) > 25){
                            window.select.cube.position.setX(25 - diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)));
                        } 
                        if (window.select.cube.position.y + diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)) > 25){
                            window.select.cube.position.setY(25 - diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)));
                        }
                    }
                    if (Math.tan(window.select.cube.rotation.z) < 0 && Math.cos(window.select.cube.rotation.z) >= 0){
                        if (window.select.cube.position.x + diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)) > 25){
                            window.select.cube.position.setX(25 - diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)));
                        }
                        if (window.select.cube.position.y + diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)) > 25){
                            window.select.cube.position.setY(25 - diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)));
                        }
                    }
                    if (Math.tan(window.select.cube.rotation.z) >= 0 && Math.cos(window.select.cube.rotation.z) < 0){
                        if (window.select.cube.position.x - diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)) > 25){
                            window.select.cube.position.setX(25 + diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)));
                        }
                        if (window.select.cube.position.y - diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)) > 25){
                            window.select.cube.position.setY(25 + diagonal*Math.cos(window.select.cube.rotation.z - Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)));
                        }
                    }
                    if (Math.tan(window.select.cube.rotation.z) < 0 && Math.cos(window.select.cube.rotation.z) < 0){
                        if (window.select.cube.position.x - diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)) > 25){
                            window.select.cube.position.setX(25 + diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.y/window.select.cube.scale.x)));
                        }
                        if (window.select.cube.position.y - diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)) > 25){
                            window.select.cube.position.setY(25 + diagonal*Math.cos(window.select.cube.rotation.z + Math.atan(window.select.cube.scale.x/window.select.cube.scale.y)));
                        }
                    }
                }
                //arrow_box_position = ConvertPosition(window.select.cube, arrowHelper);
                //indicator_box_position = ConvertPosition(window.select.cube, indicator_box.parent);
                render_box_object(window.select);
            }
        }
    }
    if (window.select.cube){
        arrow_box_position = ConvertPosition(window.select.cube, arrowHelper);
        indicator_box_position = ConvertPosition(window.select.cube, indicator_box.parent);
    }

}

function onDocumentMouseUp(event) {
    plane_indicator_on = false;
    rotate_indicator_on = false;
    var anyRerendering = false;
    if (current_mode == BOX_MOVE_MODE || current_mode == RESIZE_MODE){
        main_threed_handler.BoxAutoSave();
    }
    if (current_mode == VERTICAL_PLANE_MOVE_MODE){
        update_plane();
        if (!window.select.cube) main_threed_handler.PlaneAutoSave(window.select.ID);
        else {
                CalculateObjectHeightDifference(window.select);
                main_threed_handler.BoxAutoSave(window.select.ID);
            }
    }
    current_mode = 0;
    if ((document.getElementById("navigation")) && (document.getElementById("navigation").checked === false))
    {
        if (DEBUG_MODE) {
            console.log('mouse up');
        }
    }
    else if (nav_toggle == true){
        nav_toggle = false;
    }

    for (var i = 0; i < arrowHelper.arrow_list.length; i++){
        arrowHelper.arrow_list[i].cone.material.color.setHex(0xff0000);
    }
    if (anyRerendering){
        renderer.render(scene, camera);
        box_renderer.render(box_scene, camera);
    }
}

function onDocumentKeyDown(evt) {
    var keyCode = evt.keyCode;
    switch (keyCode) {
        case 90:
            if (window.select.plane == plane){
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

function calculateResizeMagnitude(resize_x0, resize_y0){
 // 3d coordinates of arrowhead
    var rect = document.getElementById("main_media").getBoundingClientRect();
    var scale_factor = main_media.browser_im_ratio/main_media.im_ratio;
    var projector = new THREE.Projector();
    console.log(resize_x0, resize_y0);
    var original_mouse3D = projector.unprojectVector(new THREE.Vector3( ( (resize_x0 -rect.left)*scale_factor/ renderer.domElement.width ) * 2 - 1, - ( (resize_y0-rect.top)*scale_factor / renderer.domElement.height ) * 2 + 1, 1 ), camera ); // 3d coordinates of original screen point
    var x_scale = (original_mouse3D.x - camera.position.x)/original_arrowhead_point.x;
    console.log(original_mouse3D.x);
    console.log(camera.position.x);
    console.log(original_arrowhead_point.x);
    console.log(x_scale);
    var new_mouse3D = projector.unprojectVector(new THREE.Vector3( ( (event.clientX -rect.left)*scale_factor/ renderer.domElement.width ) * 2 - 1, - ( (event.clientY-rect.top)*scale_factor / renderer.domElement.height ) * 2 + 1, 1 ), camera ); // 3d coordinates of original screen point
    var resize_x0 = event.clientX;
    var resize_y0 = event.clientY;
    var new_x = (new_mouse3D.x - camera.position.x)/x_scale; // calculate x coordinate of new point based on scale
    console.log(new_x);
    var vector2 = new THREE.Vector3(0, 1, 0).applyMatrix4(arrowhead_object.matrixWorld).normalize();
    var new_scale = (new_x - original_arrowhead_point.x)/vector2.x;
    console.log(new_scale);
    var new_point = original_arrowhead_point.add(vector2.multiplyScalar(new_scale));
    var magnitude = original_arrowhead_point.distanceTo(new_point);
    original_arrowhead_point = new_point;
    console.log(magnitude);
    return magnitude;
}

function CalculateChildrenHeightDifferences(object){
    for (var i = 0; i < object.hchildren.length; i++){
        if (!object.cube || !object.hchildren[i].cube) continue;
         var plane_normal = new THREE.Vector3(0, 0, 1).getPositionFromMatrix(object.plane.matrixWorld);
         var cube_plane_position = object.cube.position.clone().applyMatrix4(object.cube.parent.matrixWorld.clone());
        if (object.hchildren[i].cube){
            var child_position = object.hchildren[i].cube.position.clone().sub(new THREE.Vector3(0, 0, object.hchildren[i].cube.scale.clone().z*small_h*0.5)).applyMatrix4(object.hchildren[i].cube.parent.matrixWorld.clone());
            var projected_distance = child_position.sub(cube_plane_position).projectOnVector(new THREE.Vector3(0, 0, 1).applyMatrix4(object.cube.parent.matrixWorld.clone())).length();
            object.hchildren[i].height_from_parent_cube = projected_distance;
        }
        //CalculateChildrenHeightDifferences(object.hchildren[i]);
    }
}

function CalculateObjectHeightDifference(object){

    if (!object.cube || !object.hparent.cube) return;
    var plane_normal = new THREE.Vector3(0, 0, 1).getPositionFromMatrix(object.hparent.plane.matrixWorld.clone());
    var cube_position = object.hparent.cube.position.clone().applyMatrix4(object.hparent.cube.parent.matrixWorld.clone());
    var child_position = object.cube.position.clone().sub(new THREE.Vector3(0, 0, object.cube.scale.clone().z*small_h*0.5)).applyMatrix4(object.cube.parent.matrixWorld.clone());
    var projected_distance = child_position.sub(cube_position).projectOnVector(new THREE.Vector3(0, 0, 1).applyMatrix4(object.hparent.cube.parent.matrixWorld.clone())).length();
    object.height_from_parent_cube = projected_distance;
}





function SynchronizeSupportPlanes(object, parentSyncOn){// if parentSyncOn is false, don't sync parent plane (because of recursion, so no loop)
    if (!object){
        object = window.select;
    }
    if (CheckIfSupportedByGroundplane(object) == false) return;
    //CalculateChildrenHeightDifferences(object);
    if (object.plane == plane){
        if (current_mode == POINT_DRAG_MODE){
            var lines_array = LMgetObjectField(LM_xml, object.ID, "lines");
            var lines = '';
            for (var i = 0; i < lines_array.length; i+=5){
                lines += '<vp_line>';
                lines += '<x1>' + lines_array[i] + '</x1>';
                lines += '<y1>' + lines_array[i+1] + '</y1>';
                lines += '<x2>' + lines_array[i+2] + '</x2>';
                lines += '<y2>' + lines_array[i+3] + '</y2>';
                lines += '<label>' + lines_array[i+4] + '</label>';
                lines += '</vp_line>';
            }
            for (var j = 0; j < object_list.length; j ++){
                if (object_list[j].cube && object_list[j].hparent == "unassigned"){
                    LMsetObjectField(LM_xml, object_list[j].ID, 'lines', lines);
                }
            }

        }
       
    }
    for (var i = 0; i < object.hchildren.length; i++){
        if (!object.cube){
            object.hchildren[i].plane.matrixWorld = object.plane.matrixWorld.clone();
        }else{
            if (object.hchildren[i].height_from_parent_cube == null){
              //CalculateObjectHeightDifference(object.hchildren[i]);
              continue;  
            } 
            var holder = object.hchildren[i].height_from_parent_cube;
            console.log( object.hchildren[i].height_from_parent_cube);
             object.hchildren[i].plane.matrixWorld.multiplyMatrices(object.plane.matrixWorld.clone(), (new THREE.Matrix4()).makeTranslation(0, 0, holder + object.cube.scale.clone().z*small_h*0.5));
            console.log( object.hchildren[i].height_from_parent_cube);
           
        }
        if (object.hchildren[i].cube && object.hchildren[i].cube.parent != object.hchildren[i].plane){
            object.hchildren[i].cube.parent.matrixWorld = object.hchildren[i].plane.matrixWorld.clone();
        }
        if (object.hchildren[i].cube){
            var lines_array = LMgetObjectField(LM_xml, object.ID, "lines");
            console.log(lines_array);
            if (current_mode == POINT_DRAG_MODE){
                var lines = '';
                for (var j = 0; j < lines_array.length; j+=5){
                        lines += '<vp_line>';
                        lines += '<x1>' + lines_array[j] + '</x1>';
                        lines += '<y1>' + lines_array[j+1] + '</y1>';
                        lines += '<x2>' + lines_array[j+2] + '</x2>';
                        lines += '<y2>' + lines_array[j+3] + '</y2>';
                        lines += '<label>' + lines_array[j+4] + '</label>';
                        lines += '</vp_line>';
            }
            console.log(lines);
            LMsetObjectField(LM_xml, object.hchildren[i].ID, 'lines', lines);
            }
            
            //LMsetObjectField(LM_xml, index, 'op_points', op_points);
            //proportion_array[cube_object.ID] = arrowHelper.arrow_box.scale.x;
            main_threed_handler.PlaneAutoSave(object.hchildren[i].ID);
            render_box_object(object.hchildren[i]);
        }
        SynchronizeSupportPlanes(object.hchildren[i], false);
    }
    if (object.hparent != "unassigned" && !object.hparent.cube && parentSyncOn !== false){
        object.hparent.plane.matrixWorld = object.plane.matrixWorld.clone();
        for (var i = 0; i < object.hparent.hchildren.length; i++){
            if (object.hparent.hchildren[i] != object){
                SynchronizeSupportPlanes(object.hparent);
                console.log("synchronize children");
            }
        }
        main_threed_handler.PlaneAutoSave(object.hparent.ID);
        console.log(object.hparent.ID);
        console.log("saving parent");
    }
}
function update(camera) {
    var position = camera.position;
    var offset = position.clone().sub( target );// so the problem is the target

    // angle from z-axis around y-axis
    var theta = Math.atan2( offset.x, offset.z );

    // angle from y-axis
    var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

    theta += thetaDelta;
    phi += phiDelta;

    // restrict phi to be between desired limits
    phi = Math.max( minPolarAngle, Math.min( maxPolarAngle, phi ) );

    // restrict phi to be betwee EPS and PI-EPS
    phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

    var radius = offset.length() * scale; //offset.length() = 0

    // restrict radius to be between desired limits
    radius = Math.max( 0, Math.min( Infinity, radius ) );

    offset.x = radius * Math.sin( phi ) * Math.sin( theta );
    offset.y = radius * Math.cos( phi );
    offset.z = radius * Math.sin( phi ) * Math.cos( theta );

    position.copy( target ).add( offset );

    camera.lookAt( target );

    //console.log(position);

    thetaDelta = 0;
    phiDelta = 0;
    scale = 1;
}

function copy_camera() {
    old_camera = new THREE.PerspectiveCamera();
    old_camera.aspect = camera.aspect;
    old_camera.near = camera.near;
    old_camera.far = camera.far;
    old_camera.fov = camera.fov;
    old_camera.position = camera.position.clone();
    old_camera.projectionMatrix = camera.projectionMatrix.clone();
}

function rotateLeft(angle){
    thetaDelta -= angle;
}
function rotateUp(angle){
    phiDelta -= angle;
}