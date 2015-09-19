<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$listname = $_POST['list_name'];
$dir = '../../../imageList/';
$filename = $dir . $listname;
$list_length = $_POST['list_length'];
if ($_POST['task'] == "get_list") {
  $F = file($filename);
  for ($x = 0; $x < $list_length; $x++) {
      $index = $x + $_POST['file_list_number']*$list_length;
      echo $F[$index];
  } 
}
?>
