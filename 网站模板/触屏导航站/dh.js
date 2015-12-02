// JavaScript Document

function dh(obj,id){
	var tab_li=obj.parentNode.getElementsByTagName("li");
	var tab_nr=document.getElementById(id).getElementsByTagName("div");
	for(i=0;i<tab_nr.length;i++)
	{
		if(obj==tab_li[i]){
			tab_li[i].className="dh_active";
		    tab_nr[i].style.display='block';
			}else{
				tab_li[i].className="";
				tab_nr[i].style.display='none';
				}
	}
};
function tip(id)
{
	var tipbox=document.getElementById(id);
	var a=document.getElementById('b');
		if(tipbox.style.display=='block')
		{
			tipbox.style.display='none';
			}
		else{
			tipbox.style.display='block';
		}
}
