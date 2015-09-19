function CreatePolygonClip(idx){//idx is id of parent
	console.log("clipping");
	while (main_canvas.GetAnnoByID(idx).GetType() != 0 && main_canvas.GetAnnoByID(idx).GetType() != 1){
		if (isNaN(LMgetObjectField(LM_xml, idx, 'ispartof'))){
			ClearCanvas();
			return;
		}
		idx = LMgetObjectField(LM_xml, idx, 'ispartof');
	}
	clip_on = 1;
	var context = document.getElementById("clipCanvas").getContext('2d');
	$("#clipCanvas").css('display', 'block');
	$("#clipCanvas").css('z-index', 1);
	$("#cnvs").css('z-index', 0);
	$("#boxCanvas").css('z-index', 2);	
	$("#container").css('z-index', 2);
	var canvas = document.getElementById("clipCanvas");
	/*context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false; /// future*/
	var width = $("#clipCanvas").width();
	var height = $("#clipCanvas").height();
	canvas.width = width;
	canvas.height = height;
	imageObj = new Image(width, height);
	var scale = main_media.GetImRatio();
	imageObj.onload = function(){
		polygon = new Polygon();
		context.save();
		context.drawImage(imageObj, 0, 0, width, height);
		context.globalCompositeOperation = "xor";
		context.beginPath();
		context.fillStyle = "blue";
		var coords_x = main_canvas.GetAnnoByID(idx).GetPtsX();
		var coords_y = main_canvas.GetAnnoByID(idx).GetPtsY();
		console.log(coords_x, coords_y);
		for (var i = 0; i < coords_x.length; i++){
			var point = new Point(coords_x[i]*scale, coords_y[i]*scale);
			polygon.add(point);
			if (i == 0){
				context.moveTo(coords_x[0]*scale, coords_y[0]*scale);
			}else{
				context.lineTo(coords_x[i]*scale, coords_y[i]*scale);
			}
		}		
		context.lineTo(coords_x[0]*scale, coords_y[0]*scale);
		context.closePath();	
		context.fill();
		context.globalCompositeOperation = "source-over";
		//drawing stroke
		context.beginPath();
		context.strokeStyle = "blue";
		var coords_x = main_canvas.GetAnnoByID(idx).GetPtsX();
		var coords_y = main_canvas.GetAnnoByID(idx).GetPtsY();
		console.log(coords_x, coords_y);
		for (var i = 0; i < coords_x.length; i++){
			if (i == 0){
				context.moveTo(coords_x[0]*scale, coords_y[0]*scale);
			}else{
				context.lineTo(coords_x[i]*scale, coords_y[i]*scale);
			}
		}
		context.lineTo(coords_x[0]*scale, coords_y[0]*scale);
		context.lineWidth = 5;
		context.closePath();
		context.stroke();	
	};
	imageObj.src = main_media.im.src;
}

function Screenshot(){
	$("#clipCanvas").css('display', 'block');
	$("#clipCanvas").css('z-index', 1);
	$("#cnvs").css('z-index', 1);
	$("#boxCanvas").css('z-index', 2);	
	$("#container").css('z-index', 2);
	
	var canvas = document.getElementById("clipCanvas");
	var dataurl = box_renderer.domElement.toDataURL("image/png");
	var context = document.getElementById("clipCanvas").getContext('2d');

	context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false; /// future
	var width = $("#clipCanvas").width();
	var height = $("#clipCanvas").height();

	var imageObj = new Image(width, height);
	var scale = main_media.GetImRatio();
	imageObj.onload = function(){
		context.drawImage(imageObj, 0, 0, width, height);
	};
	imageObj.src = main_media.im.src;
	/*var threed = new Image(width, height);
	threed.onload = function(){
		context.drawImage(threed, 0, 0, width, height);
	};
	threed.src = dataurl;*/
	var saved_image = canvas.toDataURL();
	console.log(saved_image);


}

function ClearCanvas(){
	console.log("clear");
	var context = document.getElementById("clipCanvas").getContext('2d');
	context.restore();
	document.getElementById("clipCanvas").style.display = "none";
	clip_on = 0;
	polygon = null;
}

function Point(x,y){
    this.x=x;
    this.y=y;
}

function Polygon(){
    this.points=[];
    this.x_min=undefined;
    this.x_max=undefined;
    this.y_min=undefined;
    this.y_max=undefined;

    this.add = function(p){
        this.points=this.points.concat(p);
        if (p.x<this.x_min){this.x_min=p.x;}
        if (p.x>this.x_max){this.x_max=p.x;}
        if (p.y<this.y_min){this.y_min=p.y;}
        if (p.y>this.y_min){this.y_max=p.y;}
    }

    this.pointInPoly = function(p){
        var j=(this.points.length-1);  //start by testing the link from the last point to the first point
        var isOdd=false;

        //check the bounding box conditions
        if (p.x < this.x_min || p.x > this.x_max || p.y < this.y_min || p.y > this.y_max){
            return false;
        }

        //if necessary use the line crossing algorithm
        for(var i=0; i<this.points.length; i++){
            if ((this.points[i].y<p.y && this.points[j].y>=p.y) ||  
                (this.points[j].y<p.y && this.points[i].y>=p.y)) {
                    if (this.points[i].x+(p.y-this.points[i].y)/(this.points[j].y-
                        this.points[i].y)*(this.points[j].x-this.points[i].x)<p.x)
                    { isOdd=(!isOdd);} }
            j=i;
        }
        return isOdd;
    }
}
