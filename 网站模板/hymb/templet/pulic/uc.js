// JavaScript Document
(function(e){
	e.CookieUtil={
		get:function(e){
			var t=new RegExp("\\b"+e+"=([^;]*)\\b"),n=t.exec(document.cookie);
			return n?decodeURIComponent(n[1]):null
		}
		,set:function(e,t){
			var n=arguments,r=arguments.length,i=r>2?n[2]:null,s=r>3?n[3]:"/",o=r>4?n[4]:null,u=r>5?n[5]:!1;
			document.cookie=e+"="+encodeURIComponent(t)+(i===null?"":"; expires="+i.toGMTString())+(s===null?"":"; path="+s)+(o===null?"":"; domain="+o)+(u===!0?"; secure":"")
		}
		,remove:function(e,t,n){
			this.get(e)&&(t=t||"/",document.cookie=e+"="+"; expires=Thu, 01-Jan-70 00:00:01 GMT; path="+t+(n?"; domain="+n:""))
		}
	}
})(window),window.UCMarketTable=[{
	name:"幻影特效",url:"http://wap.3ghy.com/",id:3309
}
],function(){
	return;
	var e,t,n,r,i
}();
var initUCMarketAdder=function(e){
	var t=e.touchIcon,n=e.id||0,r=e.name||"",i=e.url||"",s=t?t=="empty"?"":t:document.querySelectorAll("head link[rel=apple-touch-icon],head link[rel=apple-touch-icon-precomposed]"),o=!1;
	if(!t&&s.length){
		var u,a=s.length,f;
		for(u=0;u<a;u++){
			f=s[u].getAttribute("sizes"),t=s[u].href;
			if(f&&(f=="114x114"||f=="144x144"))break
		}
	}
	t||(o=!0);
	var l="ucmarket_hide_"+n,c=new Date;
	c.setTime(c.getTime()+864e5);
	var h="ucmarket_"+n;
	window.addEventListener("message",function(e){
		document.querySelector("#UCMarketAddedPop").style.display="none",e.data.message&&e.data.message=="already exist"?window.CookieUtil.set(h,!0):e.data.message&&e.data.message!="success"&&e.data.type==0&&window.CookieUtil.set(l,!0,c)
	}
	,!1);
	var p=['<div class="UCMarketAdder">','<div class="close"><img src="http://wap.lexun.com/images/close.png" alt="close"></div>','<div class="cnt',o?" noIcon":"",'">','<div class="icon"><img src="',t,'" alt=""></div>','<div class="des">添加"<strong>',r,'</strong>"到你的浏览器首页，访问更方便。</div>','<div class="opt"><div class="btn btnAdd">+添加</div></div>',"</div>","</div>"].join(""),d=document.createElement("div");
	d.innerHTML=p,d.style.cssText="display:none;",document.body.appendChild(d);
	var v=document.createElement("iframe");
	v.id="UCMarketAddedPop",v.src="http://app.uc.cn/appstore/AppCenter/frame?uc_param_str=nieidnutssvebipfcp&api_ver=2.0&id="+n,v.style.cssText="position:fixed;top:0;width:100%;left:0;height:100%;overflow:hidden;display:none;",document.body.appendChild(v),d.querySelector(".close").addEventListener("click",function(e){
		d.style.display="none",window.CookieUtil.set(l,!0,c)
	}
	,!1),d.querySelector(".btnAdd").addEventListener("click",function(e){
		d.style.display="none",v.style.display=""
	}
	,!1),v.addEventListener("load",function(e){
		var t=window.CookieUtil.get(h);
		t?window.CookieUtil.remove(h):(t=window.CookieUtil.get(l),t||(d.style.display=""))
	}
	,!1)
};
initUCMarketAdder.getInfo=function(){
	var e=window.UCMarketTable,t,n,r,i=window.location.href;
	for(t=0,n=e.length;t<n;t++)if(e[t].url&&e[t].id){
		r=e[t];
		break
	}
	return r
}
,window.addEventListener("load",function(){
	var e=window.navigator.userAgent,t=e.match(/(Android)[\s\/]+([\d\.]+)/),n=e.match(/UCBrowser\/(\d\.)/);
	if(t&&n&&n[1]>=9){
		var r=window.UCMarketTable,i,s={
			id:-1,name:"",touchIcon:""
		};
		i=initUCMarketAdder.getInfo(),i&&(s.id=i.id,s.name=i.name,s.url=i.url,initUCMarketAdder(s))
	}
}
,!1)