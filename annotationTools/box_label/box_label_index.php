<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
<meta http-equiv="pragma" content="no-cache" />

<script src="../js/jquery-1.9.1.js"></script>
<script src="../amt_util/util.js"></script>
<script src="../js/3d/box_label.js"></script>
<script src="../js/3d/jquery.colorbox.js"></script>
<script src="../js/three_r59.min.js"></script>

<link rel="stylesheet" href="../css/colorbox.css">
<?php
   if (0) {
   $files = glob('save/null/*'); // get all file names
  foreach($files as $file){ // iterate files
    if(is_file($file))
      unlink($file); // delete file
  }
   }
?>

<?php
   $i = 0; 
  $userid = $_GET['workerId'];
  $dir = 'save/' . $userid . '/';
  if ((file_exists($dir)) && ($handle = opendir($dir))) {
    while (($file = readdir($handle)) !== false){
      if (!in_array($file, array('.', '..')) && !is_dir($dir.$file)) 
	$i++;
    }
  }
  if ($i>=20) {
    echo 'The webserver seems to be broken. Please stop the job for the moment.';
    exit('');
  }
?>


<script>
  var num_boxes_labeled = 0;
  var required_num = 30;
  var time_string = '';
  var userid = gup('workerId');
  var image_list_id = gup('image_list'); // the list number (of ten images) that the user is labeling for the HIT
  var image_index = gup('image');
	if (!image_list_id) image_list_id = 0;
var FAKE_TEST = 10;
  	var img_id = parseInt(gup('image'));
	var amt_imgid = 0;
  if (FAKE_TEST) {
      <?php
    	echo 'amt_imgid = ' . $i . ';';
?>
  } else {
	  //image_list_id= gup('image_list');
      amt_imgid = gup('img') + 10*image_list_id;
  }


  var turkSubmit = gup('turkSubmitTo');
  if (turkSubmit){
  	var turkSubmit = turkSubmit.replace('%3A', ':'); // decoding URL
  	var turkSubmit = turkSubmit.replace(/%2F/g, '/');  // decoding URL
  }
  var assignmentId = gup('assignmentId');
  var hitId = gup('hitId');
  var passed = lookup_user(userid);
  var amt = true;
  var gp_incorrect_string = "";

  if (assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE')
  {
      document.location.href="../../box_instr/box_labeling_instr.htm";
  }


  function init_frame() {
		iframe_window = document.getElementById("mainframe").contentWindow;
      //document.getElementById('img_list_id').value = image_list_id;
      //document.getElementById('hitId').value = hitId;
      //document.getElementById('workerId').value = userid;
      //document.getElementById('assignmentId').value = assignmentId;
      if (passed == -1) {
		img_id = 0;
	  // run the tester
	  $('#mainframe').attr('src', 'https://people.csail.mit.edu/hairuo/test/LabelMeAnnotationTool/tool.html?collection=LabelMe&mode=mt&userid='+ userid + '&threed=true&folder=test_folder&tester=true&view_only=true&threed_mt_mode=box_label&image=0');
	tester_init();
      } else if (passed == 0) {
	  // failed user
	  alert('You have failed the qualificaton.');
	$('#mainframe').attr('src', 'fail_page.html');
      } else if (passed == 1) {
	  //TODO: starting image id
	FFF = $.ajax({
			type: "POST",
			url:"../php/3d/imageLoadHandler.php",
			data: {
				"task": 'check_curr_index',
				"current_index": image_index 
			},
			async: false,
			dataType: "html", 
		});	
	image_index = FFF.responseText;
	  
	  $('#mainframe').attr('src', 'https://people.csail.mit.edu/hairuo/test/LabelMeAnnotationTool/tool.html?collection=LabelMe&mode=mt&userid='+ userid + '&threed=true&folder=test_folder&threed_mt_mode=box_label&image_list=0&image=' + image_index);
      }  
  }
   function submit_AMT() {
	if (num_boxes_labeled < required_num){
		console.log("You have not labeled the correct number of boxes");
		return;
	}
	if (iframe_window.wait_for_input == 1){
		alert("You must close the popup window before you submit.");
		return;
	}
      try {
	  var time = (Date.now() - iframe_window.start_time)/1000;
	  time_string += time + ' ';
	  opener.document.getElementById('hitId').value = hitId;
	  opener.document.getElementById('workerId').value = userid;
	  opener.document.getElementById('assignmentId').value = assignmentId;
	  opener.document.getElementById('comment').value = document.getElementById('mt_comments').value;
	  opener.document.getElementById('wrong_groundplanes').value = gp_incorrect_string;
	  opener.document.getElementById('time').value = time_string;
	  opener.document.getElementById('mturk_form').action = turkSubmit + "/mturk/externalSubmit";
	  opener.submit_AMT();
	  window.close();
      }
      catch (e) {
	  console.log(e);
      }
  }
</script>

<body onload="init_frame();">
  <form style="display:none" id="mturk_form" method="POST" action="http://mturk.com/mturk/externalSubmit">
    <input id="img_list_id"      name="img_list_id" value=""></input>
    <input id="workerId"     name="workerId" value=""></input>
    <input id="assignmentId" name="assignmentId" value=""></input>
    <input id="hitId" name="hitId" value=""></input>
    <input id="mt_comments" name="mt_comments" value=""></input>
	<input id="wrong_groundplanes" name="wrong_groundplanes" value =""></input>
    <input id="time" name = "time" value=""></input>
  </form>

  <iframe frameBorder=0 style='position:absolute;top:0;left:0' width='100%' height='100%' id="mainframe" src=""></iframe>
<div style = "display:none">
	<div id="inline_content_box">
	</div>
</div>
</body>
