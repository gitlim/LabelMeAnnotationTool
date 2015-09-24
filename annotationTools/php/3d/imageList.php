<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$listname = $_POST['list_name'];
$dir = '../../../imageList/';
$filename = $dir . $listname;
$list_length = $_POST['list_length'];
$file_list_number = $_POST['file_list_number'];
$F = file($filename);
if ($_POST['task'] == "get_list") {
  for ($x = 0; $x < $list_length; $x++) {
      $index = $x + $_POST['file_list_number']*$list_length;
      echo $F[$index];
  } 
}elseif ($_POST['task'] == 'get_box_list'){
	echo $F[$file_list_number];
}
?>
