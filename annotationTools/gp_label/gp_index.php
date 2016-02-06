<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
<meta http-equiv="pragma" content="no-cache" />

<script src="js/jquery.min.js"></script>
<script src="amt_util/util.js"></script>

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
  var userid = gup('workerId');
  var image_list_id = gup('image_list'); // the list number (of ten images) that the user is labeling for the HIT
  var list_name = gup('list_name'); 
  var time_string = '';
  var FAKE_TEST = 10;
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

  if (assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE')
  {
      document.location.href="../../test/LabelMeAnnotationTool/gp_instr_new/instr.htm";
  }


  function init_frame() {
      //document.getElementById('img_list_id').value = image_list_id;
      //document.getElementById('hitId').value = hitId;
      //document.getElementById('workerId').value = userid;
      //document.getElementById('assignmentId').value = assignmentId;
	  iframe_window = document.getElementById("mainframe").contentWindow;
      if (passed == -1) {
	  // run the tester
	  $('#mainframe').attr('src', 'gp_tester.php?img=0&userid='+userid);
      } else if (passed == 0) {
	  // failed user
	  alert('You have failed the qualificaton.');
	$('#mainframe').attr('src', 'fail_page.html');
      } else if (passed == 1) {
	  //TODO: starting image id
	  $('#mainframe').attr('src', 'https://people.csail.mit.edu/hairuo/test/LabelMeAnnotationTool/tool.html?collection=LabelMe&mode=mt&userid='+ userid + '&threed=true&folder=3dataset&list_name='+ list_name + '&threed_mt_mode=gp&image_list='+ image_list_id + '&image=0');
      }  
  }
  function submit_AMT() {
      try { 
	  var time = (Date.now() - iframe_window.start_time)/1000;
	  time_string += time + ' ';
	  opener.document.getElementById('hitId').value = hitId;
	  opener.document.getElementById('img_list_id').value = image_list_id;
	  opener.document.getElementById('workerId').value = userid;
	  opener.document.getElementById('assignmentId').value = assignmentId;
	  opener.document.getElementById('comment').value = document.getElementById('mt_comments').value;
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
  </form>

  <iframe frameBorder=0 style='position:absolute;top:0;left:0' width='100%' height='100%' id="mainframe" src=""></iframe>
</body>
