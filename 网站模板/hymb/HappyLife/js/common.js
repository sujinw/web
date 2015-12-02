// JavaScript Document
 function $(id)
{
	
	return document.getElementById(id);
};
function HY_searchType(obj, aClick, inp, typ)
{
	if($(obj).style.display!='block')
	{
		$(obj).style.display='block';
		var aSearch=$(aClick).getElementsByTagName('a');
		
		for(var i=0; i<aSearch.length;i++)
		{
			aSearch[i].onclick=function()
			{
				$(inp).value=this.rel;
				$(typ).innerHTML=this.innerHTML+"▼";
				$(obj).style.display='none';
			}
		}
		
	}else{
		$(obj).style.display='none';
	}
};
function input_yz(input, id, no) {
    var inp_ut = $(input);
    var inp_id = $(id);
    if (inp_id.value != "") {
        $(input).style.display = "block";
    } else {
        $(input).style.display = "none";
    }
    inp_ut.onclick = function () {
        no.value = "";
        $(input).style.display = "none";
    }
};
function kaiguan(id) {
    if ($(id).style.display != "block") 
	{
        $(id).style.display = "block";
    } else {
		
        $(id).style.display = "none";
    }
};
function SwitchMenu(obj)
{
	if($)
	{
		var el = $("Menu_"+obj);
		var ar = $("Menu").getElementsByTagName("ul");
		var sp = $("Menu").getElementsByTagName("span");
		var spn= $("span_"+obj);
		if(el.style.display != "block")
		{
			for (var i=0; i<ar.length; i++)
			{
				if (ar[i].className=="submenu")
				ar[i].style.display = "none";
				sp[i].innerHTML='+';
				$("Menu"+(i+1)).className="Menutbg_1 cursor";
				}
            el.style.display = "block";
            spn.innerHTML='-';
            $("Menu"+obj).className="Menutbg_2 cursor"
       }
       else
	   {
		   el.style.display = "none";
		   spn.innerHTML='+';
		   $("Menu"+obj).className="Menutbg_1 cursor";
		}
    }
};
function goTop(acceleration, time) 
{
    acceleration = acceleration || 0.1;
    time = time || 16;
  
    var x1 = 0;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;
    var x3 = 0;
    var y3 = 0;
  
    if (document.documentElement) {
        x1 = document.documentElement.scrollLeft || 0;
        y1 = document.documentElement.scrollTop || 0;
    }
    if (document.body) {
        x2 = document.body.scrollLeft || 0;
        y2 = document.body.scrollTop || 0;
    }
    var x3 = window.scrollX || 0;
    var y3 = window.scrollY || 0;
  
    var x = Math.max(x1, Math.max(x2, x3));
    var y = Math.max(y1, Math.max(y2, y3));
  
    var speed = 1 + acceleration;

    window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));

    if(x > 0 || y > 0) {

        var invokeFunction = "goTop(" + acceleration + ", " + time + ")";

        window.setTimeout(invokeFunction, time);

    }

};
window.onload=function()
{
	
	var oNav=$('nav');
	var aS=getByClass(oNav, "ss")[0];
	var aSs=$('headerss');
	
	var index_menu=$('index_menu');
	var div_bg=$('div_bg');
	var block_index_menu=$('block_index_menu');
	var index_menu_btn=$('index_menu_btn');
	
	var searchTag=$('searchTag');
	var selecttags=$('index_search_txt');
	
	var SmsDiv=getByClass(oNav, "sms")[0];
	var SmsA=SmsDiv.getElementsByTagName("a");
	
	var sp_tj = document.getElementsByClassName("sp_tj");
    var sp_img = document.getElementsByClassName("sp_img");
	
	var searchBox=$('search_box');
	var searchType=$('searchtype');
	var searchUl=$('index_search_ul');
	var searchBtn=$('searchBtn');
	
	if(searchType)
	{
		searchType.onclick=function()
		{
			HY_searchType('index_search_ul', 'index_search_ul', 'index_search_type', 'searchtype');
		}
		searchBtn.onclick=function()
		{
			var oBtn = $('searchForm');
				oBtn.submit();
		}
	}
	

	
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
	
	if(searchTag)
	{
	  var searchTagA=searchTag.getElementsByTagName('a');
	  for(var i=0;i<searchTagA.length;i++)
	  {
		  searchTagA[i].onclick=function()
		  {
			  selecttags.value=selecttags.value+" "+ this.innerHTML;
		  };
	  }
	};
	
	for(var i=0;i<SmsA.length;i++)
	{
		SmsA[i].id="smscont";
		
	}
	var aSms=$('smscont');
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
};
window.onscroll=function()
{
	var Top=document.documentElement.scrollTop || document.body.scrollTop;
	var ShowBtn=$('navbtn');
	var Header=$('nav');
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
