function postDigg(ftype,aid)
{
	var saveid = GetCookie('diggid');
	if(saveid != null)
	{
		var saveids = saveid.split(',');
		var hasid = false;
		saveid = '';
		j = 1;
		for(i=saveids.length-1;i>=0;i--)
		{
			if(saveids[i]==aid && hasid) continue;
			else {
				if(saveids[i]==aid && !hasid) hasid = true;
				saveid += (saveid=='' ? saveids[i] : ','+saveids[i]);
				j++;
				if(j==20 && hasid) break;
				if(j==19 && !hasid) break;
			}
		}
		if(hasid) { alert("您已经顶过该帖，请不要重复顶帖 ！"); return; }
		else saveid += ','+aid;
		SetCookie('diggid',saveid,1);
	}
	else
	{
		SetCookie('diggid',aid,1);
	}
	
	var a = $('#digg-'+ftype);
	a.text(parseInt(a.text())+1);
	
	$.getJSON("../../plus/digg_ajax.php", {action:ftype, id:aid, outputtype:'json'}, function(r){
		$('#digg-good').text(r.goodpost);
		$('#digg-bad').text(r.badpost);
	});
}

function getDigg(aid)
{
	$.getJSON("../../plus/digg_ajax.php", {id:aid, outputtype:'json'}, function(r){
		$('#digg-good').text(r.goodpost);
		$('#digg-bad').text(r.badpost);
	});
}
