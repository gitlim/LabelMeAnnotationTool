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
			var scale_factor = document.getElementById("im").width/document.getElementById("im").naturalWidth;
			html_str += '<type>';
			html_str += 'plane';
			html_str += '</type>';
			html_str += '<plane>';
			html_str += '<lines>';
			for (var i = 0; i < vp_s.length; i++){
				html_str += '<vp_line>';
				html_str += '<x1>' + vp_s[i].x2d[0]/scale_factor + '</x1>';
				html_str += '<y1>' + vp_s[i].y2d[0]/scale_factor + '</y1>';
				html_str += '<x2>' + vp_s[i].x2d[1]/scale_factor + '</x2>';
				html_str += '<y2>' + vp_s[i].y2d[1]/scale_factor + '</y2>';
				html_str += '<label>' + vp_label[i] + '</label>';
				html_str += '</vp_line>';
			}
			html_str += '</lines>';
			//html_str += '<op_points>' + op_x + ' ' + op_y + ' ' + '</op_points>';
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
			var scale = '';
			var position = '';
			html_str += '<type>';
			html_str += 'box';
			html_str += '</type>';
			html_str += '<cube>';
			html_str += '<cube_matrix>';
			for (var i = 0; i < window.select.cube.matrixWorld.elements.length; i++){
				html_str += window.select.cube.matrixWorld.elements[i] + ' ';
			}
			html_str += '</cube_matrix>';
			html_str += '<cube_position>';
			var position_vector = new THREE.Vector3(0, 0, 0).applyMatrix4(window.select.cube.matrixWorld.clone());
			var position = position_vector.x + ' ' + position_vector.y + ' ' + position_vector.z;
			html_str += position + '</cube_position>';
			html_str += '<cube_rotation>' + window.select.cube.rotation.z + '</cube_rotation>';
			var scale = window.select.cube.scale.x*small_w + ' ' + window.select.cube.scale.y*small_w + ' ' + window.select.cube.scale.z*small_w;
			html_str += '<cube_scale>' + scale + '</cube_scale>';
			html_str += '</cube>';
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
		if (!(window.select.cube)) update_plane();
		render();
	};

	this.ThreeDToFore = function(){
		document.getElementById('query_canvas').style.zIndex = -2;
		document.getElementById('query_canvas_div').style.zIndex = -2;
		document.getElementById('select_canvas').style.zIndex = -2;
		document.getElementById('select_canvas_div').style.zIndex = -2;
		document.getElementById('draw_canvas').style.zIndex = -2;
		document.getElementById('draw_canvas_div').style.zIndex = -2;
		document.getElementById('container').style.zIndex = 2;
		document.getElementById('container').style.display = "block";
		document.getElementById('cnvs').style.display = "block";
		document.getElementById('boxCanvas').style.display = "block";


	};

	this.GotoFirstAnnoObject = function(){
		var anno_type = main_canvas.annotations[0].GetType();
		if (anno_type == 2 || anno_type == 3){
			this.SelectObject(0);
		}else{
			SetPolygonDrawingMode(false);
		}
	};

	this.DeleteButton = function(){
		remove_object_internal(ID_dict[threed_anno.GetAnnoID()]);
		var idx = threed_anno.GetAnnoID();

		main_canvas.DetachAnnotation(idx)

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
		CloseQueryPopup();
	};

	this.AnnotationLinkClick = function(idx){
		if (edit_popup_open){
			alert("You must close the current popup");
			return;
		}
		if (nav_on){
			alert("You must exit navigation mode before selecting another object");
			return;
		}
		if ((window.select) && idx == window.select.ID){
			select_anno = main_canvas.GetAnnoByID(idx);
			this.ThreeDAnnotationEdit(idx);
		}else{
			if (!(wait_for_input) && !(edit_popup_open)){
			RenderObjectList();
			this.SelectObject(idx);
			SetDrawingMode(2);
			}else{
				alert("You must close the edit popup first.");
			}
		}
		hover_object = null;
		ShowThreeD();
		document.getElementById('Link'+idx).style.color = '#FF0000';
	};

	this.AnnotationLinkMouseOver = function(a){
		if (nav_on){
			alert("You cannot edit 3D objects while in navigation mode");
			return;
		}
		if (edit_popup_open){
			return;
		}
		console.log(a);
		HideAllPolygons();
		hover_object = ID_dict[a];
		//ShowThreeD();
		this.ThreeDToFore();//for some reason renderobjectlist here makes clicking on the link not work, so doing workaround
		$('#show_threed_button').replaceWith('<a id="hide_threed_button" href="javascript:HideThreeD();">Hide 3D objects</a>');
		IsHidingAllThreeD = false;
		var idx = a;
		var parent = LMgetObjectField(LM_xml, idx, 'ispartof');
		while (!isNaN(parent) && main_canvas.GetAnnoByID(parent).GetType() != 0 && main_canvas.GetAnnoByID(parent).GetType() != 1){
			idx = LMgetObjectField(LM_xml, idx, 'ispartof');
			parent = LMgetObjectField(LM_xml, idx, 'ispartof');
		}
		console.log(idx);
		if (!isNaN(LMgetObjectField(LM_xml, idx, "ispartof"))){
			if (window.select != hover_object){
				CreatePolygonClip(LMgetObjectField(LM_xml, idx, "ispartof"));
				toggle_cube_resize_arrows(false);
	            toggle_cube_move_indicators(false);
	            toggle_cube_rotate_indicators(false);
			}
		/*}else if (ID_dict[a].hparent != "unassigned" && !isNaN(LMgetObjectField(LM_xml, ID_dict[a].hparent.ID, "ispartof"))){
			if (window.select != hover_object){
				CreatePolygonClip(LMgetObjectField(LM_xml, ID_dict[a].hparent.ID, "ispartof"));
				toggle_cube_resize_arrows(false);
                toggle_cube_move_indicators(false);
                toggle_cube_rotate_indicators(false);
			}*/
		}else{
			ClearCanvas();
		}
		ThreeDHoverHighlight(hover_object);
		//RenderObjectList();
		document.getElementById('Link'+a).style.color = '#FF0000';
	};

	this.AnnotationLinkMouseOut = function(){
		if (hover_object != window.select){
			document.getElementById('Link'+hover_object.ID).style.color = '#0000FF';
			/*if (LMgetObjectField(LM_xml, hover_object.ID, "ispartof") && main_canvas.GetAnnoByID(hover_object.ID).GetType() == 2){
				ClearCanvas();
			}*/
		}
		if (hover_object == window.select){
			hover_object = null;
			return;
		}else if (window.select && !isNaN(LMgetObjectField(LM_xml, window.select.ID, "ispartof")) && window.select.hparent == "unassigned"){
            CreatePolygonClip(LMgetObjectField(LM_xml, window.select.ID, "ispartof"));
        }else if (window.select){
        	if (window.select.hparent != "unassigned" && !isNaN(LMgetObjectField(LM_xml, window.select.hparent.ID, "ispartof"))){
        		CreatePolygonClip(LMgetObjectField(LM_xml, window.select.hparent.ID, "ispartof"));
        	}else{
        		ClearCanvas();
        	}
        }
		hover_object = null;
		ThreeDHoverHighlight();
		if (drawing_mode == 0 || drawing_mode == 1){
			$("#container").css('display', 'none');
	        $("#cnvs").css('display', 'none');	        
	        $("#boxCanvas").css('display', 'none');
	        $("#container").css('z-index', '-3');
	        ShowAllPolygons();
		}
		if (window.select){
			document.getElementById('Link'+window.select.ID).style.color = '#FF0000';
		}
	};

	this.SelectObject = function(idx){
		SetDrawingMode(2);
		//HideAllPolygons();
		//this.ThreeDToFore();
		window.select = ID_dict[idx];
		//p_plane.material.visible = false;
        if (ID_dict[idx].cube){
        	for (var i = 0; i < stage.children.length; i++) {
	            stage.children[i].hide();
	        }
	        toggle_cube_move_indicators(true);
	        toggle_cube_rotate_indicators(true);
	        toggle_cube_resize_arrows(true);
	        setup_arrowheads_rescaling();
	        arrow_box_position = null;
	    	indicator_box_position = null;
	    	if (window.select.hparent != "unassigned") check_plane_box_collision();
	    }else{
	    	this.LoadDifferentPlane(idx);
	    }
       	HighlightSelectedThreeDObject();
	  	document.getElementById('Link'+idx).style.color = '#FF0000';
	  	if (object_list.length && ((window.select.hparent != "unassigned") || (!window.select.cube))) {
        	for (var i = 0; i < intersect_box.children.length; i++){
            	intersect_box.children[i].material.visible = true;
        	}
  	  	}else{
        	for (var i = 0; i < intersect_box.children.length; i++){
            	intersect_box.children[i].material.visible = false;
        	}
    	}
    	check_plane_box_collision();
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
	    LMsetObjectField(LM_xml, anid, 'automatic', '0');
	    
	    // Write XML to server:
	    WriteXML(SubmitXmlUrl,LM_xml,function(){return;});
	  }
	  
	  // Move select_canvas to front:
	  $('#select_canvas').css('z-index','0');
	  $('#select_canvas_div').css('z-index','0');
	  //var anno = main_canvas.DetachAnnotation(anno_id);
	  var anno = main_canvas.GetAnnoByID(anno_id);
	  
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
		document.getElementById('Link'+ anno.anno_id).style.color = '#FF0000';
		}

	};
	this.EditBubbleDeleteButton = function(){
		if (window.select.plane == plane){
			alert("You cannot remove the groundplane");
			return;
		}
		var idx = window.select.ID;
		select_anno = main_canvas.annotations[idx];

		main_canvas.DetachAnnotation(idx)

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

		remove_object_internal(window.select);
		
		// Remove all the part dependencies for the deleted object
		removeAllParts(idx);
		
		// Write XML to server:
		WriteXML(SubmitXmlUrl,LM_xml,function(){return;});

// Refresh object list:
		selected_poly = -1;
		unselectObjects(); // Perhaps this should go elsewhere...
		StopEditEvent();
		document.getElementById('Link'+0).style.color = '#FF0000';

	};

	this.CreateGroundplane = function(){//for creation of the first plane (groundplane)
		console.log("create groundplane");
		var numItems = $(LM_xml).children('annotation').children('object').length;
		var scale_factor = document.getElementById("im").width/document.getElementById("im").naturalWidth;
		console.log($(LM_xml));
	    threed_anno = new annotation(numItems);
	    threed_anno.SetType(2);
	    object_list.push(new object_instance);
	    window.select = object_list[object_list.length-1];//window.select is now the new object
	    window.select.ID = numItems; // making the 3d objects ID in sync with LabelMe system
	    groundplane_id = window.select.ID;
	    ID_dict[window.select.ID] = window.select;
	    window.select.plane = plane; // setting up the groundplane
	    scene.add(window.select.plane);
		var anno;
		edit_popup_open = 0;
		anno = threed_anno;
		op_y = document.getElementById("im").height/2;
		update_plane();
		console.log(K);
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
			html_str += '<x1>' + vp_s[i].x2d[0]/scale_factor + '</x1>';
			html_str += '<y1>' + vp_s[i].y2d[0]/scale_factor + '</y1>';
			html_str += '<x2>' + vp_s[i].x2d[1]/scale_factor + '</x2>';
			html_str += '<y2>' + vp_s[i].y2d[1]/scale_factor + '</y2>';
			html_str += '<label>' + vp_label[i] + '</label>';
			html_str += '</vp_line>';
		}
		html_str += '</lines>';
		//html_str += '<op_points>' + op_x + ' ' + op_y + '</op_points>';
		html_str += '<plane_matrix>';
		for (var i = 0; i < window.select.plane.matrixWorld.elements.length; i++){
			html_str += window.select.plane.matrixWorld.elements[i] + ' ';
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
		this.SelectObject(window.select.ID);

		var m = main_media.GetFileInfo().GetMode();
		if(m=='mt') {
			document.getElementById('object_name').value=new_name;
			document.getElementById('number_objects').value=global_count;
			document.getElementById('LMurl').value = LMbaseurl + '?collection=LabelMe&mode=i&folder=' + main_media.GetFileInfo().GetDirName() + '&image=' + main_media.GetFileInfo().GetImName();
		if(global_count >= mt_N) document.getElementById('mt_submit').disabled=false;
		}
		this.PlaneAutoSave(window.select.ID);
		render();
	};

	this.PlaneAutoSave = function(index){
		if (!(hover_object)){
			if (index == null){
				var index = window.select.ID;
			}
		}else{
			return;
		}
		var scale_factor = document.getElementById("im").width/document.getElementById("im").naturalWidth;
		var lines = "";
		for (var i = 0; i < vp_s.length; i++){
				lines += '<vp_line>';
				lines += '<x1>' + vp_s[i].x2d[0]/scale_factor + '</x1>';
				lines += '<y1>' + vp_s[i].y2d[0]/scale_factor + '</y1>';
				lines += '<x2>' + vp_s[i].x2d[1]/scale_factor + '</x2>';
				lines += '<y2>' + vp_s[i].y2d[1]/scale_factor + '</y2>';
				lines += '<label>' + vp_label[i] + '</label>';
				lines += '</vp_line>';
		}
		LMsetObjectField(LM_xml, index, 'lines', lines);
		/*var op_points = '';
		op_points = op_x + ' ' + op_y;
		LMsetObjectField(LM_xml, index, 'op_points', op_points);*/
		var matrix = "";
		for (var i = 0; i < ID_dict[index].plane.matrixWorld.elements.length; i++){
				matrix += ID_dict[index].plane.matrixWorld.elements[i] + ' ';
			}
		LMsetObjectField(LM_xml, index, 'plane_matrix', matrix);
		LMsetObjectField(LM_xml, index, 'focal_length', f);

	    WriteXML(SubmitXmlUrl,LM_xml,function(){return;});
	    console.log("done saving");
	};

	this.LoadDifferentPlane = function(idx){
		vp_layer.removeChildren(); // purges all previous lines
		var L = LMgetObjectField(LM_xml, idx, 'plane_matrix');
		var scale_factor = document.getElementById("im").width/document.getElementById("im").naturalWidth;
		lines_array = LMgetObjectField(LM_xml, idx, 'lines');
		/*var op_points = LMgetObjectField(LM_xml, idx, 'op_points');
		op_x = op_points[0];
		op_y = op_points[1];*/
		vp_label = [];
		vp_s = [];
		for (var i = 0; i < lines_array.length; i+=5){
			var new_line = new VP_s();
			vp_label.push(lines_array[i+4]);
			new_line.x2d[0] = lines_array[i]*scale_factor;
	        new_line.y2d[0] = lines_array[i+1]*scale_factor;
	        new_line.x2d[1] = lines_array[i+2]*scale_factor;
	        new_line.y2d[1] = lines_array[i+3]*scale_factor;
	        vp_s.push(new_line);
	        addVPline(vp_label.length-1, vp_layer);
		}
		f = LMgetObjectField(LM_xml, idx, 'focal_length');
		//var op_circle = stage.find('.op_circle')[0];
		/*op_circle.setX(op_x);
		op_circle.setY(op_y);*/
		CalculateAxis(idx);
		CalculateNewOpY(L);
		update_plane();
		rerender_plane(L);
		//update_plane();
		height_transform = L[13];
		horizontal_transform = L[12];
		vertical_transform = L[14];
		stage.draw();
		//render();
	};

	this.BoxAutoSave = function(idx){
		if (idx){
			var index = idx;
		}else{
			var index = window.select.ID;
		}
		var cube_matrix = '';
		var position = '';
		var scale = '';
		for (var i = 0; i < ID_dict[index].cube.parent.matrixWorld.elements.length; i++){
			cube_matrix += ID_dict[index].cube.parent.matrixWorld.elements[i] + ' ';
		}
		LMsetObjectField(LM_xml, index, "cube_matrix", cube_matrix);
		var position_vector = new THREE.Vector3(0, 0, 0).applyMatrix4(ID_dict[index].cube.matrixWorld.clone());
		var position = position_vector.x + ' ' + position_vector.y + ' ' + position_vector.z;
		LMsetObjectField(LM_xml, index, 'cube_position', position);
		var rotation = ID_dict[index].cube.rotation.z;
		LMsetObjectField(LM_xml, index, 'cube_rotation', rotation);
		var scale = ID_dict[index].cube.scale.x + ' ' + ID_dict[index].cube.scale.y + ' ' + ID_dict[index].cube.scale.z;
		LMsetObjectField(LM_xml, index, 'cube_scale', scale);
		WriteXML(SubmitXmlUrl,LM_xml,function(){return;});
	};

	this.AssignSupportPlane = function(part_id, object_id){
		if (main_canvas.GetAnnoByID(part_id).GetType() == 3 && (main_canvas.GetAnnoByID(object_id).GetType() == 2 || main_canvas.GetAnnoByID(object_id).GetType() == 3)){
			var cube_object = ID_dict[part_id];
			var support_object = ID_dict[object_id];
			window.select = cube_object;
			if (cube_object.hparent != "unassigned"){
	            var index = cube_object.hparent.hchildren.indexOf(cube_object);
	            cube_object.hparent.hchildren.splice(index, 1);
	        }
            cube_object.hparent = support_object;
            support_object.hchildren.push(cube_object);
            for (var i = 0; i < cube_object.hchildren.length; i++){
                if (cube_object.hchildren[i] == support_object){
                    var index = cube_object.hchildren.indexOf(support_object);
                    cube_object.hchildren.splice(index, 1);
                }
            }
            cube_position_0 = cube_object.cube.position.clone();
            cube_position_0.setZ(cube_object.cube.position.z - cube_object.cube.scale.z*small_h/2);
            cube_position_0_static = cube_object.cube.position.clone();
            cube_position_0_static.setZ(cube_object.cube.position.z - cube_object.cube.scale.z*small_h/2);
            cube_position_0.applyMatrix4(cube_object.cube.parent.matrixWorld.clone());
            cube_position_0_static.applyMatrix4(cube_object.cube.parent.matrixWorld.clone());
            cube_object.plane.material.visible = true;
            old_x = cube_object.cube.scale.x;
            old_y = cube_object.cube.scale.y;
            old_z = cube_object.cube.scale.z;
            old_arrow_x = arrowHelper.arrow_box.scale.x;
            old_arrow_y = arrowHelper.arrow_box.scale.y;
            old_arrow_z = arrowHelper.arrow_box.scale.z;
           	calculate_box_location(cube_object, support_object);
           	if (LMgetObjectField(LM_xml, object_id, 'ispartof') && !ID_dict[object_id].cube){
           		CreatePolygonClip(object_id);
           		add_cube_to_new_scene(part_id, box_scene);
           		if (ID_dict[part_id].hchildren.length > 0){
           			for (var i = 0; i < ID_dict[part_id].hchildren.length; i++){
           				if(ID_dict[part_id].hchildren[i].cube){
           					add_cube_to_new_scene(ID_dict[part_id].hchildren[i].ID, box_scene);
           				}
           			}
           		}
           	}
           	render();
	        this.BoxAutoSave(part_id);
	    }else if (main_canvas.GetAnnoByID(part_id).GetType() == 2 && (main_canvas.GetAnnoByID(object_id).GetType() == 1 || main_canvas.GetAnnoByID(object_id).GetType() == 0)){
	    	CreatePolygonClip(object_id);
	    	ID_dict[part_id].lock_inside_clip_area = false;
	    	if (ID_dict[part_id].hchildren.length > 0){
	    		for (var i = 0; i < ID_dict[part_id].hchildren.length; i++){
	    			if (ID_dict[part_id].hchildren[i].cube){
	    				add_cube_to_new_scene(ID_dict[part_id].hchildren[i].ID, box_scene);
	    			}
	    		}
	    	}
	    	render();
		}else{
			return;
		}
	};

	this.LoadThreeDObjectsOnStartup = function(){
		var obj_elts = LM_xml.getElementsByTagName("object");
  		var num_obj = obj_elts.length;
  		for (var i = 0; i < num_obj; i++){
  			if (LMgetObjectField(LM_xml, i, 'deleted') != 0){
  				continue;
  			}
  			if (obj_elts[i].getElementsByTagName("plane").length > 0 ){// for planes
	  			object_list.push(new object_instance);
			    var new_plane_object = object_list[object_list.length-1];
			    new_plane_object.ID = i;
			    ID_dict[i] = new_plane_object;
			    var new_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
			    var new_plane_geometry = new THREE.PlaneGeometry(2, 2, 100, 100);
			    var new_plane = new THREE.Mesh(new_plane_geometry, new_plane_material.clone());
			    if (i == 0){
  					ID_dict[i].plane = plane;
  					groundplane_id = ID_dict[i].ID;
  				}else{
  					new_plane_object.plane = new_plane;
  					scene.add(new_plane);
  				}
  				ID_dict[i].plane.material.visible = true;
			    ID_dict[i].plane.matrixAutoUpdate = false;
			  	ID_dict[i].plane.matrixWorldNeedsUpdate = false;
			    ID_dict[i].plane.matrixWorld.elements = LMgetObjectField(LM_xml, i, 'plane_matrix');
  			}else if (obj_elts[i].getElementsByTagName("cube").length > 0){// for boxes
  				object_list.push(new object_instance);
			    var new_box_object = object_list[object_list.length-1];
			    new_box_object.ID = i; 
			    ID_dict[i] = new_box_object;
			    var new_plane_material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
			    var new_plane_geometry = new THREE.PlaneGeometry(2, 2, 100, 100);
			    var new_plane = new THREE.Mesh(new_plane_geometry, new_plane_material.clone());
			    new_plane.matrixWorld.elements = LMgetObjectField(LM_xml, i, 'cube_matrix');
			    new_plane.matrixAutoUpdate = false;
			    new_plane.matrixWorldNeedsUpdate = false;
			    console.log(plane.matrixWorld.elements);
			    console.log(new_plane.matrixWorld.elements);
			    new_plane.material.visible = false;
			    new_box_object.plane = new_plane;
			    var cubeGeometry = new THREE.CubeGeometry(small_w, small_h, small_d);
			    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
			    cubeMaterial.wireframeLinewidth = 2;
			    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
			   	new_box_object.cube = new THREE.Object3D();
			    new_box_object.cube.add(cube);
			    scene.add(new_box_object.plane);
			    //new_box_object.plane.add(new_box_object.cube);
			    var box_scene_plane = new THREE.Mesh(new_plane_geometry, new_plane_material.clone());
			    box_scene_plane.matrixWorld = new_plane.matrixWorld.clone();
			    box_scene_plane.matrixAutoUpdate = false;
			    box_scene_plane.matrixWorldNeedsUpdate = false;
			    box_scene_plane.material.visible = false;
			    box_scene_plane.add(new_box_object.cube);
			    box_scene.add(box_scene_plane);
			    var position = LMgetObjectField(LM_xml, i, "cube_position");
			    var i_mat = new THREE.Matrix4().getInverse(new_box_object.cube.parent.matrixWorld.clone());
			    position.applyMatrix4(i_mat);
			    var rotation = LMgetObjectField(LM_xml, i, "cube_rotation");
			    var scale = LMgetObjectField(LM_xml, i, "cube_scale");
			    new_box_object.cube.position.set(position.x, position.y, position.z);
			    new_box_object.cube.rotation.set(0, 0, rotation);
			    new_box_object.cube.scale.set(scale.x, scale.y, scale.z);
  			}
  		}
  		for (var i = 0; i < object_list.length; i++){
  			 if (!isNaN(LMgetObjectField(LM_xml, object_list[i].ID, "ispartof")) && ID_dict[LMgetObjectField(LM_xml, object_list[i].ID, "ispartof")]){
			    	object_list[i].hparent = ID_dict[LMgetObjectField(LM_xml, object_list[i].ID, "ispartof")];
			    	object_list[i].hparent.hchildren.push(object_list[i]);
			    	if (object_list[i].cube){
			    		object_list[i].cube.parent.matrixWorld = object_list[i].hparent.plane.matrixWorld.clone();
			    	}
			    }
			    /*if (!isNaN(LMgetObjectField(LM_xml, object_list[i].ID, "parts"))){
			    	var child_ID_list = LMgetObjectField(LM_xml, object_list[i].ID, "parts");
			    	for (var j = 0; j < child_ID_list.length; j++){
			    		if (!ID_dict[child_ID_list[j]]){
			    			object_list[i].hchildren.push(ID_dict[child_ID_list[j]])
			    		}
			    	}
			    }*/
  		}
  		render();
	};
}