list1 = textread('../collectedDataBackup/bad_images.list', '%s', 'delimiter', '\n');
list2 = textread('../collectedDataBackup/flickr_bad_images_list.list', '%s', 'delimiter', '\n');
new_list = {list1{:} list2{:}};
new_list = unique(new_list);
new_file = fopen('flickr_bad_img.list', 'w');
fprintf(new_file, '%s\n', new_list{:});
fclose(new_file);
