$(function(){
	var bold = 0; //是否粗体
	var italic = 0;	//是否斜体
	var fontsize = 16;	//字体大小
	var fontscolor = "rgb(0,0,0)";	//字体颜色
	var position = 0;  //位置  居左 居中 居右
	var border = 0;		//边框
	var bordercolor = "rgb(0,0,0)";
	var backgroundcolor = "rgb(255,255,255)";	//背景颜色
	var borderStr = Array("border-style:dashed;border-width:0px;","border-style:solid;border-width:1px;","border-style:dashed;border-width:1px;", "border-style:dotted;border-width:1px;","border-style:double;border-width:1px;","-webkit-border-image: url(images/bg_border1.png) 26/17px repeat;","-webkit-border-image: url(images/bg_border2.png) 16/10px repeat;","-webkit-border-image: url(images/bg_border3.png) 40/20px repeat;","-webkit-border-image: url(images/bg_border4.png) 8/8px repeat;","-webkit-border-image: url(images/bg_border5.png) 30/17px repeat;","-webkit-border-image: url(images/bg_border6.png) 30/20px repeat;","-webkit-border-image: url(images/bg_border7.png) 10/10px repeat;","-webkit-border-image: url(images/bg_border8.png) 30/20px repeat;","-webkit-border-image: url(images/bg_border9.png) 15/15px repeat;","-webkit-border-image: url(images/bg_border10.png) 30/20px repeat;","-webkit-border-image: url(images/bg_border11.png) 20/10px repeat;","-webkit-border-image: url(images/bg_border12.png) 39/20px repeat;","-webkit-border-image: url(images/bg_border13.png) 15/15px repeat;","-webkit-border-image: url(images/bg_border14.png) 18/15px repeat;");
	if($('#bold').val() != ''){
		bold = parseInt($('#bold').val());
	};
	if($('#italic').val() != ''){
		italic = parseInt($('#italic').val());
	};
	if($('#fontsize').val() != ''){
		fontsize = parseFloat($('#fontsize').val());
	};
	if($('#fontscolor').val() != ''){
		fontscolor = $('#fontscolor').val();
	};
	if($('#position').val() != ''){
		position = parseInt($('#position').val());
	};
	if($('#border').val() != ''){
		border = parseInt($('#border').val());
	};
	if($('#bordercolor').val() != ''){
		bordercolor = $('#bordercolor').val();
	};
	if($('#backgroundcolor').val() != ''){
		backgroundcolor = $('#backgroundcolor').val();
	};
	if(border >= 5 || border == 0){
		$('.bordCorlor').hide();
	}
	$('.fontColor s').attr('style','background-color:'+fontscolor+';');
	switch(position){
		case 0:
			$('#align').attr('class','alignL');
		break;
		case 1:
			$('#align').attr('class','alignC');
		break;
		case 2:
			$('#align').attr('class','alignR');
		break;
	}
	var style = getstyle();
	$('#EditResult').attr('style',style);
	$('.bold').on('click',function(){  //粗体
		if(bold == 0){
			bold = 1;
		}else{
			bold = 0;
		}
		style = getstyle();
		$('#EditResult').attr('style',style);
	})
	$('.tilt').on('click',function(){	//斜体
		if(italic == 0){
			italic = 1;
		}else{
			italic = 0;
		}
		style = getstyle();
		$('#EditResult').attr('style',style);
	})
	
	$('.increase').on('click',function(){	//字体增大
		console.log(fontsize)
		fontsize += 2;
		console.log(fontsize);
		if(fontsize > 60){
			fontsize = 60;
			noticeDefault('已最大');
			return;
		}
		style = getstyle();
		$('#EditResult').attr('style',style);
	})
	$('.reduce').on('click',function(){	//字体减小
		
		fontsize -= 2;
		if(fontsize < 12){
			fontsize = 12;
			noticeDefault('已最小');
			return;
		}
		style = getstyle();
		$('#EditResult').attr('style',style);
	})
	
	$('.pop-fontColor span').on('click',function(){ //字体颜色
		fontscolor = $(this).css('background-color');
		$('.fontColor s').attr('style','background-color:'+fontscolor+';');
		style = getstyle();
		$('#EditResult').attr('style',style);
		$('.pop-bgColor,.pop-align,.pop-fontColor').hide();
		$('.txtEditBox-menu li i').hide();
	})
	$('#alignL').on('click',function(){ //字体居左
		position = 0;
		style = getstyle();
		$('#EditResult').attr('style',style);
		$('.pop-bgColor,.pop-align,.pop-fontColor').hide();
		$('.txtEditBox-menu li i').hide();
	})
	$('#alignC').on('click',function(){ //字体居中
		position = 1;
		style = getstyle();
		$('#EditResult').attr('style',style);
		$('.pop-bgColor,.pop-align,.pop-fontColor').hide();
		$('.txtEditBox-menu li i').hide();
	})
	$('#alignR').on('click',function(){ //字体居右
		position = 2;
		style = getstyle();
		$('#EditResult').attr('style',style);
		$('.pop-bgColor,.pop-align,.pop-fontColor').hide();
		$('.txtEditBox-menu li i').hide();
	})
	$('#boderEdit li').on('click',function(){ //边框
		var classname = $(this).attr('className');
		console.info(classname);
		border = parseInt($(this).attr('date-bdindex'));
		if(border >= 5){
			$('.bordCorlor').hide();
		}else{
			if(border == 0){
				$('.bordCorlor').hide();
			}else{
				$('.bordCorlor').show();
			}
		}
		style = getstyle();
		$('#EditResult').attr('style',style);
	})
	$('.pop-bgColor span').on('click',function(){ //背景颜色
		backgroundcolor = $(this).css('background-color');
		style = getstyle();
		$('#EditResult').attr('style',style);
		$('.pop-bgColor,.pop-align,.pop-fontColor').hide();
		$('.txtEditBox-menu li i').hide();
		
	})
	$('#bordCorlor li').on('click',function(){	//边框颜色
		bordercolor = $(this).css('background-color');
		style = getstyle();
		$('#EditResult').attr('style',style);
	})
	
	$('.EditResult').on('click',function(){
		$('.pop-fontColor').hide();
		$('.pop-align').hide();
		$('.pop-bgColor').hide();
	})
	var text = '';
	$('.EditResult').on('focus',function(){
		text = $(this).val();
	});
	$('.EditResult').on('input',function(){
		if(text.length == 0){
			text = $(this).val();
			text = '     ' + text
			$(this).val(text);
		}
	})

	$('.EditSaveBtn').on(click,function(){
		$.ajax({
			url : path + "/vip/tosaveMcdText.xhtml",
			type : "post",
			dataType : "json",
			data : {"pdid" 		 : $('#pdid').val(),
					"pid"  		 : $('#pid').val(),
					"content"	 : $('#EditResult').val(),
					"style"		 : style,
					"bold" 		 : bold,
					"italic"	 : italic,
					"fontsize"	 : fontsize,
					"fontscolor" : fontscolor,
					"position"	 : position,
					"border"	 : border,
					"bordercolor": bordercolor,
					"backgroundcolor" : backgroundcolor
				},
			success : function(msg){
				if(msg.result == 1){
					window.location.href = path + msg.url + '#' + $('#pdid').val();
				}else if(msg.result == -1){
					noticeDefault('保存失败');
				}else if(msg.result == -2){
					noticeDefault('参数错误');
				}else if(msg.result == -3){
					noticeDefault('页面不存在，请返回到单页列表刷新重试');
				}
			}
		});
	});
	function getstyle(){
		var style = "";
		if(bold == 0){style += "font-weight:400;";}else{style += "font-weight:700;";}
		if(italic == 0){style += "font-style:normal;";}else{style += "font-style:italic ;";}
		style += "font-size:"+fontsize/10 + "rem;";
		style += "color:"+fontscolor+";";
		switch(position){
			case 0:
				style += "text-align:left;";
				break;
			case 1:
				style += "text-align:center;";
				break;
			case 2:
				style += "text-align:right;";
				break;
		}
		style += "background-color:"+backgroundcolor+";";
		style += borderStr[border];
		if(border < 5){
			style += "padding: 10px;border-color:" + bordercolor + ";";
		}
		style += "line-height:180%;";
		return style;
	}
})
