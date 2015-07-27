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

function setup_arrowheads_rescaling(){
    var distance_from_origin = window.select.cube.position.clone().applyMatrix4(window.select.plane.matrixWorld.clone()).distanceTo(camera.position);
    var arrowhead_scale = distance_from_origin;
    arrowhead_size = 0.007*arrowhead_scale;
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
        scene.add(arrowHelper);
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
        scene.add(arrowHelper);
    }
    rotate_mode_indicators = new Array();
    rotate_mode_indicators[0] = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 50), new THREE.Vector3(0,0,0.01), .03, 0x00ffff);
    rotate_mode_indicators[0].direction = new THREE.Vector3(0,0,1);
    rotate_mode_indicators[1] = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.04, 30), new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide}));
    rotate_mode_indicators[1].position.set(0, 0, 0.02);
    for (var i = 0; i < rotate_mode_indicators.length; i++){
        indicator_box.add(rotate_mode_indicators[i]);
        arrowHelper.add(indicator_box);
        scene.add(arrowHelper);
    }
    for (var i = 0; i < cube_move_mode_arrows.length; i++){
        cube_move_mode_arrows[i].cone.material.visible = false;
        cube_move_mode_arrows[i].line.material.visible = false;
    }
    rotate_mode_indicators[0].cone.material.visible = false;
    rotate_mode_indicators[0].line.material.visible = false;
    rotate_mode_indicators[1].material.visible = false;
}
