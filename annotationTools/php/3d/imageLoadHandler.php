<?php
//ini_set('display_errors', 1);
//error_reporting(E_ALL);
$listname = 'box_img.list';
$dir = '../../../imageList/';
$lock_dir = './lock/';
$filename = $dir . $listname;
$current_index = $_POST['current_index'];
$F = file_get_contents($filename); 
$lines = explode("\n", $F);
$found_image = false;
$old_index = $current_index;
$old_line = explode(" ", $lines[$old_index]);
$old_url = $old_line[0];
$old_name = end(explode('/', $old_url));
$old_name = substr($old_name, 0, -4);
$lines_length = count($lines);
while ($found_image == false){
	$current_index = $current_index + 1;
	if ($current_index > $lines_length){
		$current_index = 0;
	}
	$line = $lines[$current_index];
	$line_array = explode(" ", $line);
	$url = $line_array[0];
	$name = end(explode('/', $url));
	$name = substr($name, 0, -4);
	if (array_key_exists(1, $line_array)){
		if ((int)$line_array[1] == 5){
			continue;
		}
	}
	if (array_key_exists(2, $line_array)){
		if ((int)$line_array[2] == 5){
			continue;
		}
	}
	if (file_exists($lock_dir.$name.'.txt')){
		if ((time() - filemtime($lock_dir.$name.'.txt') > 10800)){//deletes lock file if still there after 3 hours of creation
			unlink($lock_dir.$name.'.txt');
			$found_image = true;
		}else{
			continue;
		}
	}else{
		$found_image = true;
	}
}

unlink($lock_dir.$old_name.'.txt');	
$curr_line = $lines[$current_index];
$curr_line_array = explode(' ', $curr_line);
$curr_url = $curr_line_array[0];
$curr_name = end(explode('/', $curr_url));
$curr_name = substr($curr_name, 0, -4);
$new_lock = fopen($lock_dir.$curr_name.'.txt', 'w');
fclose($new_lock);
echo $current_index;
if (array_key_exists(1, $old_line)){
	$new_done = (int)$old_line[1];
}else{
	$new_done = 0;
}
if (array_key_exists(2, $old_line)){
	$new_gp = (int)$old_line[2];
}else{
	$new_gp = 0;
}
if ($_POST['task'] == 'get_next_image'){
	$lines[$old_index] = $old_url.' '.($new_done + 1).' '.$new_gp;
}
elseif ($_POST['task'] == "gp_incorrect") {
	$lines[$old_index] = $old_url.' '.$new_done.' '.($new_gp + 1);
}
file_put_contents($filename, implode($lines, "\n"));
?>
