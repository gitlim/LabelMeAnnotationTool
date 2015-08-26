<?php
//TODO: convert to more secret data
$dir = '../save/';
$vp_dir = '../vp/';
$vp_tester_dir = '../tmp/';
echo $_POST['userid'] . "\n";
if ($_POST['userid']) {
  $dir = $dir . $_POST['userid'] . '/';
}
if (!file_exists($dir)) {
  mkdir($dir);
}

$filename = $dir . $_POST['img'] . '.tmp';
$vp_filename = $vp_dir . $_POST['img'] . '.vp';
$vp_tester_filename = $vp_tester_dir . $_POST['img'] . '.vp';
if ($_POST['task'] == "save") {
  $F = fopen($filename, 'w');
  fprintf($F, "%s\n", urldecode($_POST['data']));
  fclose($F);
  echo(urldecode($_POST['data']));
  $V = fopen($vp_filename, 'w');
	fprintf($V, "%s\n", urldecode($_POST['line_data']));
	fclose($V);
	$Y = fopen($vp_filename, "a");
	fprintf($Y, "%s\n", urldecode($_POST['new_lines']));
	fclose($Y);
	echo(urldecode($_POST['line_data']));
} elseif ($_POST['task'] == "load") {
  if (file_exists($filename)) {
    $data = file_get_contents($filename, true);
  } else {
    $data = '';
  }
  echo $data;
} elseif ($_POST['task'] == "vp_load"){
	if (file_exists($vp_filename)) {
	$vp_data = file_get_contents($vp_filename, true);
  } else {
    $vp_data = '';
  }
  echo $vp_data;
} elseif ($_POST['task'] == "vp_tester_load"){
    if (file_exists($vp_tester_filename)) {
    $vp_data = file_get_contents($vp_tester_filename, true);
  } else {
    $vp_data = '';
  }
  echo $vp_data;
}
?>
