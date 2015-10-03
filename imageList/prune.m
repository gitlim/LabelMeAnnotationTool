gp_list = textread('wrong_gp_list.list', '%s', 'delimiter', '\n');
box_list = textread('wrong_boxes_list.list', '%s', 'delimiter', '\n');
bad_images_list = textread('bad_images_list.list', '%s', 'delimiter', '\n');
whole_list = {gp_list{:,:} box_list{:, :} bad_images_list{:, :}};
list = textread('img_copy.list', '%s', 'delimiter', '\n');
new_list = {};
for i=1:164
	if not(ismember(list{i}, whole_list))
		new_list = {new_list{1:end} list{i}};	
	end
end
new_file = fopen('pruned_list.list', 'w');
fprintf(new_file, '%s\n', new_list{:});
fclose(new_file);
