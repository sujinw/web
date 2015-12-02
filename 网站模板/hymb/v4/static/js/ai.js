/**
 * ai是一个提供基础常用函数的单体。各个函数的功能见各个函数的注释。
 * @author 黄浩明
 * @version 3.0.1
 */
var ai = {
	
	touchClick: function(obj, fun) {
		/**
		* 该方法用于绑定点击事件，比一般的click事件反应速度快2倍。
		* @author 黄浩明
		* @param {对象字面量} obj 要绑定的dom对象
		* @param {对象字面量} fun 事件触发的函数
		*/
		var start_x = 0,
			start_y = 0;
		obj.addEventListener('touchstart',function(e){
			start_x = e.touches[0].clientX;
			start_y = e.touches[0].clientY;
			document.addEventListener('touchend', touEnd, false);
		});
		function touEnd(e){
			var endX = e.changedTouches[0].clientX;
			var endY = e.changedTouches[0].clientY;
			if(Math.abs(endX - start_x) < 5 && Math.abs(endY - start_y) < 5) {
				fun.call(obj,e);
			}
			document.removeEventListener('touchend', touEnd, false);
		};
	},
	ovb: {
		/**
		* 该对象用于判断系统，系统版本，浏览器，苹果设备等等功能。ovb是单词 Os Version Browser 的头字母缩写。
		* @author 黄浩明
		*/
		_version_value: false,
		_bversion_value: false,
		_ua: navigator.userAgent,
		android: function() {
			/**
			* 该方法用于判断是否为安卓平台，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/	
			var regular_result = this._ua.match(/(Android)\s+([\d.]+)/),
				os_boolean = !!regular_result;
			if(!this._version_value && os_boolean){
				this._version_value = regular_result[2];
			}
			this.android = function(){return os_boolean;};
			return os_boolean;
		},
		ios: function() {
			/**
			* 该方法用于判断是否为iOS平台，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/	
			var regular_result = this._ua.match(/.*OS\s([\d_]+)/),
				os_boolean = !!regular_result;
			if(!this._version_value && os_boolean){
				this._version_value = regular_result[1].replace(/_/g, '.');
			}
			this.ios = function(){return os_boolean;};
			return os_boolean;
		},
		ipod: function() {
			/**
			* 该方法用于判断是否为ipod设备，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/	
			var regular_result = this._ua.match(/(iPod).*OS\s([\d_]+)/),
				os_boolean = !!regular_result;
			if(!this._version_value && os_boolean){
				this._version_value = regular_result[2].replace(/_/g, '.');
			}
			this.ipod = function(){return os_boolean;};
			return os_boolean;
		},
		ipad: function() {
			/**
			* 该方法用于判断是否为ipad设备，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/
			var regular_result = this._ua.match(/(iPad).*OS\s([\d_]+)/),
				os_boolean = !!regular_result; 
			if(!this._version_value && os_boolean){
				this._version_value = regular_result[2].replace(/_/g, '.');
			}
			this.ipad = function(){return os_boolean;};
			return os_boolean;
		},
		iphone: function() {
			/**
			* 该方法用于判断是否为iphone设备，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/
			var regular_result = this._ua.match(/(iPhone);.*OS\s([\d_]+)/),
				os_boolean = !!regular_result;
			if(!this._version_value && os_boolean){
				this._version_value = regular_result[2].replace(/_/g, '.');
			}
			this.iphone = function(){return os_boolean;};
			return os_boolean;
		},
		kindle: function() {
			/**
			* 该方法用于判断是否为kindle设备，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/
			var regular_result = this._ua.match(/Kindle\/([\d.]+)/),
				os_boolean = !!regular_result;
			if(!this._version_value && os_boolean){
				this._version_value = regular_result[1];
			}
			this.kindle = function(){return os_boolean;};
			return os_boolean;
		},
		webkit: function() {
			/**
			* 该方法用于判断是否为webkit内核的浏览器，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/
			var regular_result = this._ua.match(/WebKit\/([\d.]+)/),
				os_boolean = !!regular_result;
			if(!this._version_value && os_boolean){
				this._bversion_value = regular_result[1];
			}
			this.webkit = function(){return os_boolean;};
			return os_boolean;
		},
		uc: function() {
			/**
			* 该方法用于判断是否为UC内核的浏览器，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			* @tip    该函数只在安卓平台能正常判断，慎用！
			*/
			var regular_result = this._ua.match(/UC/),
				os_boolean = !!regular_result;
			this.uc = function(){return os_boolean;};
			return os_boolean;
		},
		opera: function() {
			/**
			* 该方法用于判断是否为opera浏览器，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/
			var regular_result = this._ua.match(/Opera/),
				os_boolean = !!regular_result;
			this.opera = function(){return os_boolean;};
			return os_boolean;
		},
		safari: function() {
			/**
			* 该方法用于判断是否为safari浏览器，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			* @tip    该函数在一些不知名的浏览器如遨游之类上不能正常判断
			*/
			var regular_result = this._ua.match(/Version.*Safari/),
				os_boolean = !!regular_result;
			this.safari = function(){return os_boolean;};
			return os_boolean;
		},
		silk: function() {
			/**
			* 该方法用于判断是否为silk浏览器，如果是返回ture 否 返回 false
			* @author 黄浩明
			* @return ture或者false
			*/
			var regular_result = this._ua.match(/Silk/),
				os_boolean = !!regular_result;
			this.silk = function(){return os_boolean;};
			return os_boolean;
		},
		version: function() {
			/**
			* 该方法返回系统的版本
			* @author 黄浩明
			* @return 系统版本号例如 5.5.1
			*/
			return this._version_value;
		},
		bVersion: function() {
			/**
			* 该方法返回webkit浏览器的版本
			* @author 黄浩明
			* @return 系统版本号例如 5.5.1
			*/
			return this._bversion_value;
		}
	},
	a: function(s) {
		return document.querySelectorAll(s);
	},
	q: function(s) {
		return document.querySelector(s); 
	},
	i: function(id) {
		return document.getElementById(id);
	},
	c: function(klass) {
		return document.getElementsByClassName(klass);
	},
	hideUrl: function() {
		/**
		* 该方法用于在ios上隐藏导航条
		* @author 黄浩明
		*/
		//setTimeout(scrollTo,0,0,0);
		setTimeout(function() {
                window.scrollTo(0, 1);
				
            },
            200)
	},
	wh: function() {
		/**
		* 该方法用于取得可视区域的高度
		* @author 黄浩明
		* @return 可视区域的高度
		*/	
		return document.documentElement.clientHeight;
	},
	ww: function() {
		/**
		* 该方法用于取得可视区域的宽
		* @author 黄浩明
		* @return 可视区域的宽
		*/	
		return document.documentElement.clientWidth;
	},
	hv: function() {
		/**
		* 该方法用于判断当前状态时横屏还是竖屏
		* @author 黄浩明
		* @return 如果为竖屏返回否则返回false
		*/
		if(this.wh()/this.ww()>1){
			return true;
		}else{
			return false;
		}
	},
	resize: function(fun) {
		/**
		* 该方法用于绑定手机横屏竖屏的动作，之所以写了那么多代码，是因为该动作在安卓上会在转屏的时候出发2次，所以将间隔小于200秒的去掉。
		* @param {函数} 事件触发时要执行的函数。
		* @author 黄浩明
		*/
		//var resize = 'onorientationchange' in window ? 'orientationchange' : 'resize';
		this.resize_time = Date.now();
		window.addEventListener('resize', function(){
			if(Date.now() - this.resize_time < 200 ){
				this.resize_time = Date.now();
			}else{
				fun();
				this.resize_time = Date.now();
			}
		}, false);
		
	},
	clone: function(object) {
		/**
	　　 * 该方法用于原型式继承
	　　 * @author 黄浩明
	　　 * @param {对象字面量} object 父对象
        * @return 返回一个继承了 object 的对象
	　　 */
		function f() {}
		f.prototype = object;
		return new f;
	},
	extend: function(subClass, superClass) {
		/**
		* 该方法用于类式继承
		* @author 黄浩明
		* @param {对象字面量} subClass 子对象
		* @param {对象字面量} superClass 父对象
		*/	
		var f = function() {};
		f.prototype = superClass.prototype;
		subClass.prototype = new f();
		subClass.prototype.constructor = subClass;
		subClass.superclass = superClass.prototype;
		if(superClass.prototype.constructor == Object.prototype.constructor) {
			superClass.prototype.constructor = superClass;
		}
	},
	styleLoad: function(url,fun) {
		/**
		* 该方法用于动态加载css文件
		* @author 黄浩明
		* @param {对象字面量} url 目标style文件的url
		* @param {对象字面量} fun style文件载入后执行的函数
		*/	
		var A = document.createElement("style");
		A.type = "text/css";
		A.src = url;
		document.head.appendChild(A)
		A.onload = function(){fun()};
	},
	scriptLoad: function(url,fun) {
		/**
		* 该方法用于动态加载js文件
		* @author 黄浩明
		* @param {对象字面量} url 目标js文件的url
		* @param {对象字面量} fun js文件载入后执行的函数
		*/	
		var A = document.createElement("script");
		A.type = "text/javascript";
		A.src = url;
		document.head.appendChild(A);
		A.onload = function(){fun()};
	},
	touchMovePreventDefault: function(obj) {
		/**
		* 该方法用于取消目标DOM上touchMove的默认事件
		* @author 黄浩明
		* @param {DOM对象}obj 目标DOM
		*/	
		obj.addEventListener("touchmove", function(e) {
			e.preventDefault();
		}, false);
	}
	
}