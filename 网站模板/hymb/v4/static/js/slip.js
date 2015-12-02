/**
 * @作者 黄浩明
 * @版本 3.0.1
 * @官方网站 www.silpjs.com
 * @注意 凡是以下划线开头命名的变量和方法都是不可在外部调用的，因为在以后的版本中不确定这些方法是否存在。
 * @寄语 我们唯一的期望是将你的使用心得，改进的意见或者改进的代码反馈给我，我的邮箱：398791472@qq.com
 */
(function(window,document){
_fun = {
	ios: function() { // 作用：判断是否为苹果的IOS设备
		var regular_result = navigator.userAgent.match(/.*OS\s([\d_]+)/),
			os_boolean = !!regular_result;
		if(!this._version_value && os_boolean){
			this._version_value = regular_result[1].replace(/_/g, '.');
		}
		this.ios = function(){return os_boolean;};
		return os_boolean;
	},
	version: function() { // 作用：返回IOS的版本号
		return this._version_value;
	},
	clone: function(object) { // 作用：用于原型继承
		function f() {}
		f.prototype = object;
		return new f;
	}
}
var slipjs = {
	_refreshCommon: function(wide_high, parent_wide_high) { // 作用：当尺寸改变时，需要重新取得相关的值
		var that = this;
		that.wide_high = wide_high || that.core[that.offset] - that.up_range;
		that.parent_wide_high      = parent_wide_high      || that.core.parentNode[that.offset];
		that._getCoreWidthSubtractShellWidth();
	},
	_initCommon: function(core,param) { // 作用：初始化
		var that = this;
		that.core = core;
		that.startFun    = param.startFun;
		that.moveFun     = param.moveFun;
		that.touchEndFun = param.touchEndFun;
		that.endFun      = param.endFun;
		that.direction   = param.direction;
		that.up_range    = param.up_range   || 0;
		that.down_range  = param.down_range  || 0;
		if(that.direction == 'x'){
			that.offset ='offsetWidth';
			that._pos   = that.__posX;
		}else{
			that.offset ='offsetHeight';
			that._pos   = that.__posY;
		}
		that.wide_high       = param.wide_high || that.core[that.offset] - that.up_range;
		that.parent_wide_high   = param.parent_wide_high || that.core.parentNode[that.offset];
		that._getCoreWidthSubtractShellWidth();
		
		that._bind("touchstart");
		that._bind("touchmove");
		that._bind("touchend");
		that._bind("webkitTransitionEnd");
		
		that.xy = 0;
		that.y = 0;
		that._pos(-that.up_range); 	
	},
	_getCoreWidthSubtractShellWidth: function() { // 作用：取得滑动对象和它父级元素的宽度或者高度的差
		var that = this;
		that.width_cut_coreWidth = that.parent_wide_high - that.wide_high;
		that.coreWidth_cut_width = that.wide_high - that.parent_wide_high;
	},
	handleEvent: function(e) { // 作用：简化addEventListener的事件绑定
		switch (e.type) {
			case "touchstart":          this._start(e); break;
			case "touchmove":           this._move(e);  break;
			case "touchend":
			case "touchcancel":         this._end(e);   break;
			case "webkitTransitionEnd": this._transitionEnd(e); break;
		}
	},
	_bind: function(type, boole) { // 作用：事件绑定
		this.core.addEventListener(type, this, !!boole);
	},
	_unBind: function(type, boole) { // 作用：事件移除
		this.core.removeEventListener(type, this, !!boole);
	},
	__posX: function(x) { // 作用：当设置滑动的方向为“X”时用于设置滑动元素的坐标
		this.xy = x;
		this.core.style['webkitTransform'] = 'translate3d('+x+'px, 0px, 0px)';
		//this.core.style['webkitTransform'] = 'translate('+x+'px, 0px) scale(1) translateZ(0px)';
	},
	__posY: function(x) { // 作用：当设置滑动的方向为“Y”时用于设置滑动元素的坐标
		this.xy = x;
		this.core.style['webkitTransform'] = 'translate3d(0px, '+x+'px, 0px)';
		//this.core.style['webkitTransform'] = 'translate(0px, '+x+'px) scale(1) translateZ(0px)';
	},
	_posTime: function(x,time) { // 作用：缓慢移动
		this.core.style.webkitTransitionDuration = ''+time+'ms';
		this._pos(x);
	}
}
var SlipPage = _fun.clone(slipjs);
	SlipPage._init = function(core,param) { // 作用：初始化
		var that           = this;
		that._initCommon(core,param);
		that.num           = param.num;
		that.page          = 0;                            
		that.change_time   = param.change_time;
		that.lastPageFun   = param.lastPageFun;
		that.firstPageFun  = param.firstPageFun;
		param.change_time  && that._autoChange();
		param.no_follow ? (that._move = that._moveNoMove, that.next_time = 500) : that.next_time = 300;
	};
	SlipPage._start = function(e) { // 触摸开始
		var that = this,
			e = e.touches[0];
		that._abrupt_x     = 0;
		that._abrupt_x_abs = 0;
		that._start_x = that._start_x_clone = e.pageX;
		that._start_y = e.pageY;
		that._movestart = undefined;
		that.change_time && that._stop();
		that.startFun && that.startFun(e); 
	};
	SlipPage._move = function(evt) { // 触摸中,跟随移动
		var that = this;
		that._moveShare(evt);
		if(!that._movestart){
			var e = evt.touches[0];
			evt.preventDefault();
			that.offset_x = (that.xy > 0 || that.xy < that.width_cut_coreWidth) ? that._dis_x/2 + that.xy : that._dis_x + that.xy;  
			that._start_x  = e.pageX;
			if (that._abrupt_x_abs < 6) {
				that._abrupt_x += that._dis_x;
				that._abrupt_x_abs = Math.abs(that._abrupt_x);
				return;
			}
			that._pos(that.offset_x);
			that.moveFun && that.moveFun(e);  
		}
	};
	SlipPage._moveNoMove = function(evt) { // 触摸中,不跟随移动，只记录必要的值
		var that = this;
		that._moveShare(evt);
		if(!that._movestart){
			evt.preventDefault();
			that.moveFun && that.moveFun(e); 
		}   
	};
	SlipPage._moveShare = function(evt) { // 不跟随移动和跟随移动的公共操作
		var that = this,                   
		e = evt.touches[0];
		that._dis_x = e.pageX - that._start_x;
		that._dis_y = e.pageY - that._start_y;	
		typeof that._movestart == "undefined" && (that._movestart = !!(that._movestart || Math.abs(that._dis_x) < Math.abs(that._dis_y)));
	};
	SlipPage._end = function(e) { // 触摸结束
		if (!this._movestart) {
			var that = this;
			that._end_x = e.changedTouches[0].pageX;
			that._range = that._end_x - that._start_x_clone;
			if(that._range > 35){
				that.page != 0 ? that.page -= 1 : (that.firstPageFun && that.firstPageFun(e));
			}else if(Math.abs(that._range) > 35){
				that.page != that.num - 1 ? that.page += 1 : (that.lastPageFun && that.lastPageFun(e));
			}
			that.toPage(that.page, that.next_time);
			that.touchEndFun && that.touchEndFun(e);
		}
	};
	SlipPage._transitionEnd = function(e) { // 动画结束
		var that = this;
		e.stopPropagation();
		that.core.style.webkitTransitionDuration = '0';
		that._stop_ing && that._autoChange(), that._stop_ing = false;
		that.endFun && that.endFun();
	};
	SlipPage.toPage = function(num, time) { // 可在外部调用的函数，指定轮换到第几张，只要传入：“轮换到第几张”和“时间”两个参数。
		this._posTime(-this.parent_wide_high * num, time || 0);
		this.page = num;
	};
	SlipPage._stop = function() { // 作用：停止自动轮换
		clearInterval(this._autoChangeSet);
		this._stop_ing = true;
	};
	SlipPage._autoChange = function() { // 作用：自动轮换
		var that = this;
		that._autoChangeSet = setInterval(function() {
        	that.page != that.num - 1 ? that.page += 1 : that.page = 0;
			that.toPage(that.page, that.next_time);
        },that.change_time);
	};
	SlipPage.refresh = function(wide_high, parent_wide_high) { // 可在外部调用，作用：当尺寸改变时（如手机横竖屏时），需要重新取得相关的值。这时候就可以调用该函数
		this._refreshCommon(wide_high, parent_wide_high);
	};
		
var SlipPx = _fun.clone(slipjs);
	SlipPx._init = function(core,param) { // 作用：初始化
		var that  = this;
		that._initCommon(core,param);
		that.perfect     = param.perfect;
		that.bar_no_hide = param.bar_no_hide;
		if(that.direction == 'x'){
			that.page_x          = "pageX";
			that.page_y          = "pageY";
			that.width_or_height = "width";
			that._real           = that._realX;
			that._posBar         = that.__posBarX;
		}else{
			that.page_x          = "pageY";
			that.page_y          = "pageX";
			that.width_or_height = "height";
			that._real           = that._realY;
			that._posBar         = that.__posBarY;
		}
		if(that.perfect){
			that._transitionEnd = function(){};
			that._stop          = that._stopPerfect;
			that._slipBar       = that._slipBarPerfect;
			that._posTime       = that._posTimePerfect;
			that._bar_upRange   = that.up_range;
			that.no_bar         = false;
			that._slipBarTime   = function(){};
		}else{
			that.no_bar   = param.no_bar;
			that.core.style.webkitTransitionTimingFunction = "cubic-bezier(0.33, 0.66, 0.66, 1)";
		}
		if(that.bar_no_hide){
			that._hideBar = function(){};
			that._showBar = function(){};
		}
		if(_fun.ios()){
			that.radius = 11;
		}else{
			that.radius = 0;
		}
		if(!that.no_bar){
			that._insertSlipBar(param);
			if(that.coreWidth_cut_width <= 0){
				that._bar_shell_opacity = 0;
				that._showBarStorage    = that._showBar;
				that._showBar           = function(){};	
			}
		}else{
			that._hideBar = function(){};
			that._showBar = function(){};		
		}
	};
	SlipPx._start = function(e) { // 触摸开始
		var that = this,
			e = e.touches[0];
			that._animating = false;
		that._steps = [];
		that._abrupt_x     = 0;
		that._abrupt_x_abs = 0;
		that._start_x = that._start_x_clone = e[that.page_x];
		that._start_y = e[that.page_y];
		that._start_time = e.timeStamp || Date.now();
		that._movestart = undefined;
		!that.perfect && that._need_stop && that._stop();
		that.core.style.webkitTransitionDuration = '0';
		that.startFun && that.startFun(e);
	};
	SlipPx._move = function(evt) { // 触摸中
		var that = this,                   
			e = evt.touches[0],
			_e_page = e[that.page_x],
			_e_page_other = e[that.page_y],
			that_x = that.xy;
		that._dis_x = _e_page - that._start_x;
		that._dis_y = _e_page_other - that._start_y;
		(that.direction == 'x' && typeof that._movestart == "undefined") && (that._movestart = !!(that._movestart || (Math.abs(that._dis_x) < Math.abs(that._dis_y))));
		
		if(!that._movestart){
			evt.preventDefault();
			that._move_time = e.timeStamp || Date.now();
			that.offset_x = (that_x > 0 || that_x < that.width_cut_coreWidth - that.up_range) ? that._dis_x/2 + that_x : that._dis_x + that_x;    
			that._start_x = _e_page;
			that._start_y = _e_page_other;
			that._showBar();
			if (that._abrupt_x_abs < 6 ) {
				that._abrupt_x += that._dis_x;
				that._abrupt_x_abs = Math.abs(that._abrupt_x);
				return;
			}
			that._pos(that.offset_x);
			that.no_bar || that._slipBar();
			if (that._move_time - that._start_time > 300) {
				that._start_time    = that._move_time;
				that._start_x_clone = _e_page;
			}
			that.moveFun && that.moveFun(e);
		}
	};
	SlipPx._end = function(e) { // 触摸结束
		if (!this._movestart) {
			var that = this,
				e = e.changedTouches[0],
				duration = (e.timeStamp || Date.now()) - that._start_time,
				fast_dist_x = e[that.page_x] - that._start_x_clone;
			that._need_stop = true;
			if(duration < 300 && Math.abs(fast_dist_x) > 10) {
				if (that.xy > -that.up_range || that.xy < that.width_cut_coreWidth) {
					that._rebound();
				}else{
					var _momentum = that._momentum(fast_dist_x, duration, -that.xy - that.up_range, that.coreWidth_cut_width + (that.xy), that.parent_wide_high);
					that._posTime(that.xy + _momentum.dist, _momentum.time);
					that.no_bar || that._slipBarTime(_momentum.time);
				}
			}else{
				that._rebound();
			}
			that.touchEndFun && that.touchEndFun(e);
		}
	};
	SlipPx._transitionEnd = function(e) { // 滑动结束
		var that = this;
		if (e.target != that.core) return;
		that._rebound();
		that._need_stop = false;
	};
	SlipPx._rebound = function(time) { // 作用：滑动对象超出时复位
		var that = this,
			_reset = (that.coreWidth_cut_width <= 0) ? 0 : (that.xy >= -that.up_range ? -that.up_range : that.xy <= that.width_cut_coreWidth - that.up_range ? that.width_cut_coreWidth - that.up_range : that.xy);
		if (_reset == that.xy) {
			that.endFun && that.endFun();
			that._hideBar();
			return;
		}
		that._posTime(_reset, time || 400);
		that.no_bar || that._slipBarTime(time);
	};
	SlipPx._insertSlipBar = function(param) { // 插入滚动条
		var that = this;
		that._bar       = document.createElement('div');
		that._bar_shell = document.createElement('div');
		if(that.direction == 'x'){
			var _bar_css = 'height: 5px; position: absolute;z-index: 10; pointer-events: none;';
			var _bar_shell_css      = 'opacity: '+that._bar_shell_opacity+'; left:2px; bottom: 2px; right: 2px; height: 5px; position: absolute; z-index: 10; pointer-events: none;';
		}else{
			var _bar_css = 'width: 5px; position: absolute;z-index: 10; pointer-events: none;';
			var _bar_shell_css      = 'opacity: '+that._bar_shell_opacity+'; top:2px; bottom: 2px; right: 2px; width: 5px; position: absolute; z-index: 10; pointer-events: none; ';
		}
		var _default_bar_css = ' background-color: rgba(0, 0, 0, 0.5); border-radius: '+that.radius+'px; -webkit-transition: cubic-bezier(0.33, 0.66, 0.66, 1);' ;
		var _bar_css = _bar_css + _default_bar_css + param.bar_css;
		
		that._bar.style.cssText       = _bar_css;
		that._bar_shell.style.cssText = _bar_shell_css
		that._countAboutBar();
		that._countBarSize();
		that._setBarSize();
		that._countWidthCutBarSize();
		that._bar_shell.appendChild(that._bar);
		that.core.parentNode.appendChild(that._bar_shell);
		setTimeout(function(){that._hideBar();}, 500);
	};
	SlipPx._posBar = function(pos) {};
	SlipPx.__posBarX = function(pos) { // 作用：当设置滑动的方向为“X”时用于设置滚动条的坐标 
		var that = this;
		that._bar.style['webkitTransform'] = 'translate3d('+pos+'px, 0px, 0px)';
		//that._bar.style['webkitTransform'] = 'translate('+pos+'px, 0px)  translateZ(0px)';
	};
	SlipPx.__posBarY = function(pos) { // 作用：当设置滑动的方向为“Y”时用于设置滚动条的坐标 
		var that = this;
		//that._bar.style['webkitTransform'] = 'translate(0px, '+pos+'px)  translateZ(0px)';
		that._bar.style['webkitTransform'] = 'translate3d(0px, '+pos+'px, 0px)';
	};
	SlipPx._slipBar = function() { // 流畅模式下滚动条的滑动
		var that = this;
		var pos = that._about_bar * (that.xy + that.up_range);
		if (pos <= 0) {
			pos = 0;
		}else if(pos >= that._width_cut_barSize){
			pos = Math.round(that._width_cut_barSize);
		} 
		that._posBar(pos);
		that._showBar();
	};
	SlipPx._slipBarPerfect = function() { // 完美模式下滚动条的滑动
		var that = this;
		var pos = that._about_bar * (that.xy + that._bar_upRange);
		that._bar.style[that.width_or_height] = that._bar_size + 'px';
		if (pos < 0) {
			var size = that._bar_size + pos * 3;
			that._bar.style[that.width_or_height] = Math.round(Math.max(size, 5)) + 'px';
			pos = 0;
		}else if(pos >= that._width_cut_barSize){
			var size = that._bar_size - (pos - that._width_cut_barSize) * 3;
			if(size < 5) {size = 5;}
			that._bar.style[that.width_or_height] = Math.round(size) + 'px';
			pos = Math.round(that._width_cut_barSize + that._bar_size - size);
		}
		that._posBar(pos);
	};
	SlipPx._slipBarTime = function(time) { // 作用：指定时间滑动滚动条
		this._bar.style.webkitTransitionDuration = ''+time+'ms';
		this._slipBar();
	};
	SlipPx._stop = function() { // 流畅模式下的动画停止
		var that = this,
			_real_x = that._real();
		that._pos(_real_x);
		if(!that.no_bar){
			that._bar.style.webkitTransitionDuration = '0';
			that._posBar(that._about_bar * _real_x);
		}	
	};
	SlipPx._stopPerfect = function() { // 完美模式下的动画停止
		clearTimeout(this._aniTime);
		this._animating = false;
	};
	SlipPx._realX = function() { // 作用：取得滑动X坐标
		var _real_xy = getComputedStyle(this.core, null)['webkitTransform'].replace(/[^0-9-.,]/g, '').split(',');
		return _real_xy[4] * 1;
	};
	SlipPx._realY = function() { // 作用：取得滑动Y坐标
		var _real_xy = getComputedStyle(this.core, null)['webkitTransform'].replace(/[^0-9-.,]/g, '').split(',');
		return _real_xy[5] * 1;
	};
	SlipPx._countBarSize = function() { // 作用：根据比例计算滚动条的高度
		this._bar_size = Math.round(Math.max(this.parent_wide_high * this.parent_wide_high / this.wide_high, 5));
	};
	SlipPx._setBarSize = function() { // 作用：设置滚动条的高度
		this._bar.style[this.width_or_height] = this._bar_size + 'px';
	};
	SlipPx._countAboutBar = function() { // 作用：计算一个关于滚动条的的数值
		this._about_bar = ((this.parent_wide_high-4) - (this.parent_wide_high-4) * this.parent_wide_high / this.wide_high)/this.width_cut_coreWidth;
	};
	SlipPx._countWidthCutBarSize = function() { // 作用：计算一个关于滚动条的的数值
		this._width_cut_barSize = (this.parent_wide_high-4) - this._bar_size;
	};
	SlipPx.refresh = function(wide_high, parent_wide_high) {// 可在外部调用，作用：当尺寸改变时（如手机横竖屏时），需要重新取得相关的值。这时候就可以调用该函数
		var that = this;
		that._refreshCommon(wide_high, parent_wide_high);
		if(!that.no_bar){
			if(that.coreWidth_cut_width <= 0) {
				that._bar_shell_opacity   = 0;
				that._showBar       = function(){};	
			}else{
				that._showBar = that._showBarStorage || that._showBar;
				that._countAboutBar();
				that._countBarSize();
				that._setBarSize();
				that._countWidthCutBarSize();
			}
		}
		that._rebound(0);
	};
	SlipPx._posTimePerfect = function (x, time) { // 作用：完美模式下的改变坐标函数
		var that = this,
			step = x,
			i, l;
		that._steps.push({ x: x, time: time || 0 });
		that._startAni();
	};
	SlipPx._startAni = function () {// 作用：完美模式下的改变坐标函数
		var that = this,
			startX = that.xy,
			startTime = Date.now(),
			step, easeOut,
			animate;
		if (that._animating) return;
		if (!that._steps.length) {
			that._rebound();	
			return;
		}
		step = that._steps.shift();
		if (step.x == startX) step.time = 0;
		that._animating = true;
		animate = function () {
			var now = Date.now(),
				newX;
			if (now >= startTime + step.time) {
				that._pos(step.x);
				that._animating = false;
				that._startAni();
				return;
			}
			now = (now - startTime) / step.time - 1;
			easeOut = Math.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			that._pos(newX);
			if (that._animating) {
				that._slipBar();
				that._aniTime = setTimeout(animate, 1);
			}
		};
		animate();
	};
	SlipPx._momentum = function (dist, time, maxDistUpper, maxDistLower, size) { // 作用：计算惯性
		var deceleration = 0.001,
			speed = Math.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}
		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;
		return { dist: newDist, time: newTime };
	};
	SlipPx._showBar = function() {// 作用：显示滚动条
		var that = this;
		that._bar_shell.style.webkitTransitionDelay = "0ms";
		that._bar_shell.style.webkitTransitionDuration = '0ms';
		that._bar_shell.style.opacity = "1";
	};
	SlipPx._hideBar = function() {// 作用：隐藏滚动条
		var that = this;
		that._bar_shell.style.opacity = "0";
		that._bar_shell.style.webkitTransitionDelay  = "300ms";
		that._bar_shell.style.webkitTransitionDuration = '300ms';
	};
	function slip(state,core,param) {// 外部实现
		param || (param = {});
		if(_fun.ios() && (parseInt(_fun.version()) >= 5 && param.direction == 'x')&&param.wit){
			core.parentNode.style.cssText += "overflow:scroll; -webkit-overflow-scrolling:touch;";
		}else{
			switch(state){
				case 'page':
					param.direction = "x";
					if(!this.SlipPage){
						this.SlipPage = true;
						SlipPage._init(core,param);
						return SlipPage;
					}else{
						var page = _fun.clone(SlipPage);
						page._init(core,param);
						return page;
					}
					break;
				case 'px':
					if(!this.SlipPx){
						this.SlipPx = true;
						SlipPx._init(core,param);
						return SlipPx;
					}else{
						var Px = _fun.clone(SlipPx);
						Px._init(core,param);
						return Px;
					}
					break;
				default:
					break;
			}
		}
	}
window.slip = slip;	
})(window, document);