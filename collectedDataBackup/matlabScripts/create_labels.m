load('ikea_data.mat');
load('ADE20K_data.mat');
load('flickr_data.mat');
test = fopen('test.txt','w');
train = fopen('train.txt', 'w');
focal = fopen('focal.txt', 'w');
test_array = {};
train_array = {};
cou = 1;
max_focals = 0;
min_focals = 10000;
data = [data(1:end) ADE20K_data(1:end) flickr_data(1:end)];
focal_array = {};
focal_data = [];
for i=1:length(data)
	try
	data(i).objects{1}.plane.focal = data(i).objects{1}.plane.focal*(227/max(data(i).im_dim));
	focal_data(end+1) = data(i).objects{1}.plane.focal;
	end
end
focal_data(isnan(focal_data)) = [];
dev = std(focal_data);
average = mean(focal_data);
ceiling = 600;
for i=1:length(data)
	try
	if or(data(i).im_dim(1) > data(i).im_dim(2), data(i).objects{1}.plane.focal > ceiling)
		continue;
	end
		if data(i).objects{1}.plane.focal > max_focals
			max_focals = data(i).objects{1}.plane.focal;
		end
		if data(i).objects{1}.plane.focal < min_focals
			min_focals = data(i).objects{1}.plane.focal;
		end
		%focal_data(end+1) = data(i).objects{1}.plane.focal;
	catch ME
		continue;
	end
end
%average_f = sum_focals/length(data);
AoV_array = 2*atan(227./(2*focal_data));
for i=1:length(data)
	try
	if (data(i).im_dim(1) > data(i).im_dim(2)) | ~isfield(data(i), 'objects') | data(i).objects{1}.plane.focal > ceiling
		continue;
	end
		im_path = strsplit(data(i).im_path, '/');
		focal_array{i} = ['collectedDataBackup/gp_visual/' strjoin(im_path(end), '/') ' ' num2str(AoV_array(i)*180/pi)];
		if mod(i, 10) == 0
			%test_array{i/10} = [data(i).padded_im_path ' ' num2str(round((data(i).objects{1}.plane.focal - min_focals)/(max_focals - min_focals)*1000))];
			test_array{i/10} = [data(i).padded_im_path ' ' num2str(round(2*atan(227/(2*data(i).objects{1}.plane.focal))*180/pi))];
			continue;
		end
			train_array{cou} = [data(i).padded_im_path ' ' num2str(round(2*atan(227/(2*data(i).objects{1}.plane.focal))*180/pi))];
		%train_array{cou} = [data(i).padded_im_path ' ' num2str(round((data(i).objects{1}.plane.focal - min_focals)/(max_focals - min_focals)*1000))];
		cou = cou + 1;
	catch ME
		continue;
	end
end
disp(max_focals);
disp(min_focals);
disp(max_focals - min_focals);
test_array(1:end) = test_array(randperm(length(test_array)));
train_array(1:end) = train_array(randperm(length(train_array)));
fprintf(test, '%s\n', test_array{:});
fprintf(train, '%s\n', train_array{:});
fprintf(focal, '%s\n', focal_array{:});
fclose(focal);
fclose(test);
fclose(train);
