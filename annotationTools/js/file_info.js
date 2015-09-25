/** @file Contains the file_info class, which parses the URL and sets global variables based on the URL.  */

// file_info class - only works for still images at the moment

/**
 * Keeps track of the information for the currently displayed image
 * and fetches the information via dirlists or from the URL.
 * @constructor
*/
function file_info() {
    
    // *******************************************
    // Private variables:
    // *******************************************
    
    this.page_in_use = 0; // Describes if we already see an image.
    this.dir_name = null;
    this.im_name = null;
    this.collection = 'LabelMe';
    this.mode = 'i'; //initialize to picture mode
    this.hitId = null;
    this.assignmentId = null;
    this.workerId = null;
    this.mt_instructions = null;
    
    // *******************************************
    // Public methods:
    // *******************************************
    
    /** Parses the URL and gets the collection, directory, and filename
     * information of the image to be annotated.  Returns true if the
     * URL has collection, directory, and filename information.
    */
    this.ParseURL = function () {
        var labelme_url = document.URL;
        var idx = labelme_url.indexOf('?');
        if((idx != -1) && (this.page_in_use == 0)) {
            this.page_in_use = 1;
            var par_str = labelme_url.substring(idx+1,labelme_url.length);
            var isMT = false; // In MT mode?
            var default_view_ObjList = false;
            do {
                idx = par_str.indexOf('&');
                var par_tag;
                if(idx == -1) par_tag = par_str;
                else par_tag = par_str.substring(0,idx);
                var par_field = this.GetURLField(par_tag);
                var par_value = this.GetURLValue(par_tag);
                if(par_field=='mode'){
                    this.mode = par_value;
                    if(this.mode=='im' || this.mode=='mt') view_ObjList = false;
                    if(this.mode=='mt') isMT = true;
                }
				if (par_field == 'view_only' && par_value == 'true'){
					view_only = true;
				}
                if(par_field=='username') {
                    username = par_value;
                }
                if((par_field=='threed')&&(par_value=='true')) {
                		threed_mode = true;
                }
				if (par_field == 'tester' && par_value == 'true'){
					test_mode = true;
					view_only = true;
				}
                if(par_field=='threed_mt_mode') {
                    threed_mt_mode = par_value;
					if (par_value == 'box_label'){
						image_list_length = 5;
						use_attributes = false;
						use_parts = false;
					}else if (par_value == 'gp' || par_value == 'support_label'){
						image_list_length = 10;
						use_parts = true;
					}
                }
                if(par_field=='collection') {
                    this.collection = par_value;
                }
                if(par_field=='folder') {
                    this.dir_name = par_value;
                }
                if(par_field=='image_list') {
                    image_list_number = par_value;
                }
				if (par_field == 'test_edit'){
					test_edit == par_value;
				}
                if(par_field=='image') {
                    if (threed_mode == true && this.mode=='mt'){
                        /*getDataArray();
                        image_list = loadImageList(image_list_number);
                        address = image_list[par_value];*/
						if (test_mode == true){
							if (threed_mt_mode == "box_label") var list_name = "test_img.list";
							else if (threed_mt_mode == "support_label") var list_name = "support_test_img.list"
							CCC = $.ajax({
								 type: "POST",
								 url: "../LabelMeAnnotationTool/annotationTools/php/3d/imageList.php",
								 data: {
								 "list_length": 10,
								 "task": "get_list",
								 "file_list_number": image_list_number,
								 "list_name": list_name
								 },
								 async: false,
								 dataType: "html",
							 });
						}else if (threed_mt_mode == "box_label"){
							console.log(par_value);
							CCC = $.ajax({
								 type: "POST",
								 url: "../LabelMeAnnotationTool/annotationTools/php/3d/imageList.php",
								 data: {
								 "list_length": 0,
								 "task": "get_box_list",
								 "file_list_number": parseInt(par_value),
								 "list_name": "img.list"
								 },
								 async: false,
								 dataType: "html",
							 });
						}else{
							CCC = $.ajax({
								 type: "POST",
								 url: "../LabelMeAnnotationTool/annotationTools/php/3d/imageList.php",
								 data: {
								 "list_length": image_list_length,
								 "task": "get_list",
								 "file_list_number": image_list_number,
								 "list_name": "img.list"
								 },
								 async: false,
								 dataType: "html",
							 });
						}
						if (threed_mt_mode == "box_label"){
							address = CCC.responseText;
							image_count = par_value;
						}else{
							image_count = par_value;
							image_list = CCC.responseText;
							image_list = image_list.split("\n");
							address = image_list[par_value];
						}
						var split = address.split("\n")[0].split("/");
						filename = split[split.length-1];
                        //filename = parseInt(parseInt(image_list_number)*image_list_length + parseInt(par_value));
						//filename = filename.substring(0, substring.indexOf('.'));
                        this.im_name = filename;
                    }else{
                        this.im_name = par_value;
                            if(this.im_name.indexOf('.jpg')==-1 && this.im_name.indexOf('.png')==-1) {
                            this.im_name = this.im_name + '.jpg';
                        }
                    }
                }
                if(par_field=='screenshot_mode'){
					if (par_value == 'true') screenshot_mode == true;
					else screenshot_mode == false;
				}
				if(par_field=='hitId') {
                    this.hitId = par_value;
                    isMT = true;
                }
                if(par_field=='turkSubmitTo') {
                    isMT = true;
                }
                if(par_field=='assignmentId') {
                    this.assignmentId = par_value;
                    isMT = true;
                }
                if((par_field=='mt_sandbox') && (par_value=='true')) {
                    externalSubmitURL = externalSubmitURLsandbox;
                }
                if(par_field=='N') {
                    mt_N = par_value;
                }
                if(par_field=='workerId') {
                    this.workerId = par_value;
                    isMT = true;
                    
                    // Get second-half of workerId:
                    var len = Math.round(this.workerId.length/2);
                    username = 'MT_' + this.workerId.substring(len-1,this.workerId.length);
                }
                if(par_field=='mt_intro') {
                    MThelpPage = par_value;
                }
                if(par_field=='actions') {
                    // Get allowable actions:
                    var actions = par_value;
                    action_CreatePolygon = 0;
                    action_RenameExistingObjects = 0;
                    action_ModifyControlExistingObjects = 0;
                    action_DeleteExistingObjects = 0;
                    if(actions.indexOf('n')!=-1) action_CreatePolygon = 1;
                    if(actions.indexOf('r')!=-1) action_RenameExistingObjects = 1;
                    if(actions.indexOf('m')!=-1) action_ModifyControlExistingObjects = 1;
                    if(actions.indexOf('d')!=-1) action_DeleteExistingObjects = 1;
                    if(actions.indexOf('a')!=-1) {
                        acti
on_CreatePolygon = 1;
                        action_RenameExistingObjects = 1;
                        action_ModifyControlExistingObjects = 1;
                        action_DeleteExistingObjects = 1;
                    }
                    if(actions.indexOf('v')!=-1) {
                        action_CreatePolygon = 0;
                        action_RenameExistingObjects = 0;
                        action_ModifyControlExistingObjects = 0;
                        action_DeleteExistingObjects = 0;
                    }
                }
                if(par_field=='viewobj') {
                    // Get option for which polygons to see:
                    var viewobj = par_value;
                    view_Existing = 0;
                    view_Deleted = 0;
                    if(viewobj.indexOf('e')!=-1) view_Existing = 1;
                    if(viewobj.indexOf('d')!=-1) view_Deleted = 1;
                    if(viewobj.indexOf('a')!=-1) {
                        view_Deleted = 1;
                        view_Existing = 1;
                    }
                }
                if(par_field=='objlist') {
                    if(par_value=='visible') {
                        view_ObjList = true;
                        default_view_ObjList = true;
                    }
                    if(par_value=='hidden') {
                        view_ObjList = false;
                        default_view_ObjList = false;
                    }
                }
                if(par_field=='mt_instructions') {
                    // One line MT instructions:
                    this.mt_instructions = par_value;
                    this.mt_instructions = this.mt_instructions.replace(/_/g,' ');
                }
                if(par_field=='objects') {
                    // Set drop-down list of object to label:
                    object_choices = par_value.replace('_',' ');
                    object_choices = object_choices.split(/,/);
                }
                if((par_field=='scribble')&&(par_value=='true')) {
		             scribble_mode = true;
		        }
                if((par_field=='video')&&(par_value=='true')) {
		             video_mode = true;
                     bbox_mode = true;
		        }
                if((par_field=='bbox')&&(par_value=='true')) {
                  bbox_mode = true;
                }
                par_str = par_str.substring(idx+1,par_str.length);
            } while(idx != -1);
            if (video_mode) return 1;
            if((this.dir_name === null) || (this.im_name === null)) return this.SetURL(labelme_url);
            
            if(isMT) {
                this.mode='mt'; // Ensure that we are in MT mode
				if (threed_mt_mode == "box_label" || threed_mt_mode == 'support_label'){
					default_view_ObjList = true;
				}
				view_ObjList = default_view_ObjList;
			}
            
            if((this.mode=='i') || (this.mode=='c') || (this.mode=='f')) {
                document.getElementById('body').style.visibility = 'visible';
            }
            else if((this.mode=='im') || (this.mode=='mt')) {
                if (threed_mode != true){
                    var p = document.getElementById('header');
                    p.parentNode.removeChild(p);
                    var p = document.getElementById('tool_buttons');
                    p.parentNode.removeChild(p);
                }else{
                    var a = document.getElementById("header");
                    a.parentNode.removeChild(a);
                    var b = document.getElementById("label_buttons_navigation");
                    b.parentNode.removeChild(b);
                }
                document.getElementById('body').style.visibility = 'visible';
            }
            else {
                this.mode = 'i';
                document.getElementById('body').style.visibility = 'visible';
            }
            
            if(!view_ObjList && threed_mt_mode == "gp") {
                var p = document.getElementById('anno_anchor');
                p.parentNode.removeChild(p);
            }
            
            if(this.assignmentId=='ASSIGNMENT_ID_NOT_AVAILABLE') {
                window.location = MThelpPage;
                return false;
            }
            if(this.mode=='mt') { 
                if(!this.mt_instructions) {
                    if (threed_mt_mode == "gp") this.mt_instructions = 'Please label the groundplane in this image.';
                   	else if (threed_mt_mode == "box_label"){
						 	if (test_mode == true){ 
								var name_array = new Array();
								name_array[0] = ["drawers", "lamp"];
								name_array[1] = ["couch", "cabinet"];
								name_array[2] = ["nightstand", "bench"];
								name_array[3] = ["rocking chair", "lamp"];
								name_array[4] = ["nightstand", "lamp"];
								name_array[5] = ["nightstand", "nightstand"];
								name_array[6] = ["bed", "nightstand"]; 
								name_array[7] = ["nightstand", "lamp"];
								name_array[8] = ["bed", "drawers"];
								name_array[9] = ["bed", "wardrobe"];
								this.mt_instructions = 'Please label the two indicated objects and enter their names exactly as they are given: <u>' + name_array[image_count][0] + ', ' + name_array[image_count][1] + '</u>. <br></br>';
						}
							else this.mt_instructions = 'Please label <font color = "red">the <u>10</u> largest objects</font> in this image. If there are less than 10 objects, label as many as possible.<br></br>';
					}else if (threed_mt_mode == 'support_label'){
						this.mt_instructions = ' <font size = "3">Please label the support object and height of all objects given. If the box is "floating" and has no support object, leave it  unlabeled.</font>'	
					}
					else if(mt_N=='inf') this.mt_instructions = 'Please label as many objects as you want in this image.';
                    else if(mt_N==1) this.mt_instructions = 'Please label at least ' + mt_N + ' object in this image.';
                    else this.mt_instructions = 'Please label at least ' + mt_N + ' objects in this image.';
                }
                if(mt_N=='inf') mt_N = 1;
                var image_number = parseInt(image_count) + parseInt(1);
                if (threed_mt_mode == 'gp' && threed_mode == true){
                    if (image_count == 9){ var html_str = '<table><tr><td><font size="4"><b>' + this.mt_instructions + '  </b></font></td><td><form><input type="hidden" id="assignmentId" name="assignmentId" value="'+ this.assignmentId +'" /><input type="hidden" id="number_objects" name="number_objects" value="" /><input type="hidden" id="object_name" name="object_name" value="" /><input type="hidden" id="LMurl" name="LMurl" value="" /><input type="hidden" id="mt_comments" name="mt_comments" value="" /><input disabled="false" type="submit" id="mt_submit" name="Submit" value="Submit HIT" onmousedown="javascript: window.parent.document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value; window.parent.submit_AMT();" /></form></td></tr></table>';
                       	html_str += 'You are at image number '+ image_number + ' out of 10<br/>';
			 $('#mt_submit_form').append(html_str);
                        var html_str2 = '<font size="3">(Optional) Do you wish to provide any feedback on this HIT?</font><br /><textarea id="mt_comments_textbox" name="mt_comments_texbox" cols="94" nrows="5" />';
                        $('#mt_feedback').append(html_str2);
                        document.getElementById('mt_submit').disabled=false;
                    }else{ var html_str = '<table><tr><td><font size="4"><b>' + this.mt_instructions + '  </b></font></td><td><input type="submit" id="mt_submit" name="Submit" value="Submit Image" onmousedown="javascript:AMTLoadNextImage();" /></td></tr></table>';
						html_str += 'You are at image number '+ image_number  + ' out of 10<br/>';
						$('#mt_submit_form').append(html_str);
                    }
					var html_str3 = '<a href="gp_instr_new/instr.htm" id="instr_full"  style = "text-decoration: none; color:#000000;" class="button2">Instructions</a>';
					$('#mt_submit_form').append(html_str3);
					$('#instr_full').click(function(){ $('#instr_full').colorbox({iframe:true,width:1100,height:700,transition:"none",closeButton:true});
});
                  }
				else if (threed_mt_mode == 'box_label' && threed_mode == true){
					if (test_mode == true){
							var html_str = '<table><tr><td><font size="2"><b>' + this.mt_instructions + '  </b></font></td></tr></table>';
					html_str += '<input disabled="false" type="button" id="mt_submit" name="Submit" value="Submit" onmousedown="javascript: window.parent.test_submitted();" />'
					html_str += '<input type="submit" id="skip" name="skip" value="Skip this image" onmousedown="javascript: window.parent.test_skip();"/>'
						$('#mt_submit_form').append(html_str);
					if (window.parent.test_status[window.parent.img_id]) document.getElementById("skip").style.display = "none";
					}else{
						/*if (image_count == 4){
							var html_str = '<table><tr><td><font size="4"><b>' + this.mt_instructions + '  </b></font></td><td><form><input type="hidden" id="assignmentId" name="assignmentId" value="'+ this.assignmentId +'" /><input type="hidden" id="number_objects" name="number_objects" value="" /><input type="hidden" id="object_name" name="object_name" value="" /><input type="hidden" id="LMurl" name="LMurl" value="" /><input type="hidden" id="mt_comments" name="mt_comments" value="" /></form></td></tr></table>';
							html_str += 'You are at image number '+ image_number  + ' out of 5<br/>';
							html_str += '<input disabled="false" type="submit" id="mt_submit" name="Submit" value="Submit HIT" onmousedown="javascript: window.parent.document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value; window.parent.submit_AMT();" />';
							html_str += '<input type="submit" id="plane_mislabled" name="plane_mislabeled" value="Orientation is incorrect" onmousedown="javascript: window.parent.gp_incorrect();"/>'
							$('#mt_submit_form').append(html_str);
							var html_str2 = '<font size="3">(Optional) Do you wish to provide any feedback on this HIT?</font><br /><textarea id="mt_comments_textbox" name="mt_comments_texbox" cols="94" nrows="5" />';
							$('#mt_feedback').append(html_str2);
						}else{*/
							 var html_str = '<table><tr><td><font size="3"><b>' + this.mt_instructions + '  </b></font></td><td></td></tr></table>';
							html_str += '<table id = "indicator">You have labeled ' + window.parent.num_boxes_labeled + ' out of ' + window.parent.required_num + ' boxes.</table>';
							html_str += '<input disabled="false" type="submit" id="mt_submit" name="Submit" value="Submit HIT" onmousedown="javascript: window.parent.document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value; window.parent.submit_AMT();" />';

							html_str += '<input type="submit" id="mt_submit" name="Submit" value="Image Done" onmousedown="javascript:AMTLoadNextImage();" />';
							html_str += '<input type="submit" id="plane_mislabled" name="plane_mislabeled" value="Orientation is incorrect" onmousedown="javascript: window.parent.gp_incorrect();"/>'
							$('#mt_submit_form').append(html_str);
						//}
					}
					var html_str3 = '<a href="box_instr/box_labeling_instr.htm" id="instr_full"  style = "text-decoration: none; color:#000000;" class="button2">Instructions</a>';
					$('#mt_submit_form').append(html_str3);
					$('#instr_full').click(function(){ $('#instr_full').colorbox({iframe:true,width:1100,height:700,transition:"none",closeButton:true});
				});
					$("#mt_submit_form").css('z-index', '3');
					$("#mt_submit").css('z-index', '3');
               }
				else if (threed_mt_mode == 'support_label'){
					if (test_mode == true){
							var html_str = '<table><tr><td><font size="2"><b>' + this.mt_instructions + '  </b></font></td></tr></table>';
					html_str += '<input disabled="false" type="button" id="mt_submit" name="Submit" value="Submit" onmousedown="javascript: window.parent.test_submitted();" />'
					html_str += '<input type="submit" id="skip" name="skip" value="Skip this image" onmousedown="javascript: window.parent.test_skip();"/>'
						$('#mt_submit_form').append(html_str);
					if (window.parent.test_status[window.parent.img_id]) document.getElementById("skip").style.display = "none";
					
						document.getElementById('mt_submit').disabled=false;
					}else{
						if (image_count == 9){
							var html_str = '<table><tr><td><font size="4"><b>' + this.mt_instructions + '  </b></font></td><td><form><input type="hidden" id="assignmentId" name="assignmentId" value="'+ this.assignmentId +'" /><input type="hidden" id="number_objects" name="number_objects" value="" /><input type="hidden" id="object_name" name="object_name" value="" /><input type="hidden" id="LMurl" name="LMurl" value="" /><input type="hidden" id="mt_comments" name="mt_comments" value="" /></form></td></tr></table>';
							html_str += 'You are at image number '+ image_number  + ' out of 10<br/>';
							html_str += '<input disabled="false" type="submit" id="mt_submit" name="Submit" value="Submit HIT" onmousedown="javascript: window.parent.document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value; window.parent.submit_AMT();" />';
							$('#mt_submit_form').append(html_str);
							var html_str2 = '<font size="3">(Optional) Do you wish to provide any feedback on this HIT?</font><br /><textarea id="mt_comments_textbox" name="mt_comments_texbox" cols="94" nrows="5" />';
							$('#mt_feedback').append(html_str2);
							document.getElementById('mt_submit').disabled=false;
						}else{
							 var html_str = '<table><tr><td><font size="4"><b>' + this.mt_instructions + '  </b></font></td><td></td></tr></table>';
							html_str += 'You are at image number '+ image_number  + ' out of 10<br/>';
							html_str += '<input type="submit" id="mt_submit" name="Submit" value="Submit Image" onmousedown="javascript:AMTLoadNextImage();" />';
							$('#mt_submit_form').append(html_str);
						}
						}
						var html_str3 = '<a href="support_instr/support_labeling_instr.htm" id="instr_full"  style = "text-decoration: none; color:#000000;" class="button2">Instructions</a>';
						$('#mt_submit_form').append(html_str3);
						$('#instr_full').click(function(){ $('#instr_full').colorbox({iframe:true,width:1100,height:700,transition:"none",closeButton:true});
					});
						$("#mt_submit_form").css('z-index', '3');
						$("#mt_submit").css('z-index', '3');
						document.getElementById('mt_submit').disabled=false;
						
				}else{ var html_str = '<table><tr><td><font size="4"><b>' + this.mt_instructions + '  Scroll down to see the entire image. &#160;&#160;&#160; </b></font></td><td><form action="' + externalSubmitURL + '"><input type="hidden" id="assignmentId" name="assignmentId" value="'+ this.assignmentId +'" /><input type="hidden" id="number_objects" name="number_objects" value="" /><input type="hidden" id="object_name" name="object_name" value="" /><input type="hidden" id="LMurl" name="LMurl" value="" /><input type="hidden" id="mt_comments" name="mt_comments" value="" /><input disabled="true" type="submit" id="mt_submit" name="Submit" value="Submit HIT" onmousedown="javascript:document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value;" /></form></td></tr></table>';                
                    $('#mt_submit_form').append(html_str);
                    var html_str2 = '<font size="4"><b>Scroll up to see the entire image</b></font>&#160;&#160;&#160;<font size="3">(Optional) Do you wish to provide any feedback on this HIT?</font><br /><textarea id="mt_comments_textbox" name="mt_comments_texbox" cols="94" nrows="5" />';
            		  $('#mt_feedback').append(html_str2);
                    if(global_count >= mt_N || threed_mode == true) document.getElementById('mt_submit').disabled=false;
                }
            }
        }
        else {
            return this.SetURL(labelme_url);
        }
        
        return 1;
    };
    
    /** Gets mode */
    this.GetMode = function() {
        return this.mode;
    };
    
    /** Gets collection name */
    this.GetCollection = function () {
        return this.collection;
    };
    
    /** Gets directory name */
    this.GetDirName = function () {
        return this.dir_name;
    };
    
    /** Gets image name */
    this.GetImName = function () {
        return this.im_name;
    };
    
    /** Sets image name */
    this.SetImName = function (newImName){
        this.im_name = newImName;
    };
    
    /** Gets image path */
    this.GetImagePath = function () {
        if (threed_mode ==true && this.mode== 'mt') return address;
        else if((this.mode=='i') || (this.mode=='c') || (this.mode=='f') || (this.mode=='im') || (this.mode=='mt')) return 'Images/' + this.dir_name + '/' + this.im_name;
    };
    
    /** Gets annotation path */
    this.GetAnnotationPath = function () {
		 //if(test_mode == true) return 'Annotations/' + this.dir_name + '/'  + this.im_name.substr(0, this.im_name.length-4) + '.xml';
		if((this.mode=='i') || (this.mode=='c') || (this.mode=='f') || (this.mode=='im') || (this.mode=='mt')) return 'Annotations/' + this.dir_name + '/' + this.im_name.substr(0,this.im_name.length-4) + '.xml';
    };
    
    /** Gets full image name */
    this.GetFullName = function () {
        //if (threed_mode ==true && this.mode== 'mt' && test_mode == false) return this.dir_name + '/' + parseInt(filename);
		//if (threed_mode == true && this.mode == 'mt' && test_mode == true && threed_mt_mode == "support_label") return this.dir_name + '/support_test_' + parseInt(filename);
        //else if (threed_mode ==true && this.mode== 'mt' && test_mode == true) return this.dir_name + '/test_' + parseInt(filename);
       if((this.mode=='i') || (this.mode=='c') || (this.mode=='f') || (this.mode=='im') || (this.mode=='mt')) return this.dir_name + '/' + this.im_name;
    };
    
    /** Gets template path */
    this.GetTemplatePath = function () {
        if(!this.dir_name) return 'annotationCache/XMLTemplates/labelme.xml';
        return 'annotationCache/XMLTemplates/' + this.dir_name + '.xml';
    };
    
    // *******************************************
    // Private methods:
    // *******************************************
    
    /** String is assumed to have field=value form.  Parses string to
    return the field. */
    this.GetURLField = function (str) {
        var idx = str.indexOf('=');
        return str.substring(0,idx);
    };
    
    /** String is assumed to have field=value form.  Parses string to
     return the value. */
    this.GetURLValue = function (str) {
        var idx = str.indexOf('=');
        return str.substring(idx+1,str.length);
    };
    
    /** Changes current URL to include collection, directory, and image
    name information.  Returns false. */
    this.SetURL = function (url) {
        this.FetchImage();

	// Get base LabelMe URL:
        var idx = url.indexOf('?');
        if(idx != -1) {
            url = url.substring(0,idx);
        }
        
        // Include username in URL:
        var extra_field = '';
        if(username != 'anonymous') extra_field = '&username=' + username;
        
        if(this.mode=='i') window.location = url + '?collection=' + this.collection + '&mode=' + this.mode + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        else if(this.mode=='im') window.location = url + '?collection=' + this.collection + '&mode=' + this.mode + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        else if(this.mode=='mt') window.location = url + '?collection=' + this.collection + '&mode=' + this.mode + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        else if(this.mode=='c') window.location = url + '?mode=' + this.mode + '&username=' + username + '&collection=' + this.collection + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        else if(this.mode=='f') window.location = url + '?mode=' + this.mode + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        return false;
    };
    
    /** Fetch next image. */
    this.FetchImage = function () {
        var url = 'annotationTools/perl/fetch_image.cgi?mode=' + this.mode + '&username=' + username + '&collection=' + this.collection.toLowerCase() + '&folder=' + this.dir_name + '&image=' + this.im_name;
        var im_req;
        // branch for native XMLHttpRequest object
        if (window.XMLHttpRequest) {
            im_req = new XMLHttpRequest();
            im_req.open("GET", url, false);
            im_req.send('');
        }
        else if (window.ActiveXObject) {
            im_req = new ActiveXObject("Microsoft.XMLHTTP");
            if (im_req) {
                im_req.open("GET", url, false);
                im_req.send('');
            }
        }
        
        if(im_req.status==200) {
            this.dir_name = im_req.responseXML.getElementsByTagName("dir")[0].firstChild.nodeValue;
            this.im_name = im_req.responseXML.getElementsByTagName("file")[0].firstChild.nodeValue;
        }
        else {
            alert('Fatal: there are problems with fetch_image.cgi');
        }
    };
}
