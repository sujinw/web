ajax: function(type, url, data, fnTrue, fnFalse) { 
	    /**
		* 该方法用于发送Ajax请求
		* @author slade
		* @param {对象字面量}type 发送类型 GET/POST
		* @param {对象字面层}url 目标地址
		* @param {object类型}data 发送的参数
		* @param {fn类型}fnTrue 成功时返回函数		
		* @param {fn类型}fnFalse 失败时返回函数
		*/	

        var oAjax = null;
        
        if (window.XMLHttpRequest) {
            oAjax = new XMLHttpRequest();
        } else {
            oAjax = new ActiveXObject("Microsoft.XMLHTTP");
        }
		var type = type.toUpperCase();
		//用于清除缓存
		var random = Math.random();
		
		if(typeof data == 'object'){
			var str = '';
			for(var key in data){
				str += key + '=' data[key] + '&';
			}
			data = str.replace(/&$/, '');
		}
        switch (type) {
            case "POST":
               oAjax.open('POST', url, true);
			   //需要html表单提交数据，使用setRuequestHeader()来添加http头
			   oAjax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			   oAjax.send(data);
                break;
            case "GET":
				if(data){
					oAjax.open('GET', url + '?' +data, true);
				}else{
					oAjax.open('GET', url + '?t=' + random, true);
				}
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