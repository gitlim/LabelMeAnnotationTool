
function getDataArray(){
	$.get('imageList/img.list', function(data){
		data_array = data.split('\n');
		}
	);
}

function loadImageList(i){
	if (i == null) i = 0;
	var index = i*10;
	for (var j = 0; j < 10; j++){
		img_list[j] = data_array[index + j];
	}
	return img_list;
}