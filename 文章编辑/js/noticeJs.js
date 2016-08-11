$(function(){
	//默认通知
    noticeDefault = function(content){
    	$('#j-toast-default').children().html(content);
    	$('#j-toast-default').toggleClass('active');
        setTimeout(function(){$('#j-toast-default').removeClass('active');},3000);
    }
	noticeDefault1 = function(content){
		var id = parseInt(Math.random() * 100);
		var html = '';
		html += '<style type="text/css">@-webkit-keyframes fadeInOut { 0% { opacity: 0;} 10% { opacity: 1;} 90% { opacity: 1; -webkit-transform: translateY(0px);} 99% { opacity: 0; -webkit-transform: translateY(-30px);} 100% { opacity: 0; }		}	</style>';
		html += '<div class="ui-toast" style="position: absolute; z-index: 10003;-webkit-animation: fadeInOut 3s linear forwards;  text-align: center; text-align: center; top: 70%;  width: 100%; left: 0; display: block; font-size: 1.6rem; line-height: 1.2;" id="j-toast-default'+id+'">';
		html += '<div class="toast-cont" style=" background: rgba(0,0,0,0.8); border: solid 1px #000;-webkit-animation: fadeInOut 3s linear forwards; border-radius: 4px; color: #fff; display: inline-block; padding: 10px 20px; -webkit-box-shadow:0 0 12px rgba(0,0,0,.3); box-shadow:0 0 12px rgba(0,0,0,.3); text-align: left; max-width: 90%;">默认的Toast通知</div>';
		html += '</div>';
		$('body').append(html);
    	$("#j-toast-default"+id).children().html(content);
        setTimeout(function(){$("#j-toast-default"+id).remove();},3000);
    }
    //带图标通知
    noticeIcon = function(content){
    	$('#j-toast-icon').children().html('<i class="iconfont"></i>' + content);
    	$('#j-toast-icon').toggleClass('active');
        setTimeout(function(){$('#j-toast-icon').removeClass('active');},3000);
    }
    
    //带图标通知
    noticeIcontime = function(content,time){
    	$('#j-toast-icon').children().html('<i class="iconfont"></i>' + content);
    	$('#j-toast-icon').toggleClass('active');
        setTimeout(function(){$('#j-toast-icon').removeClass('active');},time);
    }
    
    whiteNoticeDefault = function(content){
    	$('[data-action="j-while-content"]').html(content);
    	$('#popup-while-defalut').toggleClass('active');
    }
    
    //失败关闭
    failClose = function(tip,content){
    	$('[data-action="j-fail-close-tip"]').html(tip);
    	$('[data-action="j-fail-close-content"]').html(content);
    	$('#j-fail-close').toggleClass('active');
    }
    
    //关闭键
    $("[data-action='popUpClose']").on("click",function(){
    	popClose();
    });
    
    //对话默认
    confirmDefault = function (content){
    	$('[data-action="j-confirm-default-content"]').html(content);
    	$('[data-action="j-confirm-default"]').toggleClass('active');
    }
    
    //关闭
    popClose = function(){
    	$('.ui-popup-mask,.ui-popup-iosbox').removeClass('active');
    }
    
    //ui-pageswitch 页面切换
	$('body').on('click','[data-action="close"]',function(){
		removeActive();
		event.preventDefault();
	});
	
	$("[data-action='pageswitch']").on('click',function(){
		$("[data-page='pa'],[data-page='pb'],[data-action='close']").toggleClass('active');
		$("[data-page='pa'],[data-page='pb']").addClass('m-anim');
		event.preventDefault();
	});
	
	//开关
	$('body').on('click','[data-action="switch"]',function(){
		if($(this).attr('data-value') == 0){
		}else{
			$(this).toggleClass('active');
		}
		event.preventDefault();
	});
	
	removeActive = function (){
		$("[data-page='pa'],[data-page='pb'],[data-action='close'],[data-page='pa_b'],[data-page='pb_b']").removeClass('active');
		$(this).removeClass('active');
	}
	
	//带标题的对话框
	confirmTip = function(tip,content){
		$('[data-action="j-confirm-tip-tip"]').html(tip);
		$('[data-action="j-confirm-tip-content"]').html(content);
		$('#j-confirm-tip').toggleClass('active');
	}
	confirmTip_Callback = function(tip,content,fun,data){
		$('[data-action="j-confirm-tip-tip"]').html(tip);
		$('[data-action="j-confirm-tip-content"]').html(content);
		$('#j-confirm-tip').toggleClass('active');
		$('#j-confirm-tip .ui-popup .ui-popup-btns [data-action="popUpClose"]').on('click',function(){
			$('#j-confirm-tip').removeClass('active');
			$(this).off('click');
		});
		if(fun != undefined){
			$('[data-action="j-confirm-tip-true"]').on('click',function(){
				fun(data);
				$('#j-confirm-tip').removeClass('active');
				$(this).off('click');
			});
		}
	}
	//带重置按钮设置的对话框
	confirmFailReset = function(tip,content,reset){
		$('[data-action="j-confirm-fail-operation-tip"]').html(tip);
		$('[data-action="j-confirm-fail-operation-content"]').html(content);
		$('[data-action="j-confirm-fail-operation-reset"]').html(reset);
		$('#j-confirm-fail-operation').toggleClass('active');
	}
	//带重置按钮设置的对话框
	confirmFailReset_Callback = function(tip,content,reset,fun,data){
		$('[data-action="j-confirm-fail-operation-tip"]').html(tip);
		$('[data-action="j-confirm-fail-operation-content"]').html(content);
		$('[data-action="j-confirm-fail-operation-reset"]').html(reset);
		$('#j-confirm-fail-operation').addClass('active');
		$('#j-confirm-fail-operation .ui-popup .ui-popup-btns .popUpClose').on('click',function(){
			$('#j-confirm-fail-operation').removeClass('active');
			$(this).off('click');
		});
		if(fun != undefined){
			$('[data-action="j-confirm-fail-operation-reset"]').on('click',function(){
				fun(data);
				$('#j-confirm-fail-operation').removeClass('active');
				$(this).off('click');
			});
		}
	}
	
});