function category_list_load(filelist){
    var model_container = document.getElementById('model');
    for (var i = 0; i <= filelist.length; i++) {
        if (typeof filelist[i] != "undefined"){
            var link = document.createElement("a");
            link.addEventListener("click", model_list_populate, false);
            var tmp_param = filelist[i].split("/");
            if (typeof tmp_param[1] != "undefined"){
                var img = "model_list/models/"+ tmp_param[1].substring(0, 2)  + "/" + tmp_param[1].substring(0,4) +"/"+ tmp_param[1]+"/"+tmp_param[1]+"_thumb.jpg";
                link.innerHTML = tmp_param[0] + "<img class='model_item' name='"+tmp_param[0]+"' src='"+img+"'></br>";
                model_container.appendChild(link);
            }
        }
    }
}

function category_list_populate(event) {
    var param = event.target.name;
    var model_container = document.getElementById('model');
    model_container.innerHTML = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var filelist = JSON.parse(xmlhttp.responseText);
            category_list_load(filelist);
        }
    }
    xmlhttp.open("GET","./annotationTools/php/3d/model_server.php?task=submodel&param="+param,true);
    xmlhttp.send();
}

function createObject(container, name) {
    if (name == 'NONE') {
        if (container.children.length>1) {
            container.remove(container.children[1]);
            render();
        }
    return;
    }
    var model3d_material = new THREE.MeshNormalMaterial({side:THREE.DoubleSide,opacity:0.2});
    model3d_loader.load(name, function (object) {
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = model3d_material;
        }
    });

    object.name = name;
    window.select.model = object;
    if (container.children.length>1) {
        container.remove(container.children[1]);
    }
    container.add(object);
    render();
    });
}

function CreateModelList(){
    var html_str = '<div id="model_column"> \
      <div id="model"> \
      </div> \
    </div> ';
    InsertAfterDiv(html_str, 'body');
    $('#model_column').css('display', 'block');
}

function model_click_load(event) {
    var param = event.target.name;
    var name = "model_list/models/"+param.substring(0,2) + "/" + param.substring(0,4) + "/" + param+"/untitled.obj";
    createObject(window.select.cube, name);
    setup_model_list();
}

function model_list_load(filelist){
    var model_counter = 0;
    var model_container = document.getElementById('model');
    inner_counter = 0;
    for (var i = model_counter; i <= filelist.length; i++) {
        if (i == filelist.length){
            model_counter = i;
            break;
        }
        if (inner_counter >= 10){
            model_counter = model_counter + 10;
            break;
        }
        inner_counter = inner_counter + 1;
        var link = document.createElement("a");
        link.addEventListener("click", model_click_load, false);
        var tmp_param = filelist[i];
        var name = "model_list/models/"+tmp_param.substring(0,2) + "/" + tmp_param.substring(0,4) + "/" + tmp_param+"/"+tmp_param+"_thumb.jpg";
        link.innerHTML = "<img class='model_item' name='"+filelist[i]+"' src='"+name+"'></br>"
        model_container.appendChild(link);
    }
}

function model_list_populate(event) {
    var param = event.target.name + ".txt";
    var model_container = document.getElementById('model');
    model_container.innerHTML = "";
    var scrollAmount = $("#model").scrollTop();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var filelist = JSON.parse(xmlhttp.responseText);
            model_list_load(filelist);
            $("#model").scroll(function(event){
                var scrollAmount = $("#model").scrollTop();
                var scrollPercent = scrollAmount/$("#model").prop('scrollHeight')*100;
                if (scrollPercent > 40 && $("#model").prop('scrollHeight') < 4000){
                    model_list_load(filelist);
                }
                else if (scrollPercent > 80) {
                    model_list_load(filelist);
                }
            });
        }
    }
    xmlhttp.open("GET","./annotationTools/php/3d/model_server.php?task=submodel&param="+param,true);
    xmlhttp.send();
}

function setup_model_list() {
    var model_container = document.getElementById('model');
    if (!model_container){
        return ;
    }
    model_container.innerHTML = "<p style='margin-top:0px'>Browse 3D models</p>";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        var filelist = JSON.parse(xmlhttp.responseText);
        for (var i = 0; i < filelist.length; i++) {
                var link = document.createElement("a");
                link.className = "model_type";
                link.addEventListener("click", category_list_populate, false);
                category_name = filelist[i].replace(".list", "");
                category_name = category_name.split("/")[category_name.split("/").length-1];
                link.innerHTML = category_name;
                link.name = filelist[i];
                model_container.appendChild(link);
            }
        }
    }
    xmlhttp.open("GET","./annotationTools/php/3d/model_server.php?task=model_list",true);
    xmlhttp.send();
}