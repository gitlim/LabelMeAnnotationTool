function open_instr() {
    $('#open_instr').colorbox({iframe:true,width:1100,height:700,transition:"none",closeButton:true});
}


////////////////////////////////////////////////////////////////////////////////////////////////
// TESTER RELATED CODE

var pass_status = false;
var pass_status1;
var pass_status2;
var PASS_COUNT = 3;
var MAX_Q = 10;
var FIRST_TEST = 5;
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
var k1 = 0.015; // this should be the distance from the position

var DEFAULT_INSTR = '';



function tester_init() {
	//img_id = gup('image');
	//start_time = Date.now(); 
	iframe = document.getElementById('mainframe');
	iframe_window = iframe.contentWindow;
	innerDoc = iframe.contentDocument || iframe.contentWindow.document;

    if (test_status[img_id] != false){
        innerDoc.getElementById("skip").style.display = "none";
        innerDoc.getElementById("skip").style.visibility = "hidden";
    }
   // var instr_div = document.getElementById('instructions');
    if (test_status[img_id]) {
		feedback += '[QUALIFICATION <b>TEST</b> for FIRST TIME USERS]</center><br>';
		feedback += '<br>';
		feedback += 'This is for FIRST TIME USERS only.<br><br>'
		feedback += '<p class="tester_large">This is part of the <font color="red"><b>test</b></font>.</p>';
		feedback += '- You are at ' + (img_id-FIRST_TEST + 1) + '/' + (MAX_Q - FIRST_TEST) + ' test images (and got ' + next_val + ' correctly).';
		feedback += '<ul><li>You need at least ' + PASS_COUNT + ' correct answers out of 5 to pass the qualificaiton.</li>';
		feedback += '<li>You have only <font color="red">2 submissions per test image.</font></li></ul>.<br>';

    } else {
		feedback += '[QUALIFICATION <b>TRAINING</b> for FIRST TIME USERS]</center><br>';
		feedback += '<br>';
		feedback += 'This is for first time users only.<br><br>';
		feedback += '- You are at ' + (parseInt(img_id) + 1) + '/' + FIRST_TEST + ' <font color = "red"><b>training</b></font> images';
		feedback += '<ul><li>You can skip any training image.</li>';
		feedback += '<li>You can submit as many times as you want for training. </li></ul>';
		feedback += '- There are ' + (MAX_Q - FIRST_TEST) + ' test images after the training.';
		feedback += '<ul><li>You need to get at least ' + PASS_COUNT + ' images correct out of 5.</li>'
		feedback += '<li>You have only 2 submissions per test image.</li></ul><br>';
		}
	feedback += '<br><br><br><br><br><br><center>[Click outside this popup to close it.]</center>';
	//feedback += '<input type = "submit" value = "Close this popup" onclick="popup_closed"></input>';
	POPUP_WIDTH=700;
	POPUP_HEIGHT=600;
	$("#inline_content_box").html(feedback);
	popup_closed = func_timer_on;

	open_popup();

	if (test_status[img_id]) {
	//document.getElementById('skip').style.display = "none";
	}
}

var ans_array = new Array();// array of dicts containing height and also parents
for (var i = 0; i < 10; i++){
	ans_array.push(new Array());	
}
ans_array[0][3] = [9, -0.15424904227256775];
ans_array[0][4] = [10, -0.10888063433421502];
ans_array[0][5] = [0, -0.1718221753835678];
ans_array[0][6] = [5, -0.1251111775636673];
ans_array[0][7] = [5, -0.12105156481266022];
ans_array[0][8] = [9, -0.15424903743419127];
ans_array[0][9] = [0, -0.1718221753835678];
ans_array[0][10] = [0, -0.17171263694763184];
ans_array[1][7] = [0, -0.22210924327373505];
ans_array[1][8] = [0, -0.22210924327373505];
ans_array[1][9] = [0, -0.22210924327373505];
ans_array[1][10] = [9, -0.07472963631153107];
ans_array[1][11] = [8, -0.07145713269710541];
ans_array[1][12] = [0, -0.22210924327373505];
ans_array[2][1] = [0, -0.23044688999652863];
ans_array[2][2] = [0, -0.23044688999652863];
ans_array[2][3] = [2, -0.10042988312483203];
ans_array[2][4] = [1, -0.1322406530380249];
ans_array[2][5] = [2, -0.10042988312483203];
ans_array[2][6] = [2, -0.10042988312483203];
ans_array[2][7] = [1, -0.1322406530380249];
ans_array[3][1] = [0, -0.216055229306221];
ans_array[3][2] = [0, -0.216055229306221];
ans_array[3][3] = [0, -0.216055229306221];
ans_array[3][4] = [0, -0.216055229306221];
ans_array[3][5] = [4, -0.1072166355362314];
ans_array[3][6] = [1, -0.07764483557145141];
ans_array[3][7] = [4, -0.1072166355362314];
ans_array[4][1] = [0, -0.16048818826675415];
ans_array[4][2] = [0, -0.16048818826675415];
ans_array[4][3] = [0, -0.16048818826675415];
ans_array[4][4] = [3, -0.01594342776666835];
ans_array[4][5] = [2, -0.07993906692330954];
ans_array[4][6] = [1, -0.10054553015820988];
ans_array[4][7] = [0, -0.16048818826675415];
ans_array[5][2] = [0, -0.17311424016952515];
ans_array[5][3] = [2, -0.13492969057802218];
ans_array[5][4] = [2, -0.13492969057802218];
ans_array[5][5] = [0, -0.17311424016952515];
ans_array[5][6] = [0, -0.17311424016952515];
ans_array[5][7] = [2, -0.13492969057802218];
ans_array[6][1] = [0, -0.2890438735485077];
ans_array[6][2] = [1, -0.11275893902464063];
ans_array[6][3] = [0, -0.2890438735485077];
ans_array[6][4] = [0, 0.2890438735485077];
ans_array[6][5] = [3, -0.16642909072083967];
ans_array[6][6] = [1, -0.11275893902464063];
ans_array[6][7] = [0, -0.2890438735485077];
ans_array[7][1] = [0, -0.265813410282135];
ans_array[7][2] = [0, -0.265813410282135];
ans_array[7][3] = [1, -0.10119223448885162];
ans_array[7][4] = [1, -0.10119223448885162];
ans_array[7][5] = [0, -0.265813410282135];
ans_array[7][6] = [1, -0.10119223448885162];
ans_array[7][7] = [0, -0.265813410282135];
ans_array[8][1] = [0, -0.2825779616832733];
ans_array[8][2] = [0, -0.2827148735523224];
ans_array[8][3] = [0, -0.2827148735523224];
ans_array[8][4] = [2, -0.14668619054457288];
ans_array[8][5] = [2, -0.14668619054457288];
ans_array[8][6] = [1, -0.2125229816978158];
ans_array[8][7] = [0, -0.2827148735523224];
ans_array[9][1] = [0, -0.21348130702972412];
ans_array[9][2] = [0, -0.21348130702972412];
ans_array[9][3] = [2, 0.01748506617676604];
ans_array[9][4] = [1, -0.09307347525621656];
ans_array[9][5] = [1, -0.09307347525621656];
ans_array[9][6] = [2, 0.01748506617676604];
ans_array[9][7] = [1, -0.09307347525621656];


function eval1(object){
console.log(img_id, object.ID);
var object_height = object.plane.matrixWorld.clone().elements[13];
var object_parent = object.hparent;
check1 = object_parent.ID == ans_array[img_id][object.ID][0];
check2 = Math.abs(object_height - ans_array[img_id][object.ID][1]) < k1;
console.log(Math.abs(object_height - ans_array[img_id][object.ID][1]));
if (check1 && check2){
	return;	
}else{
	var wrong_array = new Array(0, 0, 0);
	wrong_array[0] = object.ID;
	if (!check1) wrong_array[1] = 1;
	if (!check2) wrong_array[2] = 1;
	wrong_answers.push(wrong_array);
}

}


function test_submitted(){
	feedback = "<center>";
	var object_list = iframe_window.object_list;
	wrong_answers = new Array();
	for (var i = 0; i < object_list.length; i++){
		if (object_list[i].plane == iframe_window.plane) continue;
		eval1(object_list[i]);
	}
	if (wrong_answers.length == 0) pass_status1 = true;
	else {
		for (var j = 0; j < wrong_answers.length; j++){
			var name = iframe_window.LMgetObjectField(iframe_window.LM_xml, wrong_answers[j][0], "name"); 
			if (wrong_answers[j][1] == 1) feedback += "Your support object assignment for the "+ name + " is <font color = 'red'>INCORRECT</font> - refer to step 1 in the instructions.</br>";
			if (wrong_answers[j][2] == 1) feedback += "Your height assignment for the "+ name + " is <font color = 'red'>INCORRECT</font> - refer to step 2 in the instructions.</br>";
		}
		feedback += "</br>Everything else is correct.</center>";
		pass_status1 = false;
		// tell get object name and say that it is wrong;
	}

    if (pass_status1) { // if passed
	feedback = "<center>You PASSED!</center>";
	$("#inline_content_box").html(feedback);
	POPUP_WIDTH=700;
	POPUP_HEIGHT=600;
	popup_closed = func_next;
	pass_status = true;
	open_popup();
	ans_count = 0;
    }
    else if (test_status[img_id]) { //if failed and is test question
	ans_count++;

	if (ans_count > 1) {
	    feedback += "<center><p class='tester_large'>You failed this question.</center></p>";
	    /*feedback += "Correct Answer";
	    feedback += '<img width=600px src="box_label/'+img_id+'_answers.png">';*/
	    POPUP_WIDTH=700;
	    POPUP_HEIGHT=600;
	    $("#inline_content_box").html(feedback);
	    popup_closed = func_next;
		ans_count = 0;
	    open_popup();
	} else {
	    feedback += "<p class='tester_large'>You have " + ((2) - ans_count) + " more chances for this question.</p>";
	    /*feedback += "Correct Answer";
	    feedback += '<img width=600px src="box_label/'+img_id+'_answers.png">';*/
	    POPUP_WIDTH=700;
	    POPUP_HEIGHT=600;
	    popup_closed = false;

	    $("#inline_content_box").html(feedback);
	    open_popup();
	}
    }
    else { //if failed and is training question
	/*feedback += "<br>Correct Answer";
	feedback += '<img width=600px src="box_label/'+img_id+'_answers.png">';*/
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
	document.getElementById("inline_content_box").style.padding = "20px";
}

function next()// load next question, also called upon skip
{
    if ((pass_status)&&(test_status[img_id])) {
	pass_status = false;
	next_val++;
    }
    if (next_val >= PASS_COUNT) {
	pass_this_user(true, 'You passed the entire test!', false);
	passed = true;
	init_frame();
    } else {
	img_id++;
	if (img_id == MAX_Q) {
	    var next_page = 'fail_page.html';
	    pass_this_user(false, 'You failed the qualification.', next_page);
	} else {
	    $('#mainframe').attr('src', 'https://people.csail.mit.edu/hairuo/test/LabelMeAnnotationTool/tool.html?collection=LabelMe&mode=mt&threed=true&folder=test_folder&tester=true&threed_mt_mode=support_label&image=' + img_id + '&userid=' + gup("workerId")+ "&next="+next_val);// this will have to be changed to reflect labelme
	feedback = '<center>';
	pass_status = false;
	tester_init();
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
    var userid = gup('workerId');

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

function gp_incorrect(){
	iframe_window = document.getElementById("mainframe").contentWindow;
	image_index = parseInt(image_list_id)*iframe_window.image_list_length + parseInt(iframe_window.image_count);
	gp_incorrect_string += ' ' + image_index;
	if (iframe_window.image_count == 4) submit_AMT();
	else iframe_window.AMTLoadNextImage(true);
	
	//var new_page = window.location.href.replace("image=" + gup('image'), "image=" + parseInt(parseInt(gup('image')) + 1));
	//window.location.assign(new_page);
}


////////////////////////////////////////////////////////////////////////////////////////////////
// ACTUAL LABELER RELATED CODE

/*function box_label_init() {
    DEFAULT_INSTR = '<li>Press the magnifying glass icons on the upper left corner to zoom in and out.</li>';
    DEFAULT_INSTR += '<li>You can resize image view window</li>';
    DEFAULT_INSTR += '<li>You can drag and move this instruciton window.</li>';
    instruct(DEFAULT_INSTR);
}*/

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
    if ((amt) && (next_val >= 4)) {
	//TODO: submit to AMT
	window.location.assign("amt_util/comment_page.php");
    } else {
	window.location.assign("gp_label.php?img="+(img_id+1)+"&userid="+gup('userid')+"&next="+(next_val+1));
    }
}

