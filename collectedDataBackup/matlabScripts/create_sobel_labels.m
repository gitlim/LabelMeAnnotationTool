load('gp_data_struct.mat');
test = fopen('sobel_test.txt','w');
train = fopen('sobel_train.txt', 'w');
test_array = {};
train_array = {};
cou = 1;
max_focals = 0;
min_focals = 10000;
for i=1:length(data)
	try
		if data(i).objects{1}.plane.focal > max_focals
			max_focals = data(i).objects{1}.plane.focal;
		end
		if data(i).objects{1}.plane.focal < min_focals
			min_focals = data(i).objects{1}.plane.focal;
		end
	catch ME
		continue;
	end
end
%average_f = sum_focals/length(data);
for i=1:length(data)
	try
		if mod(i, 10) == 0
			test_array{i/10} = ['/archive/vision/torralba/3dataset/hairuo/Images/sobel/ikea/' data(i).im ' ' num2str(round((data(i).objects{1}.plane.focal - min_focals)/(max_focals - min_focals)*1000))];
			continue;
		end
		train_array{cou} = ['/archive/vision/torralba/3dataset/hairuo/Images/sobel/ikea/' data(i).im ' ' num2str(round((data(i).objects{1}.plane.focal - min_focals)/(max_focals - min_focals)*1000))];
		cou = cou + 1;
	catch ME
		continue;
	end
end
fprintf(test, '%s\n', test_array{:});
fprintf(train, '%s\n', train_array{:});
fclose(test);
fclose(train);
