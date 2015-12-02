// JavaScript Document
function tab(obj,id){
	var tab_li=obj.parentNode.getElementsByTagName("li");
	var tab_nr=document.getElementById(id).getElementsByTagName("ul");
	for(i=0;i<tab_nr.length;i++)
	{
		if(obj==tab_li[i]){
			tab_li[i].className="active";
		    tab_nr[i].style.display='block';
			}else{
				tab_li[i].className="";
				tab_nr[i].style.display='none';
				}
	}
};
//输入框去除提示文字
function init_input(id){
   var inp = document.getElementById(id).getElementsByTagName('input');
   for(var i = 0; i < inp.length; i++) 
   {
     if(inp[i].type == 'text') 
	 {
       inp[i].setAttribute("rel",inp[i].defaultValue)
       inp[i].onfocus = function() 
	   {
          if(this.value == this.getAttribute("rel")) 
		  {
            this.value = "";
          } else {
             this.select();
                 }
       }
          inp[i].onblur = function() {
          if(this.value == "") 
		  {
            this.value = this.getAttribute("rel");
          }
    }
   }
}
init_input("wp");
};