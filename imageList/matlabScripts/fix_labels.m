list1 = textread('../ADE20K_box_img.list', '%s', 'delimiter', '\n');
list2 = textread('../img.list', '%s', 'delimiter', '\n');
for i=50:500
	splits = strsplit(list1{i});
	if length(splits) > 2
		list2{i} = [list2{i} list1{i}(end-3:end)];
		list1{i} = list1{i}(1:end-4);
	end
end
file1 = fopen('ADE20K_box_img.list', 'w');
fprintf(file1, '%s\n', list1{:});
file2 = fopen('img.list', 'w');
fprintf(file2, '%s\n', list2{:});

