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
        camera = new THREE.PerspectiveCamera(45, theCanvas.width/theCanvas.height, .0001, 200000);
        camera.position.z = 0;
        camera.position.set(0,1,0);
        var manager = new THREE.LoadingManager();
        model3d_loader = new THREE.OBJLoader(manager);
    }
    catch (e) {
        console.log(e);
    }
    if (!Detector.webgl) {
        console.log("webgl error");
    }
    //creating box canvas
    try {
        var boxCanvas = document.getElementById("boxCanvas");
        if (!boxCanvas || !boxCanvas.getContext) {
            document.getElementById("message").innerHTML =
        "Sorry, your browser doesn't support canvas graphics.";
            return;
        }
        try {  // try to create a WebGLRenderer
            if (window.WebGLRenderingContext) {
                box_renderer = new THREE.WebGLRenderer( {
							preserveDrawingBuffer: false,
                            canvas: boxCanvas,
                            antialias: true
                            });
            }
            box_renderer.setSize(theCanvas.width, theCanvas.height);
        }
        catch (e) {
        }
        if (!box_renderer) { // If the WebGLRenderer couldn't be created, try a CanvasRenderer.
            box_renderer = new THREE.CanvasRenderer( { canvas: boxCanvas } );
            box_renderer.setSize(theCanvas.width,theCanvas.height);
            //document.getElementById("message").innerHTML =
            //"WebGL not available; falling back to CanvasRenderer.";
        }

        box_scene = new THREE.Scene();
        box_camera = new THREE.PerspectiveCamera(45, theCanvas.width/theCanvas.height, .0001, 200000);
        box_camera.position.z = 0;
        box_camera.position.set(0,1,0);
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



    //document.addEventListener('keydown', onDocumentKeyDown, false);

    $("#container").css('display', 'none');
    $("#cnvs").css('display', 'none');

    createWorld();
    render();
    setup_model_list();
    //update_plane();
    //ID_dict["GP"] = plane;
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


    var plane_geometry = new THREE.PlaneGeometry(2, 2, 20, 20);
    var gp_plane_geometry = new THREE.PlaneGeometry(2, 2, 20, 20);
    //gp_plane_geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 10, -10, 0 ) );
    //plane_geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 10, -10, 0 ) );
    var vert_plane_geometry = new THREE.PlaneGeometry(200, 200, 400, 400);
    var vert_plane_material = new THREE.MeshBasicMaterial({color:0x000000, side:THREE.DoubleSide, wireframe: true});
    var collision_plane_geometry = new THREE.PlaneGeometry(50, 50, 25, 25);
    var collision_plane_material = new THREE.MeshBasicMaterial({color:0x000000, side:THREE.DoubleSide, wireframe: true});; 
    var plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var gp_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    gp_plane = new THREE.Mesh(gp_plane_geometry, gp_plane_material);
    plane = new THREE.Mesh(plane_geometry, plane_material);
    vert_plane = new THREE.Mesh(vert_plane_geometry, vert_plane_material);
    collision_plane = new THREE.Mesh(collision_plane_geometry, collision_plane_material);
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
    collision_plane.matrixAutoUpdate = false;
    collision_plane.material.visible = false;
    empty_plane.matrixAutoUpdate = false;
    plane_object = new THREE.Object3D();
    plane_object.add(vert_plane);
    plane_object.rotation.z = Math.PI/2;
    plane_object.matrixAutoUdpdate = true;
    vert_plane.matrixAutoUpdate = false;
    plane_object.position.set( 0, 0, -1);

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
    scene.add(collision_plane);
    //scene.add(gp_plane);
    //scene.add(empty_plane);
    scene.add(plane_object);
// 3D box related


    vert_plane.material.visible = false;
    plane.frustumCulled = false;
    gp_plane.frustumCulled = false;
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
    ray.precision = 0.00000000001;
}

function setupBoxRay(event){
    var rect = document.getElementById("main_media").getBoundingClientRect();
    var scale_factor = main_media.browser_im_ratio/main_media.im_ratio;
    var projector = new THREE.Projector();
    var mouse3D = projector.unprojectVector(new THREE.Vector3( ( (event.clientX -rect.left)*scale_factor/ box_renderer.domElement.width ) * 2 - 1, - ( (event.clientY-rect.top)*scale_factor / box_renderer.domElement.height ) * 2 + 1, 1 ), box_camera );
    var direction = mouse3D.sub(box_camera.position).normalize();
    box_ray = new THREE.Raycaster(box_camera.position, mouse3D);
    box_ray.set(box_camera.position, direction);
}

function render() {
    if ((window.select) && (window.select.cube)) {
        if (typeof proportion_array[window.select.ID] == "undefined"){
            proportion_array[window.select.ID] = 1;
        }
        setup_arrowheads_rescaling(window.select);
        collision_plane.matrixWorld = window.select.plane.matrixWorld.clone();
        if (window.select.cube.parent != window.select.plane){
            window.select.cube.parent.matrixWorld = window.select.plane.matrixWorld.clone();
        }
        arrowHelper.matrixWorld = window.select.plane.matrixWorld.clone();
        //if (!arrow_box_position || !indicator_box_position || !plane_object_position){
            arrow_box_position = ConvertPosition(window.select.cube, arrowHelper);
            indicator_box_position = ConvertPosition(window.select.cube, indicator_box.parent);
            plane_object_position = ConvertPosition(window.select.cube, plane_object.parent);
        //}
        arrowHelper.arrow_box.rotation.z = window.select.cube.rotation.z;
        arrowHelper.arrow_box.position.set(arrow_box_position.x, arrow_box_position.y, arrow_box_position.z + small_h*0.5*window.select.cube.scale.z);
        arrowHelper.arrow_list[1].setLength(window.select.cube.scale.y*small_w/2/proportion_array[window.select.ID], arrowhead_scale_array[1], arrowhead_scale_array[1]);
        arrowHelper.arrow_list[2].setLength(window.select.cube.scale.x*small_w/2/proportion_array[window.select.ID], arrowhead_scale_array[2], arrowhead_scale_array[2]);
        arrowHelper.arrow_list[3].setLength(window.select.cube.scale.y*small_w/2/proportion_array[window.select.ID], arrowhead_scale_array[3], arrowhead_scale_array[3]);
        arrowHelper.arrow_list[4].setLength(window.select.cube.scale.x*small_w/2/proportion_array[window.select.ID], arrowhead_scale_array[4], arrowhead_scale_array[4]);
        arrowHelper.arrow_list[0].setLength(indicator_box.scale.x*0.1, arrowhead_scale_array[0], arrowhead_scale_array[0]);
        indicator_box.position.set(indicator_box_position.x,indicator_box_position.y,indicator_box_position.z + small_h*0.5*window.select.cube.scale.z);
        /*arrowHelper.arrow_box.scale.x = proportion_array[window.select.ID];
        arrowHelper.arrow_box.scale.y = proportion_array[window.select.ID];
        arrowHelper.arrow_box.scale.z = proportion_array[window.select.ID];*/
        /*indicator_box.scale.x = proportion_array[window.select.ID];
        indicator_box.scale.y = proportion_array[window.select.ID];
        indicator_box.scale.z = proportion_array[window.select.ID];*/
        if (window.select.cube && current_mode != RESIZE_MODE){
            plane_object.position.setX(plane_object_position.x);
            plane_object.position.setY(plane_object_position.y);
            plane_object.position.setZ(plane_object_position.z);
        }
        /*toggle_cube_resize_arrows(true);
        toggle_cube_move_indicators(true);
        toggle_cube_rotate_indicators(true);*/
    }else{
        toggle_cube_resize_arrows(false);
        toggle_cube_move_indicators(false);
        toggle_cube_rotate_indicators(false);
    }
    if (nav_on || threed_mt_mode == 'support_label'){
        toggle_cube_resize_arrows(false);
        toggle_cube_move_indicators(false);
        toggle_cube_rotate_indicators(false);
    }
    box_renderer.render(box_scene, camera);
    renderer.render(scene, camera);
}

function ConvertPosition(convert_object, target_object){//converts position of convert_object to coordinates in target_object matrixworld
    var position = convert_object.position.clone().applyMatrix4(convert_object.parent.matrixWorld.clone());
    var i_mat = new THREE.Matrix4().getInverse(target_object.matrixWorld.clone());
    var position = position.applyMatrix4(i_mat);
    return position;
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
    render_box_object(window.select);
}

function render_box_object(object){
    var parent_scene = object.cube.parent.parent;
    if (parent_scene == scene){
        var this_renderer = renderer;
    }else{
        var this_renderer = box_renderer;
    }
    if (typeof proportion_array[object.ID] == "undefined"){
            proportion_array[object.ID] = 1;
        }
    collision_plane.matrixWorld = window.select.plane.matrixWorld.clone();
    if (object.cube.parent != object.plane){
        object.cube.parent.matrixWorld = object.plane.matrixWorld.clone();
    }
    if (object == window.select){
        setup_arrowheads_rescaling(object);
        arrowHelper.matrixWorld = object.plane.matrixWorld.clone();
        if (!arrow_box_position || !indicator_box_position || !plane_object_position){
            arrow_box_position = ConvertPosition(object.cube, arrowHelper);
            indicator_box_position = ConvertPosition(object.cube, indicator_box.parent);
            plane_object_position = ConvertPosition(window.select.cube, plane_object.parent);
        }
        var plane_object_position = ConvertPosition(object.cube, plane_object.parent);
        arrowHelper.arrow_box.rotation.z = object.cube.rotation.z;
        arrowHelper.arrow_box.position.set(arrow_box_position.x, arrow_box_position.y, arrow_box_position.z + small_h*0.5*object.cube.scale.z);
        arrowHelper.arrow_list[1].setLength(object.cube.scale.y*small_w/2/proportion_array[object.ID], arrowhead_scale_array[1], arrowhead_scale_array[1]);
        arrowHelper.arrow_list[2].setLength(object.cube.scale.x*small_w/2/proportion_array[object.ID], arrowhead_scale_array[2], arrowhead_scale_array[2]);
        arrowHelper.arrow_list[3].setLength(object.cube.scale.y*small_w/2/proportion_array[object.ID], arrowhead_scale_array[3], arrowhead_scale_array[3]);
        arrowHelper.arrow_list[4].setLength(object.cube.scale.x*small_w/2/proportion_array[object.ID], arrowhead_scale_array[4], arrowhead_scale_array[4]);
        arrowHelper.arrow_list[0].setLength(indicator_box.scale.x*0.1, arrowhead_scale_array[0], arrowhead_scale_array[0]);
        indicator_box.position.set(indicator_box_position.x,indicator_box_position.y,indicator_box_position.z + small_h*0.5*object.cube.scale.z);
		if (current_mode != RESIZE_MODE){
			plane_object.position.setX(plane_object_position.x);
			plane_object.position.setY(plane_object_position.y);
			plane_object.position.setZ(plane_object_position.z);
    	}
	}
	if (threed_mt_mode == 'support_label'){
		toggle_cube_resize_arrows(false);
        toggle_cube_move_indicators(false);
        toggle_cube_rotate_indicators(false);
	}
    if (renderer.context){
        renderer.render(scene, camera);
        box_renderer.render(box_scene, camera);
    }else{
        this_renderer.render(object.cube, camera);
        renderer.render(object.plane, camera)
        box_renderer.render(arrowHelper, camera);
        box_renderer.render(indicator_box, camera);
    }

}

function render_plane_object(object){
    if (object.cube && object.cube.parent != object.plane){
        object.cube.parent.matrixWorld = object.plane.matrixWorld.clone();
    }
    if (renderer.context){
        renderer.render(scene, camera);
    }else{
        renderer.render(object.plane, camera)
    }
}

function open_instr() {
	console.log("Instructions opened");
	$('#instr_full').colorbox({iframe:true,width:1100,height:700,transition:"none",closeButton:true});
}


function AMTLoadNextImage(gp_incorrect){
	if (wait_for_input == 1 && gp_incorrect != true){
		alert("You must close the popup window before you submit.");
		return;
	}
	if (object_list.length < 11 && gp_incorrect != true && threed_mt_mode != "support_label"){
		var answer = confirm("You labeled less than 10 objects. Are you sure that there are no more objects in the image to label?");
		if (answer == false) return; 		
	}
	var time = (Date.now() - start_time)/1000;
	window.parent.time_string += time + ' ';
    var current_url = window.location.href;
    var new_count = parseInt(image_count) + 1;
	var new_url = window.location.href;
	if (screenshot_mode == true && image_count == 4){
		new_count = 0;
		var new_list_count = parseInt(image_list_number) + 1;
		new_url = current_url.replace("image_list=" + image_list_number, "image_list=" + new_list_count).replace("image=" + image_count, "image=0");
		image_count = 0;
	}
	console.log(new_count);
   	new_url = current_url.replace("image=" + image_count, "image=" + new_count);
    window.location.assign(new_url);
}
function getAnswers(){
	for (var i = 0; i < object_list.length; i++){
		console.log("ID " + object_list[i].ID);
		if (object_list[i].hparent != "unassigned") console.log("Parent " + object_list[i].hparent.ID);
		console.log("Height " + object_list[i].plane.matrixWorld.elements[13]);
	}	
}

