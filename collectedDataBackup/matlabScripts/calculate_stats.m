load('gp_data_struct.mat');
load('ADE20K_gp.mat');
focal_array = [];
cou = 1;
data = [data(1:end) ADE20K_data(1:end)]
for i=0:length(data)
	try
		if isnan(data(i).objects{1}.plane.focal)
			data(i).objects{1}.plane.focal = 0;
		end
		focal_array = [focal_array, data(i).objects{1}.plane.focal*(256/max(data(i).im_dim))];
	catch ME
		continue;
	end
end
maximum = max(focal_array);
minimum = min(focal_array);
focal_array = round((focal_array - minimum)/(maximum - minimum)*1000);
average = mean(focal_array);
med = median(focal_array);
loss_average = sum(((focal_array - average).^2)/(2*length(focal_array)));
loss_med = sum(((focal_array - med).^2)/(2*length(focal_array)));
disp(loss_average);
disp(loss_med);
%average_f = sum_focals/length(data);

