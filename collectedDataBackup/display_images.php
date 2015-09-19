<a id = "next">Next Image</a> 
<br> 
<a id = "back">Previous Image</a> 

<?php
$url = "$_SERVER[REQUEST_URI]";
$dirname = "../collectedDataBackup/box_visual/";
$count = $_GET["img"];
$images = glob($dirname."*.png");
$image = $images[$count];
$length = count($images);
echo '<p>Image number '.$count.' out of '.$length.'</p>';
echo '<img src="'.$image.'" /><br />';

?>




<script>
	var url = window.location.href;
	var str_array  = url.split("=");
	var img = str_array[str_array.length - 1];
	var next = document.getElementById("next");
	var back = document.getElementById("back");
	next.href = "display_images.php?img=" + parseInt(parseInt(img) + parseInt(1));
	back.href = "display_images.php?img=" + parseInt(parseInt(img) - parseInt(1));
</script>

