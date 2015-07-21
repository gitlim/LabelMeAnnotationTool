function mkThreeDPopup(left, top){
	wait_for_input = 1;
  var innerHTML = GetThreeDPopupFormDraw();
  CreatePopupBubble(left,top,innerHTML,'main_section');

  // Focus the cursor inside the box
  setTimeout("$('#objEnter').focus();",1);
}

function mkThreeDEditPopup(left, top, anno){
  edit_popup_open = 1;
  var innerHTML = GetThreeDPopupFormEdit(anno);
  var dom_bubble = CreatePopupBubble(left,top,innerHTML,'main_section');
  CreatePopupBubbleCloseButton(dom_bubble,StopThreeDEditEvent);

  // Focus the cursor inside the box
  $('#objEnter').select();
  $('#objEnter').focus();
}

function GetThreeDPopupFormDraw(){
	wait_for_input = 1;
  html_str = "<b>Enter name object or plane</b><br />";
  html_str += HTMLobjectBox("");
  
  if(use_attributes) {
    html_str += HTMLoccludedBox("");
    html_str += "<b>Enter attributes</b><br />";
    html_str += HTMLattributesBox("");
  }
  if(use_parts) {
    html_str += HTMLpartsBox("");
  }
  html_str += "<br />";
  
  // Done button:
  html_str += '<input type="button" value="Done" title="Press this button after you have provided all the information you want about the object." onclick="main_threed_handler.SubmitQuery(); " tabindex="0" />';
  
  // Delete button:
  html_str += '<input type="button" value="Delete" title="Press this button if you wish to delete the polygon." onclick="main_threed_handler.DeleteButton();" tabindex="0" />';
  
  return html_str;
}

function GetThreeDPopupFormEdit(anno){
  edit_popup_open =  1;
  var obj_name = LMgetObjectField(LM_xml,anno.anno_id,'name');
  if(obj_name=="") obj_name = "?";
  var attributes = LMgetObjectField(LM_xml,anno.anno_id,'attributes');
  var occluded = LMgetObjectField(LM_xml,anno.anno_id,'occluded');
  var parts = LMgetObjectField(LM_xml, anno.anno_id, 'parts');
  
  html_str = "<b>Enter object name</b><br />";
  html_str += HTMLobjectBox(obj_name);
  
  if(use_attributes) {
    html_str += HTMLoccludedBox(occluded);
    html_str += "<b>Enter attributes</b><br />";
    html_str += HTMLattributesBox(attributes);
  }
  
  if(use_parts) {
    html_str += HTMLpartsBox(parts);
  }
  
  html_str += "<br />";
  
  // Done button:
  
  html_str += '<input type="button" value="Done" title="Press this button when you are done editing." onclick="main_threed_handler.SubmitEditLabel();" tabindex="0" />';

  // Delete button:
  html_str += '<input type="button" value="Delete" title="Press this button if you wish to delete the polygon." onclick="main_threed_handler.EditBubbleDeleteButton();" tabindex="0" />';
  
  return html_str;
}

function StopThreeDEditEvent() {
  // Update the global variables for the active canvas and edit popup bubble:

  active_canvas = REST_CANVAS;
  edit_popup_open = 0;
  // Move select_canvas to back:
  $('#select_canvas').css('z-index','-2');
  $('#select_canvas_div').css('z-index','-2');
  
  // Remove polygon from the select canvas:
  if (!video_mode) select_anno.DeletePolygon();
  else $('#'+select_anno.polygon_id).remove();
  var anno = select_anno;
  select_anno = null;

  // Write logfile message:
  WriteLogMsg('*Closed_Edit_Popup');

  // Close the edit popup bubble:
  CloseEditPopup();
  // Turn on the image scrollbars:
  main_media.ScrollbarsOn();

  // If the annotation is not deleted or we are in "view deleted" mode, 
  // then attach the annotation to the main_canvas:
  if(!LMgetObjectField(LM_xml, anno.anno_id, 'deleted') || view_Deleted) {
    
    main_canvas.AttachAnnotation(anno);
    if(!anno.hidden) {
      anno.RenderAnnotation('rest');
    }
    if (video_mode){
      oVP.DisplayFrame(oVP.getcurrentFrame());
    }
  }

  // Render the object list:
  if(view_ObjList) {
    RenderObjectList();
  }
  if (window.select){
        document.getElementById('Link'+window.select.ID).style.color = '#FF0000';
  }
  console.log('LabelMe: Stopped edit event.');
}