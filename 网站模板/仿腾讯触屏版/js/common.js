/* JavaScript Document
作者：雪月青
地址：3ghy.com
copyright 2014
*/
function getByClass(oParent, sClass)
{
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	
	for(var i=0;i<aEle.length;i++)
	{
		if(aEle[i].className==sClass)
		{
			aResult.push(aEle[i]);
		}
	}
	
	return aResult;
}

//调用登陆框、导航部分
function oc(id){
    if(document.getElementById(id).style.display!='block'){
		document.getElementById(id).style.display='block';
		if(id=="nav_pop"){
			id.className="";
			document.getElementById('nav-pop-pnl').className='nav-top  new-nav-top';}
		if(id=="login_box"){
		   document.getElementById('ptmask').style.display="block";
	       document.getElementById(id).style.top=(document.documentElement.clientHeight-login_box.offsetHeight)/4+"px";
	       document.getElementById(id).style.left=(document.documentElement.clientWidth-login_box.offsetWidth)/2+"px";}
		}else{
				document.getElementById(id).style.display='none';
		if(id=="nav_pop"){
			id.className="close";
			document.getElementById('nav-pop-pnl').className='nav-top  new-nav-top close';}
		if(id=="login_box"){
		document.getElementById('ptmask').style.display="none";
			}
			}
	}	

//登陆框清除字符部分
function pt_inp(obj,id,en){
	var inp_t=document.getElementById(obj);
	var inp_id=document.getElementById(id);
	
	if(inp_t.value!=""){
		inp_id.style.display='block';
		}else{
		inp_id.style.display='none';
			}
	inp_id.onclick=function(){
		inp_id.style.display='none';
		en.value='';
		}
}
window.onscroll = function () {//滚动条事件
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    var lanmu = document.getElementById('fixed-title');
	  /* if(top<900||top>2300){
		   lanmu.style.display='none';}
	   else */if(top>=900&&top<1400){
			var news_t= document.getElementById('mod-news');
			var news_t_c=news_t.getElementsByClassName('module-t')[0].innerHTML;
		
		    lanmu.innerHTML=news_t_c;					
			lanmu.style.display='-webkit-box';
			}
		else if(top>=1400&&top<1650){
			var finance=document.getElementById('mod-finance');
			var finance_c=finance.getElementsByClassName('module-t')[0].innerHTML;
				lanmu.innerHTML=finance_c;
			    lanmu.style.display='-webkit-box';
				}
		else if(top>=1650&&top<2000){
			var sports= document.getElementById('mod-sports');
			var sports_c=sports.getElementsByClassName('module-t')[0].innerHTML;
			lanmu.innerHTML=sports_c;
			lanmu.style.display='-webkit-box';
			}
		else if(top>=2000&&top<2350){
			var ent=document.getElementById('mod-ent');
			var ent_c=ent.getElementsByClassName('module-t')[0].innerHTML;
			lanmu.innerHTML=ent_c;
			lanmu.style.display='-webkit-box';
				}
	else{
		 //lanmu.style.display='-webkit-box';
		 lanmu.style.display='none';}
}
window.onload=function (){
	
	var to_top=document.getElementById('gotop');
	var to_bot=document.getElementById('gobot');
	var full=document.getElementById('gofull');
	var simp=document.getElementById('gosimp');
	var tips=document.getElementById('tips');
	var tab=document.getElementById('tab');
	var tab_div=tab.getElementsByTagName('div');
	var tab_c=document.getElementById('time-nav');
	var tab_a=tab_c.getElementsByTagName('a');

	 to_top.onclick=function(){
				 scroll(0,0)
	 }
	 to_bot.onclick=function(){
				 scroll(0,9999)
	 }
     full.onclick=function(){
		 window.scrollTo(0,0);
		 tips.style.display='block';
		 startMove(tips, 'bottom', 0);
		 var timer=null;
		 if(tips.style.display=='block'){
		    clearInterval(timer);
	         timer=setInterval(function(){
				 startMove(tips, 'bottom', -50);
				   },5000);
			 }
		 }
		 
    simp.onclick=function(){
		tips.innerHTML='【极速版】，我们和时间赛跑';
		simp.className='current';
		full.className="";
		window.scrollTo(0,0);
		 tips.style.display='block';
		 startMove(tips, 'bottom', 0);
		 var timer=null;
		 if(tips.style.display=='block'){
		    clearInterval(timer);
	         timer=setInterval(function(){
				 startMove(tips, 'bottom', -50);
				   },5000);
			 }
		}
   
   for(var i=0;i<tab_a.length;i++){
	   tab_a[i].index=i;
	   tab_a[i].onclick=function(){
		   
		   for(var i=0;i<tab_a.length;i++)
			{
		   tab_a[i].className='';
		   tab_div[i].style.opacity="0";
		   //alert("a");
		   }
		   	this.className='active';
			//alert(this.index);
			tab_div[this.index].style.opacity="1";

	   }
	   }

}
