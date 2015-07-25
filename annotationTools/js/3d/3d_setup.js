function init(){
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
    }

    //document.addEventListener( 'mousedown', makeDoubleClick(onDocumentDoubleClick, onDocumentMouseDown), false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    $("#GP").on("click", function() { buttonClicked(this); } );


    //document.addEventListener('keydown', onDocumentKeyDown, false);

    $("#container").css('display', 'none');
    $("#cnvs").css('display', 'none');

    createWorld();
    render();
    setup_model_list();
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
    var gp_plane_geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
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
    plane_object.add(vert_plane);
    //plane_object.rotation.z = Math.PI/2;

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
            guide_box.add(guide_Z_line);
            guide_box.lines[i]=guide_Z_line;
        }
    plane.add(guide_box);
    }

    scene.add(plane);
    //scene.add(gp_plane);
    scene.add(empty_plane);
    scene.add(plane_object);
// 3D box related
    window.select = plane; //initializing the first selected object to be the plane
    plane.material.visible = false;
    vert_plane.material.visible = false;
    initialize_cube_indicators();
    //window.select.parent = scene;
  // Initializing arrowhelper
}

function setupRay(event){
    var rect = document.getElementById("main_media").getBoundingClientRect();
    var scale_factor = main_media.browser_im_ratio/main_media.im_ratio;
    var projector = new THREE.Projector();
    var mouse3D = projector.unprojectVector(new THREE.Vector3( ( (event.clientX -rect.left)*scale_factor/ renderer.domElement.width ) * 2 - 1, - ( (event.clientY-rect.top)*scale_factor / renderer.domElement.height ) * 2 + 1, 1 ), camera );
    var direction = mouse3D.sub(camera.position).normalize();
    ray = new THREE.Raycaster(camera.position, mouse3D);
    ray.set(camera.position, direction);
}

function render() {
    if ((window.select) && (window.select.cube)) {
        if (typeof proportion_array[window.select.ID] == "undefined"){
            proportion_array[window.select.ID] = 1;
        }
        arrowHelper.matrixWorld = window.select.plane.matrixWorld.clone();
        arrowHelper.arrow_box.rotation.z = window.select.cube.rotation.z;
        arrowHelper.arrow_box.position.set(window.select.cube.position.x,window.select.cube.position.y,window.select.cube.position.z + small_h*0.5*window.select.cube.scale.z);
        arrowHelper.arrow_list[1].setLength(window.select.cube.scale.y*small_d/2/proportion_array[window.select.ID], arrowhead_size, arrowhead_size);
        arrowHelper.arrow_list[2].setLength(window.select.cube.scale.x*small_d/2/proportion_array[window.select.ID], arrowhead_size, arrowhead_size);
        arrowHelper.arrow_list[3].setLength(window.select.cube.scale.y*small_d/2/proportion_array[window.select.ID], arrowhead_size, arrowhead_size);
        arrowHelper.arrow_list[4].setLength(window.select.cube.scale.x*small_d/2/proportion_array[window.select.ID], arrowhead_size, arrowhead_size);
        arrowHelper.arrow_list[0].setLength(small_w, arrowhead_size, arrowhead_size);
        indicator_box.position.set(window.select.cube.position.x,window.select.cube.position.y,window.select.cube.position.z + small_h*0.5*window.select.cube.scale.z);
        /*arrowHelper.arrow_box.scale.x = proportion_array[window.select.ID];
        arrowHelper.arrow_box.scale.y = proportion_array[window.select.ID];
        arrowHelper.arrow_box.scale.z = proportion_array[window.select.ID];*/
        indicator_box.scale.x = proportion_array[window.select.ID];
        indicator_box.scale.y = proportion_array[window.select.ID];
        indicator_box.scale.z = proportion_array[window.select.ID];
        plane_object.position.setX(window.select.cube.position.clone().applyMatrix4(window.select.plane.matrixWorld).x);
        plane_object.position.setY(window.select.cube.position.clone().applyMatrix4(window.select.plane.matrixWorld).y);
        plane_object.position.setZ(window.select.cube.position.clone().applyMatrix4(window.select.plane.matrixWorld).z);
        if (typeof window.select.cube != "undefined"){
            plane_object.position.setX(window.select.cube.position.clone().applyMatrix4(window.select.plane.matrixWorld).x);
            plane_object.position.setY(window.select.cube.position.clone().applyMatrix4(window.select.plane.matrixWorld).y);
            plane_object.position.setZ(window.select.cube.position.clone().applyMatrix4(window.select.plane.matrixWorld).z);
        }
        toggle_cube_resize_arrows(true);
        toggle_cube_move_indicators(true);
        toggle_cube_rotate_indicators(true);
    }else{
        toggle_cube_resize_arrows(false);
        toggle_cube_move_indicators(false);
        toggle_cube_rotate_indicators(false);
    }
    renderer.render(scene, camera);
}
function check_plane_box_collision(object) {
    if (typeof object == "undefined"){
        object = window.select;
    }
    var pts0 = [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6];
    var pts1 = [1, 2, 5, 3, 4, 3, 7, 6, 5, 6, 7, 7];
    var length = intersect_box.children.length;
    for (var i = length - 1; i > -1; i--){
        if (typeof plane_cube == "undefined" || intersect_box.children[i] != plane_cube){
            intersect_box.remove(intersect_box.children[i]);
        }
    }
    var cubeGeometry = new THREE.CubeGeometry(.005, .005, .005);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
    var eps = 0.0001;
    var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());

    if (object_list.length) {
        for (var i = 0; i < object_list.length; i++) {
            if (object_list[i].plane == object.plane || ((object_list[i].cube) && object_list[i].cube.visible == false)){
                continue;
            }
            if (object_list[i].cube){
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
                            intersect_box.add(cube);
                        }
                    }
                }
            }
        }
        scene.add(intersect_box);
    }

    if (object_list.length && (object.hparent != "unassigned") && (object.hparent != gp_plane) && object != plane) {
        var line_raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
        var line_vert1 = new THREE.Vector3(.985, .985, -100).applyMatrix4(plane.matrixWorld);
        var line_vert2 = new THREE.Vector3(.985, .985, 100).applyMatrix4(plane.matrixWorld);
        var direction = new THREE.Vector3().subVectors(line_vert2, line_vert1);

        line_raycaster.set(line_vert1, direction);
        line_intersect = line_raycaster.intersectObject(object.plane, false);
        var cubeGeometry2 = new THREE.CubeGeometry(.02, .02, .02);
        var cubeMaterial2 = new THREE.MeshBasicMaterial({color: 0xff0000});
        if ((line_intersect.length > 0) && (typeof plane_cube == "undefined")){
            plane_cube = new THREE.Mesh( cubeGeometry2, cubeMaterial2 );
            intersect_box.add(plane_cube);
            scene.add(intersect_box);
            plane_cube.material.visible = true;
            var position = new THREE.Vector3(1, 1, 0).applyMatrix4(object.plane.matrixWorld.clone());
            plane_cube.position.set(position.x, position.y, position.z);
        }else if (line_intersect.length){
            plane_cube.material.visible = true;
            var position = new THREE.Vector3(1, 1, 0).applyMatrix4(object.plane.matrixWorld.clone());
            plane_cube.position.set(position.x, position.y, position.z);
        }
    }else{
        for (var i = 0; i < intersect_box.children.length; i++){
            intersect_box.children[i].material.visible = false;
        }
    }
    render();
}
function cube_rotate(radians){
    if (slidersOn || (current_mode == ROTATE_MODE)){
        if (typeof radians == "undefined"){
            var radians = document.getElementById("rotation").value*Math.PI*2/100-Math.PI;}
        else{
            var radians = radians;
        }
    }
    else{
        var radians = document.getElementById("input_r").value*2*Math.PI/360;
    }
    window.select.cube.rotation.set(0,0,radians);
    for (var i = 0; i < cube_move_mode_arrows.length; i++){
        cube_move_mode_arrows[i].cone.material.visible = false;
        cube_move_mode_arrows[i].line.material.visible = false;
    }
    rotate_mode_indicators[0].cone.material.visible = true;
    rotate_mode_indicators[0].line.material.visible = true;
    rotate_mode_indicators[1].material.visible = true;
    render();
}