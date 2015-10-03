<?php
$dirname = "../collectedDataBackup/box_visual/cropped/";
$images = glob($dirname."*.png");
foreach($images as $image){
	echo '<a href= "'.$image.'" target = "_blank"><img height = "400px" src ="'.$image.'"/></a>';	
}
?>





