function $(obj){
	return new Transition(obj);
};
function Transition(obj){
 	this.ele = [];
	switch(typeof obj){
		case 'string' :
			switch (obj.charAt(0)){
				case '#' :   
					this.ele.push(document.querySelector(obj));
 				break;
				case '.' :   
					this.ele = document.querySelectorAll(obj);
				break;
				default :    
					this.ele = document.querySelectorAll(obj);
			}
		break;
		case 'object' :
			this.ele.push(obj);
		break;
	};
 };

 Transition.prototype.init = function(json){
  	this.cssJson = {
		'height' : json.height,
		'width': json.width,
		'left': json.left,
		'top': json.top,
		'right':json.right,
		'bottom':json.bottom,
		'background':json.background,
		'color':json.color,
		'borderRadius' : json.borderRadius,
		'opacity':json.opacity || (this.ele[0] ? this.getStyle(this.ele[0],'opacity') : this.getStyle(this.ele,'opacity') || 1),
		'marginLeft' :json.marginLeft || json['margin-left'],
		'marginTop': json.marginTop || json['margin-top'],
		'marginRight' :json.marginRight || json['margin-right'],
		'marginBottom': json.marginBottom || json['margin-bottom'],
		'margin' :json.margin,
		'paddingLeft' :json.paddingLeft || json['padding-left'],
		'paddingTop' :json.paddingTop || json['padding-top'],
		'paddingLeft' :json.paddingRight || json['padding-right'],
		'paddingTop' :json.paddingBottom || json['padding-bottom'],
		'padding': json.padding
	};
	//alert(this.getStyle(this.ele[0],'opacity'))
	this.move = {
	    'ease':           'ease',
	    'linear':         'linear',
	    'in':         	  'ease-in',
	    'out':            'ease-out',
	    'in-out':         'ease-in-out',
	    'snap':           'cubic-bezier(0,1,.5,1)',
	    'easeInCubic':    'cubic-bezier(.550,.055,.675,.190)',
	    'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
	    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
	    'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
	    'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
	    'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
	    'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
	    'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
	    'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
	    'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
	    'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
	    'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
	    'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
	    'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
	    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
	    'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
	    'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
	    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
	    'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
	    'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
	    'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
	    'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
	    'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
	    'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
	};
	this.callback = json.callback || function(){};
	this.cssJsonLength = 0;
	this.h = json.height;
	this.w = json.width;
	this.o = json.opacity;
	this.x = json.x || 0;
	this.y = json.y || 0;
	this.z = json.z || 0;
	this.d = json.delay || 0;
	this.r = json.rotate || 0 ;
	this.rx = json.rotateX || 0 ;
	this.ry = json.rotateY || 0 ;
	this.rz = json.rotateZ || 0 ;
	this.sc = json.scale;
	this.scx = json.scaleX;
	this.scy = json.scaleY;
 	if(json.skew){
		this.sx = json.skew || 0;
		this.sy = json.skew || 0;
	}else{
		this.sx = json.skewX || 0;
		this.sy = json.skewY || 0;
	}
    	if(json.scale || json.scale==0){
 		this.scx = json.scale.toString();
		this.scy = json.scale.toString();
	}else if(json.scaleX){
		this.scx = json.scaleX;
		this.scy = 1;
	}else if(json.scaleY){
		this.scx = 1;
		this.scy = json.scaleY;
	};
	for(var  c in this.cssJson ){
		if(this.cssJson[c] == undefined){
			delete this.cssJson[c]
		}else{
			this.cssJsonLength ++;
		};
	};
 };
Transition.prototype.transition = function(json){
	this.init(json);
	this.t = 0;
	this.type = "";
 	if(typeof arguments[1] == 'number'){
		this.t = arguments[1] || 400;
		this.type = this.move[arguments[2]] || this.move['ease']
	}else{
		this.t = arguments[2] || 400;
		this.type = this.move[arguments[1]] || this.move['ease']
	};
	var _this = this;
	var arr = this.ele;
	var arr2 = ['translateX','translateY','translateZ','rotate','rotateX','rotateY','rotateZ','skew','scale'];
	var arrs = [];
	for(var a in json){
		if(a == 'x'){
			arrs.push('translateX')
		}else if(a == 'y' ){
			arrs.push('translateY')
		}else if( a =='z'){
			arrs.push('translateZ')
		}else if(a == 'skewX' || a == 'skewY'){
			arrs.push('skew')
		}else if(a =='scaleX' || a=='scaleY'){
			arrs.push('scale')
		}else{
			arrs.push(a)
		};
	};
 	if(this.cssJsonLength){
		for(var i=0;i<arr.length;i++){
 			for(var k in this.cssJson){
   				arr[i].style[k] = this.cssJson[k] + ((k =='opacity' || k =='background' || k =='color')  ? "" : 'px');
 			}
	 	};
	};
	for(var i=0;i<arr.length;i++){
   		arr[i].style.msTransition =arr[i].style.MozTransition = arr[i].style.WebkitTransition = 'all '+ this.t +'ms '+this.type+' '+  this.d+'ms';
 	};
 	console.log(arrs)
	for(var j=0;j<arrs.length;j++){
 		for(var i=0;i<arr.length;i++){
 			arr[i].style.msTransform = arr[i].style.MozTransform = arr[i].style.WebkitTransform =  this.ins(arr[i],arrs[j]);
	 	};
	}
	setTimeout(function(){
		for(var i=0;i<arr.length;i++){
			arr[i].style.msTransition = arr[i].style.MozTransition =arr[i].style.WebkitTransition = '';
	 	};
 	 	_this.callback.call(arr[0]);
	},this.t+this.d);
	//console.log(arrs)
};
Transition.prototype.unstr = function(b){
	var c = [];
	b.forEach(function(i){  
	    if(c.indexOf(i) === -1){
			c.push(i);
		} ;
	});
	return c;
};
Transition.prototype.get = function(num){
	return this.ele[num];
};
Transition.prototype.eq = function(num){
	return $(this.ele[num]);
};
Transition.prototype.setTransTwo = function(obj){
	if(obj.getAttribute('style').match(/transform:(.*?)\);/gi)){
		return obj.getAttribute('style').match(/transform:(.*?)\);/gi).toString().replace(/transform:|;/gi,"")
		}else{
		return ''
	};
};


Transition.prototype.ins = function(o,s){
	switch (s){
		case 'translateX' :
				if(this.setTransTwo(o).match(/translate3d\(.*?\)/gi)){
					var m = this.setTransTwo(o).match(/translate3d\(.*?\)/gi,"")[0].replace(/[translate3d|\(|\)]/gi,"").split(', ');
					m[0]=this.x+'px';
					return	this.setTransTwo(o).replace(/translate3d\(.*?\)/gi,'translate3d('+m.join(",")+')');
			}else{
				return	this.setTransTwo(o) + ' translate3d('+this.x+'px,'+this.y+'px,'+this.z+'px)';
			};
			break;
			case 'translateY' :
				if(this.setTransTwo(o).match(/translate3d\(.*?\)/gi)){
					var m = this.setTransTwo(o).match(/translate3d\(.*?\)/gi,"")[0].replace(/[translate3d|\(|\)]/gi,"").split(', ');
					m[1]=this.y+'px';
					return	this.setTransTwo(o).replace(/translate3d\(.*?\)/gi,'translate3d('+m.join(",")+')');
			}else{
				return	this.setTransTwo(o) + ' translate3d('+this.x+'px,'+this.y+'px,'+this.z+'px)';
			};
			break;
			case 'translateZ' :
				if(this.setTransTwo(o).match(/translate3d\(.*?\)/gi)){
					var m = this.setTransTwo(o).match(/translate3d\(.*?\)/gi,"")[0].replace(/[translate3d|\(|\)]/gi,"").split(', ');
					m[2]=this.z+'px';
					return	this.setTransTwo(o).replace(/translate3d\(.*?\)/gi,'translate3d('+m.join(",")+')');
			}else{
				return	this.setTransTwo(o) + ' translate3d('+this.x+'px,'+this.y+'px,'+this.z+'px)';
			};
			break;
		case 'skew' :
				if(this.setTransTwo(o).match(/skew\(.*?\)/gi)){
				return	this.setTransTwo(o).replace(/skew\(.*?\)/gi,'skew('+this.sx+'deg,'+this.sy+'deg)');
			}else{
				return	this.setTransTwo(o) + ' skew('+this.sx+'deg,'+this.sy+'deg) ';
			};
		break;
		case 'rotate' :
				if(this.setTransTwo(o).match(/rotate\w?\(.*?\)/gi)){
				return	this.setTransTwo(o).replace(/rotate\w?\(.*?\)/gi,'rotate('+this.r+'deg) ');
			}else{
				return	this.setTransTwo(o) + ' rotate('+this.r+'deg)';
			};
		break;
		case 'rotateX' :
  				if(this.setTransTwo(o).match(/rotate\w?\(.*?\)/gi)){
				return	this.setTransTwo(o).replace(/rotate\w?\(.*?\)/gi,'rotateX('+this.rx+'deg) ');
			}else{
				return	this.setTransTwo(o) + ' rotateX('+this.rx+'deg)';
			};
		break;
		case 'rotateY' :
			if(this.setTransTwo(o).match(/rotate\w?\(.*?\)/gi)){
					return	this.setTransTwo(o).replace(/rotate\w?\(.*?\)/gi,'rotateY('+this.ry+'deg) ');
			}else{
				return	this.setTransTwo(o) + ' rotateY('+this.ry+'deg)';
			};
		break;
		case 'rotateZ' :
				if(this.setTransTwo(o).match(/rotate\w?\(.*?\)/gi)){
				return	this.setTransTwo(o).replace(/rotate\w?\(.*?\)/gi,'rotateZ('+this.rz+'deg) ');
			}else{
				return	this.setTransTwo(o) + ' rotateZ('+this.rz+'deg)';
			};
		break;
		case 'scale' :
				if(this.setTransTwo(o).match(/scale\(.*?\)/gi)){
				return	this.setTransTwo(o).replace(/scale\(.*?\)/gi,'scale('+this.scx+','+this.scy+')');
			}else{
				return	this.setTransTwo(o) + 'scale('+this.scx+','+this.scy+')';
			};
		break;
	};
};


Transition.prototype.getStyle = function(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,null)[attr];
	};
};
