function gp_label()
    LABEL_DIR = '/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup/gpDataCorrected';
    VISUAL_DIR = '/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup/visual';
	addpath(genpath('/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup'));
    
    VISUALIZE = true;
    
    % List all saved files
    folder = dir([LABEL_DIR]); %folders in directory starting with A/amt
    files = struct([]);
    cou = 0;
	tmp_files = dir([LABEL_DIR '/*.xml']); %gets all tmp files for each folder (data files)

	for j = 1:length(tmp_files) %loads name, username, and index into files struct
	   cou = cou + 1;
	   files(cou).file = tmp_files(j).name;
	   %files(cou).user = folders(folder_i).name;
	   files(cou).id = str2num(tmp_files(j).name(1:end-4)); %gets actual file id number w/o extension
	end
    
    % sort by img id
    [~,b] = sort([files.id]); %corresponding indices of sorted files
    files = files(b); %files now sorted

    F = fopen([VISUAL_DIR 'list.htm'], 'w');
	image_list_filename = '/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/imageList/img.list';
	urls = textread(image_list_filename, '%s');
    % Process each saved file
   %for file_i = 1:length(files)
   for file_i = 1:2
	   	filename = fullfile(LABEL_DIR, files(file_i).file);
		try
			document = xml_parseany(fileread(filename));
		catch ME
			disp(ME);
			continue
		end
		index = files(file_i).id + 1;
		data.im = urls{index};
		im = imread(data.im);
		[~, width, ~] = size(im);
		scale_factor = 800/width;
		disp(width);
		plane = document.object{1}.plane;
		op_points_tokens = strsplit(plane{1}.op_points{1}.CONTENT, ' ');
		data.origin = str2double(op_points_tokens(1:2));
		disp(op_points_tokens);
		data.focal = str2double(plane{1}.focal_length{1}.CONTENT)*scale_factor;
		disp(data.focal);
		plane_matrix_tokens = strsplit(plane{1}.plane_matrix{1}.CONTENT, ' ');
		data.E = reshape(str2double(plane_matrix_tokens(1:16)), 4, 4);
		vp_lines = plane{1}.lines{1}.vp_line;
		for m=1:length(vp_lines)
			vp_x1{m} = str2double(vp_lines{m}.x1{1}.CONTENT);
			vp_y1{m} = str2double(vp_lines{m}.y1{1}.CONTENT);
			vp_x2{m} = str2double(vp_lines{m}.x2{1}.CONTENT);
			vp_y2{m} = str2double(vp_lines{m}.y2{1}.CONTENT);
			vp_l{m} = str2double(vp_lines{m}.label{1}.CONTENT);
		end
		data.vp_x1 = vp_x1;
		data.vp_y1 = vp_y1;
		data.vp_x2 = vp_x2;
		data.vp_y2 = vp_y2;
		data.vp_l = vp_l;



		%annotation = DOMnode.getDocumentElement;
		%content = annotation.getChildNodes;
		%{
		for i=0:content.getLength -1
			if strcmpi(content.item(i).getTagName, 'object')
				object = content.item(i);
				name = object.getElementsByTagName('name').item(0);
				if (strcmpi(name.getNodeValue, 'groundplane'))
					groundplane = object;
				end
			end
		end
		%}
		%{
		groundplane_tags = groundplane.getChildNodes;
		for j=0:groundplane_tags.getLength -1
			if strcmpi(groundplane_tags.item(j).getTagName, 'plane')
				plane = groundplane_tags.item(j);	
			end
		end
		plane_data = plane.getChildNodes;
		for l=0:plane_data.getLength -1
			if strcmpi(plane_data.item(l).getTagName, 'lines')
				vp_lines = plane_data.item(l).getChildNodes;
				for m=1:vp_lines.getLength
					vp_x1(m) = str2double(vp_lines.getChildNodes.item(0))*scale_factor;
					vp_y1(m) = str2double(vp_lines.getChildNodes.item(1))*scale_factor;
					vp_x2(m) = str2double(vp_lines.getChildNodes.item(2))*scale_factor;
					vp_y2(m) = str2double(vp_lines.getChildNodes.item(3))*scale_factor;
				end
				data.vp_x1 = vp_x1;
				data.vp_y1 = vp_y1;
				data.vp_x2 = vp_x2;
				data.vp_y2 = vp_y2;
				data.vp_l = vp_l;
			end
			if strcmpi(plane_data.item(l).getTagName, 'op_points')
				op_points_tokens = strsplit(plane_data.item(l).getTextContext, ' ');
				data.origin = str2double(op_points_tokens(1:2))*scale_factor;
			end
			if strcmpi(plane_data.item(l).getTagName, 'plane_matrix')
				plane_matrix_tokens = strsplit(plane_data.item(l).getTextContext, ' ');
				data.E = reshape(str2double(plane_matrix_tokens(1:16)), 4, 4);
			end
			if strcmpi(plane_data.item(l).getTagName, 'focal_length');
				data.focal = str2double(plane_data.item(l).gettextcontext)*scale_factor;
			end
		end
		%}
		%{        
        tokens = textread(filename, '%s');
        
        % saved data too small that it error
        if length(tokens) < 5
            continue;
        end

        cou = 0;
        
        % image
        data.im = tokens{cou+1};
        % labeler
        data.user = tokens{cou+2};
        cou=cou+2;
                
        % VP data (the width of image = 800px)
        vp_n = str2double(tokens{cou+1});
        cou = cou+1;
        for j = 1:vp_n            
            vp_x1(j) = str2double(tokens{cou+1});
            vp_y1(j) = str2double(tokens{cou+2});
            vp_x2(j) = str2double(tokens{cou+3});
            vp_y2(j) = str2double(tokens{cou+4});
            vp_l(j) = str2double(tokens{cou+5});
            cou=cou+5;
        end
        data.vp_x1 = vp_x1;
        data.vp_y1 = vp_y1;
        data.vp_x2 = vp_x2;
        data.vp_y2 = vp_y2;
        data.vp_l = vp_l;
        
        % Origin
        data.origin = str2double(tokens(cou+1:cou+2));
        cou = cou + 2;
        
        % Focal length
        data.focal = str2double(tokens{cou+1});
        cou = cou + 1;
        
        % Groundplane data
        data.E = reshape(str2double(tokens(cou+1:cou+16)), 4, 4); %4x4 matrix
        cou = cou + 16;
        
        %}
        % Visualization...
        if (VISUALIZE)
            figure(1);%creates figure, names 1
            gcf;
			FigHandle = gcf;
            
            im = imread(data.im);%url
            im = imresize(im, [nan 800]);
            image(im);
			[new_height, new_width, new_depth] = size(im);
			FigHandle.Units = 'pixels';
			set(gcf,'Units', 'pixels', 'Position', [0, 0, 800, 600]);
			truesize([600, 800]);
			hold on;% retains previous plots of graphs, in this case vp lines i
            for l=1:length(vp_x1)
                if vp_l{l} == 1
                    plot([vp_x1{l}, vp_x2{l}]*new_width, [vp_y1{l}, vp_y2{l}]*new_height, 'go-');
                else
                    plot([vp_x1{l}, vp_x2{l}]*new_width, [vp_y1{l}, vp_y2{l}]*new_height, 'ro-');
                end
            end
			plot(data.origin(1)*new_width, data.origin(2)*new_height, 'bo');%op line
            hold off;
            
            I = [data.focal 0 size(im,2)/2; 0 data.focal size(im,1)/2; 0 0 1];%intrinsic parameters
            
            E = data.E;            
            flip=eye(4); %identitiy
            flip(2,2)=-1;flip(3,3)=-1;%adding these values to identity matrix
            T = eye(4); T(1,4)=1; T(2,4)=1;
            E=flip*E*T;            
            K = I*E(1:3,:);%matrix for plane
            
            hold on;%plotting grid lines?
            for x=0:10
                v3d = [-0.1*x 0 0; -0.1*x -1 0];
                v3d(:,4) = 1;
                v2d=K*v3d';
				disp(K);
                if any(v2d(3,:) < 0)
                    continue;
                end
                v2d=bsxfun(@rdivide, v2d(1:2,:), v2d(3,:))';
				disp(v2d);
                hold on; plot(v2d(:,1),v2d(:,2),'y-'); hold off;
            end
            for y=0:10
                v3d = [0 -0.1*y 0; -1 -0.1*y 0];
                v3d(:,4) = 1;
                v2d=K*v3d';
                if any(v2d(3,:) < 0)
                    continue;
                end
                v2d=bsxfun(@rdivide, v2d(1:2,:), v2d(3,:))';
                hold on; plot(v2d(:,1),v2d(:,2),'y-'); hold off;
            end
            if (0)
                v3d = [0 0 0; -0.05 -0.05 0; -0.05 0 0; 0 -0.05 0; 0 0 0.05; -0.05 -0.05 0.05; -0.05 0 0.05; 0 -0.05 0.05; ];
                v3d(:,4) = 1;
                v2d=K*v3d';
                v2d=bsxfun(@rdivide, v2d(1:2,:), v2d(3,:))';
                hold on; plot(v2d(:,1),v2d(:,2),'ro'); hold off;
            end
            
            exp_im = [num2str(files(file_i).id)];
            exp_im = [num2str(files(file_i).id)];%why is this duplicated?
            fprintf(F,'<a target="viewer" href="../gp_view.php?img=%d&userid=%s"><img src="%s"></a>\n', files(file_i).id, exp_im);
            axis off;
            set(gca, 'color', 'none');
            set(gcf, 'color', 'none');
            export_fig('-jpg', [VISUAL_DIR exp_im]);

        else
        end
        
        files(file_i).data = data;%computed data
        
        fprintf('(%d/%d) done.\n', file_i, length(files));
    end

    fclose(F);

