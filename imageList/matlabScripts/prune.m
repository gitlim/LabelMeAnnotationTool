gp_list = textread('wrong_gp_list.list', '%s', 'delimiter', '\n');
box_list = textread('wrong_boxes_list.list', '%s', 'delimiter', '\n');
bad_images_list = textread('bad_images_list.list', '%s', 'delimiter', '\n');

list = textread('img_copy.list', '%s', 'delimiter', '\n');
new_list = {};
for i=1:length(bad_images_list)
	tokens = strsplit(bad_images_list{i}, '/');
	bad_images_list{i} = tokens{end};
end
for i=1:length(gp_list)
	tokens = strsplit(gp_list{i}, '/');
	gp_list{i} = tokens{end};
end
whole_list = {gp_list{:,:} bad_images_list{:, :}};
for i=1:600
	if not(ismember(list{i}, whole_list))
		new_line = strsplit(list{i}, '/');
		new_line = ['ikea/' new_line{end}];
		new_list = {new_list{1:end} new_line};	
	end
end
new_file = fopen('pruned_gp_list.list', 'w');
fprintf(new_file, '%s\n', new_list{:});
fclose(new_file);
