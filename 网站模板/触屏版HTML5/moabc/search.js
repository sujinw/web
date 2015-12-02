// JavaScript Document
/*
 wapzz.cn
 */
document.getElementById('keyword-here').onclick=function(){
	var oSearchCon = document.getElementById('search-con').className;
	
	if(oSearchCon == 'search-con'){
		document.getElementById('search-con').className= oSearchCon + ' on';
	}else{
		document.getElementById('search-con').className= 'search-con';
	}
}
var keywordList=document.getElementById('keyword-list').getElementsByTagName('a');

for(var i=0;i<keywordList.length;i++){
	keywordList[i].onclick=function(){
		document.getElementById('search-con').className='search-con';
		document.getElementById('keyword-here').innerHTML=this.innerHTML;
		document.getElementById('srhrange').value=this.rel;
	}
}