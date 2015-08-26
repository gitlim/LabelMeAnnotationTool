<?php
$path = './annotationTools/model_lists';

if ($_GET['task'] == "model_list") {
  $cou = 0;
  foreach (glob($path . '*.list') as $filename) {
    $data[$cou++] = $filename;
  }
  echo json_encode($data);
} elseif ($_GET['task'] == "submodel") {
  $file = file_get_contents($path . str_replace(' ', '+', $_GET['param']), true);

  $list = explode("\n", $file);
  for ($i = 0; $i < count($list); $i++) {
    $tmp = explode("@@@", $list[$i]);
    $list[$i] = $tmp[0];
  }

  echo json_encode($list);
 }
?>