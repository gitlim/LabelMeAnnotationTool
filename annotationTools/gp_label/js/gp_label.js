function open_instr() {
    $('#open_instr').colorbox({iframe:true,width:1100,height:700,transition:"none",closeButton:true});
}


////////////////////////////////////////////////////////////////////////////////////////////////
// TESTER RELATED CODE

var pass_status;
var PASS_COUNT = 3;
var MAX_Q = 11;
var FIRST_TEST = 6;
var next_val = parseInt(gup('next'));
if (!next_val)
    next_val = 0;
var test_status = new Array();
for (var i = 0; i < FIRST_TEST; i++) {
    test_status[i] = false;
}
for (var i = FIRST_TEST; i < MAX_Q; i++) {
    test_status[i] = true;
}
//test_status[1] = true;

var ans_count = 0;
var feedback = "<center>";

// if the user gets 3 out of 5, they pass the qualification
var k1 = 5;
var k2 = 2.75;
var k3 = 15*15;

var DEFAULT_INSTR = '';

API_dict = {}
    API_string = document.URL.split("?")[1]; //splitting URL into main and API segments
    for (item = 0; item < API_string.split("&").length; item++){ //splitting API segment into different parts
        holder = API_string.split("&")[item].split("="); // splitting parts by equal signs to allow assigning into dictionary
        API_dict[holder[0]] = holder[1];
}
img_id = API_dict["img"];


function tester_init() {
    if (test_status[API_dict["img"]] == false){
        document.getElementById("skip").style.display = "block";
    }
    var instr_div = document.getElementById('instructions');
    if (test_status[img_id]) {
	DEFAULT_INSTR = 'This is the test.<br>You can submit only 2 times per image<br>You need to get 3 out of 5 images correctly.<br>';
	DEFAULT_INSTR += '<br>';
	DEFAULT_INSTR += '<li>Press the magnifying glass icons on the upper left corner to zoom in and out.</li>';
	DEFAULT_INSTR += '<li>You can resize image view window</li>';
	DEFAULT_INSTR += '<li>You can drag and move this instruciton window.</li>';
	instruct(DEFAULT_INSTR);

	feedback += '[QUALIFICATION]<br>';
	feedback += '<br>';
	feedback += '<font style="font-size:25px">This is the qualification test only for the FIRST time user.</font><br>';
	feedback += '<p class="tester_large">This is part of <font color="red"><b>test</b></font>.</p>';
	feedback += 'You are at ' + (img_id-FIRST_TEST + 1) + '/' + (MAX_Q - FIRST_TEST) + ' tests (and got ' + next_val + ' correctly).<br>';
	feedback += 'You need at least ' + PASS_COUNT + ' correct answers to pass the qualificaiton.<br>';
	feedback += 'You can try <font color="red">2 submissions per test</font>.<br>';

    } else {
	DEFAULT_INSTR = 'This is the training phase.<br>You can skip this image.<br>There will be tests at the end.<br>';
	DEFAULT_INSTR += '<br>';
	DEFAULT_INSTR += '<li>Press the magnifying glass icons on the upper left corner to zoom in and out.</li>';
	DEFAULT_INSTR += '<li>You can resize image view window</li>';
	DEFAULT_INSTR += '<li>You can drag and move this instruciton window.</li>';
	instruct(DEFAULT_INSTR);

	feedback += '[QUALIFICATION]<br>';
	feedback += '<br>';
	feedback += '<font style="font-size:25px">This is the qualification test only for the FIRST time user.</font><br>';
	feedback += '<p class="tester_large">This is part of training.</p>';
	feedback += 'You are at ' + (parseInt(img_id) + 1) + '/' + FIRST_TEST + ' training images.<br>';
	feedback += 'You can skip any of training image if you want to.<br>';
	feedback += 'You can have as many submissions as you want for trainig.<br>';
	feedback += '<br>';
	feedback += '<p class="tester_large">There will be test after training.</p>';
	feedback += 'There are ' + (MAX_Q - FIRST_TEST) + ' tests after training. You need to get at least ' + PASS_COUNT + ' tests correctly.<br>';
	feedback += 'You can try only 2 submissions per test.<br>';
    }
    POPUP_WIDTH=700;
    POPUP_HEIGHT=600;
    $("#inline_content_box").html(feedback);
    popup_closed = func_timer_on;

    open_popup();

    if (test_status[img_id]) {
	//document.getElementById('skip').style.display = "none";
    }
}

// focal length - answer sheet
var fp = new Array();
// ans_ox - answer sheet
var ans_ox = new Array();
var ans_oy = new Array();
// x vector - answer sheet
var ans_x_vector = new Array();
// y vector - answer sheet
var ans_y_vector = new Array();
// z vector - answer sheet
var ans_z_vector = new Array();

fp[0] = 728.67;
ans_ox[0] = 236;
ans_oy[0] = 454;
ans_x_vector[0] = [0.4973464906215668, -0.00919022411108017, 0.8675033450126648];
ans_y_vector[0] = [-0.867009162902832, -0.03566807508468628, 0.49701401591300964];
ans_z_vector[0] = [0.02637450397014618, -0.9993215203285217, -0.02570740133523941];
fp[1] = 471.61;
ans_ox[1] = 305;
ans_oy[1] = 359;
ans_x_vector[1] = [0.4302808344364166,0.025271784514188766,0.9023412466049194];
ans_y_vector[1] = [-0.9025505185127258,0.0146097457036376,0.430336058139801];
ans_z_vector[1] = [-0.002307615941390395,-0.9995739459991455,0.029095355421304703];
fp[2] = 408.71;
ans_ox[2] = 296;
ans_oy[2] = 327;
ans_x_vector[2] = [0.6379633545875549,-0.0664016455411911,0.7671985626220703];
ans_y_vector[2] = [-0.7677717208862305,-0.05375797674059868,0.6384642720222473];
ans_z_vector[2] = [-0.0011520357802510262,-0.9963501691818237,-0.08527692407369614];
fp[3] = 664.42;
ans_ox[3] = 430;
ans_oy[3] = 299;
ans_x_vector[3] = [0.8606294393539429,-0.08739063888788223,0.5016770362854004];
ans_y_vector[3] = [-0.4965057373046875,-0.16116121411323547,0.8529414534568787];
ans_z_vector[3] = [0.006311781704425812,-0.9831520318984985,-0.18209004402160645];
fp[4] = 427.62;
ans_ox[4] = 392;
ans_oy[4] = 330;
ans_x_vector[4] = [0.648746132850647, 0.012706641107797623, 0.7608988285064697];
ans_y_vector[4] = [-0.7609065175056458, 0.012034495361149311, 0.6487499475479126]
ans_z_vector[4] = [-0.0031471168622374535,-0.9999938011169434,-0.0015773132909089327];
fp[5] = 904.15;
ans_ox[5] = 509;
ans_oy[5] = 275;
ans_x_vector[5] = [0.6268191933631897,-0.17583051323890686,0.759066104888916];
ans_y_vector[5] = [-0.7591152191162109,-0.1798771470785141,0.6256103515625];
ans_z_vector[5] = [0.026537256315350533,-0.9683632254600525,-0.24622607231140137];
fp[6] = 454.98;
ans_ox[6] = 439;
ans_oy[6] = 334;
ans_x_vector[6] = [0.6739839911460876, -0.13446766138076782, 0.7264048457145691];
ans_y_vector[6] = [-0.7261378765106201, -0.13775771856307983, 0.6736071705818176];
ans_z_vector[6] = [0.01647843047976494,-0.9818243980407715,-0.1882133036851883];
/*fp[7] = 663.95;
ans_ox[7] = 450;
ans_oy[7] = 302;
ans_x_vector[7] = [0.5894871354103088,-0.1289004683494568,0.7974268794059753];
ans_y_vector[7] = [-0.7989311218261719,-0.11867649108171463,0.589597225189209];
ans_z_vector[7] = [0.018636465072631836,-0.984649121761322,-0.17294086515903473];*/
fp[7] = 709.924;
ans_ox[7] = 458;
ans_oy[7] = 298;
ans_x_vector[7] = [0.6136805415153503, -0.13973011076450348, 0.7770918011665344];
ans_y_vector[7] = [-0.7811851501464844, -0.08877698332071304, 0.6179550290107727];
ans_z_vector[7] = [-0.015534931793808937, -0.9921267032623291, -0.12403247505426407];
fp[8] = 818.51;
ans_ox[8] = 460;
ans_oy[8] = 380;
ans_x_vector[8] = [0.6699998378753662, -0.08803066611289978, 0.7371233701705933];
ans_y_vector[8] = [-0.738215982913971, -0.06742645800113678, 0.6711861491203308];
ans_z_vector[8] = [-0.00938334595412016, -0.9938508868217468, -0.11016136407852173];
fp[9] = 995.19;
ans_ox[9] = 439;
ans_oy[9] = 334;
ans_x_vector[9] = [0.829684317111969, -0.11619819700717926, 0.5460054278373718];
ans_y_vector[9] = [-0.5452792644500732, -0.1407744139432907, 0.8263492584228516];
ans_z_vector[9] = [-0.019156700000166893, -0.983334481716156, -0.180158793926239];
fp[10] = 443.09;
ans_ox[10] = 290;
ans_oy[10] = 360;
ans_x_vector[10] = [0.627291202545166, -0.002054395619779825, 0.778782069683075];
ans_y_vector[10] = [-0.778438150882721, -0.026667620986700058, 0.627154529094696];
ans_z_vector[10] = [0.019479840993881226, -0.9996421933174133, -0.018327584490180016];


function eval(input_ox, input_oy, input_fp, input_x, input_y, input_z)//evaluate input focus point and normal vector
{
    var theCanvas = document.getElementById("cnvs");
    var width = theCanvas.width;
    var scale_factor = 800/width;

    var ang1 = Math.atan(800/fp[img_id])/Math.PI*180;
    var ang2 = Math.atan(width/input_fp)/Math.PI*180;
    console.log(ang1);
    console.log(ang2);
    checkF = Math.abs(ang1-ang2) < k1;

    var vec_x_ang = Math.acos(Math.min(1,vec3.dot(input_x, ans_x_vector[img_id])))/Math.PI*180;
    var vec_y_ang = Math.acos(Math.min(1,vec3.dot(input_y, ans_y_vector[img_id])))/Math.PI*180;
    var vec_z_ang = Math.acos(Math.min(1,vec3.dot(input_z, ans_z_vector[img_id])))/Math.PI*180;
    checkN = (vec_x_ang < k2) && (vec_y_ang < k2) && (vec_z_ang < k3);
    console.log(vec_x_ang);
    console.log(vec_y_ang);
    console.log(vec_z_ang);

    var o_dist = Math.pow(input_ox*scale_factor - ans_ox[img_id],2)+Math.pow(input_oy*scale_factor-ans_oy[img_id],2);
    console.log(input_ox*scale_factor);
    console.log(input_oy*scale_factor);
    checkO = o_dist < k3;

    console.log(ang1 - ang2, vec_x_ang, vec_y_ang, vec_z_ang, o_dist);

    if ((checkF) && (checkN) && (checkO)) {
	pass_status = true;
    console.log("true");
    }
    else {
	pass_status = false;
    console.log("false");
    }

    feedback = "<center>";
    if (checkO) {
	feedback += "Center point (blue circle): CORRECT.<br>"
    } else {
	feedback += "Center point (blue circle): INCORRECT!<br>"
    }
    if ((!checkF) || (!checkN)) {
	feedback += "Green/red line alignment: INCORRECT!<br>";
    } else {
	feedback += "Green/red line alignment: CORRECT!<br>";
    }
}

function test_submitted(){
    eval(op_x, op_y, f, axis_x, axis_y, axis_z);

    if (pass_status) { // if passed
	$("#inline_content_box").html(feedback);
	POPUP_WIDTH=300;
	POPUP_HEIGHT=300;
	popup_closed = func_next;

	open_popup();
    }
    else if (test_status[img_id]) { //if failed and is test question
	ans_count++;

	if (ans_count > 1) {
	    feedback += "<p class='tester_large'>You failed this question.</p>";
	    feedback += "Correct Answer";
	    feedback += '<img width=600px src="gp_label/'+img_id+'_answers.png">';
	    POPUP_WIDTH=700;
	    POPUP_HEIGHT=600;
	    $("#inline_content_box").html(feedback);
	    popup_closed = func_next;

	    open_popup();
	} else {
	    feedback += "<p class='tester_large'>You have " + ((1+1) - ans_count) + " more chance for this question.</p>";
	    feedback += "Correct Answer";
	    feedback += '<img width=600px src="gp_label/'+img_id+'_answers.png">';
	    POPUP_WIDTH=700;
	    POPUP_HEIGHT=600;
	    popup_closed = false;

	    $("#inline_content_box").html(feedback);
	    open_popup();
	}
    }
    else { //if failed and is training question
	feedback += "<br>Correct Answer";
	feedback += '<img width=600px src="gp_label/'+img_id+'_answers.png">';
	POPUP_WIDTH=700;
	POPUP_HEIGHT=600;
	popup_closed = false;

	$("#inline_content_box").html(feedback);
	open_popup();
    }
}

function test_skip() {
    next();
}

function open_popup() {
    //$("#inline_content_box").colorbox({iframe:true,open:true,returnFocus:false});
    $.colorbox({href:"#inline_content_box",inline:true,width:POPUP_WIDTH,height:POPUP_HEIGHT,transition:"none",closeButton:true,onClosed:popup_closed});
}

function next()// load next question, also called upon skip
{
    if ((pass_status)&&(test_status[img_id])) {
	next_val++;
    }
    if (next_val >= PASS_COUNT) {
	pass_this_user(true, 'You passed the entire test!', false);
	parent.passed = true;
	parent.init_frame();
    } else {
	img_id++;
	if (img_id == MAX_Q) {
	    var next_page = 'FAILED_PAGE';
	    pass_this_user(false, 'You failed the qualification.', next_page);
	} else {
	    window.location.replace("gp_tester.php?img="+img_id+"&userid="+gup('userid')+"&next="+next_val);
	}
    }
}
var func_next = function() { next(); };

function timer_on()
{
    job_startTime = new Date().getTime();
}
var func_timer_on = function() { timer_on(); };

function pass_this_user(b_passed, msg, next_page)
{
    var userid = gup('userid');

    //access mysql and register this user
    $.ajax({
	       async: false,
	       url: 'php/register_user.php',
	       type: 'GET',
	       data: 'userid='+userid+'&passed='+b_passed+'&task=register'
	   }).done(function(data) { console.log(data); });

    alert(msg);

    if (next_page) {
	window.location.replace(next_page);
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////
// ACTUAL LABELER RELATED CODE

function gp_label_init() {
    DEFAULT_INSTR = '<li>Press the magnifying glass icons on the upper left corner to zoom in and out.</li>';
    DEFAULT_INSTR += '<li>You can resize image view window</li>';
    DEFAULT_INSTR += '<li>You can drag and move this instruciton window.</li>';
    instruct(DEFAULT_INSTR);
}

function label_submitted() {
    //TODO: SAVE THIS LABEL and go to the next image
    save_file(img_id, true);

    label_nextpage();
}
function label_hard() {
    //TODO: SKIP (because it is a hard image)
    //label_nextpage();
}

function label_nextpage() {
    var next_val = parseInt(gup('next'));
    if (!next_val)
	next_val = 0;
    if ((parent.amt) && (next_val >= 4)) {
	//TODO: submit to AMT
	window.location.assign("amt_util/comment_page.php");
    } else {
	window.location.assign("gp_label.php?img="+(img_id+1)+"&userid="+gup('userid')+"&next="+(next_val+1));
    }
}

