function calculate_box_location(cube_object, support_object){ // make it the bottom position of the object
    //var cube_position_holder = cube_position_0.clone();
    if (!cube_object.cube){
        cube_object.plane.matrixWorld = support_object.plane.matrixWorld.clone();
    }
    var direction = new THREE.Vector3(cube_position_0.x - camera.position.x, cube_position_0.y - camera.position.y, cube_position_0.z - camera.position.z).normalize();
    var optical_ray = new THREE.Raycaster(camera.position, direction);
    if (CheckIfSupportedByGroundplane(support_object) == false){
        return;
    }else if (!(support_object.cube)){//if support object is a plane - making the cube object plane the same height as the plane that is supporting
        var plane_intersection = optical_ray.intersectObject(support_object.plane, false);
        cube_object.plane.matrixWorld = support_object.plane.matrixWorld.clone();
        if (cube_object.cube.parent != cube_object.plane){
            cube_object.cube.parent.matrixWorld = cube_object.plane.matrixWorld.clone();
        }
    }else{//if support object is a cube - moving the plane of the cube object to the correct height
        cube_object.plane.matrixWorld.multiplyMatrices(support_object.plane.matrixWorld.clone(), (new THREE.Matrix4()).makeTranslation(0, 0, support_object.cube.scale.z*small_h));
        var plane_intersection = optical_ray.intersectObject(cube_object.plane, false);
        if (cube_object.cube.parent != cube_object.plane){
            cube_object.cube.parent.matrixWorld = cube_object.plane.matrixWorld.clone();
        }
    }
    if (plane_intersection){
        for (var i = 0; i < plane_intersection.length; i++){
            var i_mat2 = new THREE.Matrix4().getInverse(cube_object.cube.parent.matrixWorld);
            plane_intersection[i].point.applyMatrix4(i_mat2);//x and y in support plane
            cube_object.cube.position.copy(plane_intersection[i].point);
            proportion_scale = camera.position.distanceTo(plane_intersection[i].point.applyMatrix4(cube_object.cube.parent.matrixWorld.clone()))/camera.position.distanceTo(cube_position_0_static);
            cube_object.cube.scale.x = proportion_scale*old_x;
            cube_object.cube.scale.y = proportion_scale*old_y;
            cube_object.cube.scale.z = proportion_scale*old_z;
            /*arrowHelper.arrow_box.scale.x = proportion_scale*old_arrow_x;
            arrowHelper.arrow_box.scale.y = proportion_scale*old_arrow_y;
            arrowHelper.arrow_box.scale.z = proportion_scale*old_arrow_z;*/
            setup_arrowheads_rescaling(cube_object);
            cube_object.cube.position.setZ(cube_object.cube.scale.z*small_h/2);
        }
    }
    //proportion_array[cube_object.ID] = arrowHelper.arrow_box.scale.x;
    if (cube_object.hchildren.length > 0){
        for (var i = 0; i < cube_object.hchildren.length; i++){
            calculate_children_box_locations(cube_object.hchildren[i]);
        }
    }
    main_threed_handler.BoxAutoSave(cube_object.ID);
    if (window.select) check_plane_box_collision();
    arrow_box_position = null;
    indicator_box_position = null;
    CalculateAxis(cube_object.ID);
    CalculateNewOpY(cube_object.plane.matrixWorld.elements);
    render();
}

function calculate_children_box_locations(object){
    if (!object.cube){
        object.plane.matrixWorld = object.hparent.plane.matrixWorld.clone();
        return;
    }
    target_cube_position_0 = object.cube.position.clone();
    target_cube_position_0.setZ(object.cube.position.z - object.cube.scale.z*small_h/2);
    target_cube_position_0_static = object.cube.position.clone();
    target_cube_position_0_static.setZ(object.cube.position.z - object.cube.scale.z*small_h/2);
    target_cube_position_0.applyMatrix4(object.cube.parent.matrixWorld.clone());
    target_cube_position_0_static.applyMatrix4(object.cube.parent.matrixWorld.clone());
    target_cube_scale_0 = object.cube.scale.clone();
    object.plane.matrixWorld.multiplyMatrices(object.hparent.plane.matrixWorld.clone(), (new THREE.Matrix4()).makeTranslation(0, 0, object.hparent.cube.scale.z*small_w));
    if (object.cube.parent != object.plane){
            object.cube.parent.matrixWorld = object.plane.matrixWorld.clone();
    }
    var direction = new THREE.Vector3(target_cube_position_0.x - camera.position.x, target_cube_position_0.y - camera.position.y, target_cube_position_0.z - camera.position.z).normalize();
    var optical_ray = new THREE.Raycaster(camera.position, direction);
    var plane_intersection = optical_ray.intersectObject(object.plane, false);
    if (plane_intersection){
        for (var i = 0; i < plane_intersection.length; i++){
            var i_mat = new THREE.Matrix4().getInverse(object.cube.parent.matrixWorld.clone());
            plane_intersection[i].point.applyMatrix4(i_mat);
            object.cube.position.copy(plane_intersection[i].point);
            var proportion_scale = camera.position.distanceTo(plane_intersection[i].point.applyMatrix4(object.cube.parent.matrixWorld.clone()))/camera.position.distanceTo(target_cube_position_0_static);
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


function CalculateBoxCanBeAdded(cube_object, support_object){
    var cube_position = cube_object.cube.position.clone();
    cube_position.setZ(cube_position.z - cube_object.cube.scale.z*small_h/2).applyMatrix4(cube_object.cube.parent.matrixWorld.clone());
    var direction = new THREE.Vector3(cube_position.x - camera.position.x, cube_position.y - camera.position.y, cube_position.z - camera.position.z).normalize();
    var optical_ray = new THREE.Raycaster(camera.position, direction);
    if (!(support_object.cube)){//if support object is a plane - making the cube object plane the same height as the plane that is supporting
        var plane_intersection = optical_ray.intersectObject(support_object.plane, false);
    }else{//if support object is a cube - moving the plane of the cube object to the correct height
        var test_plane = cube_object.plane.clone();
        test_plane.matrixWorld.multiplyMatrices(support_object.plane.matrixWorld.clone(), (new THREE.Matrix4()).makeTranslation(0, 0, support_object.cube.scale.z*small_h))
        //cube_object.plane.matrixWorld.multiplyMatrices(support_object.plane.matrixWorld.clone(), (new THREE.Matrix4()).makeTranslation(0, 0, support_object.cube.scale.z*small_h));
        var plane_intersection = optical_ray.intersectObject(test_plane, false);
    }
    if (plane_intersection[0]){
        console.log("yes");
        return true;
    }else{
        console.log("no");
        return false;
    }
}

function CheckIfSupportedByGroundplane(object){
    var ancestor = object;
    while (ancestor.hparent && ancestor.hparent != "unassigned"){
        ancestor = ancestor.hparent;
    }
    if (ancestor.plane == plane || (ancestor.plane && !(ancestor.cube))){
        return true;
    }else{
        return false;
    }
}