<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
<meta http-equiv="pragma" content="no-cache" />

<?php
    $lines = file('tmp/test_img.list');
    $img_id = $_GET['img'];
    if (is_null($img_id))
      $img_id = 0;
?>

<script>
    var img_name = "<?php echo trim($lines[$img_id]); ?>";
    function load_img() {
        document.getElementById('img').src = img_name;
  }
  /*var o_img_id = <?php echo $o_img_id; ?>;*/
  var img_id_n = parseInt(<?php echo $img_id;?>);
</script>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>3dataset</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="css/labeler.css">
    <link rel="stylesheet" href="Apprise/apprise-v2.css">
    <link rel="stylesheet" href="js/jquery-ui.css" />
    <link rel="stylesheet" href="css/colorbox.css">
  </head>

<script src="gl-matrix/dist/gl-matrix-min.js"></script>
<script src="js/Detector.js"></script>
<script src="js/jquery.min.js"></script>
<script src="js/jquery-ui.min.js"></script>
<script src="js/kinetic-v5.0.1.min.js"></script>
<script src="js/three_r59.min.js"></script>
<script src="js/OBJLoader_yzflipped.js"></script>
<script src="js/3dataset_new.js"></script>
<script src="js/vp_new.js"></script>
<script src="amt_util/util.js"></script>
<script src="Apprise/apprise-v2.js"></script>
<script src="js/gp_label.js"></script>
<script src="js/jquery.colorbox.js"></script>


<script>
  var userid = gup('userid');
  DEFAULT_INSTR = "Click on an icon to edit that object."
  var img_name = "<?php echo trim($lines[$img_id]); ?>";
  function load_img() {
      document.getElementById('img').src = img_name;
  }
</script>

<div id="label_buttons_drawing">
      <div id ="generic_buttons" class="annotatemenu">
      <!-- ZOOM IN BUTTON -->
      <button id="zoomin" class="labelBtnDraw" type="button" title="Zoom In" onclick="toggle_zoom_on()">
        <img src="img/zoomin.png" width="28" height="38" />
      </button>
      <!-- ZOOM OUT BUTTON -->
      <button id="zoomout" class="labelBtnDraw" type="button" title="Zoom Out" onclick="toggle_zoom_off()">
        <img src="img/zoomout.png" width="28" height="38" />
      </button>
      </div>
    </div>

<body onload="load_img();" style = "height: 100%" oncontextmenu = "return false;">
  <div id = "container1">
    <div id = "title_bar">
      <button id="save" type="submit" name="save" onclick="save_file(
                   <?php
                     echo $img_id;
                   ?>
                   );" value="Save">Save</button>
    </div>

    <div id="im_resizable" style="position: absolute; width: 900px; height: 630px; margin-top: 0px; margin-left: 0px; overflow: hidden;">
      <div id="im">
        <img id="img" style="width:900px" onload="setTimeout(function () {init2(); tester_init(); init(
            <?php
              echo $img_id;
            ?>
            );}, 500);" src="">
        <canvas width="900px" height="4000px" id="cnvs"></canvas>
        <div id="container">
        </div>
      </div>
    </div>


    <div id="model_column">
      <div id="model">e
      </div>

      <button id = "height" type = "submit" name = "height" onclick = "assign_height()" >
        <img src = "img/height-button.png" width = "40px"><br>
          Label box height
        </button>
        <button id = "clone" type = "submit" name = "clone" onclick = "clone_box()">
        <img src = "img/clone-button.png" width = "40px"><br>
          Clone a box
      </button>
    </div>

    <div id="input">
      <div id="instructions">
        <div id="instructions_heading">
	         Instructions
        </div>
        <div id="instructions_inner">
          <b>Instructions go here</b>
        </div>
      </div>

      <div id="buttonform1">
        <div id="buttonform2">
          <form  style = "margin-left: 10px;">
            <div class = "checkboxFour">
              <input id="showimg"  type="checkbox" onclick="toggle_img(this);" checked=true style="float:left; margin-bottom: 5px; display: inline-block;"/>
              <label id = "showimg_label" for = "showimg" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Image
              </label>
            </div>
            <div class = "checkboxFour">
              <input id="show3d" type="checkbox" onclick="toggle_3d(this);" checked=true style="float:left; margin-bottom: 5px; display: inline-block;"/>
              <label id = "show3d_label" for = "show3d" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3D
              </label>
            </div>

            <!--<div class = "checkboxFour">
              <input id="navigation" type = "checkbox" onclick="toggle_nav(this);" style = "float:left; display: inline-block;"/>
              <label id = "navigation_label" for = "navigation"  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Navigation
              </label>
            </div>-->

            <div id = "all_boxes_wrapper" class = "checkboxFour">
              <input id="all_boxes" type = "checkbox" onclick="toggle_all_boxes(this);" style = "float:left; display: inline-block;"/>
              <label id = "all_boxes_label" for = "all_boxes" style = "white-space: nowrap;"  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All Boxes
              </label>
            </div>

            <br>
            <div id = "sliders">
              <div id = "x_wrapper">Scale X: <br><input type = "range" id = "scale_x"  name = "scale_x" min = '0' max = '100' oninput = "input_change()" onchange="input_change()"><br></div>
              <br>
              <div id = "y_wrapper">Scale Y: <br><input type = "range" id = "scale_y"  name = "scale_y" min = '0' max = '100' oninput = "input_change()" onchange="input_change()"><br></div>
              <br>
              <div id = "z_wrapper">Scale Z: <br><input type = "range" id = "scale_z" name = "scale_z" min = '0' max = '100' oninput = "input_change()" onchange="input_change()"><br></div>
              <br>
              <div id = "r_wrapper">Rotation: <br><input type = "range" id = "rotation" name = "rotation" min = '0' max = '100' value = '50' oninput = "cube_rotate()" onchange="cube_rotate()"><br><br></div>
            </div>
            <div id = "inputs">
              <div id = "x_wrapper_i">Scale X: <input type="number" id = "input_x" name="input_x" min="1" style="width:50px;" value = "1" oninput = "input_change()" onchange="input_change()"><br></div>
              <br>
              <div id = "y_wrapper_i">Scale Y: <input type="number" id = "input_y" name="input_y" min="1" style="width:50px;" value = "1" oninput = "input_change()" onchange="input_change()"><br></div>
              <br>
              <div id = "z_wrapper_i">Scale Z: <input type="number" id = "input_z" name="input_z" min="1" style="width:50px;" value = "1" oninput = "input_change()" onchange="input_change()"><br></div>
              <br>
              <div id = "r_wrapper_i">Rotation: <input type="number" id = "input_r" name="input_r" style="width:50px;" value = "0" oninput = "cube_rotate()" onchange="cube_rotate()"><br></div>
            </div>
          </form>

        </div>
        <div id="height-slider">
          <div id="slider-vertical"></div>
          <button id="add" type="button" name="add" value="Add"><img width = "40px;" src = "img/add-button.png"></button>
          <button id="remove" type="button" name="remove" value="Remove"><img src = "img/remove-button.png"></button>
        </div>
        <br><br>

        <script>
          $( "#add" ).on("click", function() { add_box(); buttonClicked(this); } );
          $( "#remove" ).on("click", function() { remove_box(); buttonClicked(this);  }); //buttonClicked(this); } );
        </script>

      </div>
      <canvas width="279px" height="250px" id="diffview_cnvs"></canvas>
        <button id="submit" type="submit" name="save" onclick="test_submitted();" value="Save"><img src = "img/submit-button2.png" width = "80px"></button>
        <button id = "skip" type = "submit" name = "skip" onclick = "test_skip();" value = "Skip"><img src = "img/skip.png" width = "80px"></button>
        <a href="gp_instr_new/instr.htm" id="open_instr" onclick="open_instr()" class="button2">Instructions</a><br>
    </div>
  </div>

  <div id = "icon_wrapper" >
    <span style="font-size:20px"><b>BOX Selection:</b></span> Select the object to edit. Double-click button to change name.<br>
    <div id ="icon_container">
      <button id = "GP" class = "gp_icon" value= "Groundplane"><font size=3><b>Groundplane</b></font></button>
    </div>
  </div>
  <form><input type="checkbox" checked="yes" name="zoom_checkbox" id="zoom_checkbox" value="zoom" style = "visibility:hidden;" onclick="toggle_zoom();"></input></form>
  <div style="display:none">
    <div id="inline_content_box">
    </div>
  </div>
</body>
</html>
