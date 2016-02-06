
    LABEL_DIR = '/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup/boxData';
    VISUAL_DIR = '/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup/box_visual/box_visual';
	addpath(genpath('/afs/csail.mit.edu/u/h/hairuo/public_html/test/LabelMeAnnotationTool/collectedDataBackup'));
	%load('data_struct.mat');
    load('ADE20K_box_data.mat');
    %load('ADE20K_box.mat');
	VISUALIZE = true;
    %data = box_data; 
	data = ADE20K_box;
    % List all saved files
	x_dim = [];
	y_dim = [];
	z_dim = [];
	urls = {data(1:end).im_path};
    % Process each saved file
   	for file_i = 1:200
  	%for file_i = 1:2
		filename = data(file_i).anno_path;
		try
			document = xml_parseany(fileread(filename));
		catch ME
			disp(ME);
			continue;
		end
		im_data.im = data(file_i).im_path;
		im = imread(im_data.im);
		[height, width, ~] = size(im);
		%height = data(file_i).im_dim(1);
		%width = data(file_i).im_dim(2);
		scale_factor = 800/width;
		%scale_factor = 1;
		objects = document.object;
		counter = 0;
		for object_i=1:length(objects);
			if isfield(objects{object_i}, 'cube')
				counter = counter + 1;
				cuboid = objects{object_i}.cube{1};
				position_tokens{object_i} = str2double(strsplit(cuboid.cube_position{1}.CONTENT, ' '));%note that this is the position of the center of the cuboids
				scale_tokens{object_i} = str2double(strsplit(cuboid.cube_scale{1}.CONTENT, ' '));
                rotation{object_i} = str2double(cuboid.cube_rotation{1}.CONTENT);
                cube_plane_tokens{object_i} = str2double(strsplit(cuboid.cube_matrix{1}.CONTENT, ' '));
				x_dim(end+1) = cube_plane_tokens{object_i}(1);
				y_dim(end+1) = cube_plane_tokens{object_i}(2);
				z_dim(end+1) = cube_plane_tokens{object_i}(3);
			end
			if (isfield(objects{object_i}.name{1}, 'CONTENT'))
                if strcmpi(objects{object_i}.name{1}.CONTENT, 'groundplane')
                    im_data.focal = str2double(objects{object_i}.plane{1}.focal_length{1}.CONTENT)*scale_factor;
                    im_data.E = str2double(strsplit(objects{object_i}.plane{1}.plane_matrix{1}.CONTENT, ' '));
			
                end
                if isfield(objects{object_i}, 'plane')
            		plane_focal{object_i} = str2double(objects{object_i}.plane{1}.focal_length{1}.CONTENT)*scale_factor;
				end
			end
		end
		if counter == 0
			continue;
		end	
			% Visualization...
		counter = 0;
		if (VISUALIZE)
			figure('units', 'pixels');%creates figure, names 1
			pos = get(gcf, 'pos');
			disp(pos);
			gcf;
			FigHandle = gcf;
			
			im = imread(im_data.im);%url
			im = imresize(im, 800/width);
			disp(get(gcf, 'pos'));
			image(im);
			[new_height, new_width, new_depth] = size(im);
			%FigHandle.Units = 'pixels';
			disp(size(im));
			set(gcf, 'Units', 'pixels', 'Position', [0 0  800 new_height]);
			disp(get(gcf, 'pos'));
		
			I = [im_data.focal 0 size(im,2)/2; 0 im_data.focal size(im,1)/2; 0 0 1];%intrinsic parameters
			
			for object_j =1:length(objects)
				if str2double(objects{object_j}.deleted{1}.CONTENT) ~= 0
					continue;
				end 

				if isfield(objects{object_j}, 'cube')
					counter = counter + 1;
					E = reshape(cube_plane_tokens{object_i}, 4, 4);
                    flip=eye(4); %identity
					flip(3,3)=-1;flip(2,2)=-1;%adding these values to identity matrix
                                 
					old_E = E; 
					T = eye(4); T(1,4)=1; T(2,4)=1;
					E=flip*E;    
					K = I*E(1:3,:);%matrix for plane
					
					hold on;
                     
					
                    rotation_matrix = makehgtform('zrotate', rotation{object_j}); 
					vertices = [
						.5 .5 -.5 1;
						-.5 .5 -.5 1;				
						-.5 .5 .5 1;
						.5 .5 .5 1;
						-.5 -.5 .5 1;
						.5 -.5 .5 1;
						.5 -.5 -.5 1;
						-.5 -.5 -.5 1;
					];
					rot_shift = makehgtform('zrotate', pi/2);
									%vertices = vertices(:, 1:3);
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
                    position_tokens{object_j}(:,4) = 1;
                    position_tokens{object_j} = inv(old_E)*position_tokens{object_j}';
					vertices(:, 1) = vertices(:, 1)*scale_tokens{object_j}(1)*0.1;% + position_tokens{object_j}(1);
					vertices(:, 2) = vertices(:, 2)*scale_tokens{object_j}(2)*0.1;% + position_tokens{object_j}(2);
					vertices(:, 3) = vertices(:, 3)*scale_tokens{object_j}(3)*0.1;% + position_tokens{object_j}(3);
					vertices = rotation_matrix*vertices';
					vertices = vertices';
					vertices = vertices(:, 1:3);
					vertices(:, 1) = vertices(:, 1) + position_tokens{object_j}(1);
					vertices(:, 2) = vertices(:, 2) + position_tokens{object_j}(2);
					vertices(:, 3) = vertices(:, 3) + position_tokens{object_j}(3);

					

					%vertices(:, 1:2) = vertices(:, 1:2)*-1;
 					for l=1:length(lines)
						vertex_1 = lines(l, 1);
						vertex_2 = lines(l, 2);
						v3d = [vertices(vertex_1, :); vertices(vertex_2, :)];
						v3d(:, 4) = 1;
						v2d = K*v3d';
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
			if counter == 0
				continue;
			end
			[~, exp_im, ~] = fileparts(filename);
			disp(exp_im);	
			axis off;
			set(gca, 'color', 'none');
			set(gcf, 'color', 'none');
			%truesize([600, 800]);
			saveas(gcf, ['./box_visual/' exp_im '.jpg']);
		else
		disp(length(x_dim));
		        fprintf('(%d/%d) done.\n', file_i, length(data));
    end
	end
	%{
	disp(length(x_dim));
	disp(length(y_dim));
	disp(length(z_dim));
	figure;
	subplot(2, 1, 1);
	h1 = abs(bsxfun(@max,x_dim, y_dim)./z_dim);
	i1 = find(h1 > 5)
	h1(i1) = [];
	hist(h1, 40);
	title('Histogram of ratios of object width over height', 'FontSize', 16);
	xlabel('Ratio of object width (wider side) over object height', 'FontSize', 16);
	ylabel('Number of images', 'FontSize', 16);
	subplot(2, 1, 2);
	h2 = abs(bsxfun(@min, x_dim, y_dim)./z_dim)
	i2 = find(h2>0.6);
	h2(i2) = [];
	hist(h2, 40);
	title('Histogram of ratios of object depth over height', 'FontSize', 16);
	xlabel('Ratio of object depth over object height', 'FontSize', 16);
	ylabel('Number of images', 'FontSize', 16);

		print -dpng xz.png;
	%}
    %fclose(F);

