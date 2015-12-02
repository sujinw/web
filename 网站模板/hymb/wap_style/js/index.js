// JavaScript Document
function tab(obj,id){
	var tab_li=obj.parentNode.getElementsByTagName("li");
	var tab_nr=document.getElementById(id).getElementsByTagName("ul");
	for(i=0;i<tab_nr.length;i++)
	{
		if(obj==tab_li[i]){
			tab_li[i].className="active";
		    tab_nr[i].style.display='block';
			//startMove(tab_nr[i],'width',"100%");
			}else{
				tab_li[i].className="";
				tab_nr[i].style.display='none';
				//startMove(tab_nr[i],'width',0);
				}
	}
};

 function SwitchMenu(obj){
  if(document.getElementById){
  var el = document.getElementById("Menu_"+obj);
  var ar = document.getElementById("Menu").getElementsByTagName("ul");
  var sp = document.getElementById("Menu").getElementsByTagName("span");
  var spn= document.getElementById("span_"+obj);
   if(el.style.display != "block"){ 
    for (var i=0; i<ar.length; i++){
     if (ar[i].className=="submenu")
     ar[i].style.display = "none";
	 sp[i].innerHTML='+';
     document.getElementById("Menu"+(i+1)).className="Menutbg_1 cursor";
    }
    el.style.display = "block";
	spn.innerHTML='-';
    document.getElementById("Menu"+obj).className="Menutbg_2 cursor"
   }else{
    el.style.display = "none";
	spn.innerHTML='+';
    document.getElementById("Menu"+obj).className="Menutbg_1 cursor";
   }
  }
 }

window.onload=function ()
{
    var sp_tj = document.getElementsByClassName("sp_tj");
    var sp_img = document.getElementsByClassName("sp_img");
	
	var oBtnSlider = document.getElementById('settings');
	var aSlider = document.getElementById('opciones');
	
    for (var i = 0; i < sp_tj.length; i++)
	 {
        if (sp_tj[i].innerHTML == "<strong class=\"bj\">0</strong>") 
		{
            sp_img[i].innerHTML = "<img src='images/forum.gif' alt='论坛'>";
            sp_tj[i].style.display = "none";
        } 
	    else 
		{
            sp_img[i].innerHTML = "<img src='images/forum_new.gif' alt='论坛'>";
            sp_tj[i].style.display = "block";
        };
    };
	
}
function kaiguan(id)
{
	if(document.getElementById(id).style.display=='block')
	{
		  document.getElementById(id).style.display='none';
	}
	else
	{
		  document.getElementById(id).style.display='block';
		  if(id=="login"){
			  document.getElementById(id).style.left=Math.floor((document.documentElement.clientWidth-document.getElementById(id).offsetWidth)/2)+ "px";
			  document.getElementById(id).style.top=Math.floor((document.documentElement.clientHeight-document.getElementById(id).offsetHeight)/8)+ "px";
			  };
	}	
};
