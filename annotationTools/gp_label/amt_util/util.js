function gup( name )
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
	return null;
    else
	return results[1];
}

function lookup_user(userid)
{
    var user_passed;

    //access mysql and lookup an user
    $.ajax({
	       async: false,
	       url: 'php/register_user.php',
	       type: 'GET',
	       data: 'userid='+userid+'&task=lookup'
	   }).done(function(data) { user_passed = data; });
    return user_passed;
}
