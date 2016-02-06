<?php
$lines = file('focal.txt', FILE_IGNORE_NEW_LINES);
for($x = 0; $x < count($lines); $x++){
	/*if ($x mod 10 == 0){
		continue;
	}*/
	$line = $lines[$x];
	$split = explode(' ', $line);
	$image = $split[0];
	$focal = $split[1];
	$root = '../';
	echo "<div style = 'display: inline-block'>Image number: ".$x." "."Angle of view: ".$focal.'<br><a href= "'.$root.$image.'" target = "_blank"><img height = "400px" src ="'.$root.$image.'"/></a></div>';	
}
?>





