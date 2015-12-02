/**
 *	Author: 	Hiro Zhang
 *  E-mail:		hiro.zhd@gmail.com
 *  Blog:		http://www.ihiro.org/
 *	Version:	0.1
 *	
 *
 * 参数说明：
 *		1. scrollAnimation 为布尔型， 控制是否需要动态滑动， 可选值：ture、false
 *		2. speed 控制滑动速度，只有scrollAnimation设置为true时才起到作用， 可选值：slow、normal、fast、任意数字
 *
 * 使用方法：(假设有html文档中一个class为top的标签)
 * 		1. 直接跳到顶部: 
 * 			$('.top').scrollTop();
 *		2. 以默认的速度滑行到顶部:	
 *			$('.top').scrollTop({'scrollAnimation': 'true'});
 *			或 $('.top').scrollTop({'scrollAnimation': 'true', 'speed': 'normal'});
 *		3. 自定义速度滑行到顶部：可选值：slow、fast、任意数字
 *		 	$('.top').scrollTop({'scrollAnimation': 'true', 'speed': 'slow'});  移动到顶部的时间为2000毫秒
 *		 	$('.top').scrollTop({'scrollAnimation': 'true', 'speed': 'fast'});  移动到顶部的时间为200毫秒
 *		 	$('.top').scrollTop({'scrollAnimation': 'true', 'speed': '1000'});  移动到顶部的时间为1000毫秒
 *
 */

jQuery.fn.extend({
	
	scrollTop: function(params) {
		
		// 给出默认的参数值
		// 默认情况下，不传参数，没有滑动效果：scrollAnimation = false
		// 若只传一个参数scrollAnimation: true,则默认的速度是500
		var scrollAnimation = false, speed = 500;
		
		if(params != null) {
			scrollAnimation = params.scrollAnimation;
			speed = params.speed;
			
			if(speed == null || speed == 'normal') {
				speed = 500;
			} else if(speed == 'fast') {
				speed = 200;
			} else if(speed == 'slow') {
				speed = 2000;
			};
		};
		
		this.click(function() {
			if(!scrollAnimation) {
				window.scrollTo(0, 0);
			} else {
				$('html, body').animate({scrollTop: '0'}, speed);
			};
			
			return false;
		});
	}
	
});