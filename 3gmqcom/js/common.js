//函数部分

function $(id)
{
  return document.getElementById(id);
}

function showhide(id)
{
   if($(id).style.display=="none")
   {
     $(id).style.display="block"; 
   
   }else{
      $(id).style.display="none";
   
   }

}

