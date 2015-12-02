// JavaScript Document
(function($){
	//Plugin For Pic
	//============================
	
	
	//regeister Plugin
	//===========================
	$(window).on('load',function(){
		$(".btt").hide();
	});
	$(window).scroll(function(){
		if($(window).scrollTop()>500){
			$(".btt").show();	
		}
		else{
			$(".btt").hide();
		}
	});
})(jQuery);