function box_label()
    LABEL_DIR = '/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup/boxData';
    VISUAL_DIR = '/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup/box_visual/box_visual';
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
   	for file_i = 1:1
  	%for file_i = 1:2
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
		objects = document.object;
		for object_i=1:length(objects);
			disp(document.object{object_i});
			if isfield(objects{object_i}, 'cube')
				cuboid = objects{object_i}.cube{1};
				position_tokens{object_i} = str2double(strsplit(cuboid.cube_position{1}.CONTENT, ' '));%note that this is the position of the center of the cuboids
				scale_tokens{object_i} = str2double(strsplit(cuboid.cube_scale{1}.CONTENT, ' '));
                rotation{object_i} = str2double(cuboid.cube_rotation{1}.CONTENT);
                cube_plane_tokens{object_i} = str2double(strsplit(cuboid.cube_matrix{1}.CONTENT, ' '));
			end
			if (isfield(objects{object_i}.name{1}, 'CONTENT'))
                if strcmpi(objects{object_i}.name{1}.CONTENT, 'groundplane')
                    data.focal = str2double(objects{object_i}.plane{1}.focal_length{1}.CONTENT)*scale_factor;
                    data.E = str2double(strsplit(objects{object_i}.plane{1}.plane_matrix{1}.CONTENT, ' '));
			
                end
            end
		end
			
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
		
			I = [data.focal 0 size(im,2)/2; 0 data.focal size(im,1)/2; 0 0 1];%intrinsic parameters
			
			for object_j =1:length(objects)
				if isfield(objects{object_j}, 'cube')
					E = reshape(data.E, 4, 4);
                    flip=eye(4); %identity
					flip(3,3)=-1;flip(2,2)=-1;%adding these values to identity matrix
                    flip2=eye(4); %identity
					%flip2(1,1)=-1;flip2(3,3)=-1;%adding these values to identity matrix
                    angle1 = pi*2;
                    angle2 = pi*2;
                    angle3 = pi*2;
                    
                    
                    flip3 = [cos(angle2) 0 sin(angle2) 0;
                            0 1 0 0;
                            -1*sin(angle2) 0 cos(angle2) 0;
                            0 0 0 1];
                    
                   
                    
                    flip4 = [cos(angle3) -1*sin(angle3) 0 0;
                            sin(angle3) cos(angle3) 0 0;
                            0 0 1 0;
                            0 0 0 1];
                    
                     
                    
                        flip2 = [1 0 0 0 ;
                            0 cos(angle1) -sin(angle1)  0;
                            0 sin(angle1) cos(angle1) 0;
                            0 0 0 1];
                     
                    
					T = eye(4); T(1,4)=-1; T(2,4)=-1;
					E=flip2*flip3*flip4*E*T;    
					K = I*E(1:3,:);%matrix for plane
					
					hold on;
                     
                    rotation_matrix = [cos(rotation{object_j}) -1*sin(rotation{object_j}) 0 0;
						sin(rotation{object_j}) cos(rotation{object_j}) 0 0;
						 0 0 1 0;
						 0 0 0 1];
					vertices = [
						.5 .5 -.5;
						-.5 .5 -.5;				
						-.5 .5 .5;
						.5 .5 .5;
						-.5 -.5 .5;
						.5 -.5 .5;
						.5 -.5 -.5;
						-.5 -.5 -.5;
					];, 
					lines = [1 4;
							1 2;
							1 7;
							2 3;
							2 8;
							3 4;
							3 5;
							4 6;				
							5 8;
							5 6;
							6 7;
							7 8;
							];
                    disp(scale_tokens{object_j});
                    position_tokens{object_j}(:,4) = 1;
                    disp(position_tokens{object_j});
                    position_tokens{object_j} = inv(E)*position_tokens{object_j}';
                    disp(position_tokens{object_j});
					vertices(:, 1) = vertices(:, 1)*scale_tokens{object_j}(1)*0.1 + position_tokens{object_j}(1);
					vertices(:, 2) = vertices(:, 2)*scale_tokens{object_j}(2)*0.1 + position_tokens{object_j}(2);
					vertices(:, 3) = vertices(:, 3)*scale_tokens{object_j}(3)*0.1 + position_tokens{object_j}(3);
					disp(vertices);
 					for l=1:length(lines)
						vertex_1 = lines(l, 1);
						vertex_2 = lines(l, 2);
						v3d = [vertices(vertex_1, :); vertices(vertex_2, :)];
						v3d(:, 4) = 1;
                        disp(v3d);
						v2d = K*rotation_matrix*v3d';
                        %disp(rotation_matrix);
                        %disp(v2d);
                        v2d = bsxfun(@rdivide, v2d(1:2,:), v2d(3, :))';
						%disp(v2d);
                        hold on; plot(v2d(:, 1), v2d(:, 2), 'y-'); hold off;
					end
					hold off;
					%{
                    hold on;%plotting grid lines?
					for x=0:10
						v3d = [-0.1*x 0 0; -0.1*x -1 0];
						v3d(:,4) = 1;
						v2d=K*v3d';
						%disp(v2d);
						if any(v2d(3,:) < 0)
							continue;
						end
						disp(v2d(1:2, :));
						disp(v2d(3, :));
						v2d=bsxfun(@rdivide, v2d(1:2,:), v2d(3,:))'; %projecting?
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
					%}
				end			
			end	
			exp_im = [num2str(files(file_i).id)];
			exp_im = [num2str(files(file_i).id)];%why is this duplicated?
			fprintf(F,'<a target="viewer" href="../gp_view.php?img=%d&userid=%s"><img src="%s"></a>\n', files(file_i).id, exp_im);
			axis on;
			set(gca, 'color', 'none');
			set(gcf, 'color', 'none');
			export_fig('-bmp', 'native', [VISUAL_DIR exp_im]);

		else
		end
        files(file_i).data = data;%computed data
        
        fprintf('(%d/%d) done.\n', file_i, length(files));
    end

    fclose(F);

