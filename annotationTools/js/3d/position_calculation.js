function assign_height(){
    //Apprise("Select the box that is the support object.", okAlert);
    heightOn = true;
}

function calculate_box_location(){
    //var cube_position_holder = cube_position_0.clone();
    var direction = new THREE.Vector3(cube_position_0.x - camera.position.x, cube_position_0.y - camera.position.y, cube_position_0.z - camera.position.z).normalize();
    var optical_ray = new THREE.Raycaster(camera.position, direction);
    if (current_mode == VERTICAL_PLANE_MOVE_MODE){
        var plane_intersection = optical_ray.intersectObject(window.select.support_plane, false);
    }else if (window.select.hparent == gp_plane){
        var plane_intersection = optical_ray.intersectObject(gp_plane, false);
        window.select.support_plane.matrixWorld = gp_plane.matrixWorld.clone();
    }else{
        window.select.support_plane.matrixWorld.multiplyMatrices(window.select.hparent.support_plane.matrixWorld.clone(), (new THREE.Matrix4()).makeTranslation(0, 0, window.select.hparent.cube.scale.z*small_h));
        var plane_intersection = optical_ray.intersectObject(window.select.support_plane, false);
    }
    if (plane_intersection){
        for (var i = 0; i < plane_intersection.length; i++){
            var i_mat2 = new THREE.Matrix4().getInverse(window.select.support_plane.matrixWorld);
            plane_intersection[i].point.applyMatrix4(i_mat2);//x and y in support plane
            window.select.cube.position.copy(plane_intersection[i].point);
            proportion_scale = camera.position.distanceTo(plane_intersection[i].point.applyMatrix4(window.select.support_plane.matrixWorld))/camera.position.distanceTo(cube_position_0_static);
            window.select.cube.scale.x = proportion_scale*old_x;
            window.select.cube.scale.y = proportion_scale*old_y;
            window.select.cube.scale.z = proportion_scale*old_z;
            arrowHelper.arrow_box.scale.x = proportion_scale*old_arrow_x;
            arrowHelper.arrow_box.scale.y = proportion_scale*old_arrow_y;
            arrowHelper.arrow_box.scale.z = proportion_scale*old_arrow_z;
            window.select.cube.position.setZ(window.select.cube.scale.z*small_h/2);
        }
    }
    proportion_array[window.select.ID] = arrowHelper.arrow_box.scale.x;
    if (window.select.hchildren.length > 0){
        for (var i = 0; i < window.select.hchildren.length; i++){
            calculate_children_box_locations(window.select.hchildren[i])
        }
    }
    check_plane_box_collision();
    render();
}

function calculate_children_box_locations(object){
    target_cube_position_0 = object.cube.position.clone();
    target_cube_position_0.setZ(object.cube.position.z - object.cube.scale.z*0.05/2);
    target_cube_position_0_static = object.cube.position.clone();
    target_cube_position_0_static.setZ(object.cube.position.z - object.cube.scale.z*0.05/2);
    target_cube_position_0.applyMatrix4(object.support_plane.matrixWorld.clone());
    target_cube_position_0_static.applyMatrix4(object.support_plane.matrixWorld.clone());
    target_cube_scale_0 = object.cube.scale.clone();
    object.support_plane.matrixWorld.multiplyMatrices(object.hparent.support_plane.matrixWorld, (new THREE.Matrix4()).makeTranslation(0, 0, object.hparent.cube.scale.z*small_w));
    var direction = new THREE.Vector3(target_cube_position_0.x - camera.position.x, target_cube_position_0.y - camera.position.y, target_cube_position_0.z - camera.position.z).normalize();
    var optical_ray = new THREE.Raycaster(camera.position, direction);
    var plane_intersection = optical_ray.intersectObject(object.support_plane, false);
    if (plane_intersection){
        for (var i = 0; i < plane_intersection.length; i++){
            var i_mat = new THREE.Matrix4().getInverse(object.support_plane.matrixWorld);
            plane_intersection[i].point.applyMatrix4(i_mat);
            object.cube.position.copy(plane_intersection[i].point);
            var proportion_scale = camera.position.distanceTo(plane_intersection[i].point.applyMatrix4(object.support_plane.matrixWorld.clone()))/camera.position.distanceTo(target_cube_position_0_static);
            object.cube.scale.x = proportion_scale*target_cube_scale_0.x;
            object.cube.scale.y = proportion_scale*target_cube_scale_0.y;
            object.cube.scale.z = proportion_scale*target_cube_scale_0.z;
            object.cube.position.setZ(object.cube.scale.z*small_h/2);
        }
    }
    if (typeof proportion_array[object.ID] == "undefined"){
        proportion_array[object.ID] = 1;
    }
    proportion_array[object.ID] = proportion_scale*proportion_array[object.ID];
    if (object.hchildren){
        for (var i = 0; i < object.hchildren.length; i++){
            calculate_children_box_locations(object.hchildren[i])
        }
    }
    render();
}