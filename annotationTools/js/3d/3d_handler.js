var THREED_CANVAS = 5; // this actually should consist of both the kineticjs and threejs canvases in the div container.

function threed_handler(){

	this.SubmitQuery = function(){
		var nn; // this is the name
		var anno;
		edit_popup_open = 0;
		// If the attributes are active, read the fields.
		if (use_attributes) {
			// get attributes (is the field exists)
			if(document.getElementById('attributes')) new_attributes = RemoveSpecialChars(document.getElementById('attributes').value);
			else new_attributes = "";
		
			// get occlusion field (is the field exists)
			if (document.getElementById('occluded')) new_occluded = RemoveSpecialChars(document.getElementById('occluded').value);
			else new_occluded = "";
		}
			
		if((object_choices!='...') && (object_choices.length==1)) {
			nn = RemoveSpecialChars(object_choices[0]);
			var re = /[a-zA-Z0-9]/;
			if(!re.test(nn)) {
				alert('Please enter an object name');
				return;
			}
		}else{
			nn = RemoveSpecialChars(document.getElementById('objEnter').value);
			this.ThreeDToFore();
		}
			
		anno = threed_anno;
		// Update old and new object names for logfile:
		new_name = nn;
		old_name = nn;
		
		submission_edited = 0;
		global_count++;
		
		// Insert data for server logfile:
		InsertServerLogData('cpts_not_modified');
		
		// Insert data into XML:
		var html_str = '<object>';
		html_str += '<name>' + new_name + '</name>';
		html_str += '<deleted>0</deleted>';
		html_str += '<verified>0</verified>';
		if(use_attributes) {
			html_str += '<occluded>' + new_occluded + '</occluded>';
			html_str += '<attributes>' + new_attributes + '</attributes>';
		}
		html_str += '<parts><hasparts></hasparts><ispartof></ispartof></parts>';
		var ts = GetTimeStamp();
		if(ts.length==20) html_str += '<date>' + ts + '</date>';
		html_str += '<id>' + anno.anno_id + '</id>';
		if(anno.GetType() == 2) {//for planes
			html_str += '<type>'
			html_str += 'plane';
			html_str += '</type>'
			html_str += '<segm>';
			html_str += '<username>' + username + '</username>';
			
			html_str += '<box>';
			html_str += '<xmin>' + scribble_canvas.object_corners[0] + '</xmin>'; 
			html_str += '<ymin>' + scribble_canvas.object_corners[1] + '</ymin>';
			html_str += '<xmax>' + scribble_canvas.object_corners[2] + '</xmax>'; 
			html_str += '<ymax>' + scribble_canvas.object_corners[3] + '</ymax>';
			html_str += '</box>';
			
			html_str += '<mask>'+ scribble_canvas.image_name +'</mask>';
			
			html_str += '<scribbles>';
			html_str += '<xmin>' + scribble_canvas.image_corners[0] + '</xmin>'; 
			html_str += '<ymin>' + scribble_canvas.image_corners[1] + '</ymin>';
			html_str += '<xmax>' + scribble_canvas.image_corners[2] + '</xmax>'; 
			html_str += '<ymax>' + scribble_canvas.image_corners[3] + '</ymax>';
			html_str += '<scribble_name>'+ scribble_canvas.scribble_name +'</scribble_name>'; 
			html_str += '</scribbles>';
			
			html_str += '</segm>';
			html_str += '</object>';
			$(LM_xml).children("annotation").append($(html_str));

		}else {//for cubes
			html_str += '<type>'
			html_str += 'box';
			html_str += '</type>'
			html_str += '<polygon>';
			html_str += '<username>' + username + '</username>';
			html_str += '</polygon>';
			html_str += '</object>';
			$(LM_xml).children("annotation").append($(html_str));
		}
		 CloseQueryPopup();

		if(!LMgetObjectField(LM_xml, LMnumberOfObjects(LM_xml)-1, 'deleted') ||view_Deleted) {
			main_canvas.AttachAnnotation(anno);
		}
		// Write XML to server:
		WriteXML(SubmitXmlUrl,LM_xml,function(){return;});
			
		if(view_ObjList) RenderObjectList();
		this.SelectObject(threed_anno.anno_id);

		var m = main_media.GetFileInfo().GetMode();
		if(m=='mt') {
			document.getElementById('object_name').value=new_name;
			document.getElementById('number_objects').value=global_count;
			document.getElementById('LMurl').value = LMbaseurl + '?collection=LabelMe&mode=i&folder=' + main_media.GetFileInfo().GetDirName() + '&image=' + main_media.GetFileInfo().GetImName();
		if(global_count >= mt_N) document.getElementById('mt_submit').disabled=false;
		}
	};

	this.ThreeDToFore = function(){
		document.getElementById('query_canvas').style.zIndex = -2;
		document.getElementById('query_canvas_div').style.zIndex = -2;
		document.getElementById('select_canvas').style.zIndex = -2;
		document.getElementById('select_canvas_div').style.zIndex = -2;
		document.getElementById('draw_canvas').style.zIndex = -2;
		document.getElementById('draw_canvas_div').style.zIndex = -2;
		document.getElementById('container').style.zIndex = 1;
		document.getElementById('container').style.display = "block";
		document.getElementById('cnvs').style.display = "block";

	};

	this.ThreeDToBack = function(){

	};

	this.DeleteButton = function(){
		remove_box_internal(ID_dict[threed_anno.GetAnnoID()]);
		var idx = threed_anno.GetAnnoID();

		if((IsUserAnonymous() || (!IsCreator(LMgetObjectField(LM_xml, idx, 'username')))) && (!IsUserAdmin()) && (idx<num_orig_anno) && !action_DeleteExistingObjects) {
				alert('You do not have permission to delete this polygon');
				return;
		}
		
		if(idx>=num_orig_anno) {
				global_count--;
				
		}
		
		submission_edited = 0;
		
		// Insert data for server logfile:
		old_name = LMgetObjectField(LM_xml,threed_anno.anno_id,'name');
		new_name = old_name;
		WriteLogMsg('*Deleting_object');
		InsertServerLogData('cpts_not_modified');
		
		// Set <deleted> in LM_xml:
		LMsetObjectField(LM_xml, idx, "deleted", "1");
		
		// Remove all the part dependencies for the deleted object
		removeAllParts(idx);
		
		// Write XML to server:
		WriteXML(SubmitXmlUrl,LM_xml,function(){return;});
		threed_anno = null;
		if(view_ObjList) RenderObjectList();
		CloseQueryPopup();
	};

	this.AnnotationLinkClick = function(idx){
		if ((window.select) && idx == window.select.ID){
			this.ThreeDAnnotationEdit(idx);
		}else{
			RenderObjectList();
			this.SelectObject(idx);
		}
	};

	this.AnnotationLinkMouseOver = function(a){
		hover_object = ID_dict[a];
		this.ThreeDToFore();
		document.getElementById('Link'+a).style.color = '#FF0000';
		ThreeDHoverHighlight(hover_object);
	};

	this.AnnotationLinkMouseOut = function(){
		if (hover_object != window.select) document.getElementById('Link'+hover_object.ID).style.color = '#0000FF';
		//needs something that sets canvases as they were before
		ThreeDHoverHighlight();
		hover_object = null;
	};

	this.SelectObject = function(idx){
		HideAllPolygons();
		this.ThreeDToFore();
		window.select = ID_dict[idx];
		gp_plane.material.visible = false;
        for (var i = 0; i < stage.children.length; i++) {
            stage.children[i].hide();
        }
        toggle_cube_move_indicators(true);
        toggle_cube_rotate_indicators(true);
        toggle_cube_resize_arrows(true);
        HighlightSelectedThreeDObject();
	  	document.getElementById('Link'+idx).style.color = '#FF0000';
	};

	this.ThreeDAnnotationEdit = function(idx){
		anno_id = idx;
		console.log('LabelMe: Starting edit event...');
	  if((IsUserAnonymous() || (!IsCreator(LMgetObjectField(LM_xml, anno_id, 'username')))) && (!IsUserAdmin()) && (anno_id<num_orig_anno) && !action_RenameExistingObjects && !action_ModifyControlExistingObjects && !action_DeleteExistingObjects) {
	    PermissionError();
	    return;
	  }
	  active_canvas = SELECTED_CANVAS;
	  edit_popup_open = 1;
	  
	  // Turn off automatic flag and write to XML file:
	  if(LMgetObjectField(LM_xml, anno_id, 'automatic')) {
	    // Insert data for server logfile:
	    var anid = main_canvas.GetAnnoIndex(anno_id);
	    old_name = LMgetObjectField(LM_xml,main_canvas.annotations[anid].anno_id,'name');
	    new_name = old_name;
	    InsertServerLogData('cpts_not_modified');
	    
	    // Set <automatic> in XML:
	    LMsetObjectField(LM_xml, anno_id, 'automatic', '0');
	    
	    // Write XML to server:
	    WriteXML(SubmitXmlUrl,LM_xml,function(){return;});
	  }
	  
	  // Move select_canvas to front:
	  $('#select_canvas').css('z-index','0');
	  $('#select_canvas_div').css('z-index','0');
	  //var anno = main_canvas.DetachAnnotation(anno_id);
	  var anno = main_canvas.annotations[anno_id];
	  
	  editedControlPoints = 0;
	    
	  if(username_flag) submit_username();
	  
	  select_anno = anno;
	  select_anno.SetDivAttach('select_canvas');
	  
	  // Make edit popup appear.
	  main_media.ScrollbarsOff();
	  if(LMgetObjectField(LM_xml, anno.anno_id, 'verified')) {
	    edit_popup_open = 1;
	    var innerHTML = "<b>This annotation has been blocked.</b><br />";
	    var dom_bubble = CreatePopupBubble(pt[0],pt[1],innerHTML,'main_section');
	    CreatePopupBubbleCloseButton(dom_bubble,StopEditEvent);
	  }
	  else {
	    // Popup edit bubble:
	    WriteLogMsg('*Opened_Edit_Popup');
	    mkThreeDEditPopup(1,1,anno);
	    
	  }
	};
	this.SubmitEditLabel = function(){
		submission_edited = 1;
		var anno = select_anno;
			
		// object name
		old_name = LMgetObjectField(LM_xml,anno.anno_id,'name');
		if(document.getElementById('objEnter')) new_name = RemoveSpecialChars(document.getElementById('objEnter').value);
		else new_name = RemoveSpecialChars(adjust_objEnter);
		
		var re = /[a-zA-Z0-9]/;
		if(!re.test(new_name)) {
		alert('Please enter an object name');
		return;
		}
			
		if (use_attributes) {
	// occlusion field
		if (document.getElementById('occluded')) new_occluded = RemoveSpecialChars(document.getElementById('occluded').value);
		else new_occluded = RemoveSpecialChars(adjust_occluded);
	
		// attributes field
		if(document.getElementById('attributes')) new_attributes = RemoveSpecialChars(document.getElementById('attributes').value);
		else new_attributes = RemoveSpecialChars(adjust_attributes);
			}
			
			StopEditEvent();
			
		// Insert data to write to logfile:
		if(editedControlPoints) InsertServerLogData('cpts_modified');
		else InsertServerLogData('cpts_not_modified');
		
		// Object index:
		var obj_ndx = anno.anno_id;
		
		// Pointer to object:
		
		// Set fields:
		LMsetObjectField(LM_xml, obj_ndx, "name", new_name);
		LMsetObjectField(LM_xml, obj_ndx, "automatic", "0");
		
		// Insert attributes (and create field if it is not there):
		LMsetObjectField(LM_xml, obj_ndx, "attributes", new_attributes);
			
		
		LMsetObjectField(LM_xml, obj_ndx, "occluded", new_occluded);
		
		// Write XML to server:
		WriteXML(SubmitXmlUrl,LM_xml,function(){return;});
		
		// Refresh object list:
		if(view_ObjList) {
		RenderObjectList();
		}
	};
	this.EditBubbleDeleteButton = function(){
		var idx = window.select.ID;

		if((IsUserAnonymous() || (!IsCreator(LMgetObjectField(LM_xml, idx, 'username')))) && (!IsUserAdmin()) && (idx<num_orig_anno) && !action_DeleteExistingObjects) {
				alert('You do not have permission to delete this polygon');
				return;
		}
		
		if(idx>=num_orig_anno) {
				global_count--;
		}
		
		submission_edited = 0;
		
		// Insert data for server logfile:
		old_name = LMgetObjectField(LM_xml,window.select.ID,'name');
		new_name = old_name;
		WriteLogMsg('*Deleting_object');
		InsertServerLogData('cpts_not_modified');
		
		// Set <deleted> in LM_xml:
		LMsetObjectField(LM_xml, idx, "deleted", "1");

		remove_box_internal(window.select);
		
		// Remove all the part dependencies for the deleted object
		removeAllParts(idx);
		
		// Write XML to server:
		WriteXML(SubmitXmlUrl,LM_xml,function(){return;});

// Refresh object list:
		if(view_ObjList) RenderObjectList();
		selected_poly = -1;
		unselectObjects(); // Perhaps this should go elsewhere...
		StopEditEvent();
	};
}