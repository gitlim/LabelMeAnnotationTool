function toggle_cube_move_indicators(toggle){
    for (var i = 0; i < cube_move_mode_arrows.length; i++){
        cube_move_mode_arrows[i].cone.material.visible = toggle;
        cube_move_mode_arrows[i].line.material.visible = toggle;
    }
    render();
}
function toggle_cube_rotate_indicators(toggle){
    rotate_mode_indicators[0].cone.material.visible = toggle;
    rotate_mode_indicators[0].line.material.visible = toggle;
    rotate_mode_indicators[1].material.visible = toggle;
    render();
}
function toggle_cube_resize_arrows(toggle){
    for (var i = 0; i < arrowHelper.arrow_list.length; i++){
            arrowHelper.arrow_list[i].cone.material.visible = toggle;
            arrowHelper.arrow_list[i].line.material.visible = toggle;
    }
}