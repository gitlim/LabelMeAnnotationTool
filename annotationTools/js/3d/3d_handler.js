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
			html_str += '<type>';
			html_str += 'plane';
			html_str += '</type>';
			html_str += '<plane>';
			html_str += '<lines>';
			for (var i = 0; i < vp_s.length; i++){
				html_str += '<vp_line>';
				html_str += '<x1>' + vp_s[i].x2d[0] + '</x1>';
				html_str += '<y1>' + vp_s[i].y2d[0] + '</y1>';
				html_str += '<x2>' + vp_s[i].x2d[1] + '</x2>';
				html_str += '<y2>' + vp_s[i].y2d[1] + '</y2>';
				html_str += '<label>' + vp_label[i] + '</label>';
				html_str += '</vp_line>';
			}
			html_str += '</lines>';
			html_str += '<plane_matrix>';
			for (var i = 0; i < K.length; i++){
				html_str += K[i] + ' ';
			}
			html_str += '</plane_matrix>';
			html_str += '<focal_length>' + f + '</focal_length>';
			html_str += '</plane>';
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
		console.log(a);
		hover_object = ID_dict[a];
		this.ThreeDToFore();
		document.getElementById('Link'+a).style.color = '#FF0000';
		ThreeDHoverHighlight(hover_object);
	};

	this.AnnotationLinkMouseOut = function(){
		if (hover_object != window.select){
			document.getElementById('Link'+hover_object.ID).style.color = '#0000FF';
			ThreeDHoverHighlight();
			hover_object = null;
		}
	};

	this.SelectObject = function(idx){
		HideAllPolygons();
		this.ThreeDToFore();
		window.select = ID_dict[idx];
		//p_plane.material.visible = false;
        if (ID_dict[idx].cube){
        	for (var i = 0; i < stage.children.length; i++) {
	            stage.children[i].hide();
	        }
	        toggle_cube_move_indicators(true);
	        toggle_cube_rotate_indicators(true);
	        toggle_cube_resize_arrows(true);
	    }
       	HighlightSelectedThreeDObject();
	  	document.getElementById('Link'+idx).style.color = '#FF0000';
	  	render();
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
		select_anno = main_canvas.annotations[idx];

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

	this.CreateGroundplane = function(){//for creation of the first plane (groundplane)
		var numItems = $(LM_xml).children('annotation').children('object').length;
		console.log($(LM_xml));
	    threed_anno = new annotation(numItems);
	    threed_anno.SetType(3);
	    object_list.push(new object_instance);
	    window.select = object_list[object_list.length-1];//window.select is now the new object
	    window.select.ID = numItems; // making the 3d objects ID in sync with LabelMe system
	    ID_dict[window.select.ID] = window.select;
	    window.select.plane = plane; // setting up the groundplane

		var anno;
		edit_popup_open = 0;
		anno = threed_anno;


		// Update old and new object names for logfile:
		
		submission_edited = 0;
		global_count++;
		
		// Insert data for server logfile:
		//InsertServerLogData('cpts_not_modified');
		
		// Insert data into XML:
		var html_str = '<object>';
		html_str += '<name>' + "groundplane" + '</name>';
		html_str += '<deleted>0</deleted>';
		html_str += '<verified>0</verified>';
		html_str += '<parts><hasparts></hasparts><ispartof></ispartof></parts>';
		var ts = GetTimeStamp();
		if(ts.length==20) html_str += '<date>' + ts + '</date>';
		html_str += '<id>' + anno.anno_id + '</id>';
		html_str += '<type>';
		html_str += 'plane';
		html_str += '</type>';
		html_str += '<plane>';
		html_str += '<lines>';
		for (var i = 0; i < vp_s.length; i++){
			html_str += '<vp_line>';
			html_str += '<x1>' + vp_s[i].x2d[0] + '</x1>';
			html_str += '<y1>' + vp_s[i].y2d[0] + '</y1>';
			html_str += '<x2>' + vp_s[i].x2d[1] + '</x2>';
			html_str += '<y2>' + vp_s[i].y2d[1] + '</y2>';
			html_str += '<label>' + vp_label[i] + '</label>';
			html_str += '</vp_line>';
		}
		html_str += '</lines>';
		html_str += '<plane_matrix>';
		for (var i = 0; i < K.length; i++){
			html_str += K[i] + ' ';
		}
		html_str += '</plane_matrix>';
		html_str += '<focal_length>' + f + '</focal_length>';
		html_str += '</plane>';
		html_str += '</object>';
		$(LM_xml).children("annotation").append($(html_str));

		main_canvas.AttachAnnotation(anno);

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

	this.PlaneAutoSave = function(){
		if (!(hover_object)){
			var index = window.select.ID;
		}else{
			return;
		}
		var lines = "";
		for (var i = 0; i < vp_s.length; i++){
				lines += '<vp_line>';
				lines += '<x1>' + vp_s[i].x2d[0] + '</x1>';
				lines += '<y1>' + vp_s[i].y2d[0] + '</y1>';
				lines += '<x2>' + vp_s[i].x2d[1] + '</x2>';
				lines += '<y2>' + vp_s[i].y2d[1] + '</y2>';
				lines += '<label>' + vp_label[i] + '</label>';
				lines += '</vp_line>';
		}
		LMsetObjectField(LM_xml, index, 'lines', lines);
		var matrix = "";
		for (var i = 0; i < K.length; i++){
				matrix += K[i] + ' ';
			}
		LMsetObjectField(LM_xml, index, 'plane_matrix', matrix);
		LMsetObjectField(LM_xml, index, 'focal_length', f);
	};

	this.LoadDifferentPlane = function(idx){
		vp_layer.removeChildren(); // purges all previous lines
		K = LMgetObjectField(LM_xml, idx, 'plane_matrix');
		rerender_plane(K);
		lines_array = LMgetObjectField(LM_xml, idx, 'lines');
		vp_label = [];
		vp_s = [];
		for (var i = 0; i < lines_array.length; i+=5){
			var new_line = new VP_s();
			vp_label.push(lines_array[i+4]);
			new_line.x2d[0] = lines_array[i];
	        new_line.y2d[0] = lines_array[i+1];
	        new_line.x2d[1] = lines_array[i+2];
	        new_line.y2d[1] = lines_array[i+3];
	        vp_s.push(new_line);
	        addVPline(vp_label.length-1, vp_layer);
		}
		f = LMgetObjectField(LM_xml, idx, 'focal_length');
		stage.draw();
		render();
	};
}