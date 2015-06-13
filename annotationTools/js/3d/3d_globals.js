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

var small_d = -0.05;
var small_h = 0.05;
var small_w = 0.05;
