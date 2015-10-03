<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
<meta http-equiv="pragma" content="no-cache" />

<script src="js/jquery.min.js"></script>
<script src="amt_util/util.js"></script>

<script>
    var assignmentId = gup('assignmentId');

if (assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE')
{
    document.location.href="gp_instr_new/instr.htm";
}

  function open_link() {
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
		alert("This tool does not work with Safari. Please use a different browser.");
		return;
	}
    var s = document.URL;
    var queryString = s.substring(s.lastIndexOf("?"));
    window.open('gp_index.php'+queryString, '_blank');
    window.focus;
  }
  function submit_AMT() {
      document.forms["mturk_form"].submit();
  }
</script>

<button onclick="open_link()" style="width:200px;height:50px;">Click to open the labeler</button>

 
<form style="display:none" id="mturk_form" method="POST" action="">
  <input id="img_list_id" name="img_list_id" value=""></input>
  <input id="workerId"     name="workerId" value=""></input>
  <input id="assignmentId" name="assignmentId" value=""></input>
  <input id="hitId" name="hitId" value=""></input>
  <input id="comment" name="comment" value=""></input>
</form>
