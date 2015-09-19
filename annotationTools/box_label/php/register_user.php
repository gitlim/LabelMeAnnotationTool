<?php
$con = mysql_connect("mysql.csail.mit.edu","lim","verytempsql");

if (!$con) {
  die("Failed to connect to MySQL" . mysql_error());
}

mysql_select_db("amt_qual", $con);

if ($_GET['task'] == "register") {
  $userid = $_GET['userid'];
  $passed = $_GET['passed'];

  $query = "SELECT * from modeltown_box where workerid = '" . $userid . "'";
  $q = mysql_query($query, $con);
  if (mysql_num_rows($q)) {
    $row = mysql_fetch_array($q);
    echo "user already registered as " . $row['passed'] . "</br>";
  } else {
    $query = "INSERT INTO modeltown_box VALUES (";
    $query = $query . "NULL,";
    $query = $query . "'" . $userid . "',";
    $query = $query . "" .  $passed . "";
    $query = $query . ")";
    echo $query . "</br>";
    if (!mysql_query($query, $con)) {
      die(mysql_error());
    }
    echo "user recorded</br>";
  }
} elseif ($_GET['task'] == "lookup") {
  $userid = $_GET['userid'];
  $query = "SELECT * from modeltown_box where workerid = '" . $userid . "'";
  $q = mysql_query($query, $con);
  if (mysql_num_rows($q)) {
    $row = mysql_fetch_array($q);
    echo $row['passed'];
  } else {
    echo -1;
  }
}

mysql_close($con);
?>
