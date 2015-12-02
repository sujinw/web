<?php
require_once('connect.php'); 
$last = $_POST['last'];   
$amount = $_POST['amount'];   
   
$query=mysql_query("select * from phpcms_content order by contentid desc limit $last,$amount");   
while ($row=mysql_fetch_array($query)) {   
	$sayList[] = array(   
		'title'=>"<a target='_blank' href='http://www.163css.net/$row[url]'>".$row['title']."</a>",
		'pic'=>"<a target='_blank' href='http://www.163css.net/$row[url]'><img src='http://www.163css.net.vh01.51cdngo.com/$row[thumb]' /></a>"
	  );   
}   
echo json_encode($sayList);
?>