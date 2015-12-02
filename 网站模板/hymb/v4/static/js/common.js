//获取class
function id(obj) {
    switch (obj.charAt(0)) {
        case "#":
            return document.getElementById(obj.substring(1));
            break;
        case ".":
            return document.getElementsByClassName(obj.substring(1));
        default:
            return document.getElementsByTagName(obj);
    }
}

function getByClass(parent, clsName){
    var boxArr=[],
        oElenmet = parent.getElementsByTagName('*');

    for(var i=0; i<oElenmet.length; i++){
        if(oElenmet[i].className==clsName){
            boxArr.push(oElenmet[i])
        }
    }
    return boxArr;
}
//绑定事件
function myAddEvent(obj, sEv, fn){
    if (window.attachEvent) {
        obj.attachEvent("on"+sEv, fn);//ie
    }else {
        obj.addEventListener(sEv, fn,false); //火狐
    }
}

function zyHuaDong(obj){
	this.obj = id(obj);
	this.objLi = null;
	this.downX = 0;
	this.downLeft = 0;
	_this = this;

}
zyHuaDong.prototype.zy = function(ziObj){
	this.objLi = this.obj.getElementsByTagName(ziObj);
	this.obj.style.width = (this.objLi[0].offsetWidth)*this.objLi.length + "px";


	this.obj.ontouchstart = function (ev){   
		document.ontouchmove = function(ev){
		   ev.preventDefault();
	    };  
		var touchs = ev.changedTouches[0];
        var bBtn = true;
		_this.downX  = touchs.pageX;
		_this.downLeft = this.offsetLeft;
		this.className = "";
		_this.obj.ontouchmove = function (ev){
			var touchs = ev.changedTouches[0];
			if(this.offsetLeft>=0){
				if(bBtn){
					bBtn = false;
					_this.downX = touchs.pageX;	
				}
				
				this.style.left = (touchs.pageX - _this.downX)/2 + "px";
			}else if(this.offsetLeft <= document.documentElement.clientWidth - this.offsetWidth){
				if(bBtn){
					bBtn = false;
					_this.downX = touchs.pageX;	
				}
				
				this.style.left = (touchs.pageX - _this.downX)/2 + (document.documentElement.clientWidth - this.offsetWidth) + "px";
			}else{
				bBtn = true;
			    this.style.left = touchs.pageX - _this.downX + _this.downLeft + "px";
			}
		}
 
		_this.obj.ontouchend = function(){
		    
			if(this.offsetLeft>=0){
				this.className = "hd";
				this.style.left = "0px";
			}else if(this.offsetLeft <= this.parentNode.offsetWidth - this.offsetWidth){
				this.className = "hd";
				this.style.left = (this.parentNode.offsetWidth - this.offsetWidth) + "px"
			}
			_this.obj.ontouchmove = null;
			_this.obj.ontouchend = null;
			document.ontouchmove = null;
		}
	}
}
function ajaxTrend(ubb,aTime){
    var _this = this;
    var strTrue = null;
    if(_this.mulu != "chat"){
        setTimeout(dongTai,10)
        setInterval(dongTai,aTime)
    }
    function dongTai(){
        _this.ajax("post", "/ajax_ubb.aspx?ubb="+ ubb,function(str){
            if(strTrue != str || strTrue == null){
                strTrue = str;
                if(document.getElementById("kl-trend") == null){
                    found("kl-trend",str)
                }else{
                    var oKlChat = document.getElementById("kl-trend");
                    oKlChat.innerHTML = str;
                }
            }
        });
    }

}
//回到顶部（缓冲）
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

}


//搜索框
function searchbox(){
    document.getElementById('keyword-here').onclick=function(){
        var oSearchCon = document.getElementById('search-con').className;

        if(oSearchCon == 'search-con'){
            document.getElementById('search-con').className= oSearchCon + ' on';
        }else{
            document.getElementById('search-con').className= 'search-con';
        }
    }
    var keywordList=document.getElementById('keyword-list').getElementsByTagName('a');

    for(var i=0;i<keywordList.length;i++){
        keywordList[i].onclick=function(){
            document.getElementById('search-con').className='search-con';
            document.getElementById('keyword-here').innerHTML=this.innerHTML;
            document.getElementById('srhrange').value=this.rel;
        }
    }
}
//发帖、签到弹窗
function showBox(id, obj){
    var id=document.getElementById(id);
    var obj=document.getElementById(obj);
    ai.touchClick(id,function(e){
        e.preventDefault();
        obj.className+=' is-visible';
    });
       //close popup
    ai.touchClick(obj,function(e){
        if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
            e.preventDefault();
            obj.className='cd-popup';
        }
    });

    myAddEvent(document,'keyup',function(event){
        if(event.which=='27') {
            obj.className = 'cd-popup';
        }
    });
};

//发帖部分
function sendTie(id, tag,forma){
    //id 发帖最外围的id
    //tag 论坛列表的box id
    //btn 提交按钮
//.getAttribute('data-value');

    var id=document.getElementById(id);
    var title=id.getElementsByTagName('input')[0];
    var cont=id.getElementsByTagName('textarea')[0];
    var btn=id.getElementsByTagName('input')[6];

   /* ai.touchClick(btn,function(e){
        //验证函数
        confirmInp(id);

    })*/
    myAddEvent(title,'keyup',function(event){
        //清除函数
        clearValue(title);
    })
    myAddEvent(cont,'keyup',function(event){
        //清除函数
        clearValue(cont);
    })


    //console.log(forma.value)
}
function confirmInp(opt){
    var title=opt.getElementsByTagName('input')[0];
    var cont=opt.getElementsByTagName('textarea')[0];
    var newDiv=document.createElement('div');

    newDiv.id='tips';
    newDiv.style.cssText = 'display:none;position:absolute; top:40%; left:40%;z-index:9999; height:30px; line-height:30px; width:180px;overflow:hiden;background:#dedede; color:#FF0000';

    if(title.value.length< 3 || title.value.length>15 || cont.value.length<5||cont
        .value.length>2000){
        opt.appendChild(newDiv);
        newDiv.style.display = 'block';
        newDiv.innerHTML='字数不符合规定，请重新输入';

    }
}


//签到部分
function qiandao(id ,forma){
    var id=document.getElementById(id);
    var qdText=id.getElementsByTagName('input')[0];
    var lis=id.getElementsByTagName('li');

    myAddEvent(id.getElementsByTagName('input')[0],'keyup',function(event){
        //清除函数
        clearValue(qdText);
    });
    for(var i=0;i<lis.length;i++){
        myAddEvent(lis[i],'click',function(event){
            qdText.value+= " "+this.innerHTML;
            clearValue(qdText);
        })
    }
    myAddEvent(id.getElementsByTagName('input')[1],'click',function(){
        document.forma.submit();
    })

}
function clearValue(obj){

    if(obj.value.length!=0){
        obj.parentNode.getElementsByTagName('i')[0].style.display='block';
        obj.parentNode.getElementsByTagName('i')[0].onclick=function(){
            obj.value="";
            obj.parentNode.getElementsByTagName('i')[0].style.display='none';
        }
    }else{
        obj.parentNode.getElementsByTagName('i')[0].style.display='none';
    }

}
//列表自适应
function List(){
    var picBox=document.getElementById('picbox');
    var picList=picBox.getElementsByTagName("li");
    var scaleW=window.innerWidth;
    var picListW=picList[0].offsetWidth;
    var picListH=picList[0].offsetHeight;
    //console.log(picListW)
    for(var i=0; i<picList.length; i++){

        if(scaleW>picListW){
            picList[i].style.float='left';
            picBox.style.height=picListH*2+'px';
        }else{
            picList[i].style.display='';
            picBox.style.height=picListH*4+'px';
        }

    }
}

//中间快速通道函数
function tongDao(id, obj, tit){
    var id=document.getElementById(id);
    var obj=document.getElementById(obj);
    var oBox=document.getElementById('tcBox');
    var tit=document.getElementById(tit);
    var clo=document.getElementById('tc-close');

    oBox.style.display="none";

   ai.touchClick(id,function(e){
       oBox.style.display='block'
       obj.style.display='block';
       tit.innerHTML=id.getElementsByTagName('p')[0].innerHTML;
       oBox.style.cssText="left:"+(oBox.parentNode.offsetWidth-oBox.offsetWidth)/2 + "px;";
       console.log(oBox.parentNode.offsetWidth)
       console.log(oBox.offsetWidth)

    });
   ai.touchClick(clo,function(e){
        oBox.style.display='none';
        obj.style.display='none';
    })

}

function ajax (sty,url,fnTrue,fnFalse){
    var oAjax = null;

    if (window.XMLHttpRequest) {
        oAjax = new XMLHttpRequest();
    } else {
        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
    }
    switch (sty){
        case "post":
            var arr = url.split("?");
            oAjax.open(sty, arr[0], true);
            oAjax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            if(arr.length < 2){
                oAjax.send(arr[1]);
            }else{
                var arrUrl = "";
                for(var i=1;i<arr.length;i++){
                    arrUrl += "?" + arr[i];
                }
                oAjax.send(arrUrl.substring(1));
            }
            break;
        case "get":
            url += "&" + new Date().getTime();
            oAjax.open(sty, url, true);
            oAjax.send();
            break;
    }
    oAjax.onreadystatechange = function() {
        if (oAjax.readyState == 4) {
            if (oAjax.status == 200) {
                fnTrue(oAjax.responseText);
            } else {
                if (fnFalse) {
                    fnFalse();
                }
            }
        }
    }
}
function ubbAjax(json){
	var span=id(json.boxDianJi).getElementsByTagName('span')[0];
	
    id(json.boxDianJi).onclick = function(){
        var _this = this;
		span.className+=' span';
		
						
        ajax("post","/ajax_ubb.aspx?ubb=" + json.ubb,function(str){
			span.className='icon_refresh';
            id(json.boxId).innerHTML = str;
            if(json.ciShu!=true){
                _this.innerHTML = "进入此频道";
                _this.onclick = null;
            }
        },function(){alert("网络错误，请稍候重新加载");});
        return false;
    }
}

/*农历日期部分*/
function showDate() {
var sWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
var dNow = new Date();
var CalendarData = new Array(100);
var madd = new Array(12);
var tgString = "甲乙丙丁戊己庚辛壬癸";
var dzString = "子丑寅卯辰巳午未申酉戌亥";
var numString = "一二三四五六七八九十";
var monString = "正二三四五六七八九十冬腊";
var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
var cYear, cMonth, cDay, TheDate;
CalendarData = [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96,
0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A,
0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA,
0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA,
0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D,
0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B,
0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F,
0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96,
0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95,
0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95];
madd[0] = 0; madd[1] = 31; madd[2] = 59; madd[3] = 90;
madd[4] = 120; madd[5] = 151; madd[6] = 181; madd[7] = 212;
madd[8] = 243; madd[9] = 273; madd[10] = 304; madd[11] = 334;
    /**
     * @return {number}
     */
    function GetBit(m, n) {
    return m >> n & 1; }
function e2c() {
    TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
    var total, m, n, k;
    var isEnd = false;
    var tmp = TheDate.getFullYear();
    total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38; if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) { total++; } for (m = 0; ; m++) { k = (CalendarData[m] < 0xfff) ? 11 : 12; for (n = k; n >= 0; n--) { if (total <= 29 + GetBit(CalendarData[m], n)) { isEnd = true; break; } total = total - 29 - GetBit(CalendarData[m], n); } if (isEnd) break; } cYear = 1921 + m; cMonth = k - n + 1; cDay = total; if (k == 12) { if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) { cMonth = 1 - cMonth; } if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) { cMonth--; } }
}

    /**
     * @return {string}
     */
    function GetcDateString() {
    var tmp = ""; tmp += tgString.charAt((cYear - 4) % 10);
    tmp += dzString.charAt((cYear - 4) % 12);
    tmp += "年 ";
    if (cMonth < 1) { tmp += "(闰)"; tmp += monString.charAt(-cMonth - 1); } else { tmp += monString.charAt(cMonth - 1); } tmp += "月"; tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
    if (cDay % 10 != 0 || cDay == 10) { tmp += numString.charAt((cDay - 1) % 10); } return tmp;
}

    /**
     * @return {string}
     */
    function GetLunarDay(solarYear, solarMonth, solarDay) {
    if (solarYear < 1921 || solarYear > 2020) {
        return "";
    } else { solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11; e2c(solarYear, solarMonth, solarDay); return GetcDateString(); }
}
var D = new Date();
var yy = D.getFullYear();
var mm = D.getMonth() + 1;
var dd = D.getDate();

    function getFullYear(d) {// 修正firefox下year错误
        var yr = d.getYear(); if (yr < 1000)
        yr += 1900; return yr;
}
    timeString = new Date().toLocaleTimeString();
    var sValue = getFullYear(dNow) + "年" + (dNow.getMonth() + 1) + "月" + dNow.getDate() + "日 " + sWeek[dNow.getDay()] + " "; // + " " + timeString + " "
    sValue += GetLunarDay(yy, mm, dd);
    var svalue1 = getFullYear(dNow) + "年" + (dNow.getMonth() + 1) + "月" + dNow.getDate() + "日";
    var svalue2 = timeString;
    var svalue3 = GetLunarDay(yy, mm, dd);
    //alert(svalue2)
	
	document.write("<table cellspacing='3' width='90' bordercolor='#000000' bgcolor='#FFFFFF' height='110' cellpadding='2'"); 
document.write("<tr><td align='center'><b><font color=#008040>"+ getFullYear(dNow) + "年" + (dNow.getMonth() + 1) + "月"+"</font><br><font face='Arial' size='4' color=#FF8040>"+dNow.getDate()+"</font><br><font color=#008040><span style='FONT-SIZE: 10.5pt'>");
document.write(sWeek[dNow.getDay()]+"</span><br>"+"</b><font color=#9B4E00>");
document.write(GetLunarDay(yy, mm, dd)+"</td></tr></table>");
	
}

/*
******侧边栏打开和收起tc-nav
*/
function tcNav(){

    var oBtn=document.getElementById('navbtn');
    var tcNav=document.getElementById('tc-nav');

    var scalew=window.innerWidth;
    var oTc=document.getElementById('indexBg');
    var oMian=document.getElementById('main');
    var oMenu=document.getElementById('menu');
    var oHeader=document.getElementById('header');
   //alert(oTc)

    tcNav.style.webkitTransform='translate3d(-'+ scalew +'px, 0, 0)';
    oMian.style.webkitTransform='translate3d(0, 0, 0)';
    oMenu.style.zIndex=1;
    oMenu.style.webkitTransform='translate3d(0, 0, 0)';
   // oMenu.style.webkitTransform='translate3d('+ scalew +'px, 0, 0)'

    myAddEvent(oBtn,'click',function(event){
        if(tcNav.style.display=='none'){
            tcNav.style.display='block';
            tcNav.style.webkitTransform='translate3d(0, 0, 0)';
            oTc.style.display='block';
            oMenu.style.webkitTransform='translate3d(0, 0, 0)';
            oMenu.style.zIndex=102;
            oMian.style.webkitTransform='translate3d(-200px, 0, 0)';
            oHeader.style.webkitTransform='translate3d(-200px, 0, 0)';

        }else{
            tcNav.style.display='none'
            tcNav.style.webkitTransform='translate3d(-'+ scalew +'px, 0, 0)';
            tcNav.style.webkitTransition='none';
            oTc.style.display='none';
            oMian.style.webkitTransform='translate3d(0, 0, 0)';
            oMenu.style.webkitTransform='translate3d(0, 0, 0)';
            oMenu.style.zIndex=1;
            oHeader.style.webkitTransform='translate3d(0, 0, 0)'

        }
    })
    myAddEvent(oTc,'click',function(){
        tcNav.style.webkitTransform = 'translate3d(-'+ scalew +'px, 0, 0)';
        tcNav.style.display='none';
        oTc.style.display = 'none';
        oMenu.style.zIndex=1;
        oMian.style.webkitTransform='translate3d(0, 0, 0)';
        oHeader.style.webkitTransform='translate3d(0, 0, 0)';
    })
}

//论坛列表收起展开
function forum(obj,oTit){
    var obj = document.getElementById(obj);
    var oTit = obj.getElementsByTagName(oTit);
    var oDay = obj.getElementsByClassName("day");
    for(var i=0;i<oDay.length;i++){
        if(parseInt(oDay[i].innerHTML.charAt(1)) > 0){
            oDay[i].style.display = "inline-block";
        }
    }
    for(var i=0;i<oTit.length;i++){
        oTit[i].onclick = function (ev){
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if(this.parentNode.className ==  "mb" && target.nodeName.toLowerCase() != "a"){
                this.parentNode.className += " on";
            }else if(target.nodeName.toLowerCase() != "a"){
                this.parentNode.className = "mb";
            }
        }
    }
}

//论坛帖子tab不切换部分
function Swipe(container, options) {
    "use strict";
    var noop = function() {};   var offloadFn = function(fn) { setTimeout(fn || noop, 0) };
    var browser = {
        addEventListener: !!window.addEventListener,
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        transitions: (function(temp) {
            var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
            for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
            return false;
        })(document.createElement('swipe'))
    };
    if (!container) return;
    var element = container.children[0];
    var slides, slidePos, width, length;
    options = options || {};
    var index = parseInt(options.startSlide, 10) || 0;
    var speed = options.speed || 300;
    options.continuous = options.continuous !== undefined ? options.continuous : true;

    function setup() {
        slides = element.children;
        length = slides.length;
        if (slides.length < 2) options.continuous = false;
        if (browser.transitions && options.continuous && slides.length < 3) {
            element.appendChild(slides[0].cloneNode(true));
            element.appendChild(element.children[1].cloneNode(true));
            slides = element.children;
        }
        slidePos = new Array(slides.length);

        width =container.parentNode.getBoundingClientRect().width || parentNode.container.offsetWidth;
            container.getBoundingClientRect().width || container.offsetWidth;

        element.style.width = (slides.length * width) + 'px';
        var pos = slides.length;
        while(pos--) {

            var slide = slides[pos];

            slide.style.width = width + 'px';
            slide.setAttribute('data-index', pos);

            if (browser.transitions) {
                slide.style.left = (pos * -width) + 'px';
                move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
            }

        }

        if (options.continuous && browser.transitions) {
            move(circle(index-1), -width, 0);
            move(circle(index+1), width, 0);
        }

        if (!browser.transitions) element.style.left = (index * -width) + 'px';

        container.style.visibility = 'visible';

    }

    function prev() {

        if (options.continuous) slide(index-1);
        else if (index) slide(index-1);

    }

    function next() {

        if (options.continuous) slide(index+1);
        else if (index < slides.length - 1) slide(index+1);

    }

    function circle(index) {
        return (slides.length + (index % slides.length)) % slides.length;

    }

    function slide(to, slideSpeed) {
        if (index == to) return;
        if (browser.transitions) {
            var direction = Math.abs(index-to) / (index-to);
            if (options.continuous) {
                var natural_direction = direction;
                direction = -slidePos[circle(to)] / width;
                if (direction !== natural_direction) to =  -direction * slides.length + to;
            }
            var diff = Math.abs(index-to) - 1;
            while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);
            to = circle(to);
            move(index, width * direction, slideSpeed || speed);
            move(to, 0, slideSpeed || speed);

            if (options.continuous) move(circle(to - direction), -(width * direction), 0);
        } else {
            to = circle(to);
            animate(index * -width, to * -width, slideSpeed || speed);
        }
        index = to;
        offloadFn(options.callback && options.callback(index, slides[index]));
    }

    function move(index, dist, speed) {

        translate(index, dist, speed);
        slidePos[index] = dist;

    }

    function translate(index, dist, speed) {

        var slide = slides[index];
        var style = slide && slide.style;

        if (!style) return;

        style.webkitTransitionDuration =
            style.MozTransitionDuration =
                style.msTransitionDuration =
                    style.OTransitionDuration =
                        style.transitionDuration = speed + 'ms';

        style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
                style.OTransform = 'translateX(' + dist + 'px)';

    }

    function animate(from, to, speed) {
        if (!speed) {
            element.style.left = to + 'px';
            return;
        }

        var start = +new Date;

        var timer = setInterval(function() {

            var timeElap = +new Date - start;

            if (timeElap > speed) {

                element.style.left = to + 'px';

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                clearInterval(timer);
                return;

            }

            element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

        }, 4);

    }

    var delay = options.auto || 0;
    var interval;

    function begin() {

        interval = setTimeout(next, delay);

    }

    function stop() {

        delay = 0;
        clearTimeout(interval);

    }

    var start = {};
    var delta = {};
    var isScrolling;
    var events = {

        handleEvent: function(event) {

            switch (event.type) {
                case 'touchstart': this.start(event); break;
                case 'touchmove': this.move(event); break;
                case 'touchend': offloadFn(this.end(event)); break;
                case 'webkitTransitionEnd':
                case 'msTransitionEnd':
                case 'oTransitionEnd':
                case 'otransitionend':
                case 'transitionend': offloadFn(this.transitionEnd(event)); break;
                case 'resize': offloadFn(setup); break;
            }

            if (options.stopPropagation) event.stopPropagation();

        },
        start: function(event) {

            var touches = event.touches[0];

            start = {
                x: touches.pageX,
                y: touches.pageY,
                time: +new Date
            };
            isScrolling = undefined;
            delta = {};
            element.addEventListener('touchmove', this, false);
            element.addEventListener('touchend', this, false);
        },
        move: function(event) {
            if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

            if (options.disableScroll) event.preventDefault();

            var touches = event.touches[0];
            delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
            }
            if ( typeof isScrolling == 'undefined') {
                isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
            }
            if (!isScrolling) {
                event.preventDefault();
                stop();
                if (options.continuous) {          translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

                } else {

                    delta.x =
                        delta.x /
                        ( (!index && delta.x > 0|| index == slides.length - 1&& delta.x < 0) ?( Math.abs(delta.x) / width + 1 ): 1 );
                    translate(index-1, delta.x + slidePos[index-1], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(index+1, delta.x + slidePos[index+1], 0);
                }

            }

        },
        end: function(event) {

            var duration = +new Date - start.time;
            var isValidSlide =
                Number(duration) < 250                           && Math.abs(delta.x) > 20                        || Math.abs(delta.x) > width/2;
            var isPastBounds =
                !index && delta.x > 0                                        || index == slides.length - 1 && delta.x < 0;
            if (options.continuous) isPastBounds = false;

            var direction = delta.x < 0;

            if (!isScrolling) {

                if (isValidSlide && !isPastBounds) {

                    if (direction) {

                        if (options.continuous) { move(circle(index-1), -width, 0);
                            move(circle(index+2), width, 0);

                        } else {
                            move(index-1, -width, 0);
                        }

                        move(index, slidePos[index]-width, speed);
                        move(circle(index+1), slidePos[circle(index+1)]-width, speed);
                        index = circle(index+1);

                    } else {
                        if (options.continuous) { move(circle(index+1), width, 0);
                            move(circle(index-2), -width, 0);

                        } else {
                            move(index+1, width, 0);
                        }

                        move(index, slidePos[index]+width, speed);
                        move(circle(index-1), slidePos[circle(index-1)]+width, speed);
                        index = circle(index-1);

                    }

                    options.callback && options.callback(index, slides[index]);

                } else {

                    if (options.continuous) {

                        move(circle(index-1), -width, speed);
                        move(index, 0, speed);
                        move(circle(index+1), width, speed);

                    } else {

                        move(index-1, -width, speed);
                        move(index, 0, speed);
                        move(index+1, width, speed);
                    }

                }
            }

            element.removeEventListener('touchmove', events, false)
            element.removeEventListener('touchend', events, false)

        },
        transitionEnd: function(event) {

            if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
            }
        }
    };

    setup();

    if (delay) begin();

    if (browser.addEventListener) {

        if (browser.touch) element.addEventListener('touchstart', events, false);

        if (browser.transitions) {
            element.addEventListener('webkitTransitionEnd', events, false);
            element.addEventListener('msTransitionEnd', events, false);
            element.addEventListener('oTransitionEnd', events, false);
            element.addEventListener('otransitionend', events, false);
            element.addEventListener('transitionend', events, false);
        }

        window.addEventListener('resize', events, false);

    } else {

        window.onresize = function () { setup() };
    }

    return {
        setup: function() {

            setup();

        },
        slide: function(to, speed) {

            stop();

            slide(to, speed);

        },
        prev: function() {

            stop();

            prev();

        },
        next: function() {

            stop();

            next();

        },
        stop: function() {

            stop();

        },
        getPos: function() {

            return index;

        },
        getNumSlides: function() {

            return length;
        },
        kill: function() {

            stop();

            element.style.width = '';
            element.style.left = '';

            var pos = slides.length;
            while(pos--) {

                var slide = slides[pos];
                slide.style.width = '';
                slide.style.left = '';

                if (browser.transitions) translate(pos, 0, 0);

            }

            if (browser.addEventListener) {

                element.removeEventListener('touchstart', events, false);
                element.removeEventListener('webkitTransitionEnd', events, false);
                element.removeEventListener('msTransitionEnd', events, false);
                element.removeEventListener('oTransitionEnd', events, false);
                element.removeEventListener('otransitionend', events, false);
                element.removeEventListener('transitionend', events, false);
                window.removeEventListener('resize', events, false);

            }
            else {

                window.onresize = null;

            }

        }
    }

}

