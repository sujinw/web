// JavaScript Document

window.onload=function()
{
	
	var oNav=document.getElementById('nav');
	var aS=getByClass(oNav, "ss")[0];
	var aSs=document.getElementById('headerss');
	
	var index_menu=document.getElementById('index_menu');
	var div_bg=document.getElementById('div_bg');
	var block_index_menu=document.getElementById('block_index_menu');
	var index_menu_btn=document.getElementById('index_menu_btn');
	
	var searchTag=document.getElementById('searchTag');
	var selecttags=document.getElementById('selecttags');
	
	var SmsDiv=getByClass(oNav, "sms")[0];
	var SmsA=SmsDiv.getElementsByTagName("a");
	
	var sp_tj = document.getElementsByClassName("sp_tj");
    var sp_img = document.getElementsByClassName("sp_img");
	

	
	aS.onclick=function()
	{
		//alert("a");
		
		if(aSs.style.display=="block")
		{
			aSs.style.display="none";
			startMove(aSs, 'opacity', 0);
		}
		else
		{
			aSs.style.display="block"
			startMove(aSs, 'opacity', 100);
		}
		
	};
	
	index_menu.onclick=function()
	{
		//alert("a");
		div_bg.style.display= "block";
		block_index_menu.style.display= "block";
		startMove(block_index_menu, "right", 0);
	};
	div_bg.onclick=index_menu_btn.onclick=function()
	{
		startMove(block_index_menu, "right", "-200px");
		div_bg.style.display= "none";
		block_index_menu.style.display= "none";
		startMove(block_index_menu, "right", "-200px");
	};
	
	if(searchTag.getElementsByTagName('a'))
	{
	  var searchTagA=searchTag.getElementsByTagName('a');
	  for(var i=0;i<searchTagA.length;i++)
	  {
		  searchTagA[i].onclick=function()
		  {
			  selecttags.value=selecttags.value+";"+ this.innerHTML;
		  };
	  }
	}
	
	for(var i=0;i<SmsA.length;i++)
	{
		SmsA[i].id="smscont";
		
	}
	var aSms=document.getElementById('smscont');
	if(aSms.innerHTML=="0"||aSms.innerHTML=="")
	{
		startMove(SmsDiv, 'opacity', 0);
	}
	else
	{
		startMove(SmsDiv, 'opacity', 100);
	}
	
	
    for (var i = 0; i < sp_tj.length; i++)
	 {
        if (sp_tj[i].innerHTML == "<strong class=\"bj\">0</strong>") 
		{
            sp_img[i].innerHTML = "<img src='/happylife/images/forum.gif' alt='论坛'>";
            sp_tj[i].style.display = "none";
        } 
	    else 
		{
            sp_img[i].innerHTML = "<img src='/happylife/images/forum_new.gif' alt='论坛'>";
            sp_tj[i].style.display = "block";
        };
	 }
	 
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
		if(tipbox.style.display=='block')
		{
			tipbox.style.display='none';
			}
		else{
			tipbox.style.display='block';
		}
}

	
};

window.onscroll=function()
{
	var Top=document.documentElement.scrollTop || document.body.scrollTop;
	var ShowBtn=document.getElementById('navbtn');
	var Header=document.getElementById('nav');
	if(Top<110){
		 ShowBtn.style.display='none';
		 Header.className='header';
		}
	else
	{
		 ShowBtn.style.display='block';
		 ShowBtn.onclick=function()
	     {
			  Header.className='header fix'
			  ShowBtn.style.top=Header.offsetHeight+'px';
		 };
	  Header.className='header';
	}
};
function input_yz(input, id, no) {
    var inp_ut = document.getElementById(input);
    var inp_id = document.getElementById(id);
    if (inp_id.value != "") {
        document.getElementById(input).style.display = "block";
    } else {
        document.getElementById(input).style.display = "none";
    }
    inp_ut.onclick = function () {
        no.value = "";
        document.getElementById(input).style.display = "none";
    }
};
function kaiguan(id) {
    if (document.getElementById(id).style.display != "block") 
	{
        document.getElementById(id).style.display = "block";
    } else {
		
        document.getElementById(id).style.display = "none";
    }
};
function SwitchMenu(obj)
{
	if(document.getElementById)
	{
		var el = document.getElementById("Menu_"+obj);
		var ar = document.getElementById("Menu").getElementsByTagName("ul");
		var sp = document.getElementById("Menu").getElementsByTagName("span");
		var spn= document.getElementById("span_"+obj);
		if(el.style.display != "block")
		{
			for (var i=0; i<ar.length; i++)
			{
				if (ar[i].className=="submenu")
				ar[i].style.display = "none";
				sp[i].innerHTML='+';
				document.getElementById("Menu"+(i+1)).className="Menutbg_1 cursor";
				}
            el.style.display = "block";
            spn.innerHTML='-';
            document.getElementById("Menu"+obj).className="Menutbg_2 cursor"
       }
       else
	   {
		   el.style.display = "none";
		   spn.innerHTML='+';
		   document.getElementById("Menu"+obj).className="Menutbg_1 cursor";
		}
    }
};