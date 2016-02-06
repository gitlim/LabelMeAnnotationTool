var DEBUG_MODE = false;
var RESIZE_MODE = 1
var ROTATE_MODE = 2
var BOX_MOVE_MODE = 3
var VERTICAL_PLANE_MOVE_MODE = 4
var POINT_DRAG_MODE = 5;
var current_mode;
var pass_val;
var proportion_array = [];


var job_startTime;
var job_endTime;

var renderer;  // A three.js WebGL or Canvas renderer.
var scene;     // The 3D scene that will be rendered, containing the cube.
var camera;    // The camera that takes the picture of the scene.
var old_camera;
var K;

var box_renderer;
var box_scene;
var box_camera;

var sidemode = 1;

var plane;
var empty_plane;
var arrowHelper;
var arrowhead_size;
var intersect_box = new THREE.Object3D();
var guide_box;

var zoomOn = false;
var scrollTop = 0;
var scrollLeft = 0;

var resize_x0, resize_y0, resize_vx, resize_vy;

var object_list = new Array();


var small_h = 0.1;
var small_w = 0.1;
var small_d = -0.1;
var f;
var gp_f;

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
var scale = 1;

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

//GP Globals

var op_x = 50, op_y = 50;
var vp_s = new Array();
var vp = new Array();
var gp = new Array(); // guiding-z-line
var vp_label = new Array();
var vp_layer;
var pt_layer;
var stage;
var selected_line_id;
var lineOn = false;
var original_number_of_lines = 0;

var hover_object;
var groundplane_id;
var renderer_last_update = 0;

var clip_on = 0;
var polygon = null;
var selected_plane = null;
var height_transform;
var horizontal_transform;
var vertical_transform;

var arrow_box_position;
var indicator_box_position;
var IsHidingAllPlanes = false;
var IsHidingAllThreeD = false;
var IsHidingAllButSelected = false;
var separation = new Array();
var plane_height_array = new Array();
var threed_mt_mode; // this is for the different modes for 3D AMT such as groundplane, cuboids, etc.
//var scale_factor_x = document.getElementById("im").width;
//var scale_factor_y = document.getElementById("im").height;
var image_list_number = 0;
var mousemove_last = -999999;
var screenshot_mode = false;
var image_list_length;
var image_count = 0;
var test_edit;
var cleanup_mode = false;
var list_name = null;
var fix_mode = false;
