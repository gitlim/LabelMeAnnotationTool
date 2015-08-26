/** @file This file contains functions for reading attributes of an xml. 
*/

/** Gets a field for an object from an xml. If frame value is provided, it gives the field at the given.
  * @param {string} xml - The xml containing the annotations
  * @param {int} ind_object - Index to the object to be displayed
  * @param {string} name - name of the field to return.
  * @param {int} frame - frame of interest
*/
function LMgetObjectField(xml,ind_object, name, frame) {
	var obj = $(xml).children("annotation").children("object").eq(ind_object);
	console.log(ind_object);
	if (obj.length == 0) return "";
	if (name == 'name' ||  name == 'attributes' || name == 'occluded'){
		if (!obj.children(name).length > 0) return "";
		else return obj.children(name).text();
	}
	if (name == 'type'){
		if (obj.children("segm").length > 0) return 'segmentation';
		else if (obj.children(name).length > 0) return 'bounding_box';
		else return 'polygon';
	}
	if (name == 'deleted' || name == 'verified' || name == 'automatic'){
		if (!obj.children(name).length > 0) return "";
		else return parseInt(obj.children(name).text());
	}
    if (name == 'username'){
        if (obj.children("segm").length > 0 && obj.children("segm").children("username").length > 0) obj.children("segm").children("username").text();
        else if (obj.children("polygon").children("username").length > 0) return obj.children("polygon").children("username").text();
        return "";
    }
    if (name == 'parts'){
        parts = [];
        if (obj.children("parts").length>0) {
            tmp = obj.children("parts").children("hasparts").text();
            if (tmp.length>0) {
                // if it is not empty, split and trasnform to numbers
                parts = tmp.split(",");
                for (var j=0; j<parts.length; j++) {parts[j] = parseInt(parts[j], 10);}
            }
        }
        return parts;
    }
	if (name == 'x' || name == 'y'){
		if (frame){
			var framestamps = (obj.children("polygon").children("t").text()).split(',');
          	for(var ti=0; ti<framestamps.length; ti++) { framestamps[ti] = parseInt(framestamps[ti], 10); } 
          	var objectind = framestamps.indexOf(frame);
            if (objectind == -1) return [];
			var coords = ((obj.children("polygon").children(name).text()).split(';')[objectind]).split(',');
			for(var ti=0; ti<coords.length; ti++) { coords[ti] = parseInt(coords[ti], 10); }
			return coords;	

		}
		else {
			if (obj.children("polygon").length == 0) return null;
			var pt_elts = obj.children("polygon")[0].getElementsByTagName("pt");
			if (pt_elts){
				var coord = Array(pt_elts.length);
				for (var ii=0; ii < coord.length; ii++){

					coord[ii] = parseInt(pt_elts[ii].getElementsByTagName(name)[0].firstChild.nodeValue);
				} 
				return coord;
			}
		}
	}
	if (name == 't'){
		var framestamps = (obj.children("polygon").children("t").text()).split(',');
        for(var ti=0; ti<framestamps.length; ti++) { framestamps[ti] = parseInt(framestamps[ti], 10); } 
        return framestamps;
	}
	if (name == 'userlabeled'){
		if(obj.children("polygon").children("userlabeled").length == 0) return [];
		var framestamps = (obj.children("polygon").children("userlabeled").text()).split(',');
        for(var ti=0; ti<framestamps.length; ti++) { framestamps[ti] = parseInt(framestamps[ti], 10); } 
        return framestamps;
	}
	if (name == 'mask_name'){
		return obj[0].getElementsByTagName("segm")[0].getElementsByTagName("mask")[0].firstChild.nodeValue
	}
	if (name == 'scribble_name'){
		return obj[0].getElementsByTagName("segm")[0].getElementsByTagName("scribbles")[0].getElementsByTagName("scribble_name")[0].firstChild.nodeValue;
	}
	if (name == 'imagecorners'){
		var corners = new Array(4);
		corners[0] = parseInt(obj[0].getElementsByTagName("segm")[0].getElementsByTagName("scribbles")[0].getElementsByTagName("xmin")[0].firstChild.nodeValue);
		corners[1] = parseInt(obj[0].getElementsByTagName("segm")[0].getElementsByTagName("scribbles")[0].getElementsByTagName("ymin")[0].firstChild.nodeValue);
		corners[2] = parseInt(obj[0].getElementsByTagName("segm")[0].getElementsByTagName("scribbles")[0].getElementsByTagName("xmax")[0].firstChild.nodeValue);
		corners[3] = parseInt(obj[0].getElementsByTagName("segm")[0].getElementsByTagName("scribbles")[0].getElementsByTagName("ymax")[0].firstChild.nodeValue);
		return corners;
	}
	if (name == 'bboxcorners'){
		var corners = new Array(4);
		corners[0] = parseInt(obj.find("segm").find("box").find("xmin")[0].firstChild.nodeValue);
      	corners[1] = parseInt(obj.find("segm").find("box").find("ymin")[0].firstChild.nodeValue);
      	corners[2] = parseInt(obj.find("segm").find("box").find("xmax")[0].firstChild.nodeValue);
      	corners[3] = parseInt(obj.find("segm").find("box").find("ymax")[0].firstChild.nodeValue);
      	return corners;	
	}
	if (name == 'plane_matrix'){
		if (obj.children('plane').children('plane_matrix').length > 0){
			var K = new Array(16);
			K = obj.children('plane').children('plane_matrix').text().match(/[\S]+/g);
			for (var i = 0; i < K.length; i++){
				K[i] = parseFloat(K[i]);
			}
		}
		return K;
	}
	if (name == 'cube_matrix'){
		if (obj.children('cube').children('cube_matrix').length > 0){
			var M = new Array(16);
			M = obj.children('cube').children('cube_matrix').text().match(/[\S]+/g);
			for (var i = 0; i < M.length; i++){
				M[i] = parseFloat(M[i]);
			}
		}
		return M;
	}
	if (name == 'lines'){
		var lines = new Array();
		for (var i = 0; i < obj.children('plane').children('lines').find('vp_line').length; i++){
			for (var j = 0; j < 5; j++){
				lines.push(parseFloat(obj.children('plane').children('lines').find('vp_line')[i].children[j].firstChild.nodeValue));
			}
		}
		return lines;
	}
	if (name == 'focal_length'){
		if (obj.children('plane').children('focal_length').length > 0){
			var f = parseFloat(obj.children('plane').children('focal_length').text());
		}
		return f;
	}
	if (name == 'height_from_parent'){
		if (obj.children('cube').children('height_from_parent').length > 0){
			var height_from_parent = parseFloat(obj.children('cube').children('height_from_parent').text());
		}
		return height_from_parent;
	}
	if (name == 'op_points'){
		if (obj.children('plane').children('op_points').length > 0){
			var op_points = new Array(2);
			op_points = obj.children('plane').children('op_points').text().match(/[\S]+/g);
			for (var i = 0; i < op_points.length; i++){
				op_points[i] = parseFloat(op_points[i]);
			}
		}
		return op_points;
	}
	if (name == 'ispartof'){
		if (obj.children("parts").children("ispartof").length > 0){
			tmp = obj.children("parts").children("ispartof").text();
			tmp = parseInt(tmp);
		}
		return tmp;
	}
	if (name == 'cube_position' || name == 'cube_scale'){
		if (obj.children('cube').children(name).length > 0){
			var vector = new THREE.Vector3();
			var vector_array = obj.children('cube').children(name).text().match(/[\S]+/g);
			for (var i = 0; i < vector_array.length; i++){
				vector_array[i] = parseFloat(vector_array[i]);
			}
		}
		vector.x = vector_array[0];
		vector.y = vector_array[1];
		vector.z = vector_array[2];
		
		return vector;
	}
	if (name == 'cube_rotation'){
		if (obj.children('cube').children('cube_rotation').length > 0){
			var rotation = parseFloat(obj.children('cube').children('cube_rotation').text());
		}
		return rotation;
	}
	return null;
}

/** Returns number of LabelMe objects. */
function LMnumberOfObjects(xml) {
    return xml.getElementsByTagName('object').length;
}

/** Sets a field for an object from an xml. 
  * @param {string} xml - The xml containing the annotations
  * @param {int} ind_object - Index to the object to be set
  * @param {string} name - name of the field to set.
  * @param {string} value - value to which the object will be set
*/
function LMsetObjectField(xml, ind_object, name, value){
	var obj = $(xml).children("annotation").children("object").eq(ind_object);
	if (name == 'name' || name == 'automatic' || name == 'attributes' || name == 'occluded' || name == 'deleted' || name == 'id'){
		if (obj.children(name).length > 0) obj.children(name).text(value);
		else if (name != 'automatic') obj.append("<"+name+">"+value+"</"+name+">");
	}
	if (name == 'username'){
		if (obj.children("polygon").length == 0 && obj.children("segm").children("username").length == 0) obj.children("segm").append($("<username>anonymous</username>"));
		else if (obj.children("polygon").length > 0 && obj.children("polygon").children("username").length == 0) obj.children("polygon").append($("<username>anonymous</username>"));
	}
	if (name == 'x' || name == 'y' || name == 't' || name == 'userlabeled'){
		if (obj.children("polygon").children("t").length > 0){
			obj.children("polygon").children(name).text(value);
		}
		else {
			for (var ii = 0; ii < value.length; ii++){
				obj.children("polygon").children("pt").eq(ii).children(name).text(value[ii]);
			}			   	
		}
	}
	if (name == 'plane_matrix' || name == 'focal_length' || 'op_points'){
		if (obj.children("plane").children(name).length > 0){
			obj.children("plane").children(name).text(value);
		}
	}
	if (name == 'lines'){
		obj.children("plane").children(name).empty();
		obj.children("plane").children(name).append(value);
	}
	if (name == 'cube_matrix' || name == 'cube_position' || name == 'cube_rotation' || name == 'cube_scale'){
		if (obj.children("cube").children(name).length > 0){
			obj.children("cube").children(name).text(value);
		}
	}
	if (name == 'height_from_parent'){
		if (obj.children("cube").children(name).length > 0){
			obj.children('cube').children(name).text(value);
		}	
	}
}


