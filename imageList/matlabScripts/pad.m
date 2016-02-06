images = textread('../imageList/flickr_img.list', '%s');
for i=1:length(images)
	name = images{i};
	if exist(['/archive/vision/torralba/3dataset/hairuo/Images/padded/' name], 'file')
		continue;
	end
	try
		im = imread(['3dataset/' name], 'jpg');
	catch
		continue;
	end
	%h = fspecial('sobel');
	%im = imfilter(im, h);
	[height, width, ~] = size(im);
	%disp(size(im));
	if height > width
		padding = floor((height - width)/2);
		im = padarray(im, [0 padding]);
	else
		padding = floor((width - height)/2);
		im = padarray(im, [padding 0]);
	end
	disp(padding);
	im = imresize(im, [256 256]);
	imwrite(im, ['/archive/vision/torralba/3dataset/hairuo/Images/padded/' name], 'jpg');
end
