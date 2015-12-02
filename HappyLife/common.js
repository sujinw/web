// JavaScript Document
function input_yz(input, id, no) {
    var inp_ut = document.getElementById(input);
    var inp_id = document.getElementById(id);
    if (inp_id.value != "") {
        document.getElementById(input).style.display = "block";
    } else {
        document.getElementById(input).style.display = "none";
    }
    inp_ut.onclick = function () {
        no.value = "";
        document.getElementById(input).style.display = "none";
    }
}
function kaiguan(id) {
    if (document.getElementById(id).style.display != "block") {
        document.getElementById(id).style.display = "block";
    } else {
        document.getElementById(id).style.display = "none";
    }
}
function sousuo(obj,sousuo){
var gu= obj.parentNode.getElementsByTagName("li");
var hui=document.getElementById("id");

for(i=0;i<gu.length;i++){

if(obj==gu[i]){
gu[i].className="sousuo-nav-i";
if(obj==gu[0]){
document.getElementById("sousuo").value="bbs_0";
}else if(obj==gu[1]){
document.getElementById("sousuo").value="article_0";
}else if(obj==gu[2]){
document.getElementById("sousuo").value="download_0";
}else if(obj==gu[3]){
document.getElementById("sousuo").value="search_0";
}
}else{
gu[i].className="";
}
}
}
