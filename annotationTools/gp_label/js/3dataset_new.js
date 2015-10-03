var DEBUG_MODE = false;
var RESIZE_MODE = 1
var ROTATE_MODE = 2
var BOX_MOVE_MODE = 3
var VERTICAL_PLANE_MOVE_MODE = 4
var current_mode;
var pass_val;
var proportion_array = [];

var job_startTime;
var job_endTime;

var renderer;  // A three.js WebGL or Canvas renderer.
var scene;     // The 3D scene that will be rendered, containing the cube.
var camera;    // The camera that takes the picture of the scene.
var old_camera;

var sidemode = 1;

var plane;
var empty_plane;
var arrowHelper;
var intersect_box = new THREE.Object3D();
var guide_box;

var zoomOn = false;
var scrollTop = 0;
var scrollLeft = 0;

var resize_x0, resize_y0, resize_vx, resize_vy;

var object_list = new Array();


var small_h;
var small_w;
var small_d;
var f;

var model3d_loader;

var cloneOn = false;
var addOn = false;
var removeOn = false;
var projectOn = false;
var heightOn = false;
var click_original = new THREE.Vector3();
var cube_original = new THREE.Vector3();

// variable for rotatin views
var rotateStart = new THREE.Vector2();
var rotateEnd = new THREE.Vector2();
var rotateDelta = new THREE.Vector2();
var rotateSpeed = 1.0;
var thetaDelta = 0;
var phiDelta = 0;
var EPS = 0.000001;
var lastPosition = new THREE.Vector3();
var target = new THREE.Vector3(0, 0, -1);
var nav_toggle = false;
var nav_on = false;

var minPolarAngle = 0; // radians
var maxPolarAngle = Math.PI; // radians
var scale = 0.1;

var dollyStart = new THREE.Vector2();
var dollyDelta = new THREE.Vector2();
var ID_dict = {};

// TODO: this height control should be relative to what's saved as "mid-point"
var delta1 = 50;
var support_object;
var rotate_mode = false;
var prevX;
var alertFlag = false;
var slidersOn = false;

var plane_indicator_on = false;
var rotate_indicator_on = false;

var okAlert = {
    name: "okAlert",
    animation: 700, // Animation speed
    buttons: {
    },
    input: false, // input dialog
    override: true, // Override browser navigation while Apprise is visible
};

$(function() {
      $( "#slider-vertical" ).slider({
                     orientation: "vertical",
                     range: "min",
                     min: 0,
                     max: 100,
                     value: 60,
                     slide: function( event, ui ) {
                         $( "#amount" ).val( ui.value );
                         vertical_slide(ui.value);
                     }
                     });
      $( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
  });


function add_box() {// adding a new box//
    //instr = 'Select the object you want to add the new box on (using BOX Selection window on the bottom left).';
    add_box_internal(plane);
    instruct(instr);
}

function add_box_internal(support_object) {
    if (window.location.pathname.split("/").pop() == "box_tester.php"){
        var box_label = "undefined";
    }else{
        var box_label = prompt("Please choose a label for the box", "Box");
        box_label = box_label.replace(/ /g,"_");
    }
    instructions = "";
    object_list.push(new object_instance);
    window.select = object_list[object_list.length-1];//window.select is now the new object
    window.select.hparent = "unassigned";
    if (object_list.length == 1) {
        window.select.ID = 1;
    }
    else {
        window.select.ID = object_list[object_list.length-2].ID + 1;
    } //making ID of object the max ID of object currently in list + 1
    ID_dict[window.select.ID] = window.select;
    var sp_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    var sp_plane_geometry = new THREE.PlaneGeometry(20, 20, 40, 40);
    sp_plane = new THREE.Mesh(sp_plane_geometry, sp_plane_material);
    sp_plane.matrixWorld = plane.matrixWorld;
    sp_plane.material.visible = false;
    //window.select.support_plane = empty_plane.clone();
    window.select.support_plane.matrixWorld = gp_plane.matrixWorld.clone();
    scene.add(window.select.support_plane);
    window.select.support_plane.add(object_list[object_list.length-1].cube);
    //scene.add(object_list[object_list.length-1].cube);
    object_list[object_list.length-1].cube.position.setX(0.95);
    object_list[object_list.length-1].cube.position.setY(0.95);
    object_list[object_list.length-1].cube.position.setZ(small_h/2);

    window.select.label = box_label;

    var tmp_button = add_icon(box_label);
    tmp_button.innerHTML = "<font size=3><b>"+tmp_button.innerHTML+"</b></font>";

    for (var i = 0; i < stage.children.length; i++) {
        stage.children[i].hide();
    }
    boxSelect();
    instruct(instructions);
    render()

}


function add_icon(box_label) {// adding icons
    var icon_container = document.getElementById('icon_container');
    var tmp_button = document.createElement('button');

    tmp_button.value = box_label;
    tmp_button.className = "icon"
    tmp_button.id = object_list[object_list.length-1].ID;
    icon_container.appendChild(tmp_button);

    $( "#" + object_list[object_list.length-1].ID ).on( "click", function() { buttonClicked(this); } );

    reset_icon();

    return tmp_button;
}

function API_handler(){
    API_dict = {}
    API_string = document.URL.split("?")[1]; //splitting URL into main and API segments
    for (item = 0; item < API_string.split("&").length; item++){ //splitting API segment into different parts
        holder = API_string.split("&")[item].split("="); // splitting parts by equal signs to allow assigning into dictionary
        API_dict[holder[0]] = holder[1];
    }
    if ("sliders" in API_dict && API_dict["sliders"] == "true"){
        slidersOn = true;
        document.getElementById("sliders").style.display = "inline-block";
    }
    else{
        slidersOn = false;
        document.getElementById("sliders").style.display = "none";
        document.getElementById("inputs").style.display = "inline-block";
    }
    if ("mode" in API_dict && API_dict["mode"] == "expert"){
        document.getElementById("icon_wrapper").style.display = "block";
        document.getElementById("title_bar").style.display = "block";
        document.getElementById("model_column").style.display = "block";
        document.getElementById("all_boxes_wrapper").style.display = "inline-block";
        document.getElementById("input").style.display = "inline-block";
        document.getElementById("buttonform1").style.display = "inline-block";
        document.getElementById("clone").style.display = "inline";
        document.getElementById("height").style.display = "inline";

        hovering();
    }
    else if ("mode" in API_dict){//For when mechanical turk is on. This is now the default mode
        document.getElementById("submit").style.display = "block";
        if (API_dict["mode"] == "gp"){
            document.getElementById("submit").style.display = "block";
            document.getElementById("input").style.display = "block";
            document.getElementById("im").style.overflow = "auto";
            zoomOn = false;
            toggle_zoom();
            DEFAULT_INSTR = "Click and drag the circles to move the dotted lines. Press z to zoom in and out."
            instruct(DEFAULT_INSTR);
        }
        if (API_dict["mode"] == "add"){ //box labeling mode
            document.getElementById("input").style.display = "block";
            document.getElementById("buttonform1").style.display = "block";
            document.getElementById("diffview_cnvs").style.display = "block";
            document.getElementById("height-slider").style.display = "none";
            document.getElementById("submit").style.display = "block";
            for (var i = 0; i < stage.children.length; i++) {
                stage.children[i].hide();
            }
            if (confirm("Is there an object to label in this picture?")){
                add_box_internal(plane);
                toggle_cube_resize_arrows(true);
            }
        }
        if ("mode" in API_dict && API_dict["mode"] == "model"){// if gp is selected
            if ("select" in API_dict && API_dict["select"] != "GP"){
                gp_plane.material.visible = false;
                window.select = ID_dict[API_dict["select"]];
                for (var i = 0; i < stage.children.length; i++) {
                    stage.children[i].hide();
                }
                for (var i=0; i<object_list.length; i++){// disappears cubes and all support planes, keeps model visible
                    object_list[i].cube.traverse( function ( object ) { if (object != window.select.model){object.visible = false; }} );
                    object_list[i].support_plane.material.visible = false;
                }
                document.getElementById("all_boxes").checked = false;
                toggle_all_boxes();
                boxSelect();
                toggle_cube_resize_arrows(true);

            }
            DEFAULT_INSTR = "Select the 3D model that is most similar to the object bounded by the box.";
            instruct(DEFAULT_INSTR);
            document.getElementById("buttonform1").style.display = "none";
            document.getElementById("model_column").style.display = "block";
            document.getElementById("save").style.display = "none";
            document.getElementById("clone").style.display = "none";
            document.getElementById("height").style.display = "none";
            document.getElementById("add").style.display = "none";
            document.getElementById("remove").style.display = "none";
            document.getElementById("sliders").style.display = "none";
            document.getElementById("input").style.display = "block";
            document.getElementById("height-slider").style.display = "none";
            document.getElementById("diffview_cnvs").style.display = "none";
            document.getElementById("submit").style.display = "block";
        }
        if ("mode" in API_dict && API_dict["mode"] == "location"){
                document.getElementById("model_column").style.display = "block";
                document.getElementById("buttonform1").style.display = "none";
                document.getElementById("save").style.display = "none";
                document.getElementById("clone").style.display = "none";
                document.getElementById("height").style.display = "none";
                document.getElementById("add").style.display = "none";
                document.getElementById("remove").style.display = "none";
                document.getElementById("sliders").style.display = "none";
                document.getElementById("input").style.display = "block";
                document.getElementById("height-slider").style.display = "none";
                document.getElementById("diffview_cnvs").style.display = "none";
                document.getElementById("submit").style.display = "block";
                document.getElementById("icon_wrapper").style.display = "block";
                document.getElementById("model").style.display = "none";

            if ("select" in API_dict && API_dict["select"] != "GP"){
                gp_plane.material.visible = false;
                window.select = ID_dict[API_dict["select"]];
                for (var i = 0; i < stage.children.length; i++) {
                    stage.children[i].hide();
                }
                document.getElementById("all_boxes").checked = false;
                document.getElementById("model_column").style.display = "none";
                toggle_all_boxes();
                boxSelect();
                DEFAULT_INSTR = "Select the support object of this box.";
                instruct(DEFAULT_INSTR);
                assign_height();
                document.getElementById(window.select.ID).style.display = "none";
            }
            toggle_cube_resize_arrows(false);
            toggle_cube_move_indicators(false);
            toggle_cube_rotate_indicators(false);
        }
    }

    if ("id" in API_dict){
        window.select = ID_dict[API_dict["id"]];
        document.getElementById("all_boxes").checked = false;
    }
    if (window.location.pathname.split("/").pop() == "gp_tester.php"){
        document.getElementById("input").style.display = "block";
        document.getElementById("submit").style.display = "block";
    }
    if (window.location.pathname.split("/").pop() == "box_tester.php"){
        document.getElementById("input").style.display = "block";
        document.getElementById("submit").style.display = "block";
        document.getElementById("buttonform1").style.display = "block";
        document.getElementById("height-slider").style.display = "none";
        add_box_internal(plane);
    }
}

function boxSelect() {//now really only highlighting
    for (var i = 0; i < object_list.length; i++) {
        changeColor(object_list[i].cube, 0xffffff);
        object_list[i].support_plane.material.visible = false;
    }
    if (object_list.length && window.select.ID != 0) {
        changeColor(window.select.cube, 0xffff00);
        if (window.select.hparent != "unassigned"){
            window.select.support_plane.material.visible = true;
            console.log("click");
        }
        if (API_dict["mode"] != "model"){
            toggle_cube_resize_arrows(true);
        }
        gp_plane.material.visible = false;
        guide_Z_line.material.visible = false;
    } else if (window.select == plane){
        gp_plane.material.visible = true;
        guide_Z_line.material.visible = true;
    }
    if (typeof window.select.cube !== 'undefined' && slidersOn == true){
        document.getElementById("scale_x").value = (window.select.cube.scale.x-1)/0.1;
        document.getElementById("scale_y").value = (window.select.cube.scale.y-1)/0.1;
        document.getElementById("scale_z").value = (window.select.cube.scale.z-1)/0.1;
        document.getElementById("rotation").value = (window.select.cube.rotation.z + Math.PI)*50/Math.PI;
        $("#slider-vertical").slider("value",  (window.select.support_plane.slider_value));
    }
    else if (typeof window.select.cube !== 'undefined' && slidersOn == false){
        document.getElementById("input_x").value = window.select.cube.scale.x;
        document.getElementById("input_y").value = window.select.cube.scale.y;
        document.getElementById("input_z").value = window.select.cube.scale.z;
        document.getElementById("input_r").value = window.select.cube.rotation.z/(2*Math.PI)*360;
        $("#slider-vertical").slider("value",  (window.select.support_plane.slider_value));
    }
    render();
}

function assign_height(){

    instr = "Select the box that is the support object.";
    instruct(instr);
    Apprise("Select the box that is the support object.", okAlert);
    $('#im_resizable').css('opacity',.7);
    $('#model_column').css('opacity',.03);
    $('#input').children().not("#instructions").css('opacity',.3);
    heightOn = true;
}

function buttonClicked(event) {
    var instructions;
    console.log(event.id);
    for (var i = 0; i < intersect_box.children.length; i++){
        if (typeof plane_cube != "undefined" && intersect_box.children[i] != plane_cube){
            intersect_box.children[i].material.color.setHex(0x0000ff);
        }
    }
    if (removeOn && (typeof ID_dict[event.id] != "undefined")){
        removeOn = false;
        remove_box_internal(ID_dict[event.id]);
        $('#im_resizable').css('opacity','');
        $('#model_column').css('opacity','');
        $('#input').children().not("#instructions").css('opacity','');
    }else if (heightOn == true){
        heightOn = false;
        if (window.select.hparent != "unassigned" && window.select.hparent != gp_plane){
            var index = window.select.hparent.hchildren.indexOf(window.select);
            window.select.hparent.hchildren.splice(index, 1);
        }if (window.select == plane){
            Apprise("You cannot assign a support object to the groundplane", okAlert);
        }else if (event.id == "GP"){
            window.select.hparent = gp_plane;
            var i_mat = new THREE.Matrix4().getInverse(window.select.support_plane.matrixWorld.clone());
            cube_position_0 = window.select.cube.position.clone();
            cube_position_0.setZ(window.select.cube.position.z - window.select.cube.scale.z*0.05/2);
            cube_position_0_static = window.select.cube.position.clone();
            cube_position_0_static.setZ(window.select.cube.position.z - window.select.cube.scale.z*0.05/2);
            cube_position_0.applyMatrix4(window.select.support_plane.matrixWorld.clone());
            cube_position_0_static.applyMatrix4(window.select.support_plane.matrixWorld.clone());
            old_x = window.select.cube.scale.x;
            old_y = window.select.cube.scale.y;
            old_z = window.select.cube.scale.z;
            old_arrow_x = arrowHelper.arrow_box.scale.x;
            old_arrow_y = arrowHelper.arrow_box.scale.y;
            old_arrow_z = arrowHelper.arrow_box.scale.z;
            calculate_box_location();
        }else if (typeof ID_dict[event.id] != "undefined"){//instead of creating new support plane, move current one (gp.clone())
            //var sp_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
            window.select.hparent = ID_dict[event.id];
            ID_dict[event.id].hchildren.push(window.select);
            for (var i = 0; window.select.hchildren.length; i++){
                if (window.select.hchildren[i] == ID_dict[event.id]){
                    var index = window.select.hchildren.indexOf(ID_dict[event.id]);
                    window.select.hchildren.splice(index, 1);
                }
            }
            //window.select.support_plane.matrixWorld = window.select.hparent.support_plane.matrixWorld.clone();
            //window.select.support_plane.material = sp_plane_material;
            //window.select.support_plane.add(window.select.cube);
            //scene.add(window.select.support_plane); // do all this stuff in calculate_box_location instead
            //window.select.support_plane.matrixWorld.multiplyMatrices(window.select.hparent.support_plane.matrixWorld, (new THREE.Matrix4()).makeTranslation(0, 0, window.select.hparent.cube.scale.z*small_h));
            var oldest_ancestor = check_oldest_ancestor(ID_dict[event.id]);
            if (oldest_ancestor == gp_plane){
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
                calculate_box_location();
            }
        }
        $('#im_resizable').css('opacity','');
        $('#model_column').css('opacity','');
        $('#input').children().not("#instructions").css('opacity','');
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
        window.select.support_plane.matrixWorld = ID_dict[event.id].support_plane.matrixWorld.clone();
        window.select.cube.scale.x = temp_x;
        window.select.cube.scale.y = temp_y;
        window.select.cube.scale.z = temp_z;
        window.select.cube.rotation.z = temp_rotation_z;
        window.select.cube.position.setZ(temp_z_pos);
        window.select.support_plane.material.visible = true;
        $('#container1').children().css('opacity','');
        $('#input').children().css('opacity','');
    }else if (event.id == "GP") {
        reset_icon();
        event.innerHTML = "<b><font size=3>"+event.value+"</font></b>";
        window.select = plane;
        for (var i = 0; i < stage.children.length; i++) {
            stage.children[i].show();
        }
        for (var i = 0; i<object_list.length; i++){
            changeColor(object_list[i].cube, 0xffffff);
            if (object_list[i].hparent != "unassigned"){
                object_list[i].support_plane.material.visible = false;
            }
        }
        guide_Z_line.material.visible = true;
        toggle_cube_move_indicators(false);
        toggle_cube_rotate_indicators(false);
        toggle_cube_resize_arrows(false);
        instructions = "Use dotted lines and blue circle to edit and move groundplane until it is aligned with floor."
        instruct(instructions);
    }else if ((event.id != "remove") && (event.id != "project") && (event.id != "add") && (event.id != "GP")){
        gp_plane.material.visible = false;
        reset_icon();
        icon_container.children[0].innerHTML = icon_container.children[0].value;
        event.innerHTML = "<b><font size=3>"+event.innerHTML+"</font></b>";
        //var instructions = "Left click and move mouse on plane to move box to an object. Left click and drag arrows on box to resize box to correct dimensions until object is bounded. Right click and drag to rotate box.";
        var instructions = "";
        instruct(instructions);
        for (var i = 0; i < stage.children.length; i++) {
            stage.children[i].hide();
        }
        window.select = ID_dict[event.id];//selecting based on clicked button id
        toggle_cube_move_indicators(true);
        toggle_cube_rotate_indicators(true);
        toggle_cube_resize_arrows(true);
        boxSelect();//highlighting functions
        /*arrowHelper.arrow_box.scale.x = 1;
        arrowHelper.arrow_box.scale.y = 1;
        arrowHelper.arrow_box.scale.z = 1;*/
    }
    var oldest_ancestor = check_oldest_ancestor(window.select);
    if (oldest_ancestor != "unassigned" && typeof oldest_ancestor != "undefined"){
        window.select.support_plane.material.visible = true;
        check_plane_box_collision();
    }
    toggle_all_boxes();
    render();
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
            console.log("intersect");
            //var i_mat = new THREE.Matrix4().getInverse(dummy_plane.matrixWorld);
            var i_mat2 = new THREE.Matrix4().getInverse(window.select.support_plane.matrixWorld);
            plane_intersection[i].point.applyMatrix4(i_mat2);//x and y in support plane
            window.select.cube.position.copy(plane_intersection[i].point);
            proportion_scale = camera.position.distanceTo(plane_intersection[i].point.applyMatrix4(window.select.support_plane.matrixWorld))/camera.position.distanceTo(cube_position_0_static);
            console.log(plane_intersection[i].point);
            console.log(cube_position_0_static);
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
    render();
    console.log(proportion_scale);
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
    //object.support_plane = gp_plane.clone();
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
    console.log(proportion_scale);
    console.log(target_cube_scale_0.x);
    if (typeof proportion_array[object.ID] == "undefined"){
        proportion_array[object.ID] = 1;
    }
    proportion_array[object.ID] = proportion_scale*proportion_array[object.ID];
    render();
        //console.log(object.cube.position.clone().applyMatrix4(object.support_plane.matrixWorld.clone()).distanceTo(object.hparent.cube.position.clone().applyMatrix4(object.hparent.support_plane.matrixWorld.clone())));
    if (object.hchildren){
        for (var i = 0; i < object.hchildren.length; i++){
            calculate_children_box_locations(object.hchildren[i])
        }
    }
    render();
}

function category_list_load(filelist){
    var model_container = document.getElementById('model');
    for (var i = 0; i <= filelist.length; i++) {
        if (typeof filelist[i] != "undefined"){
            var link = document.createElement("a");
            link.addEventListener("click", model_list_populate, false);
            var tmp_param = filelist[i].split("/");
            if (typeof tmp_param[1] != "undefined"){
                var img = "data/models/"+ tmp_param[1].substring(0, 2)  + "/" + tmp_param[1].substring(0,4) +"/"+ tmp_param[1]+"/"+tmp_param[1]+"_thumb.jpg";
                link.innerHTML = tmp_param[0] + "<img class='model_item' name='"+tmp_param[0]+"' src='"+img+"'></br>";
                model_container.appendChild(link);
            }
        }
    }
}

function category_list_populate(event) {
    var param = event.target.name;
    var model_container = document.getElementById('model');
    model_container.innerHTML = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var filelist = JSON.parse(xmlhttp.responseText);
            category_list_load(filelist);
        }
    }
    xmlhttp.open("GET","php/model_server.php?task=submodel&param="+param,true);
    xmlhttp.send();
}


function changeColor(container, color) {
    for (var i = 0; i < container.children.length; i++) {
        if (container.children[i].material) {
            if (container.children[i].material.color) {
                container.children[i].material.color.setHex(color);
            }
        }
    changeColor(container.children[i], color);
    }
}

function check_oldest_ancestor(oldest_ancestor){
    while (oldest_ancestor != "unassigned" && oldest_ancestor != gp_plane && typeof oldest_ancestor != "undefined"){
        oldest_ancestor = oldest_ancestor.hparent;
    }
    return oldest_ancestor;
}

function check_plane_box_collision(object) {
    if (typeof object == "undefined"){
        object = window.select;
    }
    var pts0 = [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6];
    var pts1 = [1, 2, 5, 3, 4, 3, 7, 6, 5, 6, 7, 7];

    /*while (intersect_box.children.length){
        intersect_box.remove(intersect_box.children[0]);
    }*/
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

    if (object_list.length && object.hparent != gp_plane) {
        for (var i = 0; i < object_list.length; i++) {
            if (object_list[i].support_plane == object.support_plane || object_list[i].cube.visible == false){
                continue;
            }
            vert = object_list[i].cube.children[0].geometry.vertices;
            for (var j = 0; j < pts0.length; j++) {
                var vert0 = vert[pts0[j]].clone().applyMatrix4(object_list[i].cube.matrixWorld);
                var vert1 = vert[pts1[j]].clone().applyMatrix4(object_list[i].cube.matrixWorld);
                var direction = new THREE.Vector3().subVectors(vert1, vert0);
                var direction_len = direction.length();
                raycaster.set(vert0.clone(), direction);
                intersects = raycaster.intersectObject(object.support_plane, false);
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
        scene.add(intersect_box);
    }

    if (object_list.length && (object.hparent != "unassigned") && (object.hparent != gp_plane) && object != plane) {
        var line_raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
        var line_vert1 = new THREE.Vector3(.985, .985, -100).applyMatrix4(plane.matrixWorld);
        var line_vert2 = new THREE.Vector3(.985, .985, 100).applyMatrix4(plane.matrixWorld);
        //var line_vert1 = line_vert[0].clone().applyMatrix4(object.cube.matrixWorld);
        //var line_vert2 = line_vert[1].clone().applyMatrix4(object.cube.matrixWorld);
        var direction = new THREE.Vector3().subVectors(line_vert2, line_vert1);

        line_raycaster.set(line_vert1, direction);
        line_intersect = line_raycaster.intersectObject(object.support_plane, false);
        var cubeGeometry2 = new THREE.CubeGeometry(.02, .02, .02);
        var cubeMaterial2 = new THREE.MeshBasicMaterial({color: 0xff0000});
        if ((line_intersect.length > 0) && (typeof plane_cube == "undefined")){
            plane_cube = new THREE.Mesh( cubeGeometry2, cubeMaterial2 );
            //plane_cube.material.color.setHex( 0xff0000 );
            intersect_box.add(plane_cube);
            scene.add(intersect_box);
            plane_cube.material.visible = true;
            var position = new THREE.Vector3(1, 1, 0).applyMatrix4(object.support_plane.matrixWorld.clone());
            plane_cube.position.set(position.x, position.y, position.z);
        }else if (line_intersect.length){
            plane_cube.material.visible = true;
            var position = new THREE.Vector3(1, 1, 0).applyMatrix4(object.support_plane.matrixWorld.clone());
            plane_cube.position.set(position.x, position.y, position.z);
        }
    }else{
        for (var i = 0; i < intersect_box.children.length; i++){
            intersect_box.children[i].material.visible = false;
        }
    }
    render();
}


function clone_box(){
    cloneOn = true;

    instr = "Select the box you want to clone.";
    //Apprise(instr, okAlert);
    instruct(instr);

    $('#im_resizable').css('opacity',.7);
    $('#model_column').css('opacity',.03);
    $('#input').children().not("#instructions").css('opacity',.3);

    //TODO: make sure (1) you activate the current icon and (2) scrollbars are set based on the cloned object
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

function createObject(container, name) {
    if (name == 'NONE') {
        if (container.children.length>1) {
            container.remove(container.children[1]);
            render();
        }
    return;
    }
    var model3d_material = new THREE.MeshNormalMaterial({side:THREE.DoubleSide,opacity:0.2});
    model3d_loader.load(name, function (object) {
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = model3d_material;
        }
    });

    object.name = name;
    window.select.model = object;
    if (container.children.length>1) {
        container.remove(container.children[1]);
    }
    container.add(object);
    render();
    //TODO: loading screen?
    });
}

function createWorld() {
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
    //gp_plane.add(guide_Z_line);


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
    small_d = -0.05;
    small_h = 0.05;
    small_w = 0.05;
    window.select = plane; //initializing the first selected object to be the plane
    plane.material.visible = false;
    gp_plane.material.visible = true;

    vert_plane.material.visible = false;
    plane.frustumCulled = false;
    gp_plane.frustumCulled = false;
    empty_plane.frustumCulled = false;
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
    }
}

function cube_rotate(radians){
    if (slidersOn || (current_mode == ROTATE_MODE)){
        if (typeof radians == "undefined"){
            var radians = document.getElementById("rotation").value*Math.PI*2/100-Math.PI;}
        else{
            var radians = radians;
        }
    boxSelect();
    }
    else{
        var radians = document.getElementById("input_r").value*2*Math.PI/360;
    }
    if (API_dict["mode"] == "model"){
        radians = radians*180/Math.PI;
        radians = Math.round(radians/90)*90*Math.PI/180;
        window.select.model.rotation.set(0,0, radians);
    }else{
        window.select.cube.rotation.set(0,0,radians);
        /*radians = radians*180/Math.PI;
        radians = Math.round(radians/90)*90*Math.PI/180;
        window.select.model.rotation.set(0,0, radians);*/ // this code is for testing only
        for (var i = 0; i < cube_move_mode_arrows.length; i++){
            cube_move_mode_arrows[i].cone.material.visible = false;
            cube_move_mode_arrows[i].line.material.visible = false;
        }
        rotate_mode_indicators[0].cone.material.visible = true;
        rotate_mode_indicators[0].line.material.visible = true;
        rotate_mode_indicators[1].material.visible = true;
        render();
    }
}

 function hovering(){
    $(document).ready(function () {
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
                                object_list[i].support_plane.material.visible = false;
                        }
                    }
                }
                var oldest_ancestor = check_oldest_ancestor(ID_dict[event.target.id]);
                console.log(oldest_ancestor);
                changeColor(ID_dict[event.target.id].cube, 0xff0000);//makes cube that is hovered over red
                if (oldest_ancestor != "unassigned"){
                    check_plane_box_collision(ID_dict[event.target.id]);
                    ID_dict[event.target.id].support_plane.material.visible = true;//shows groundplane of cube that is being hovered over
                }
            }
            else if (event.target.id == "GP" && window.select != plane){// hovering over the GP icon
                toggle_cube_resize_arrows(false);
                toggle_cube_rotate_indicators(false);
                toggle_cube_move_indicators(false);
                var length = intersect_box.children.length;
                for (var i = length - 1; i > -1; i--){
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
                    object_list[i].support_plane.material.visible = false;
                }
                gp_plane.material.visible = true;// shows GP
            }
            else{ // not hovering over any icon
                for (var i=0; i<object_list.length; i++){// making visible all cubes as white, dissappearing all of their support planes
                    object_list[i].cube.traverse( function ( object ) { object.visible = true; } );
                    changeColor(object_list[i].cube, 0xffffff);
                    if (object_list[i].hparent != "unassigned"){
                        object_list[i].support_plane.material.visible = false;
                    }
                }
                var length = intersect_box.children.length;
                for (var i = length - 1; i > -1; i--){
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
                        window.select.support_plane.material.visible = true;
                        check_plane_box_collision();
                    }
                    changeColor(window.select.cube, 0xffff00);
                }else{
                    for (var i = 0; i < stage.children.length; i++) {// shows GP tools
                        stage.children[i].show();
                    }
                    var length = intersect_box.children.length;
                    for (var i = length - 1; i > -1; i--){
                        if ((typeof plane_cube != "undefined") && (intersect_box.children[i] != plane_cube)){
                            console.log("clicked");
                            intersect_box.remove(intersect_box.children[i]);
                            plane_cube.material.visible = false;
                        }
                    }
                    guide_Z_line.material.visible = true;
                    gp_plane.material.visible = true;//if GP is selected, make GP visible
                }
                /*if (window.select != plane && typeof window.select != "undefined"){// highlighting selected cube and showing its support plane
                    if (window.select.hparent != "unassigned"){
                        window.select.support_plane.material.visible = true;
                    }
                    changeColor(window.select.cube, 0xffff00);
                }*/
            }
            render();
        });
    });
}


function init(img_id){
    instruct(DEFAULT_INSTR);
    img_id = img_id;
    console.log(img_id);
     //--------------------------------------------------------------------Resizing Start----------------------------------------------------------------------------//
    if (document.getElementById("img").width <= 920){
        document.getElementById("im").style.overflow = "hidden";
    }
    if (document.getElementById("img").height > 630){
        document.getElementById("img").height = "630";
    }
    document.getElementById("cnvs").height = document.getElementById("img").height;
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
    if (document.getElementById("navigation")) {
        document.getElementById("navigation").checked = false;
        document.getElementById("navigation_label").style.backgroundColor = "#333";
    }
    document.getElementById("all_boxes").checked = true;

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    $('#im_resizable').resizable();
    $('#input').draggable();
    $("#GP").on("click", function() { buttonClicked(this); } );


    document.addEventListener('keydown', onDocumentKeyDown, false);

    createWorld();
    render();
    update_plane();
    //setup_model_list()


    ID_dict["GP"] = plane;
    render();

    load_file(img_id);
    API_handler();
    update_plane();
    job_startTime = new Date().getTime();

}

function input_change() {// getting input for cube dimensions
    indicatorsOff = true;// to make indicators go off during resizing
    n = 0.1;
    static_x = window.select.cube.position.x;
    static_y = window.select.cube.position.y;
    static_z = window.select.cube.position.z;
    old_w = window.select.cube.scale.x;//for calculating delta of dimensions
    old_h = window.select.cube.scale.y;
    old_d = window.select.cube.scale.z;
    if (slidersOn){
        window.select.cube.scale.x = 1+document.getElementById("scale_x").value*n || 1;
        window.select.cube.scale.y = 1+document.getElementById("scale_y").value*n || 1;
        window.select.cube.scale.z = 1+document.getElementById("scale_z").value*n || 1;
    }
    else{
        window.select.cube.scale.x = document.getElementById("input_x").value || 1;
        window.select.cube.scale.y = document.getElementById("input_y").value || 1;
        window.select.cube.scale.z = document.getElementById("input_z").value || 1;
    }
    window.select.cube.position.x = static_x - small_w*0.5*(window.select.cube.scale.x - old_w)*Math.cos(window.select.cube.rotation.z) + small_h*0.5*(window.select.cube.scale.y - old_h)*Math.sin(window.select.cube.rotation.z);
    window.select.cube.position.y = static_y - small_w*0.5*(window.select.cube.scale.x - old_w)*Math.sin(window.select.cube.rotation.z) - small_h*0.5*(window.select.cube.scale.y - old_h)*Math.cos(window.select.cube.rotation.z);
    window.select.cube.position.z = static_z - small_d*0.5*(window.select.cube.scale.z - old_d);
    for (var i = 0; i < cube_move_mode_arrows.length; i++){
        cube_move_mode_arrows[i].cone.material.visible = false;
        cube_move_mode_arrows[i].line.material.visible = false;
    }
    rotate_mode_indicators[0].cone.material.visible = false;
    rotate_mode_indicators[0].line.material.visible = false;
    rotate_mode_indicators[1].material.visible = false;
    //the previous line is essentially to offset the change in position for z only
    render();
}

function instruct(string) {
    if (string === "undefined") {
        string = DEFAULT_INSTR;
    }
    //document.getElementById("instructions").innerHTML = "<b>Instructions:</b><br>" + string;
    document.getElementById("instructions_inner").innerHTML = string;
}

function load_file(img_id, use_id) {
    if (typeof userid == 'undefined'){
        userid = 'undefined';
    }
    use_id = typeof use_id !== 'undefined' ? use_id : false;
    if (use_id){
        use_id = userid;
    }
    else{
        use_id = '';
    }


    var split_url = location.pathname.substring(1).split("/");
    if (split_url[split_url.length-1] == "gp_tester.php"){
        CCC = $.ajax({
         type: "POST",
         url: "php/save_data.php",
         data: {
         "task": "vp_tester_load",
         "img": img_id,
         "userid": use_id
         },
         async: false,
         dataType: "html",
         error: function(a,b,c) {
         Apprise('load error', okAlert);
         error('load error');
         }
     });
    vp_out = CCC.responseText;
    load_vp(vp_out);
    }else{
        CCC = $.ajax({
             type: "POST",
             url: "php/save_data.php",
             data: {
             "task": "vp_load",
             "img": img_id,
             "userid": use_id
             },
             async: false,
             dataType: "html",
             error: function(a,b,c) {
             Apprise('load error', okAlert);
             error('load error');
             }
         });
        vp_out = CCC.responseText;
        load_vp(vp_out);
    }
        AAA = $.ajax({
             type: "POST",
             url: "php/save_data.php",
             data: {
             "task": "load",
             "img": img_id,
             "userid": use_id
             },
             async: false,
             dataType: "html",
             error: function(a,b,c) {
             Apprise('load error', okAlert);
             error('load error');
             }
         });
    out = AAA.responseText;
    load_data(out, use_id);
}

function load_data(out, use_id) {
    if (out.length < 5) {
        //Apprise('No saved data', okAlert);
        return ;
    }
    var sp = out.split(" ");
    var cou = 0;
    console.log(sp);

    // skipping userid + filename
    cou+=2;

    var scale_factor = document.getElementById('cnvs').width / 800;

    // VP points
    //for (var i = 4; i < stage.children[0].children.length; i++) {
    var vp_n = parseInt(sp[cou++]);
    for (var i = 0; i < vp_n; i++) {
        for (var j = 0; j < 2; j++) {
            if (vp_out.split("\n").length < 5){
                var child = stage.children[0].children[i*3+j+1];
                var point_id = child.name();
                var layer = child.getParent();
                var point_id = parseInt(point_id[1]);
                var line_id = Math.floor(point_id / 2);
                child.x(parseFloat(sp[cou++])*scale_factor);
                child.y(parseFloat(sp[cou++])*scale_factor);

                if (point_id % 2 == 0) {//reassigning coordinates of line endpoints based on which color/pair they belong to because it's just going from 0 to i
                    vp_s[line_id].x2d[0] = child.x();
                    vp_s[line_id].y2d[0] = child.y();
                } else if (point_id % 2 == 1) {
                    vp_s[line_id].x2d[1] = child.x();
                    vp_s[line_id].y2d[1] = child.y();
                }
                layer.get('.l'+(line_id)).each(function(line,n) {
                               line.points([vp_s[line_id].x2d[0], vp_s[line_id].y2d[0], vp_s[line_id].x2d[1], vp_s[line_id].y2d[1]]);
                           });
            }else{
                console.log("skip");
                cou++;
                cou++;
           }
        }
        if (typeof vp_out == "undefined"){
            vp_label[i] = parseInt(sp[cou++]);
        }else{
            cou++;
        }
    }
    op_x = parseFloat(sp[cou++]*scale_factor);//blue circle
    op_y = parseFloat(sp[cou++]*scale_factor);
    stage.children[1].children[0].x(op_x);
    stage.children[1].children[0].y(op_y);
    for (var i = 0; i < stage.children.length; i++) {
        stage.children[i].show();
    }

    stage.draw();

    // focal length
    f = parseFloat(sp[cou++])*scale_factor;

    // ground plane
    plane.matrixAutoUpdate = false;
    //createWorld();
    render();
    var K = new Array();
    for (var k = 0; k < 16; k++) {
        K[k] = parseFloat(sp[cou++]);
    }
    rerender_plane(K);

    if (document.getElementById('icon_container')) {
    // objects
        var N = parseInt(sp[cou++]);
        console.log(N);
        object_list = new Array();
        document.getElementById('icon_container').innerHTML='<button id = "GP" class = "gp_icon" value= "GP"><font size=3><b>GP</b></font></button>';
        for (var i = 0; i < N; i++) { //Loading box data starts here
            object_list.push(new object_instance);
            window.select = object_list[object_list.length-1];

            window.select.parent = plane;
            window.select.support_plane.add(window.select.cube);
            if (window.select.hparent != "unassigned"){
                window.select.support_plane.material.visible = false;
            }

            scene.add(window.select.support_plane);//temporarily disregarding object heirarchy, pretending every support plane is mobile
            render();

            for (var k = 0; k < 16; k++) {
                  window.select.support_plane.matrixWorld.elements[k] = parseFloat(sp[cou++]);
            }

            window.select.cube.position.x = parseFloat(sp[cou++]);
            window.select.cube.position.y = parseFloat(sp[cou++]);
            window.select.cube.position.z = parseFloat(sp[cou++]);
            window.select.cube.scale.x = parseFloat(sp[cou++]);
            window.select.cube.scale.y = parseFloat(sp[cou++]);
            window.select.cube.scale.z = parseFloat(sp[cou++]);
            window.select.cube.rotation.z = parseFloat(sp[cou++]);
            window.select.ID = parseFloat(sp[cou++]);
            window.select.label = sp[cou++];
            window.select.holder = sp[cou++];//parentage gets assigned later after dictionary created



            createObject(window.select.cube, sp[cou++]);// 3d model

            add_icon(window.select.label);

            render();
        }

        for (var n = 0; n < object_list.length; n++){//population ID_dict
            ID_dict[object_list[n].ID] = object_list[n];
        }

        for (var n = 0; n < object_list.length; n++){//populating hparent/hchildren relationships
            if (object_list[n].holder == 'gp_plane'){
                object_list[n].hparent = gp_plane;
            }
            else if (object_list[n].holder != "unassigned"){
                object_list[n].hparent = ID_dict[object_list[n].holder];
                object_list[n].hparent.hchildren.push(object_list[n]);
            }
            else{
                object_list[n].hparent = "unassigned";
            }
        }

        window.select = plane;
        for (var i = 0; i < stage.children.length; i++) {
            stage.children[i].show();
        }
        for (var i = 0; i<object_list.length; i++){
            changeColor(object_list[i].cube, 0xffffff);
            if (object_list[i].hparent != "unassigned"){
                object_list[i].support_plane.material.visible = false;
            }
        }

        /*for (var n = 0; n < object_list.length; n++){
                if (object_list[n].hparent == gp_plane){
                    //scene.remove(object_list[n].support_plane);
                    //object_list[n].support_plane = empty_plane.clone();
                    object_list[n].support_plane.matrixWorld = gp_plane.matrixWorld;
                    object_list[n].support_plane.add(object_list[n].cube);
                }
                object_list[n].parent = plane;
        }*/

        render();

        window.select = plane;
        for (var i = 0; i < stage.children.length; i++) {
                stage.children[i].show();
        }
        for (var i = 0; i<object_list.length; i++){
                changeColor(object_list[i].cube, 0xffffff);
                if (object_list[i].hparent != "unassigned"){
                    object_list[i].support_plane.material.visible = false;
                }
        }

        document.getElementById("GP").innerHTML = "<font size=3><b>GP</b></font>";
        $("#GP").on("click", function() { buttonClicked(this); } );
    } else {
        window.select = plane;

        for (var i = 0; i < stage.children.length; i++) {
            stage.children[i].show();
        }
        for (var i = 0; i<object_list.length; i++){
            changeColor(object_list[i].cube, 0xffffff);
            if (object_list[i].hparent != "unassigned"){
                object_list[i].support_plane.material.visible = false;
            }
        }

        for (var i = 0; i < stage.children.length; i++) {
                stage.children[i].show();
        }
        for (var i = 0; i<object_list.length; i++){
            changeColor(object_list[i].cube, 0xffffff);
            if (object_list[i].hparent != "unassigned"){
                object_list[i].support_plane.material.visible = false;
            }
        }
    }

    render();
    console.log("load done");

    //Apprise("Load done!", okAlert);

    //copy_camera();

    //alert("Load done.");
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

function model_click_load(event) {
    var param = event.target.name;

    var name = "data/models/"+param.substring(0,2) + "/" + param.substring(0,4) + "/" + param+"/untitled.obj";

    createObject(window.select.cube, name);


    setup_model_list();
}

function model_list_load(filelist){

    var model_counter = 0;
    var model_container = document.getElementById('model');
    inner_counter = 0;
    for (var i = model_counter; i <= filelist.length; i++) {
        if (i == filelist.length){
            model_counter = i;
            break;
        }
        if (inner_counter >= 10){
            model_counter = model_counter + 10;
            break;
        }
        inner_counter = inner_counter + 1;
        var link = document.createElement("a");
        link.addEventListener("click", model_click_load, false);
        var tmp_param = filelist[i];
        var name = "data/models/"+tmp_param.substring(0,2) + "/" + tmp_param.substring(0,4) + "/" + tmp_param+"/"+tmp_param+"_thumb.jpg";
        link.innerHTML = "<img class='model_item' name='"+filelist[i]+"' src='"+name+"'></br>"
        model_container.appendChild(link);
    }
}

function model_list_populate(event) {
    var param = event.target.name + ".txt";
    console.log(param);
    var model_container = document.getElementById('model');
    model_container.innerHTML = "";
    var scrollAmount = $("#model").scrollTop();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            console.log(xmlhttp.responseText);
            var filelist = JSON.parse(xmlhttp.responseText);
            model_list_load(filelist);
            $("#model").scroll(function(event){
                var scrollAmount = $("#model").scrollTop();
                var scrollPercent = scrollAmount/$("#model").prop('scrollHeight')*100;
                //console.log(scrollPercent);
                if (scrollPercent > 40 && $("#model").prop('scrollHeight') < 4000){
                    model_list_load(filelist);
                }
                else if (scrollPercent > 80) {
                    model_list_load(filelist);
                }
            });
        }
    }
    xmlhttp.open("GET","php/model_server.php?task=submodel&param="+param,true);
    xmlhttp.send();
}

function object_instance(){
    this.hparent;
    this.hchildren = [];
    this.ID;
    this.label;
    this.model;
    this.holder; //for the parent ID in the load function
    //this.dimensions;
    //this.coordinates;

    var cubeGeometry = new THREE.CubeGeometry(small_w, small_h, small_d);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    //var cubeMaterial = new THREE.MeshNormalMaterial({color: 0xffffff, wireframe:false});
    //var cubeMaterial = new THREE.MeshNormalMaterial({wireframe:false, side:THREE.DoubleSide});
    //var cubeMaterial = new THREE.MeshNormalMaterial({side:THREE.DoubleSide,opacity:0.05,wireframe:false,color: 0x000000});
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

    this.support_plane = empty_plane.clone();
    this.support_plane.material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    this.support_plane.matrixWorld.matrixAutoUpdate=true;
    this.support_plane.slider_value = 60;
    this.icon;

    this.cube = new THREE.Object3D();
    this.cube.add(cube);
}

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


function onDocumentMouseDown(event) {
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
}

function onDocumentMouseMove(event) {
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
            var rect = document.getElementById("img").getBoundingClientRect();
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
}

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


function remove_box(){
    removeOn = true;
    instr = 'Select the object that you want to remove (using BOX Selection window on the bottom left).';
    instruct(instr);
    //Apprise('Click on the icon of the box that you want to remove', okAlert);
    $('#im_resizable').css('opacity',.3);
    $('#model_column').css('opacity',.3);
    $('#input').children().not("#instructions").css('opacity',.3);
}

function remove_box_internal(object) {
    console.log(object.ID);
    if (object.hparent != "unassigned" && object.hparent != gp_plane){
        var index = object.hparent.hchildren.indexOf(window.select);
        object.hparent.hchildren.splice(index, 1);
    }
    if (object.parent == scene) {
        Apprise('You cannot remove the groundplane', okAlert);
        return;
    } else if (object.support_plane == plane || object.support_plane == gp_plane) {
        plane.remove(object.cube);
    } else {
        scene.remove(object.support_plane);
    }
    object_list.splice(object_list.indexOf(object),1);
    window.select = plane;
    remove_icon();
    render();
}

function remove_icon() {
    var icon_container = document.getElementById('icon_container');
    icon_container.innerHTML='<button id = "GP" class = "gp_icon"  value= "GP"><font size=3><b>GP</b></font></button>';
    $("#GP").on("click", function() {
        buttonClicked(this);
    });

    for (var i = 0; i < object_list.length; i++) {
        var tmp_button = document.createElement('button');
        tmp_button.id = object_list[i].ID;
        tmp_button.className = "icon";
        tmp_button.value = object_list[i].label;
        icon_container.appendChild(tmp_button);
        $( "#" + (object_list[i].ID) ).on( "click", function() { buttonClicked(this); } );
    }

    reset_icon();
    buttonClicked(document.getElementById('GP'));
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
    }
    if (typeof window.select.cube != "undefined"){
        plane_object.position.setX(window.select.cube.position.clone().applyMatrix4(window.select.support_plane.matrixWorld).x);
        plane_object.position.setY(window.select.cube.position.clone().applyMatrix4(window.select.support_plane.matrixWorld).y);
        plane_object.position.setZ(window.select.cube.position.clone().applyMatrix4(window.select.support_plane.matrixWorld).z);
    }
    renderer.render(scene, camera);
}


function rerender_plane(K) {//where K is the new matrix after vanishing point recalculation
    camera.matrixAutoUpdate=false;
    plane.matrixAutoUpdate=false;
    plane.matrixWorld.elements= K;// setting plane to camera transformation

    gp_plane.matrixAutoUpdate = false;
    gp_plane.matrixWorld.elements = K;

    var z_vector1 = new THREE.Vector4(0,0,0,1).applyMatrix4(plane.matrixWorld);
    var z_vector2 = new THREE.Vector4(0,0,1,1).applyMatrix4(plane.matrixWorld);
    var z_vector3 = new THREE.Vector4(0,1,0,1).applyMatrix4(plane.matrixWorld);
    var D1 = (z_vector2.y - z_vector1.y) / (z_vector2.z - z_vector1.z);
    var D2 = (z_vector3.y - z_vector1.y) / (z_vector3.z - z_vector1.z);
    if (Math.abs(D1) < Math.abs(D2)) {
        console.log("flip3");

        var a = new THREE.Matrix4(1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1);
        z_vector1 = new THREE.Vector4(1,1,0,1).applyMatrix4(plane.matrixWorld);
        plane.matrixWorld.multiplyMatrices(plane.matrixWorld,a);
        z_vector2 = new THREE.Vector4(1,1,0,1).applyMatrix4(plane.matrixWorld);
        plane.matrixWorld.elements[12] -= z_vector2.x - z_vector1.x;
        plane.matrixWorld.elements[13] -= z_vector2.y - z_vector1.y;
        plane.matrixWorld.elements[14] -= z_vector2.z - z_vector1.z;
    }

    var z_vector1 = new THREE.Vector4(0,0,0,1).applyMatrix4(plane.matrixWorld);
    var z_vector2 = new THREE.Vector4(0,0,1,1).applyMatrix4(plane.matrixWorld);
    var z_vector3 = new THREE.Vector4(1,0,0,1).applyMatrix4(plane.matrixWorld);
    var D1 = (z_vector2.y - z_vector1.y) / (z_vector2.z - z_vector1.z);
    var D2 = (z_vector3.y - z_vector1.y) / (z_vector3.z - z_vector1.z);
    if (Math.abs(D1) < Math.abs(D2)) {
        console.log("flip2");

    var a = new THREE.Matrix4(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1);
    z_vector1 = new THREE.Vector4(1,1,0,1).applyMatrix4(plane.matrixWorld);
    plane.matrixWorld.multiplyMatrices(plane.matrixWorld,a);
    z_vector2 = new THREE.Vector4(1,1,0,1).applyMatrix4(plane.matrixWorld);
    plane.matrixWorld.elements[12] -= z_vector2.x - z_vector1.x;
    plane.matrixWorld.elements[13] -= z_vector2.y - z_vector1.y;
    plane.matrixWorld.elements[14] -= z_vector2.z - z_vector1.z;
    }


    var z_vector1 = new THREE.Vector3(1,1,0,1).applyMatrix4(plane.matrixWorld);
    var z_vector2 = new THREE.Vector3(1,1,10,1).applyMatrix4(plane.matrixWorld);
    var proj = new THREE.Projector();
    z_vector1 = proj.projectVector(z_vector1, camera);
    z_vector2 = proj.projectVector(z_vector2, camera);
    if (z_vector1.y < z_vector2.y) {
        console.log("flip1");

        var a = new THREE.Matrix4().makeRotationX(Math.PI);
        var c = new THREE.Matrix4().makeRotationZ(Math.PI/2*3);
        plane.matrixWorld.multiplyMatrices(plane.matrixWorld,a);
        plane.matrixWorld.multiplyMatrices(plane.matrixWorld,c);
    }

    var v1 = new THREE.Vector4(0,0,0,1).applyMatrix4(plane.matrixWorld);
    var v2 = new THREE.Vector4(0,0,1,1).applyMatrix4(plane.matrixWorld);
    if (v1.y > v2.y) {
        console.log('flip plane');
        console.log(plane.matrixWorld);
        var a = new THREE.Matrix4().makeRotationX(Math.PI);
        var c = new THREE.Matrix4().makeRotationZ(Math.PI/2*3);
        plane.matrixWorld.multiplyMatrices(plane.matrixWorld,a);
        plane.matrixWorld.multiplyMatrices(plane.matrixWorld,c);
        //gp_plane.matrixWorld.multiplyMatrices(gp_plane.matrixWorld,a);
        //gp_plane.matrixWorld.multiplyMatrices(gp_plane.matrixWorld,c);
        console.log(plane.matrixWorld);
    }

    var theCanvas = document.getElementById("cnvs"); //setting up the camera so that it is using the canvas parameters
    camera = new THREE.PerspectiveCamera(Math.atan(theCanvas.height/f/2)/Math.PI*180*2, theCanvas.width/theCanvas.height, .01, 20000);
    camera.position.z = 0;
    plane.material.visible = false;
}


function reset_icon() {
    var label_list = [];
    icon_container.children[0].innerHTML = icon_container.children[0].value;

    for (var i = 1; i < icon_container.children.length; i++) {
    // Check how many boxes have the same name
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

function save_file(img_id, use_id) {
    var scale_factor = document.getElementById('cnvs').width / 800;
    var scale_factor_x = document.getElementById('img').width / document.getElementById('img').naturalWidth;
    var scale_factor_y = document.getElementById("img").height / document.getElementById('img').naturalHeight;
    var selected_lines = '';
    var red_line = '';
    var green_line = '';
    var orange_line = '';
    for (var i = 0; i < vp_label.length; i++){
        if (vp_label[i] == 2){
            red_line += (i);
            red_line += ' ';
        }
        if (vp_label[i] == 1){
            green_line += (i);
            green_line += ' ';
        }
        if (vp_label[i] == 3){
            orange_line += (i);
            orange_line += ' ';
        }
    }
    var new_lines = '';
    var each_line = '';
    for (var i = 0; i < vp_s.length; i++){
        if (isNaN(vp_s[i].y2d[0]) == false){
            each_line = vp_s[i].x2d[0]/scale_factor_x + " " + vp_s[i].y2d[0]/scale_factor_y + " " + vp_s[i].x2d[1]/scale_factor_x + " " + vp_s[i].y2d[1]/scale_factor_y + "\n";
            new_lines += each_line;
        }
    }
    selected_lines = red_line + "\n" + green_line + "\n" + orange_line;
    job_endTime = (new Date().getTime() - job_startTime);


    if (typeof userid == 'undefined'){
        userid = 'undefined';
    }
    use_id = typeof use_id !== 'undefined' ? use_id : false;
    if (use_id){
        use_id = userid;
    }
    else{
        use_id = '';
    }

    var scale_factor = document.getElementById('cnvs').width / 800;


    out = '';

    out += img_name + ' ';
    if (typeof userid == 'undefined'){
        userid = 'undefined';
    }
    out += userid + ' ';

    // TODO: VP data [0-18]
    //for (var i = 4; i < stage.children[0].children.length; i++) {
    var counter = 0;
    for (var i = 0; i < vp_label.length; i++){
        if ((vp_label[i] == 1) || (vp_label[i] == 2) || (vp_label[i] == 3)){
            counter += 1;
        }
    }

    out += counter + ' ';
    for (var i = 0; i < vp_label.length; i++) {// this is running over - 30
        if ((vp_label[i] == 1) || (vp_label[i] == 2) || (vp_label[i] == 3)){
            for (var j = 0; j < 2; j++) {
                var child = vp_s[i];
                out += vp_s[i].x2d[j] + ' ';
                out += vp_s[i].y2d[j] + ' ';
            }
        out += vp_label[i] + ' ';
        }
    }

    out += stage.children[1].children[0].x()/scale_factor + ' ';
    out += stage.children[1].children[0].y()/scale_factor + ' ';

    // focal length [19]
    out += f/scale_factor + ' ';

    // ground plane
    for (var k = 0; k < 16; k++) {
        out += plane.matrixWorld.elements[k] + ' ';
    }

    out += object_list.length + ' ';
    for (var i = 0; i < object_list.length; i++) {
        var box = object_list[i];

    // support plane
        for (var k = 0; k < 16; k++) {
            out += box.support_plane.matrixWorld.elements[k] + ' ';
        }

    // cube
        out += box.cube.position.x + ' ';
        out += box.cube.position.y + ' ';
        out += box.cube.position.z + ' ';
        out += box.cube.scale.x + ' ';
        out += box.cube.scale.y + ' ';
        out += box.cube.scale.z + ' ';
        out += box.cube.rotation.z + ' ';
        out += box.ID + ' ';
        out += box.label + ' ';
    // TODO: parent information
        if (box.hparent == gp_plane){
            out += "gp_plane" + ' ';
        }
        else if (box.hparent != "unassigned"){
            out += box.hparent.ID + ' ';}
        else if (box.hparent == "unassigned"){
            out += "unassigned" + ' ';
        }

        // 3d model
        if (typeof box.model != "undefined") {
            out += box.model.name + ' ';
        } else {
            out += 'NONE ';
        }



        continue;

        if (window.select.parent == scene){//assigning support plane based on parent
            object_list.push(new object_instance);
            window.select = object_list[object_list.length-1];//window.select is now the new object
            window.select.parent = plane;
            window.select.support_plane = plane;
            window.select.support_plane.add(object_list[object_list.length-1].cube);
        }
        else {//assigning support plane for objects that are above groundplane.
            holder = window.select;
            object_list.push(new object_instance);
            window.select = object_list[object_list.length-1];//now window.select is the new object
            window.select.parent = holder;
            if (holder.hparent != "unassigned"){
                holder.support_plane.material.visible=false;
            }
            scene.add(window.select.support_plane);
            window.select.support_plane.add(window.select.cube);
            scalar = holder.cube.scale.z*small_w;
            window.select.support_plane.matrixWorld.multiplyMatrices(holder.support_plane.matrixWorld, (new THREE.Matrix4()).makeTranslation(0, 0, scalar));
            render();
            window.select.support_plane.matrixWorld.multiplyMatrices(holder.support_plane.matrixWorld, (new THREE.Matrix4()).makeTranslation(0, 0, scalar));
            render(); //TODO fix this double render() bug
        }
    }
    out += job_endTime + ' ';
    console.log(out);

    AAA = $.ajax({
             type: "POST",
             url: "php/save_data.php",
             data: {
             "task": "save",
             "line_data": encodeURIComponent(selected_lines),
             "new_lines": encodeURIComponent(new_lines),
             "data": encodeURIComponent(out),
             "img": img_id,
             "userid": use_id
             },
             async: false,
             dataType: "html",
             success: function(data) {
             console.log(data.message);
             Apprise('SAVE DONE.\nIt took ' + Math.ceil(job_endTime/1000) + 's to complete this image.', okAlert);
             },
             error: function(a,b,c) {
             Apprise('save error', okAlert);
             error('save error');
             }
         });
    console.log(new_lines);
}

function rotateLeft(angle){
    thetaDelta -= angle;
}
function rotateUp(angle){
    phiDelta -= angle;
}

function setup_model_list() {
    var model_container = document.getElementById('model');
    if (!model_container){
        return ;
    }
    model_container.innerHTML = "<p style='margin-top:0px'>Browse 3D models</p>";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        var filelist = JSON.parse(xmlhttp.responseText);
        for (var i = 0; i < filelist.length; i++) {
                var link = document.createElement("a");
                link.className = "model_type";
                link.addEventListener("click", category_list_populate, false);
                category_name = filelist[i].replace(".list", "");
                category_name = category_name.split("/")[category_name.split("/").length-1];
                link.innerHTML = category_name;
                link.name = filelist[i];
                model_container.appendChild(link);
            }
        }
    }
    xmlhttp.open("GET","php/model_server.php?task=model_list",true);
    xmlhttp.send();
}

function setupRay(event){
    var rect = document.getElementById("img").getBoundingClientRect();
    var scale_factor = document.getElementById('img').width / rect.width;
    var projector = new THREE.Projector();
    var mouse3D = projector.unprojectVector(new THREE.Vector3( ( (event.clientX -rect.left)*scale_factor/ renderer.domElement.width ) * 2 - 1, - ( (event.clientY-rect.top)*scale_factor / renderer.domElement.height ) * 2 + 1, 1 ), camera );
    var direction = mouse3D.sub(camera.position).normalize();
    ray = new THREE.Raycaster(camera.position, mouse3D);
    ray.set(camera.position, direction);
}

function toggle_3d(event) {
    if (event.checked) {
        document.getElementById("cnvs").style.visibility="visible";
        document.getElementById("container").style.visibility="visible";
        document.getElementById("show3d_label").style.backgroundColor = "#8A8B8C";
    }
    else {
        document.getElementById("cnvs").style.visibility="hidden";
        document.getElementById("container").style.visibility="hidden";
        document.getElementById("show3d_label").style.backgroundColor = "#333"
    }
}

function toggle_all_boxes(){
    if (document.getElementById("all_boxes").checked) {
        document.getElementById("all_boxes_label").style.backgroundColor = "#8A8B8C";
        for (var i = 0; i<object_list.length; i++){
            object_list[i].cube.traverse( function ( object ) { object.visible = true; } );
        }
    }else{
        document.getElementById("all_boxes_label").style.backgroundColor = "#333";
        for (var i=0; i<object_list.length; i++){
            object_list[i].cube.traverse( function ( object ) { object.visible = false; } );
        }
        window.select.cube.traverse(function(object){object.visible = true;});
        holder = window.select.hparent
        while ((holder != gp_plane) && (holder != "unassigned")){
            holder.cube.traverse( function ( object ) { object.visible = true; } );
            holder = holder.hparent;
        }
    }
    render();
}

function toggle_cube_move_indicators(toggle){
    for (var i = 0; i < cube_move_mode_arrows.length; i++){
        cube_move_mode_arrows[i].cone.material.visible = toggle;
        cube_move_mode_arrows[i].line.material.visible = toggle;
    }
    render();
}
function toggle_cube_rotate_indicators(toggle){
    rotate_mode_indicators[0].cone.material.visible = toggle;
    rotate_mode_indicators[0].line.material.visible = toggle;
    rotate_mode_indicators[1].material.visible = toggle;
    render();
}
function toggle_cube_resize_arrows(toggle){
    for (var i = 0; i < arrowHelper.arrow_list.length; i++){
            arrowHelper.arrow_list[i].cone.material.visible = toggle;
            arrowHelper.arrow_list[i].line.material.visible = toggle;
    }
}

function toggle_img(event) {
    if (event.checked) {
        document.getElementById("img").style.visibility="visible";
        renderer.setClearColor(new THREE.Color(0x000000),0);
        document.getElementById("showimg_label").style.backgroundColor = "#8A8B8C";
        render();
    }
    else {
        document.getElementById("showimg_label").style.backgroundColor = "#333"
        renderer.setClearColor(new THREE.Color(0x666666),1);
        render();
    }
}

function toggle_zoom() {
    if (zoomOn) {
        document.getElementById("im").style.overflow = "hidden";
        $('#img').attr('class', '');
        $('#cnvs').attr('class', '');
        $('#container').attr('class', '');
        document.getElementById('im').scrollLeft = scrollLeft;
        document.getElementById('im').scrollTop = scrollTop;
        document.getElementById('zoom_checkbox').checked="yes";

        /*for (var i = 0; i < stage.children[0].children.length; i++) {
            var child = stage.children[0].children[i];
            child.strokeWidth(2);
            if (child instanceof Kinetic.Circle) {
                child.radius(8);
            } else {
                child.dash([5,5]);
            }
        }
        for (var i = 0; i < stage.children[1].children.length; i++) {
            var child = stage.children[1].children[i];
            child.strokeWidth(2);
            if (child instanceof Kinetic.Circle) {
                child.radius(8);
            }
        }*/
        stage.draw();
        zoomOn = false;
        } else {
            document.getElementById("im").style.overflow = "auto";
            scrollLeft = document.getElementById('im').scrollLeft;
            scrollTop = document.getElementById('im').scrollTop;
            $('#img').attr('class', 'zoom_half');
            $('#cnvs').attr('class', 'zoom_half');
            $('#container').attr('class', 'zoom_half');
            document.getElementById('im').scrollLeft = 0;
            document.getElementById('im').scrollTop = 0;
            document.getElementById('zoom_checkbox').checked="";

        /*for (var i = 0; i < stage.children[0].children.length; i++) {
            var child = stage.children[0].children[i];
            child.strokeWidth(1.5);
            if (child instanceof Kinetic.Circle) {
                child.radius(4);
            } else {
                child.dash([5,5]);
            }
        }
        for (var i = 0; i < stage.children[1].children.length; i++) {
            var child = stage.children[1].children[i];
            child.strokeWidth(1.5);
            if (child instanceof Kinetic.Circle) {
                child.radius(4);
            }
        }*/
        stage.draw();
        zoomOn = true;
    }
}

function toggle_zoom_on(){
     document.getElementById("im").style.overflow = "auto";
            scrollLeft = document.getElementById('im').scrollLeft;
            scrollTop = document.getElementById('im').scrollTop;
            $('#img').attr('class', 'zoom_half');
            $('#cnvs').attr('class', 'zoom_half');
            $('#container').attr('class', 'zoom_half');
            document.getElementById('im').scrollLeft = 0;
            document.getElementById('im').scrollTop = 0;
            document.getElementById('zoom_checkbox').checked="";

        /*for (var i = 0; i < stage.children[0].children.length; i++) {
            var child = stage.children[0].children[i];
            child.strokeWidth(1.5);
            if (child instanceof Kinetic.Circle) {
                child.radius(4);
            } else {
                child.dash([5,5]);
            }
        }
        for (var i = 0; i < stage.children[1].children.length; i++) {
            var child = stage.children[1].children[i];
            child.strokeWidth(1.5);
            if (child instanceof Kinetic.Circle) {
                child.radius(4);
            }
        }*/
        stage.draw();
        zoomOn = true;
    
}

function toggle_zoom_off(){document.getElementById("im").style.overflow = "hidden";
        $('#img').attr('class', '');
        $('#cnvs').attr('class', '');
        $('#container').attr('class', '');
        document.getElementById('im').scrollLeft = scrollLeft;
        document.getElementById('im').scrollTop = scrollTop;
        document.getElementById('zoom_checkbox').checked="yes";

        /*for (var i = 0; i < stage.children[0].children.length; i++) {
            var child = stage.children[0].children[i];
            child.strokeWidth(2);
            if (child instanceof Kinetic.Circle) {
                child.radius(8);
            } else {
                child.dash([5,5]);
            }
        }
        for (var i = 0; i < stage.children[1].children.length; i++) {
            var child = stage.children[1].children[i];
            child.strokeWidth(2);
            if (child instanceof Kinetic.Circle) {
                child.radius(8);
            }
        }*/
        stage.draw();
        zoomOn = false;
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

