function toggle_cube_move_indicators(toggle){
    for (var i = 0; i < cube_move_mode_arrows.length; i++){
        cube_move_mode_arrows[i].cone.material.visible = toggle;
        cube_move_mode_arrows[i].line.material.visible = toggle;
    }
}
function toggle_cube_rotate_indicators(toggle){
    rotate_mode_indicators[0].cone.material.visible = toggle;
    rotate_mode_indicators[0].line.material.visible = toggle;
    rotate_mode_indicators[1].material.visible = toggle;
}
function toggle_cube_resize_arrows(toggle){
    for (var i = 0; i < arrowHelper.arrow_list.length; i++){
        arrowHelper.arrow_list[i].cone.material.visible = toggle;
        arrowHelper.arrow_list[i].line.material.visible = toggle;
    }
}

function setup_arrowheads_rescaling(object){
    if (!object){
        object = window.select;
    }
    if (!object.cube){
        return;
    }
    var distance_from_origin = object.cube.position.clone().applyMatrix4(object.cube.parent.matrixWorld.clone()).distanceTo(camera.position);
    arrowhead_scale_array = new Array(5);
    var diagonal = Math.sqrt(Math.pow(object.cube.scale.x, 2) + Math.pow(object.cube.scale.y, 2) + Math.pow(object.cube.scale.z, 2));
    var arrow_box_position = ConvertPosition(object.cube, arrowHelper);
    arrowHelper.arrow_box.position.set(arrow_box_position.x, arrow_box_position.y, arrow_box_position.z + small_h*0.5*window.select.cube.scale.z);
    for (var i = 0; i < arrowHelper.arrow_list.length; i++){
        arrowhead_scale_array[i] = 0.005*Math.sqrt(arrowHelper.arrow_list[i].cone.position.clone().applyMatrix4(arrowHelper.arrow_list[i].cone.parent.matrixWorld.clone()).distanceTo(camera.position))*Math.cbrt(diagonal);
    }
    arrowhead_scale = distance_from_origin; // kept just for backwards compatibility in case I missed any cases where this variable was used
    indicator_box.scale.set(distance_from_origin, distance_from_origin, distance_from_origin);
    /*for (var i = 0; i < intersect_box.children.length; i++){
        intersect_box.children[i].scale.set(0.001*arrowhead_scale);
    }*/
}

function initialize_cube_indicators(){
    arrowhead_size = 0.01;
    var sphereGeom = new THREE.SphereGeometry(2);
    arrowHelper = new THREE.Object3D();
    arrowHelper.matrixAutoUpdate = false;
    arrowHelper.arrow_box = new THREE.Object3D();
    arrowHelper.arrow_list = new Array();
    var origin = new THREE.Vector3(0,0,0);
    arrowHelper.arrow_list[0] = new THREE.ArrowHelper(new THREE.Vector3(0,0,100), origin, small_w, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[0].direction = new THREE.Vector3(0,0,1);
    arrowHelper.arrow_list[1] = new THREE.ArrowHelper(new THREE.Vector3(0,-100,0), origin, small_w, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[1].direction = new THREE.Vector3(0,-1,0);
    arrowHelper.arrow_list[2] = new THREE.ArrowHelper(new THREE.Vector3(-100,0,0), origin, small_w, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[2].direction = new THREE.Vector3(-1,0,0);
    arrowHelper.arrow_list[3] = new THREE.ArrowHelper(new THREE.Vector3(0, 100, 0), origin, small_w, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[3].direction = new THREE.Vector3(0, 1, 0);
    arrowHelper.arrow_list[4] = new THREE.ArrowHelper(new THREE.Vector3(100, 0, 0), origin, small_w, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[4].direction = new THREE.Vector3(1, 0, 0);
    arrowHelper.add(arrowHelper.arrow_box);
    sphereGeom0 = sphereGeom.clone();
    sphereGeom0.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -1, 0 ) );
    arrowHelper.arrow_list[0].cone.geometry = sphereGeom0;
    arrowHelper.arrow_list[0].cone.geometry.needsUpdate = true;
    arrowHelper.arrow_box.add(arrowHelper.arrow_list[0]);
    for (var i = 1; i < arrowHelper.arrow_list.length; i++){
        arrowHelper.arrow_list[i].cone.geometry = sphereGeom;
        arrowHelper.arrow_list[i].line.material.visible = false;
        arrowHelper.arrow_list[i].cone.geometry.needsUpdate = true;
        arrowHelper.arrow_box.add(arrowHelper.arrow_list[i]);
        box_scene.add(arrowHelper);
    }
    toggle_cube_resize_arrows(false);// hide resize initially

    indicator_box = new THREE.Object3D();
    cube_move_mode_arrows = new Array();
    cube_move_mode_arrows[0] = new THREE.ArrowHelper(new THREE.Vector3(-100,0,0), new THREE.Vector3(0,0,0.01), .03, 0x0000ff);
    cube_move_mode_arrows[0].direction = new THREE.Vector3(-1, 0, 0);
    cube_move_mode_arrows[1] = new THREE.ArrowHelper(new THREE.Vector3(0,-100,0), new THREE.Vector3(0,0,0.01), .03, 0x0000ff);
    cube_move_mode_arrows[1].direction = new THREE.Vector3(0, -1, 0);
    cube_move_mode_arrows[2] = new THREE.ArrowHelper(new THREE.Vector3(0,100,0), new THREE.Vector3(0,0,0.01), .03, 0x0000ff);
    cube_move_mode_arrows[2].direction = new THREE.Vector3(0, 1, 0);
    cube_move_mode_arrows[3] = new THREE.ArrowHelper(new THREE.Vector3(100,0,0), new THREE.Vector3(0,0,0.01), .03, 0x0000ff);
    cube_move_mode_arrows[3].direction = new THREE.Vector3(1, 0, 0);
    for (var i = 0; i < cube_move_mode_arrows.length; i++) {
        cube_move_mode_arrows[i].line.material.linewidth = 5;
        indicator_box.add(cube_move_mode_arrows[i]);
        arrowHelper.add(indicator_box);
        box_scene.add(arrowHelper);
    }
    rotate_mode_indicators = new Array();
    rotate_mode_indicators[0] = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 50), new THREE.Vector3(0,0,0.01), .03, 0x00ffff);
    rotate_mode_indicators[0].direction = new THREE.Vector3(0,0,1);
    rotate_mode_indicators[1] = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.04, 30), new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide}));
    rotate_mode_indicators[1].position.set(0, 0, 0.02);
    for (var i = 0; i < rotate_mode_indicators.length; i++){
        indicator_box.add(rotate_mode_indicators[i]);
        arrowHelper.add(indicator_box);
        box_scene.add(arrowHelper);
    }
    for (var i = 0; i < cube_move_mode_arrows.length; i++){
        cube_move_mode_arrows[i].cone.material.visible = false;
        cube_move_mode_arrows[i].line.material.visible = false;
    }
    rotate_mode_indicators[0].cone.material.visible = false;
    rotate_mode_indicators[0].line.material.visible = false;
    rotate_mode_indicators[1].material.visible = false;
}

function check_plane_box_collision(object) {
    console.log("check plane box collision");
    if (!object){
        object = window.select;
    }
    var pts0 = [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6];
    var pts1 = [1, 2, 5, 3, 4, 3, 7, 6, 5, 6, 7, 7];

    /*while (intersect_box.children.length){
        intersect_box.remove(intersect_box.children[0]);
    }*/
    var length = intersect_box.children.length;
    for (var i = length - 1; i > -1; i--){
            intersect_box.remove(intersect_box.children[i]);
    }
    var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
    var eps = 0.0001;
    var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());

    if (object_list.length) {
        for (var i = 0; i < object_list.length; i++) {
            if (((object_list[i].plane == object.plane || (object_list[i].cube && object_list[i].cube.visible == false)  || (object_list[i].hparent == "unassigned"))) || !(object_list[i].cube)){
                continue;
            }
            var distance_from_origin = object_list[i].cube.position.clone().applyMatrix4(object_list[i].cube.parent.matrixWorld.clone()).distanceTo(camera.position);
            if (object_list[i].cube && object_list[i].cube.hparent != "unassigned"){
                vert = object_list[i].cube.children[0].geometry.vertices;
                for (var j = 0; j < pts0.length; j++) {
                    var vert0 = vert[pts0[j]].clone().applyMatrix4(object_list[i].cube.matrixWorld);
                    var vert1 = vert[pts1[j]].clone().applyMatrix4(object_list[i].cube.matrixWorld);
                    var direction = new THREE.Vector3().subVectors(vert1, vert0);
                    var direction_len = direction.length();
                    raycaster.set(vert0.clone(), direction);
                    intersects = raycaster.intersectObject(object.plane, false);
                    if (intersects.length) {
                        for (var k = 0; k < intersects.length; k++) {
                            var vec_len = new THREE.Vector3().subVectors(intersects[k].point, vert0).length();
                            if (vec_len > direction_len + eps){
                                continue;
                            }
                            var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
                            cube.position.set(intersects[k].point.x,intersects[k].point.y,intersects[k].point.z);
                            cube.scale.set(distance_from_origin*0.01, distance_from_origin*0.01, distance_from_origin*0.01);
                            intersect_box.add(cube);
                        }
                    }
                }
            }
        }
        box_scene.add(intersect_box);
    }
    if (object_list.length && IsHidingAllPlanes == false && ((object.hparent != "unassigned") || (!object.cube)) && !(IsHidingAllButSelected)) {
        for (var i = 0; i < intersect_box.children.length; i++){
            intersect_box.children[i].material.visible = true;
        }
    }else{
        for (var i = 0; i < intersect_box.children.length; i++){
            intersect_box.children[i].material.visible = false;
        }
    }
}

