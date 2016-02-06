function x = change_address_script(list_address, string_to_append)
list = textread(list_address, '%s', 'delimiter', '\n');
new_list = {};
for i=1:length(list)
		new_line = [string_to_append list{i}];
		new_list = {new_list{1:end} new_line};	
end
new_file = fopen(list_address, 'w');
fprintf(new_file, '%s\n', new_list{:});
fclose(new_file);
end
