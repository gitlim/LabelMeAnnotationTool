<?php

$gp_file = fopen("wrong_gp_list.list", 'a+');
$boxes_file = fopen("wrong_boxes_list.list", 'a+');
$bad_image_file = fopen("bad_images_list.list", 'a+');
$filename = '../imageList/img.list';
$F = file($filename);
$image_count = $_POST["image_count"];
if ($_POST['task'] == 'gp_incorrect'){
	fwrite($gp_file, $F[$image_count]."\n");
	$image_count = $image_count + 1;
}
elseif ($_POST['task'] == 'boxes_incorrect'){
	fwrite($boxes_file, $F[$image_count]."\n");
	$image_count = $image_count + 1;
}elseif ($_POST['task'] == 'next'){
	$image_count = $image_count + 1;
}elseif ($_POST['task'] == 'back'){
	$image_count = $image_count - 1;
}elseif ($_POST['task'] == 'bad_image'){
	$image_count = $image_count + 1;
	fwrite($bad_image_file, $F[$image_count]."\n");
}
echo $image_count;
fclose($gp_file);
fclose($boxes_file);
fclose($bad_image_file);

?>

