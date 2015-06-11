function init(){
     //--------------------------------------------------------------------Resizing Start----------------------------------------------------------------------------//
    /*document.getElementById("cnvs").height = document.getElementById("im").naturalHeight;
    document.getElementById("cnvs").width = document.getElementById("im").naturalWidth;
    document.getElementById("container").height = document.getElementById("im").naturalHeight;
    document.getElementById("container").width = document.getElementById("im").naturalWidth;
    document.getElementById("container").style.overflow = "hidden";
    $(".kineticjs-content").width(document.getElementById("im").naturalWidth).height(document.getElementById("im").naturalHeight);*/
    //$("canvas").width(document.getElementById("im").naturalWidth).height(document.getElementById("im").naturalHeight);


    //--------------------------------------------------------------------Resizing End----------------------------------------------------------------------------//
    if (!Detector.webgl) {
        console.log("webgl error");
    }

    try {
        var theCanvas = document.getElementById("cnvs");
        if (!theCanvas || !theCanvas.getContext) {
            document.getElementById("message").innerHTML =
        "Sorry, your browser doesn't support canvas graphics.";
            return;
        }
        try {  // try to create a WebGLRenderer
            if (window.WebGLRenderingContext) {
                renderer = new THREE.WebGLRenderer( {
                            canvas: theCanvas,
                            antialias: true
                            });
            }
        }
        catch (e) {
        }
        if (!renderer) { // If the WebGLRenderer couldn't be created, try a CanvasRenderer.
            renderer = new THREE.CanvasRenderer( { canvas: theCanvas } );
            renderer.setSize(theCanvas.width,theCanvas.height);
            //document.getElementById("message").innerHTML =
            //"WebGL not available; falling back to CanvasRenderer.";
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, theCanvas.width/theCanvas.height, .01, 20000);
        camera.position.z = 0;
        camera.position.set(0,1,0);
        var manager = new THREE.LoadingManager();
        model3d_loader = new THREE.OBJLoader(manager);
    }
    catch (e) {
        console.log(e);
        //document.getElementById("message").innerHTML = "Sorry, an error occurred: " + e;
    }

    /*document.addEventListener( 'mousedown', makeDoubleClick(onDocumentDoubleClick, onDocumentMouseDown), false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );*/

    $("#GP").on("click", function() { buttonClicked(this); } );


    document.addEventListener('keydown', onDocumentKeyDown, false);

    createWorld();
    render();
    update_plane();

    ID_dict["GP"] = plane;
    render();

}

function createWorld() {// split into different parts for 3d and gp later
    if (scene) {// this prevents duplication of groundplane if loading saved data
        for (var k = scene.children.length-1; k>= 0; k--){
            scene.remove(scene.children[k]);
        }
    }
    if (plane) {
        for (var k = plane.children.length-1; k>= 0; k--){
            plane.remove(plane.children[k]);
        }
    }
    // This section is for drawing the groundplane, arguments are how plane is divided
    var plane_geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
    var gp_plane_geometry = new THREE.PlaneGeometry(2, 2, 40, 40);
    var vert_plane_geometry = new THREE.PlaneGeometry(2, 2, 40, 40);
    var plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var vert_plane_material = new THREE.MeshBasicMaterial({color:0x000000, side:THREE.DoubleSide, wireframe: true});
    var gp_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    gp_plane = new THREE.Mesh(gp_plane_geometry, gp_plane_material);
    plane = new THREE.Mesh(plane_geometry, plane_material);
    vert_plane = new THREE.Mesh(vert_plane_geometry, vert_plane_material);
    gp_plane.position.x = 0;
    gp_plane.position.y = 0;
    gp_plane.position.z = 0;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    vert_plane.position.x = 0;
    vert_plane.position.y = 0;
    vert_plane.position.z = 0;
    empty_plane = gp_plane.clone();
    empty_plane.matrixAutoUpdate = false;
    plane_object = new THREE.Object3D();
    //vert_plane.rotation.z = Math.PI/4;
    //vert_plane.rotation.x = 3*Math.PI/2;
    //vert_plane.rotation.y = Math.PI/4;

    plane_object.add(vert_plane);
    plane_object.rotation.z = Math.PI/2;
    //plane_object.rotation.x = Math.PI/2;

    // Add Z-direction guide line
    var line_material = new THREE.LineBasicMaterial({color: 0x0000ff});
    var line_geometry = new THREE.Geometry();
    line_geometry.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 100)
    );
    guide_Z_line = new THREE.Line(line_geometry, line_material);
    guide_Z_line.position.set(1,1,0);
    gp_plane.add(guide_Z_line);


    // Box of Z-lines for guiding
    guide_box = new THREE.Object3D();
    guide_box.lines = new Array();
    if ((typeof mode_guide_box != 'undefined')&&(mode_guide_box)) {
        for (var i = 0; i < 3; i++) {
            guide_Z_line = new THREE.Line(line_geometry, line_material);
            //guide_Z_line.position.set(1-(i+1)*.1,1-(i+1)*.1,0);
            guide_box.add(guide_Z_line);
            guide_box.lines[i]=guide_Z_line;
        }
    plane.add(guide_box);
    }

    scene.add(plane);
    scene.add(gp_plane);
    scene.add(empty_plane);
    //plane.add(vert_plane);
    scene.add(plane_object);

        // 3D box related
/*    small_d = -0.05;
    small_h = 0.05;
    small_w = 0.05;
    window.select = plane; //initializing the first selected object to be the plane
    plane.material.visible = false;
    vert_plane.material.visible = false;
    window.select.parent = scene;
    var sphereGeom = new THREE.SphereGeometry(1);

        // Resizing arrowhelper
    arrowHelper = new THREE.Object3D();
    arrowHelper.matrixAutoUpdate = false;
    arrowHelper.arrow_box = new THREE.Object3D();
    arrowHelper.arrow_list = new Array();
    //var origin = new THREE.Vector3(0.025, 0.025, -0.025);
    var origin = new THREE.Vector3(0,0,0);
    arrowHelper.arrow_list[0] = new THREE.ArrowHelper(new THREE.Vector3(0,0,100), origin, .05, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[0].direction = new THREE.Vector3(0,0,1);
    arrowHelper.arrow_list[1] = new THREE.ArrowHelper(new THREE.Vector3(0,-100,0), origin, .05, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[1].direction = new THREE.Vector3(0,-1,0);
    arrowHelper.arrow_list[2] = new THREE.ArrowHelper(new THREE.Vector3(-100,0,0), origin, .05, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[2].direction = new THREE.Vector3(-1,0,0);
    arrowHelper.arrow_list[3] = new THREE.ArrowHelper(new THREE.Vector3(0, 100, 0), origin, .05, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[3].direction = new THREE.Vector3(0, 1, 0);
    arrowHelper.arrow_list[4] = new THREE.ArrowHelper(new THREE.Vector3(100, 0, 0), origin, .05, 0xff0000, 0.01, 0.01);
    arrowHelper.arrow_list[4].direction = new THREE.Vector3(1, 0, 0);
    arrowHelper.add(arrowHelper.arrow_box);
    sphereGeom0 = sphereGeom.clone();
    sphereGeom0.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -1, 0 ) );
    arrowHelper.arrow_list[0].cone.geometry = sphereGeom0;
    arrowHelper.arrow_list[0].cone.geometry.needsUpdate = true;
    arrowHelper.arrow_box.add(arrowHelper.arrow_list[0]);
    for (var i = 1; i < arrowHelper.arrow_list.length; i++){
        //sphereGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.05, 0 ) );
        arrowHelper.arrow_list[i].cone.geometry = sphereGeom;
        arrowHelper.arrow_list[i].line.material.visible = false;
        //arrowHelper.arrow_list[i].line.material.linewidth = 0;
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

    if (document.getElementById("scale_x")) {
        document.getElementById("scale_x").value = 0;
        document.getElementById("scale_y").value = 0;
        document.getElementById("scale_z").value = 0;
    }*/
}

function setupRay(event){
    var rect = document.getElementById("im").getBoundingClientRect();
    var scale_factor = document.getElementById('im').width / rect.width;
    var projector = new THREE.Projector();
    var mouse3D = projector.unprojectVector(new THREE.Vector3( ( (event.clientX -rect.left)*scale_factor/ renderer.domElement.width ) * 2 - 1, - ( (event.clientY-rect.top)*scale_factor / renderer.domElement.height ) * 2 + 1, 1 ), camera );
    var direction = mouse3D.sub(camera.position).normalize();
    ray = new THREE.Raycaster(camera.position, mouse3D);
    ray.set(camera.position, direction);
}

function render() {
    if ((window.select) && (window.select.cube)) {
        document.getElementById("scale_x").value = (window.select.cube.scale.x-1)/0.1;
        document.getElementById("scale_y").value = (window.select.cube.scale.y-1)/0.1;
        document.getElementById("scale_z").value = (window.select.cube.scale.z-1)/0.1;
        document.getElementById("input_x").value = window.select.cube.scale.x;
        document.getElementById("input_y").value = window.select.cube.scale.y;
        document.getElementById("input_z").value = window.select.cube.scale.z;
        if (typeof proportion_array[window.select.ID] == "undefined"){
            proportion_array[window.select.ID] = 1;
        }
        arrowHelper.matrixWorld = window.select.support_plane.matrixWorld.clone();
        arrowHelper.arrow_box.rotation.z = window.select.cube.rotation.z;
        arrowHelper.arrow_box.position.set(window.select.cube.position.x,window.select.cube.position.y,window.select.cube.position.z + small_h*0.5*window.select.cube.scale.z);
        arrowHelper.arrow_list[1].setLength(window.select.cube.scale.y*0.025/proportion_array[window.select.ID], 0.01, 0.01);
        arrowHelper.arrow_list[2].setLength(window.select.cube.scale.x*0.025/proportion_array[window.select.ID], 0.01, 0.01);
        arrowHelper.arrow_list[3].setLength(window.select.cube.scale.y*0.025/proportion_array[window.select.ID], 0.01, 0.01);
        arrowHelper.arrow_list[4].setLength(window.select.cube.scale.x*0.025/proportion_array[window.select.ID], 0.01, 0.01);
        indicator_box.position.set(window.select.cube.position.x,window.select.cube.position.y,window.select.cube.position.z + small_h*0.5*window.select.cube.scale.z);
        arrowHelper.arrow_box.scale.x = proportion_array[window.select.ID];
        arrowHelper.arrow_box.scale.y = proportion_array[window.select.ID];
        arrowHelper.arrow_box.scale.z = proportion_array[window.select.ID];
        indicator_box.scale.x = proportion_array[window.select.ID];
        indicator_box.scale.y = proportion_array[window.select.ID];
        indicator_box.scale.z = proportion_array[window.select.ID];
        plane_object.position.setX(window.select.cube.position.clone().applyMatrix4(window.select.support_plane.matrixWorld).x);
        plane_object.position.setY(window.select.cube.position.clone().applyMatrix4(window.select.support_plane.matrixWorld).y);
        plane_object.position.setZ(window.select.cube.position.clone().applyMatrix4(window.select.support_plane.matrixWorld).z);
    }
    renderer.render(scene, camera);
}

