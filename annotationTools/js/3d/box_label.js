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
var k2 = 0.2; // rotation
var k3 = 0.20; //scale for width (bigger side)
var k4 = 0.10; // minimum scale
var k5 = 0.2; //scale for depth (smaller side)
var k6 = 0.15; //scale for height

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
		feedback += '<li>You have only <font color="red">3 submissions per test image.</font></li></ul>.<br>';

    } else {
		feedback += '[QUALIFICATION <b>TRAINING</b> for FIRST TIME USERS]</center><br>';
		feedback += '<br>';
		feedback += 'This is for first time users only.<br><br>';
		feedback += '- You are at ' + (parseInt(img_id) + 1) + '/' + FIRST_TEST + ' <font color = "red"><b>training</b></font> images';
		feedback += '<ul><li>You can skip any training image.</li>';
		feedback += '<li>You can submit as many times as you want for training. The training images are a bit harder than those for the test - use them for practice.</li></ul>';
		feedback += '- There are ' + (MAX_Q - FIRST_TEST) + ' test images after the training.';
		feedback += '<ul><li>You need to get at least ' + PASS_COUNT + ' images correct out of 5.</li>'
		feedback += '<li>You have only 3 submissions per test image.</li></ul><br>';
		feedback += 'For the training and test ONLY, place the boxes around the two indicated objects. <br><br>For the REAL HIT, you will label around <font color = "red">10</font> objects per image.<br>';
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


// position - answer sheet
var ans_position = new Array();
var ans_rotation = new Array();
var ans_scale_vector = new Array();
var ans_metrics = new Array();
for (var i = 0; i < 10; i++){
	ans_position.push(new Array());
	ans_rotation.push(new Array());
	ans_scale_vector.push(new Array());
	ans_metrics.push(new Array());
	ans_metrics[i][0] = [k1, k2, k3, k4, k5, k6];
	ans_metrics[i][1] = [k1, k2, k3, k4, k5, k6];
}
ans_position[0][0] = {x: 1.0214431873492447, y: 1.1828439012443357, z: 0.0033279368332784446};
ans_position[0][1] = {x: 0.9056581052194744, y: 1.2136167085232858, z: 0.20034273252989235};
ans_position[1][0] = {x: 0.886906466627182, y: 1.2937884302658098, z: -0.010325663843604366};
ans_position[1][1] = {x: 1.158562718690685, y: 0.6050988709699084, z: 0.07776074149342962}; 
ans_position[2][0] = {x: 0.6693097444894205, y: 1.2297325287673162, z: 0.018466192087517104};
ans_position[2][1] = {x: 1.2330918803919113, y: 0.9304136155502505, z: -0.12122804953096936};
ans_position[3][0] = {x: 0.8221716081767662, y: 1.1080448503353955, z: 0.02036735210818838};
ans_position[3][1] = {x: 0.8825819628763635, y: 1.0941201605627873, z: 0.07353619703068037};
ans_position[4][0] = {x: 0.5202805484467111, y: 1.5586898897330534, z: -0.027260895977609723};
ans_position[4][1] = {x: 0.535082167972601, y: 1.550473063815233, z: 0.1481468816976111};
ans_position[5][0] = {x: 0.6092493562984036, y: 1.3392617567159646, z: -0.1452187021814882};
ans_position[5][1] = {x: 0.9749621748596955, y: 1.0133459448650295, z: 0.011058565051095814};
ans_position[6][0] = {x: 1.1588729640030508, y: 0.9872272019222724, z: -0.07973987851944847};
ans_position[6][1] = {x: 1.4752889358333279, y: 0.4276556896838071, z: -0.1357337722500955};
ans_position[7][0] = {x: 0.6918799949324741, y: 1.3478271176221628, z: -0.10083206100340902};
ans_position[7][1] = {x: 0.7184675707615875, y: 1.3930004271319731, z: 0.055353228470822746};
ans_position[8][0] = {x: 1.0052646601748971, y: 0.8984672469950442, z: -0.0030725334841782415};
ans_position[8][1] = {x: 0.6837604814729726, y: 1.4054949739635891, z: -0.02008107330153422};
ans_position[9][0] = {x: 1.086678153158092, y: 0.9820452142274618, z: -0.09973646710561976};
ans_position[9][1] = {x: 0.9428110036541488, y: 1.1644034882428804, z: 0.14068421556433186};


// rotation - answer sheet
ans_rotation[0][0] = 0;
ans_rotation[0][1] = 0;
ans_rotation[1][0] = -0.06283185307179587;
ans_rotation[1][1] = 0.025132741228718346;
ans_rotation[2][0] =  -0.0879645943005142;
ans_rotation[2][1] = 0.012566370614359165;
ans_rotation[3][0] = 0.5906194188748811;
ans_rotation[3][1] = 0;
ans_rotation[4][0] = -0.10053096491487339;
ans_rotation[4][1] = 0;
ans_rotation[5][0] = -0.02513274122871834;
ans_rotation[5][1] = 0;
ans_rotation[6][0] = 0;
ans_rotation[6][1] = 0.06283185307179587;
ans_rotation[7][0] = -1.6336281798666925 
ans_rotation[7][1] = 0;
ans_rotation[8][0] = 0; 
ans_rotation[8][1] = 0;
ans_rotation[9][0] = 0.012566370614359173;
ans_rotation[9][1] = 0;
// cube scale answer sheet
ans_scale_vector[0][0] = {x: 3.467472545138127, y: 1.0681669490670427, z: 2.4244595501717847};
ans_scale_vector[0][1] = {x: 0.7081470346853347, y: 0.6183705290636358, z: 1.604132335180849};
ans_scale_vector[1][0] = {x: 3.516107701106032, y: 2.7030040502750508, z: 2.909027159356103};
ans_scale_vector[1][1] = {x: 0.5812647209780686, y: 1.19080873514238, z: 1.6989737103317195};
ans_scale_vector[2][0] = {x: 1.5764109094260763, y: 1.0038027175349382, z: 1.5228796697458888};
ans_scale_vector[2][1] = {x: 4.270953532123048, y: 1.3771962497638166, z: 1.2560131624680202};
ans_scale_vector[3][0] = {x: 0.963599933643809, y: 1.2947352228947422, z: 1.2433858457687919};
ans_scale_vector[3][1] = {x: 0.588666542554702, y: 0.6821005698142976, z: 1.948032612717248};
ans_scale_vector[4][0] = {x: 1.8267131374415588, y: 1.117491694428168, z: 2.1885953032809464};
ans_scale_vector[4][1] = {x: 0.5633890292290701, y: 0.6054199512178022, z: 1.2044713418567254}; 
ans_scale_vector[5][0] = {x: 1.833975496733236, y: 1.6279952418653614, z: 1.6148233287889413};
ans_scale_vector[5][1] = {x: 1.3333979781136014, y: 1, z: 1};
ans_scale_vector[6][0] = {x: 10.144411290124227, y: 7.842723229727474, z: 3.630505228552533};
ans_scale_vector[6][1] = {x: 1.6818277917144706, y: 2.3049259137257634, z: 1.8748860841327017};
ans_scale_vector[7][0] = {x: 1.3629874880358608, y: 1.3315478400358207, z: 1.6517332944460899};
ans_scale_vector[7][1] = {x: 0.8221147570448849, y: 0.7454709700740887, z: 1.4691268333053944};
ans_scale_vector[8][0] = {x: 4.55577851885835, y: 3.307830131293675, z: 2.241653960537194};
ans_scale_vector[8][1] = {x: 2.4064551613606477, y: 1, z: 3.6448397806776005};
ans_scale_vector[9][0] = {x: 5.770092222585983, y: 2.7578760756596528, z: 1.5922583767551175};
ans_scale_vector[9][1] = {x: 4.485122142424599, y: 1.333406294602936, z: 4.239795044075594};

ans_metrics[0][1][2] = 0.3;
ans_metrics[0][1][4] = 0.3;
ans_metrics[0][1][1] = 1;
ans_metrics[1][1][4] = 0.3;
ans_metrics[3][0][2] = 0.3;
ans_metrics[3][0][4] = 0.3;
ans_metrics[3][0][1] = 0.3;
ans_metrics[3][1][2] = 0.3;
ans_metrics[3][1][4] = 0.3;
ans_metrics[3][1][0] = 0.02;
ans_metrics[3][1][1] = 1;
ans_metrics[4][0][4] = 0.3;
ans_metrics[4][1][2] = 0.3;
ans_metrics[4][1][4] = 0.3;
ans_metrics[4][1][1] = 1;
ans_metrics[5][0][2] = 0.3;
ans_metrics[5][1][0] = 0.02
ans_metrics[5][1][2] = 0.22;
ans_metrics[5][1][4] = 0.22;
ans_metrics[5][1][5] = 0.3;
ans_metrics[6][0][2] = 0.075;
ans_metrics[6][0][4] = 0.1;
ans_metrics[6][0][0] = 0.03;
ans_metrics[6][1][5] = 0.22;
ans_metrics[6][1][4] = 0.25;
ans_metrics[7][0][2] = 0.25;
ans_metrics[7][0][4] = 0.25;
ans_metrics[7][1][2] = 0.3;
ans_metrics[7][1][4] = 0.3;
ans_metrics[7][1][1] = 1;
ans_metrics[8][0][0] = 0.03;
ans_metrics[8][0][2] = 0.15;
ans_metrics[9][0][0] = 0.03;
ans_metrics[9][0][4] = 0.25;
ans_metrics[9][0][5] = 0.3;
ans_metrics[9][1][4] = 0.3;

function eval1(position_vector, rotation, scale_vector){
var metrics = ans_metrics[img_id][0]
var k1 = metrics[0];
var k2 = metrics[1];
var k3 = metrics[2];
var k4 = metrics[3];
var k5 = metrics[4];
var k6 = metrics[5];
//var distance = ans_position[img_id][0].distanceTo(position_vector);
var three_ans_position_vector = new THREE.Vector3(ans_position[img_id][0]["x"], ans_position[img_id][0]["y"], ans_position[img_id][0]["z"]).applyMatrix4(iframe_window.plane.matrixWorld.clone()).sub(iframe_window.camera.position.clone());
var three_ans_position_vector_bottom = new THREE.Vector3(ans_position[img_id][0]["x"], ans_position[img_id][0]["y"], ans_position[img_id][0]["z"] - 0.1*0.5*ans_scale_vector[img_id][0]["z"]).applyMatrix4(iframe_window.plane.matrixWorld.clone()).sub(iframe_window.camera.position.clone());
var ans_distance = three_ans_position_vector.length(); 
var position_normalized = position_vector.clone().setZ(position_vector.clone().z - 0.1*0.5*scale_vector.clone().z).applyMatrix4(iframe_window.plane.matrixWorld.clone()).sub(iframe_window.camera.position).normalize();
var distance = position_normalized.distanceTo(three_ans_position_vector_bottom.clone().normalize());
var camera_distance = position_vector.clone().applyMatrix4(iframe_window.plane.matrixWorld.clone()).distanceTo(iframe_window.camera.position);
console.log(camera_distance);
console.log(distance);
checkF1 = Math.abs(distance) < k1;
var sin_rotation = Math.abs(Math.sin(rotation));
console.log(sin_rotation);
var sin_ans_rotation = Math.abs(Math.sin(ans_rotation[img_id][0]));
checkN1 = Math.abs(sin_ans_rotation - sin_rotation) < k2;
if (checkN1 == false){
	var ans_x_bigger = ans_scale_vector[img_id][0]["x"] > ans_scale_vector[img_id][0]["y"];
	var x_bigger = scale_vector.x > scale_vector.y;
	if (ans_x_bigger != x_bigger) checkN1 = Math.abs(Math.abs(Math.sin(rotation + Math.PI/2)) - sin_ans_rotation) < k2;
}
if (checkN1 == false && img_id == 7){
	checkN1 = Math.abs(Math.abs(Math.sin(rotation + Math.PI/2)) - sin_ans_rotation) < k2;
}

var width = Math.max(scale_vector.x, scale_vector.y)/camera_distance;
var depth = Math.min(scale_vector.x, scale_vector.y)/camera_distance;
var height = scale_vector.z/camera_distance;
console.log(width, depth, height);
var check_height = Math.abs(ans_scale_vector[img_id][0]["z"]/ans_distance - height) < Math.max(k4, ans_scale_vector[img_id][0]["z"]/ans_distance*k6);
console.log(ans_scale_vector[img_id][0]["z"] - scale_vector.z);
var ans_width = Math.max(ans_scale_vector[img_id][0]["x"], ans_scale_vector[img_id][0]["y"])/ans_distance;
var ans_depth = Math.min(ans_scale_vector[img_id][0]["x"], ans_scale_vector[img_id][0]["y"])/ans_distance;
console.log(ans_width, ans_depth);
console.log(width - ans_width);
console.log(depth - ans_depth);
var check_width = Math.abs(width - ans_width) < Math.max(ans_width*k3, k4);
var check_depth = Math.abs(depth - ans_depth) < Math.max(ans_depth*k5, k4);
checkO1 = check_width && check_depth && check_height;


if ((checkF1) && (checkN1) && (checkO1)) {
pass_status1 = true;
console.log("true");
}
else {
pass_status1 = false;
console.log("false");
}

feedback = "<center>";
	if (checkO1) {
	feedback += "Bounding box scale for " + name_array[img_id][0] + ": CORRECT!<br>";
    } else {
	feedback += "Bounding box scale for " + name_array[img_id][0] + ": INCORRECT!<br>";
    }
    if ((checkF1)) {
	feedback += "Bounding box position for " + name_array[img_id][0] + ": CORRECT!<br>";
    } else {
	feedback += "Bounding box position for " + name_array[img_id][0] + ": INCORRECT!<br>";
    }
    if (checkN1){
	feedback += "Bounding box rotation for " + name_array[img_id][0] + ": CORRECT!<br>";
    }else {
	feedback += "Bounding box rotation for " + name_array[img_id][0] + ": INCORRECT!<br><br><br>";
    }9

}
function eval2(position_vector, rotation, scale_vector){
var metrics = ans_metrics[img_id][1]
var k1 = metrics[0];
var k2 = metrics[1];
var k3 = metrics[2];
var k4 = metrics[3];
var k5 = metrics[4];
var k6 = metrics[5];

var three_ans_position_vector = new THREE.Vector3(ans_position[img_id][1]["x"], ans_position[img_id][1]["y"], ans_position[img_id][1]["z"]).applyMatrix4(iframe_window.plane.matrixWorld.clone()).sub(iframe_window.camera.position.clone());
var three_ans_position_vector_bottom = new THREE.Vector3(ans_position[img_id][1]["x"], ans_position[img_id][1]["y"], ans_position[img_id][1]["z"] - 0.1*0.5*ans_scale_vector[img_id][1]["z"]).applyMatrix4(iframe_window.plane.matrixWorld.clone()).sub(iframe_window.camera.position.clone());
var ans_distance = three_ans_position_vector.length(); 
var position_normalized = position_vector.clone().setZ(position_vector.clone().z - scale_vector.clone().z*0.1*0.5).applyMatrix4(iframe_window.plane.matrixWorld.clone()).sub(iframe_window.camera.position).normalize();
var distance = position_normalized.distanceTo(three_ans_position_vector_bottom.clone().normalize());
var camera_distance = position_vector.clone().applyMatrix4(iframe_window.plane.matrixWorld.clone()).distanceTo(iframe_window.camera.position);

checkF2 = Math.abs(distance) < k1;

var sin_rotation = Math.abs(Math.sin(rotation));
var sin_ans_rotation = Math.abs(Math.sin(ans_rotation[img_id][1]));
checkN2 = Math.abs(sin_ans_rotation - sin_rotation) < k2;

if (checkN2 == false){
	var ans_x_bigger = ans_scale_vector[img_id][1]["x"] > ans_scale_vector[img_id][1]["y"];
	var x_bigger = scale_vector.x > scale_vector.y;
	if (ans_x_bigger != x_bigger) checkN2 = Math.abs(Math.abs(Math.sin(rotation + Math.PI/2)) - sin_ans_rotation) < k2;
}
var width = Math.max(scale_vector.x, scale_vector.y)/camera_distance;
var depth = Math.min(scale_vector.x, scale_vector.y)/camera_distance;
var height = scale_vector.z/camera_distance;
var check_height = Math.abs(ans_scale_vector[img_id][1]["z"]/ans_distance - height) < Math.max(k6, k3*ans_scale_vector[img_id][1]["z"]/ans_distance);
var ans_width = Math.max(ans_scale_vector[img_id][1]["x"], ans_scale_vector[img_id][1]["y"])/ans_distance;
var ans_depth = Math.min(ans_scale_vector[img_id][1]["x"], ans_scale_vector[img_id][1]["y"])/ans_distance;
var check_width = Math.abs(width - ans_width) < Math.max(ans_width*k3, k4);
var check_depth = Math.abs(depth - ans_depth) < Math.max(ans_depth*k3, k5);
checkO2 = check_width && check_depth && check_height;

if ((checkF2) && (checkN2) && (checkO2)) {
pass_status2 = true;
console.log("true");
}
else {
pass_status2 = false;
console.log("false");
}

    if (checkO2) {
	feedback += "Bounding box scale for " + name_array[img_id][1] + ": CORRECT!<br>";
    } else {
	feedback += "Bounding box scale for " + name_array[img_id][1] + ": INCORRECT!<br>";
    }
    if ((checkF2)) {
	feedback += "Bounding box position for " + name_array[img_id][1] + ": CORRECT!<br>";
    } else {
	feedback += "Bounding box position for " + name_array[img_id][1] + ": INCORRECT!<br>";
    }
    if (checkN2){
	feedback += "Bounding box rotation for " + name_array[img_id][1] + ": CORRECT!<br>";
    }else {
	feedback += "Bounding box rotation for " + name_array[img_id][1] + ": INCORRECT!<br><br><br>";
    }

	if (!(pass_status1 && pass_status2) )feedback += "<br><b>TIP:</b> If the box looks correct but the tester says that it is incorrect, use the navigation mode to check the box dimensions. Optical illusions can happen where the box dimensions are actually very different from what you think they are! This is especially the case for objects in the backgrounds of images.";
	else feedback += "You passed! Remember that during the real HIT, you will have to label <font color = 'red'><u>10<u/><font> objects per image (or at least as many as possible)."
}


function test_submitted(){
	var object1;
	var object2;
	name_array = new Array();
	name_array[0] = ["drawers", "lamp"];
	name_array[1] = ["couch", "cabinet"];
	name_array[2] = ["nightstand", "bench"];
	name_array[3] = ["rocking chair", "lamp"];
	name_array[4] = ["nightstand", "lamp"];
	name_array[5] = ["nightstand", "nightstand"];
	name_array[6] = ["bed", "nightstand"]; 
	name_array[7] = ["nightstand", "lamp"];
	name_array[8] = ["bed", "drawers"];
	name_array[9] = ["bed", "wardrobe"];

	iframe_window = document.getElementById("mainframe").contentWindow;
	if (iframe_window.object_list.length < 2){
		alert("You must have two boxes labeled before you submit.");
		return;
	}	
	for (var i = 0; i < iframe_window.object_list.length; i++){
		if (iframe_window.LMgetObjectField(iframe_window.LM_xml, iframe_window.object_list[i].ID, "deleted") > 0) continue;
		if (iframe_window.LMgetObjectField(iframe_window.LM_xml, iframe_window.object_list[i].ID, "name") == name_array[img_id][0] && !object1) object1 = iframe_window.object_list[i];
		else if (iframe_window.LMgetObjectField(iframe_window.LM_xml, iframe_window.object_list[i].ID, "name") == name_array[img_id][1]) object2 = iframe_window.object_list[i];
	}
	if (!object1 && !object2){
		alert("The names you entered for both objects are incorrect");
		return;
	}else if (!object1){
		alert("The name you entered for the " + name_array[img_id][0] + " is incorrect.");
		return;
	}else if (!object2){
		alert("The name you entered for the " + name_array[img_id][1] + " is incorrect.");
		return;
	}
	if (img_id == 5){
	var three_ans_position_vector = new THREE.Vector3(ans_position[img_id][0]["x"], ans_position[img_id][0]["y"], ans_position[img_id][0]["z"]).applyMatrix4(iframe_window.plane.matrixWorld.clone()).sub(iframe_window.camera.position.clone());
		var dist1 = object1.cube.position.clone().normalize().distanceTo(three_ans_position_vector.clone().normalize());
		var dist2 = object2.cube.position.clone().normalize().distanceTo(three_ans_position_vector.clone().normalize());
		if (dist1 > dist2){
			var holder = object1;
			object1 = object2;
			object2 = holder;
		}
	}
    eval1( object1.cube.position.clone(), object1.cube.rotation.z, object1.cube.scale.clone());
    eval2( object2.cube.position.clone(), object2.cube.rotation.z, object2.cube.scale.clone());
	
    if (pass_status1 && pass_status2) { // if passed
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

	if (ans_count > 2) {
	    feedback += "<p class='tester_large'>You failed this question.</p>";
	    /*feedback += "Correct Answer";
	    feedback += '<img width=600px src="box_label/'+img_id+'_answers.png">';*/
	    POPUP_WIDTH=700;
	    POPUP_HEIGHT=600;
	    $("#inline_content_box").html(feedback);
	    popup_closed = func_next;
		ans_count = 0;
	    open_popup();
	} else {
	    feedback += "<p class='tester_large'>You have " + ((3) - ans_count) + " more chances for this question.</p>";
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
	    $('#mainframe').attr('src', 'https://people.csail.mit.edu/hairuo/test/LabelMeAnnotationTool/tool.html?collection=LabelMe&mode=mt&threed=true&folder=example_folder&tester=true&threed_mt_mode=box_label&image=' + img_id + '&userid=' + gup("workerId")+ "&next="+next_val);// this will have to be changed to reflect labelme
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

