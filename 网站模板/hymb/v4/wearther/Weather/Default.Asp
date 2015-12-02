<%
''此参数是取得透过代理服务器的客户端IP 
	IP=Request.ServerVariables("Http_X_ForWarded_For") 
	If Len(IP)=0 Then 
	''直接取得客户端的IP 
	IP=Request.ServerVariables("Remote_Addr")
	Else
	''代理IP地址
	DP=IP
	End If

'Response.Write("IP:"&DP&"<br>")	//测试输出IP
if len(DP)>15 Then
	weizhi = instr(DP,", ")-1
	DP = left(DP,weizhi)
End If
LBSIP="http://api.map.baidu.com/location/ip?ak=fqTDnGKqsVYzLAq2CfMHHijl&ip="&DP&"&coor=bd09ll"
'此处LBSIP中的ak可替换为使用者自行申请的百度LBS ak。


'开始处理Baidu LBS IP信息
'接口实例：http://api.map.baidu.com/location/ip?ak=fqTDnGKqsVYzLAq2CfMHHijl&ip=202.198.16.3&coor=bd09ll
	Function Getjson(Jstr)
	Err.Clear
	On Error Resume Next
	set http=server.CreateObject("WinHttp.WinHttpRequest.5.1")
	http.SetTimeouts 30000,50000,30000,30000
	http.Open "GET",LBSIP,False
'获取Json并写入Session备用
	http.SetRequestHeader "Content-Type", "application/x-www-form-urlencoded"
	http.Send()
	If Err.Number = 0 Then
	jsonStr=trim(http.responsetext)
	'Response.Write jsonStr		//测试输出Json
	Session("Miee_Jstr")=jsonStr
	global jsonStr
	else

	'Response.Write Err.Number	//测试输出Json错误代码
	end if
	http.Abort()

	end Function


	jsonJstr=trim(server.htmlencode(request.QueryString("Jstr")))
	Getjson(jsonJstr)

'下面开始读取Baidu LBS定位返回的Json信息

%>

<script language="JScript" runat="Server">
function toObject(json) {
    eval("var o="+json); //精妙
   return o;
}
</script>
<%
'从Session获取Json并取出省份信息
json=Replace(Session("Miee_Jstr"),Chr(34),Chr(39))
Set json=toObject(json)
if json.status=1 then
Address="北京"
else
Address=json.content.address_detail.city
End if
'Response.Write "<br>您的地址："&Address&"<br>"		//测试输出Json
Set json=Nothing

'下面开始发送地址给Baidu LBS获取天气
'接口实例：http://api.map.baidu.com/telematics/v3/weather?location=北京&output=json&ak=fqTDnGKqsVYzLAq2CfMHHijl
LBSAddress="http://api.map.baidu.com/telematics/v3/weather?location="&Address&"&output=json&ak=fqTDnGKqsVYzLAq2CfMHHijl"
'此处LBSAddress中的ak可替换为使用者自行申请的百度LBS ak。
	Function GetWeatherjson(Jstr)
	Err.Clear
	On Error Resume Next
	set http=server.CreateObject("WinHttp.WinHttpRequest.5.1")
	http.SetTimeouts 30000,50000,30000,30000
	http.Open "GET",LBSAddress,False
'获取Json并写入Session备用
	http.SetRequestHeader "Content-Type", "application/x-www-form-urlencoded"
	http.Send()
	If Err.Number = 0 Then
	jsonStr=trim(http.responsetext)
	'Response.Write jsonStr			//测试输出Json
	Session("Miee_Jstr")=jsonStr
	global jsonStr
	else

	Response.Write Err.Number
	end if
	http.Abort()

	end Function


	jsonJstr=trim(server.htmlencode(request.QueryString("Jstr")))
	GetWeatherjson(jsonJstr)

'下面开始读取Baidu LBS定位返回的Json信息

%>

<%
'从Session获取Json并取出天气信息
json=Replace(Session("Miee_Jstr"),Chr(34),Chr(39))
Set json=toObject(json)
NowTime=Hour(Now)
MCity=json.results.[0].currentCity
MCity=Replace(MCity,"市","")
MCity=Replace(MCity,"省","")
MWatherWind=json.results.[0].weather_data.[0].wind
If NowTime>17 Then			'根据当前时间输出即时天气情况
MTemperature=json.results.[0].weather_data.[1].temperature
MDayPictureUrl=json.results.[0].weather_data.[0].nightPictureUrl
Else
MWeather=json.results.[0].weather_data.[0].weather
MTemperature=json.results.[0].weather_data.[0].temperature
MDayPictureUrl=json.results.[0].weather_data.[0].dayPictureUrl
End If
MWeatherResult=MDayPictureUrl
Set json=Nothing

'对天气预报icon进行优化处理
if MWeatherResult="http://api.map.baidu.com/images/weather/day/qing.png" then
	MDayPictureUrl="0.png"
else if MWeatherResult="http://api.map.baidu.com/images/weather/night/qing.png" then
	MDayPictureUrl="1.png"
else
Select case MWeatherResult
	Case "http://api.map.baidu.com/images/weather/day/duoyun.png"
		MDayPictureUrl="4.png"
	Case "http://api.map.baidu.com/images/weather/night/duoyun.png"
		MDayPictureUrl="4.png"
	Case "http://api.map.baidu.com/images/weather/day/yin.png"
		MDayPictureUrl="9.png"
	Case "http://api.map.baidu.com/images/weather/night/yin.png"
		MDayPictureUrl="9.png"
	Case "http://api.map.baidu.com/images/weather/day/zhenyu.png"
		MDayPictureUrl="10.png"
	Case "http://api.map.baidu.com/images/weather/night/zhenyu.png"
		MDayPictureUrl="10.png"
	Case "http://api.map.baidu.com/images/weather/day/leizhenyu.png"
		MDayPictureUrl="11.png"
	Case "http://api.map.baidu.com/images/weather/night/leizhenyu.png"
		MDayPictureUrl="11.png"
	Case "http://api.map.baidu.com/images/weather/day/leizhenyubanyoubingbao.png"
		MDayPictureUrl="12.png"
	Case "http://api.map.baidu.com/images/weather/night/leizhenyubanyoubingbao.png"
		MDayPictureUrl="12.png"
	Case "http://api.map.baidu.com/images/weather/day/yujiaxue.png"
		MDayPictureUrl="20.png"
	Case "http://api.map.baidu.com/images/weather/night/yujiaxue.png"
		MDayPictureUrl="20.png"
	Case "http://api.map.baidu.com/images/weather/day/xiaoyu.png"
		MDayPictureUrl="13.png"
	Case "http://api.map.baidu.com/images/weather/night/xiaoyu.png"
		MDayPictureUrl="13.png"
	Case "http://api.map.baidu.com/images/weather/day/zhongyu.png"
		MDayPictureUrl="14.png"
	Case "http://api.map.baidu.com/images/weather/night/zhongyu.png"
		MDayPictureUrl="14.png"
	Case "http://api.map.baidu.com/images/weather/day/dayu.png"
		MDayPictureUrl="15.png"
	Case "http://api.map.baidu.com/images/weather/night/dayu.png"
		MDayPictureUrl="15.png"
	Case "http://api.map.baidu.com/images/weather/day/baoyu.png"
		MDayPictureUrl="16.png"
	Case "http://api.map.baidu.com/images/weather/night/baoyu.png"
		MDayPictureUrl="16.png"
	Case "http://api.map.baidu.com/images/weather/day/dabaoyu.png"
		MDayPictureUrl="17.png"
	Case "http://api.map.baidu.com/images/weather/night/dabaoyu.png"
		MDayPictureUrl="17.png"
	Case "http://api.map.baidu.com/images/weather/day/tedabaoyu.png"
		MDayPictureUrl="18.png"
	Case "http://api.map.baidu.com/images/weather/night/tedabaoyu.png"
		MDayPictureUrl="18.png"
	Case "http://api.map.baidu.com/images/weather/day/zhenxue.png"
		MDayPictureUrl="21.png"
	Case "http://api.map.baidu.com/images/weather/night/zhenxue.png"
		MDayPictureUrl="21.png"
	Case "http://api.map.baidu.com/images/weather/day/xiaoxue.png"
		MDayPictureUrl="22.png"
	Case "http://api.map.baidu.com/images/weather/night/xiaoxue.png"
		MDayPictureUrl="22.png"
	Case "http://api.map.baidu.com/images/weather/day/zhongxue.png"
		MDayPictureUrl="23.png"
	Case "http://api.map.baidu.com/images/weather/night/zhongxue.png"
		MDayPictureUrl="23.png"
	Case "http://api.map.baidu.com/images/weather/day/daxue.png"
		MDayPictureUrl="24.png"
	Case "http://api.map.baidu.com/images/weather/night/daxue.png"
		MDayPictureUrl="24.png"
	Case "http://api.map.baidu.com/images/weather/day/baoxue.png"
		MDayPictureUrl="25.png"
	Case "http://api.map.baidu.com/images/weather/night/baoxue.png"
		MDayPictureUrl="25.png"
	Case "http://api.map.baidu.com/images/weather/day/wu.png"
		MDayPictureUrl="30.png"
	Case "http://api.map.baidu.com/images/weather/night/wu.png"
		MDayPictureUrl="30.png"
	Case "http://api.map.baidu.com/images/weather/day/dongyu.png"
		MDayPictureUrl="19.png"
	Case "http://api.map.baidu.com/images/weather/night/dongyu.png"
		MDayPictureUrl="19.png"
	Case "http://api.map.baidu.com/images/weather/day/shachenbao.png"
		MDayPictureUrl="28.png"
	Case "http://api.map.baidu.com/images/weather/night/shachenbao.png"
		MDayPictureUrl="28.png"
	Case "http://api.map.baidu.com/images/weather/day/xiaoyuzhuanzhongyu.png"
		MDayPictureUrl="14.png"
	Case "http://api.map.baidu.com/images/weather/night/xiaoyuzhuanzhongyu.png"
		MDayPictureUrl="14.png"
	Case "http://api.map.baidu.com/images/weather/day/zhongyuzhuandayu.png"
		MDayPictureUrl="15.png"
	Case "http://api.map.baidu.com/images/weather/night/zhongyuzhuandayu.png"
		MDayPictureUrl="15.png"
	Case "http://api.map.baidu.com/images/weather/day/dayuzhuanbaoyu.png"
		MDayPictureUrl="16.png"
	Case "http://api.map.baidu.com/images/weather/night/dayuzhuanbaoyu.png"
		MDayPictureUrl="16.png"
	Case "http://api.map.baidu.com/images/weather/day/baoyuzhuandabaoyu.png"
		MDayPictureUrl="17.png"
	Case "http://api.map.baidu.com/images/weather/night/baoyuzhuandabaoyu.png"
		MDayPictureUrl="17.png"
	Case "http://api.map.baidu.com/images/weather/day/dabaoyuzhuantedabaoyu.png"
		MDayPictureUrl="18.png"
	Case "http://api.map.baidu.com/images/weather/night/dabaoyuzhuantedabaoyu.png"
		MDayPictureUrl="18.png"
	Case "http://api.map.baidu.com/images/weather/day/xiaoxuezhuanzhongxue.png"
		MDayPictureUrl="23.png"
	Case "http://api.map.baidu.com/images/weather/night/xiaoxuezhuanzhongxue.png"
		MDayPictureUrl="23.png"
	Case "http://api.map.baidu.com/images/weather/day/zhongxuezhuandaxue.png"
		MDayPictureUrl="24.png"
	Case "http://api.map.baidu.com/images/weather/night/zhongxuezhuandaxue.png"
		MDayPictureUrl="24.png"
	Case "http://api.map.baidu.com/images/weather/day/daxuezhuanbaoxue.png"
		MDayPictureUrl="25.png"
	Case "http://api.map.baidu.com/images/weather/night/daxuezhuanbaoxue.png"
		MDayPictureUrl="25.png"
	Case "http://api.map.baidu.com/images/weather/day/fuchen.png"
		MDayPictureUrl="26.png"
	Case "http://api.map.baidu.com/images/weather/night/fuchen.png"
		MDayPictureUrl="26.png"
	Case "http://api.map.baidu.com/images/weather/day/yangsha.png"
		MDayPictureUrl="27.png"
	Case "http://api.map.baidu.com/images/weather/night/yangsha.png"
		MDayPictureUrl="27.png"
	Case "http://api.map.baidu.com/images/weather/day/qiangshachenbao.png"
		MDayPictureUrl="29.png"
	Case "http://api.map.baidu.com/images/weather/night/qiangshachenbao.png"
		MDayPictureUrl="29.png"
	Case "http://api.map.baidu.com/images/weather/day/mai.png"
		MDayPictureUrl="31.png"
	Case "http://api.map.baidu.com/images/weather/night/mai.png"
		MDayPictureUrl="31.png"
	Case Else
		MDayPictureUrl="99.png"
	End Select
  end if
end if
%>
<!DOCYTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>天气-幻影特效网-手机上的前端学习平台</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
<meta name="keywords" content=" 幻影特效网,手机上的前端学习平台,HTML、CSS、javascript基础学习,手机前端特效" />
<meta name="description" content=" 幻影特效网-手机上的前端学习平台，旨在为更多的初涉前端编程的人提供一个免费、高效、明了的学习平台 " />
<meta name="author" content="Slade" /> 
  <style type="text/css">
      body{width:120px;height:20px;margin:0 auto;line-height:19px;display:block;overfllow:hidden;}
      p{margin:0;padding:0;font-size:12px;line-height:19px;float:Right;}
      img{margin:0px 2px;float:right;}
  </style>
</head>
<body>
<% Response.Write "<center><p>"&MTemperature&"&nbsp;</p> <img src='/hymb/v4/wearther/Images/Weather/Icon/"&MDayPictureUrl&"' height='16' alt='"&MWatherWind&"'/> <p>"&MCity&"</p></center>" %>
<!-- page.baidu.com/3ghy.com/4qejs_87rk_i.html Baidu tongji analytics -->
<script type="text/javascript">
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F4826c5a45fd4bdd3aa8b1463f97318a1' type='text/javascript'%3E%3C/script%3E"));
</script>
</body>
</html>