bad_images_list = textread('flickr_bad_img.list', '%s', 'delimiter', '\n');
list = dir('../Images/3dataset/flickr/*.jpg');
list = {list(1:end).name};
list = strcat('flickr/', list); 
new_list = {};
for i=1:length(list)
	if ismember(list{i}, bad_images_list)
		continue;
	end
	new_list = {new_list{1:end} list{i}};
end
new_file = fopen('flickr_img.list', 'w');
fprintf(new_file, '%s\n', new_list{:});
fclose(new_file);
