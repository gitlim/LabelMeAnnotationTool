<?php
$page = $_GET['page'];
$dirname = "../Images/3dataset/";
$images = explode("\n", file_get_contents('3dataset_img.list'));
$init = $page*1000;
array_splice($images, $init, $init+1000);
shuffle($images);
for ($x = 0; $x < 1000; $x++){
	echo '<a href= "'.$dirname.$images[$x].'" target = "_blank"><img height = "128px" src ="'.$dirname.$images[$x].'"/></a>';	
}
?>





