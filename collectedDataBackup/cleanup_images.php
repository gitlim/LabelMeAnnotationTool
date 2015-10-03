
<?php
session_start();
$_SESSION["index"] = 0;
$_POST['task'] = null;
?>
<?php

/*$gp_file = fopen("wrong_gp_list.list", 'w');
$boxes_file = fopen("wrong_boxes_file.list", 'w');
$filename = '../imageList/img.list';
$F = file($filename);
if ($_POST['task'] == 'gp_incorrect'){
	fwrite($gp_file, $F[$_SESSION["index"]]."\n");
	$_SESSION["index"] = $_SESSION["index"] + 1;
}
elseif ($_POST['task'] == 'boxes_incorrect'){
	fwrite($boxes_file, $F[$_SESSION["index"]]."\n");
	$_SESSION["index"] = $_SESSION["index"] + 1;
}elseif ($_POST['task'] == 'next'){
	$_SESSION["index"] = $_SESSION["index"] + 1;
}elseif ($_POST['task'] == 'back'){
	$_SESSION["index"] = $_SESSION["index"] - 1;

}
echo $_SESSION["index"];
fclose($gp_file);
fclose($boxes_file);*/

?>




<script> 
function init(){
	var next = document.getElementById("next");
	var back = document.getElementById("back");
	var gp_incorrect = document.getElementById("gp_incorrect");
	var boxes_incorrect = document.getElementById("boxes_incorrect");
	var bad_image = document.getElementById("bad_image");
		image_name = 0;
	$('#mainframe').attr('src', 'https://people.csail.mit.edu/hairuo/test/LabelMeAnnotationTool/tool.html?collection=LabelMe&mode=i&threed=true&folder=example_folder&cleanup=true&view_only=true&image_list=0&image=' + image_name);
	
	gp_incorrect.href = 'javascript: next("gp_incorrect")';
	boxes_incorrect.href = 'javascript: next("boxes_incorrect")';
	bad_image.href = 'javascript: next("bad_image")';
	next.href = 'javascript: next("next")';
	back.href = 'javascript: next("back")';
}

	function next(task){
	iframe_window = document.getElementById("mainframe").contentWindow;
	index = iframe_window.image_count;
	var task = task;
	FFF = $.ajax({
			type: "POST",
			url:"cleanup_backend.php",
			data:{
					"task": task,
					"image_count": index,
			},
			async: false,
			dataType: "html",
			});
			image_name = FFF.responseText;
			$('#mainframe').attr('src', 'https://people.csail.mit.edu/hairuo/test/LabelMeAnnotationTool/tool.html?collection=LabelMe&mode=i&threed=true&folder=example_folder&cleanup=true&image_list=0&view_only=true&image=' + image_name);
			}


	
	
</script>
<head>
<script src="https://code.jquery.com/jquery-latest.min.js"
        type="text/javascript"></script>
</head>
<body onload = "javascript: init()">
	<a id = "next">Next Image</a> 
	<br> 
	<a id = "back">Previous Image</a>
	<br> 
	<a id = "gp_incorrect">GP Incorrect</a>
	<br>
	<a id = "boxes_incorrect">Boxes Incorrect</a>
	<br>
	<a id = "bad_image">Bad Image</a>

	<iframe frameBorder=0 style='position:absolute; top:100px; left:0'width='100%' height='80%'id = 'mainframe' src= ''></iframe>
	<div style = "display:none">
		<div id = "inline_content_box">
		</div>
	</div>
</body>
