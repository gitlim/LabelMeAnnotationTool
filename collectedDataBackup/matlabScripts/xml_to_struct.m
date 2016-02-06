%this function converts the data from xml form into at matlab struct
function files = box_label(root_path)
    VISUAL_DIR = [root_path '/Images/3dataset/'];
    LABEL_DIR = [root_path '/Annotations/3dataset/'];
	addpath(genpath('/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup'));
    files = struct([]);
	%image_list_filename = img_list_path;
	image_list_filename = '/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/imageList/ADE20K_img.list';
	urls = textread(image_list_filename, '%s');
    % Process each saved file
   	for file_i = 1:length(urls);
	%for file_i = 1:200
  	%for file_i = 1:2
		filepath = urls{file_i};
	   	annopath = fullfile(LABEL_DIR, [filepath(1:end-4) '.xml']);
		imagepath = fullfile(VISUAL_DIR, filepath);
		img_name = strsplit(urls{file_i}, '/');
		img_name = img_name{end};
		try
			document = xml_parseany(fileread(annopath));
		catch ME
			disp(ME);
			continue
		end
		files(file_i).name = img_name(1:end-4);
		files(file_i).anno_path = annopath;
		files(file_i).im_path = imagepath;
		files(file_i).padded_im_path = ['/archive/vision/torralba/3dataset/hairuo/Images/padded/' urls{file_i}];
		files(file_i).im = img_name;
		files(file_i).im_dim = size(imread(imagepath));
		try	
			doc_objects = document.object;
		end
		files(file_i).objects = struct([]);
		for object_i=1:length(doc_objects);
			if isfield(doc_objects{object_i}, 'polygon')
				continue;
			end
			if isfield(doc_objects{object_i}.name{1}, 'CONTENT')
				object.name = doc_objects{object_i}.name{1}.CONTENT;
			end
			if isfield(doc_objects{object_i}, 'cube')
				cuboid = doc_objects{object_i}.cube{1};
				object.cube.position = str2double(strsplit(cuboid.cube_position{1}.CONTENT, ' '));%note that this is the position of the center of the cuboids
				object.cube.scale = str2double(strsplit(cuboid.cube_scale{1}.CONTENT, ' '));
                object.cube.rotation = str2double(cuboid.cube_rotation{1}.CONTENT);
			end
			object.plane.focal = str2double(doc_objects{object_i}.plane{1}.focal_length{1}.CONTENT);
			object.plane.matrix = str2double(strsplit(doc_objects{object_i}.plane{1}.plane_matrix{1}.CONTENT, ' '));
			files(file_i).objects{object_i} = object;
		end
	end
end
