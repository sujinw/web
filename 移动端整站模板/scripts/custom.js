$(document).ready(function(){
	
(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&(d.href.indexOf("http")||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone")
	
	  var isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
	  var isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
	  var isiPod = navigator.userAgent.toLowerCase().indexOf("ipod");
	  var isiAndroid = navigator.userAgent.toLowerCase().indexOf("android");
	
	  if(isiPhone > -1)
	  {
		  $('.ipod-detected').hide();
		  $('.ipad-detected').hide();
		  $('.iphone-detected').show();
		  $('.android-detected').hide();
	  }
	  if(isiPad > -1)
	  {
		  $('.ipod-detected').hide();
		  $('.ipad-detected').show();
		  $('.iphone-detected').hide();
		  $('.android-detected').hide();
	  }
	  if(isiPod > -1)
	  {
		  $('.ipod-detected').show();
		  $('.ipad-detected').hide();
		  $('.iphone-detected').hide();
		  $('.android-detected').hide();
	  }   
	  
	  if(isiAndroid > -1)
	  {
		  $('.ipod-detected').hide();
		  $('.ipad-detected').hide();
		  $('.iphone-detected').hide();
		  $('.android-detected').show();
	  }  
	
	$('#tweets').tweetable({username: 'iEnabled', time: true, limit: 4, replies: true, position: 'append'});
	
	$('.sidebar-left').hide();
	$('.sidebar-right').hide();
	
	$('.header-notification').click(function(){$('.header-notification').hide(300)});
	
	
	$('.close-notification').click(function(){$(this).parent().hide(200); return false;});
	$('.close-notification-red').click(function(){$('.red-box').hide(300); return false;});
	$('.close-notification-green').click(function(){$('.green-box').hide(300); return false;});
	$('.close-notification-blue').click(function(){$('.blue-box').hide(300); return false;});
	$('.close-notification-yellow').click(function(){$('.yellow-box').hide(300); return false;});

	$('.open-left-sidebar').click(function(){
		$('.content').animate(
			{ left: 260 }, // what we are animating
			200, // how fast we are animating
			'easeOutQuad', // the type of easing
			function() { // the callback
		});
		//$('body').css('position', 'absolute') 
		$('.open-left-sidebar').hide();
		$('.close-left-sidebar').show();
		$('.sidebar-left').show();
		$('.header-notification').delay(400).hide(300);
		return false;
	});
	
	$('.close-left-sidebar').click(function(){
		$('.content').animate(
			{ left: 0 }, // what we are animating
			200, // how fast we are animating
			'easeOutQuad', // the type of easing
			function() { // the callback
		});	
		$('.open-left-sidebar').show();
		$('.close-left-sidebar').hide();
		$('.sidebar-left').hide();
	});


	$('.open-right-sidebar').click(function(){
		$('.content').animate(
			{ left: -260 }, // what we are animating
			200, // how fast we are animating
			'easeOutQuad', // the type of easing
			function() { // the callback
		});
		//$('body').css('position', 'absolute') 
		$('.open-right-sidebar').hide();
		$('.close-right-sidebar').show();
		$('.sidebar-right').show();
		$('.header-notification').delay(400).hide(300);
		return false;
	});
	
	$('.close-right-sidebar').click(function(){
		$('.content').animate(
			{ left: 0 }, // what we are animating
			200, // how fast we are animating
			'easeOutQuad', // the type of easing
			function() { // the callback
		});	
		$('.open-right-sidebar').show();
		$('.close-right-sidebar').hide();
		$('.sidebar-right').hide();
	});


	$('#sub-menu-one').click(function(){
		$('.sub-menu-one').toggle(200);
	});

	$('.image-slider').roundabout({
		minScale: 0.2,
		autoplay:true,
		autoplayDuration:2000,
		minOpacity:0,
		responsive:true,
		duration: 500
	});
	
	$('.toggle-deploy').click(function(){
		$('.toggle-content').show(200);
		$('.toggle-close').show();
		$('.toggle-deploy').hide();
	});
	
	
	$('.toggle-close').click(function(){
		$('.toggle-content').hide(200);
		$('.toggle-close').hide();
		$('.toggle-deploy').show();
	});
	
	
	$('.checkbox').click(function(){
		$(this).toggleClass('selected-checkbox');
		return false;
	});
	
	$('.checkbox2').click(function(){
		$(this).toggleClass('selected-checkbox2');
		return false;
	});
	
	$('.radiobox').click(function(){
		$(this).toggleClass('selected-radiobox');
		return false;
	});
	
	$('.radiobox2').click(function(){
		$(this).toggleClass('selected-radiobox2');
		return false;
	});
	
	var myPhotoSwipe = $("#gallery a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false });

});














