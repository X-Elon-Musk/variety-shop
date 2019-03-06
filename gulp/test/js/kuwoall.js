///<jscompress sourcefile="properties.js" />
/*
 * Created By Jiang Wanyu
 * 
 * 项目常量
 */
 
//---------------------------------------------------------------------------------
var PROPERTIES = {};

PROPERTIES.timestamp = new Date().getTime();

PROPERTIES.projectname = '/vip';//工程名
PROPERTIES.debug = false;//是否是debug模式
PROPERTIES.userinfo={};//用户信息

PROPERTIES.loginNew = false;

//定价
PROPERTIES.priceDefine = {
	vip1 : 8,
	vip2: 12,
	vip3: 4,
	vip4: 10,
	discount: 0.95
}

//支付时商品描述
PROPERTIES.goodsDescription = {
	singleSong: '单曲购买',
	singleAlbum: '专辑购买',
	vip1: '酷我音乐包',
	vip2: '酷我至尊音乐包',
	vip3: '酷我至尊音乐包',
	vip4: '酷我VIP',
	batch: '批量购买'
}

PROPERTIES.device = {
	MY_DEVICE_UID: '',
	MY_VERSION_NAME: '',
	MY_SOURCE: ''
}

//用于LogTraceUtils 的参数
PROPERTIES.logtrace = {
	//音乐包当前的日志版本信息
	vipmCurrentVersion: 'V20160519', 
	pcCurrentVersion: 'V0000',
	mboxCurrentVersion: 'V1000',
	payCurrentVersion: 'P20160720',
	abtest: {
		'DEFAULT': '0',
		'A': '1',
		'B': '2',
		'C': '3',
		'D': '4'
	}
}

PROPERTIES.productType = {
	"vip_1": 1,
	"vip_2": 2,
	"vip_3": 3,
	"vip_4": 7,
	"vip_7": 12
}


///<jscompress sourcefile="utils.js" />
/*Created By Jiang Wanyu
 * 
 * 通用工具类---
 */


// 操作系统	---------------------------------------------------------------------------------------------------------------------------
osUtils = {
	flag: {
		FLAG_ME_ANDR: false,
		FLAG_ME_IOS: false,
		FLAG_ME_PC: false,
		setIos: function(){
			this.FLAG_ME_IOS = true;
		},
		setAndroid: function(){
			this.FLAG_ME_ANDR = true;	
		},
		setPC: function () {
			this.FLAG_ME_PC = true;
		}
	},
	property:{
		android: 'an',
		ios: 'ios',
		windows: 'win',
		mac: 'mac',
		pc: 'pc'
	},
	getPlat: function(){
		if(this.flag.FLAG_ME_ANDR) return this.property.android;
		if(this.flag.FLAG_ME_IOS) return this.property.ios;
		if(this.flag.FLAG_ME_PC) return this.property.pc;
		
		var plat = navigator.platform.toLowerCase();
		if(plat.indexOf('arm')>=0 || plat.indexOf('linux') >= 0 ){
			return this.property.android;
		}else if(plat.indexOf('win')>=0){
			return this.property.windows;
		}else if(plat.indexOf('mac')>=0){
			return this.property.mac;
		}else if(plat.indexOf('iphone')>=0||plat.indexOf('ipad')>=0||plat.indexOf('ipod')>=0){
			return this.property.ios;
		}
		return plat.substr(0,5);
	},
	isAndroid: function(){
		if(this.flag.FLAG_ME_ANDR) return true;
		else return this.property.android == this.getPlat();
	},
	isIos: function(){
		if(this.flag.FLAG_ME_IOS) return true;
		else return this.property.ios == this.getPlat();
	},
    isWx: function () {
        var ua = navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i)=="micromessenger";
    },
    //是否在微信内
    isInWeChat: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    //是否在支付宝内
    isInAli: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/Alipay/i) == 'alipay' || ua.match(/AliApp/i) == 'aliapp') {
            return true;
        } else {
            return false;
        }
    },
    //QQ内
    isQQ: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/QQ/i) == 'qq') {
            return true;
        } else {
            return false;
        }
    },
    //微信内
    isWeChat: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    //微博内
    isWeiBo: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/WeiBo/i) == 'weibo') {
            return true;
        } else {
            return false;
        }
    },
}

//手机本地方法调用 -----------------------------------------------------------------------------------------------------------------------
var nativeUtils={
	/**
	 * 调用本地方法
	 *  
	 * @param {} jsonAdr Required 必须有 
	 * @param {} jsonIos	Optional
	 */
	callNative: function(json){
		
		if(osUtils.isAndroid()){
			try{
				window.KuwoInterface.jsCallNative(json);
			}catch(e){}
		}else if (osUtils.isIos()) {
			var data = eval("("+json+")");
			var messagingIframe;    
			messagingIframe = document.createElement('iframe');    
			messagingIframe.style.display = 'none';    
			document.documentElement.appendChild(messagingIframe);
			messagingIframe.src= "kwip://kwplayerhd/"+data.action+"?param="+encodeURIComponent(json);
		}else{
			try{
				window.KuwoInterface.jsCallNative(json);
			} catch(e){
				var data = eval("("+json+")");
				var messagingIframe;    
				messagingIframe = document.createElement('iframe');    
				messagingIframe.style.display = 'none';    
				document.documentElement.appendChild(messagingIframe);
				messagingIframe.src= "kwip://kwplayerhd/"+data.action+"?param="+encodeURIComponent(json);
			}
		}
	},
	/**
	 * MV操作
	 * 
	 * @param {} mvId
	 * @param {} mvName
	 * @param {} mvQuality
	 * @param {} artist
	 */
	arPlayMV: function(mvId,mvName,mvQuality,artist){
		var libpath = '';
		var jsonstr=   '{"action":"control_playmv","libpath":"'+libpath+'","musiclist":[{"musicrid":"'+mvId+'","name":"'+mvName+'","formats":"'+mvQuality+'","artist":"'+artist+'"}]}';
		var armvquality = mvQuality.replace(/\|/g,";")
		var jsonstrAdr='{"action":"control_playmv","libpath":"'+libpath+'","musiclist":[{"mvid":"'+mvId+'","mvname":"'+mvName+'","mvquality":"'+armvquality+'","artist":"'+artist+'"}]}';
		this.callNative(jsonstrAdr, jsonstr);
	},
	//歌曲操作 type操作类型 musicStr歌曲集合array 单曲[{}],批量[{},{}]
	musicOption: function (type, musicStr) {
		var action = '';
		if (type == 'play') {
			action = 'control_playselect';
		} else if (type == 'download') {
			action = 'control_downloadselect';
		}
		var jsonstr = '{"action":"' + action + '","libpath":"","musiclist":' + musicStr + '}';
		console.log(jsonstr);
		this.callNative(jsonstr);
	},
	/**
	 * 
	 * 歌曲操作
	 * 
	 * @param {} playSelect
	 * @param {} id
	 * @param {} name
	 * @param {} artist
	 * @param {} album
	 * @param {} formats
	 */
	arPlaySONG: function(playSelect,id,name,artist,album,formats){
		var libpath = '';
		var jsonstr='{"action":"'+playSelect+'","libpath":"'+libpath+'","musiclist":[{"musicrid":"'+id+'","name":"'+name+'","formats":"'+formats+'","artist":"'+artist+'","album":"'+album+'"}]}';
		this.callNative(jsonstr);
	},
	tagDefine: function () {
		var jsonstr='{"action":"pay_tag_define", "callback":"tagDefineCallBack"}';
		this.callNative(jsonstr);
	},
	/**调用是否是最新的客户端--同时也是是否支持登录后的回调*/
	supportClientPay: function(){
		var jsonstr = '{"action":"is_compatible_client_pay","callback":"supportCallback"}';
		this.callNative(jsonstr);
	},
	/**显示登陆框*/
	showLoginBox: function () {
		var jsonstr='{"action":"control_login", "callback":"loginsuccess"}';
		if(osUtils.isIos() && !PROPERTIES.loginNew){
			//不支持登陆回调版本的 IOS 要使用此方法来弹出登陆
			jsonstr ='{"action":"to_loginAndRegist"}';
		}
		this.callNative(jsonstr);
	},
	/**
	 * 获取设备信息
	 * 
	 * 回调
	 * feedback_deviceinfo(data) （ios）
	 * feedback_ardeviceinfo(data) (android)
	 */
	getDeviceinfo: function() {
		var jsonstr = '{"action":"control_get_deviceinfo","pagetype":"def"}';
		this.callNative(jsonstr);
	},
	
	/**
	 * 跳转到指定面板
	 * 
	 * @param {} type 要调用的面板类型，
	 * 				<ul>
	 * 					<li>gs: 歌手面板; 
	 * 					<li>zj: 专辑面板; 
	 * 					<li>gd: 歌单面板; 
	 * 					<li>zq: 专区面板; 
	 * 					<li>gm: 我的购买面板; 
	 * 				</ul> 
	 * @param {} id 指定ID 面板的后台配置ID
	 * @param {} title 面板名称
	 */
	gotoPanel: function (type, id, title) {
		if(utils.isEmpty(type)) return;
		var action = '',
			jsonstr = '';
		if(osUtils.isIos()){
			if('gs' == type) action = 'sys_goto_artist';
			else if('zj' == type) action = 'sys_goto_album';
			else if('gd' == type) action = 'sys_goto_songlist';
			else if('zq' == type) action = 'sys_goto_zhuanqu';
			else if('gm' == type) action = 'pay_goto_songs_purchased';
			jsonstr = '{"action":"'+action+'","persistentId":"'+id+'","title":"'+title+'"}';
		}else{
			if ('gs' == type) {
				action = 'goto_artist_page';
				jsonstr = '{"action":"' + action + '","artistid":"' + id + '","artistname":"' + title + '"}';
			} else if ('zj' == type) {
				action = 'goto_album_page';
				jsonstr = '{"action":"' + action + '","albumid":"' + id + '","name":"' + title + '"}';
			} else if ('gd' == type) {
				action = 'goto_playlist_page';
				jsonstr = '{"action":"' + action + '","pid":"' + id + '","name":"' + title + '"}';
			} else if ('zq' == type) {
				action = 'sys_goto_zhuanqu';
				jsonstr = '{"action":"' + action + '","persistentId":"' + id + '","title":"' + title + '"}';
			} else if('gm' == type) {
				action = 'pay_goto_songs_purchased';
				jsonstr = '{"action":"' + action + '","persistentId":"' + id + '","title":"' + title + '"}';
			};
		}
		this.callNative(jsonstr);
	},
    //在app打开一个新的webview
    openUrl: function (url, title, type) {
        if (url.indexOf('?') > -1) {
            url = url + '&t=' + Math.random();
        } else {
            url = url + '?t=' + Math.random();
        }
        var refer = getKey(url, 'refer');
        if (!refer) {
            url = url + '&refer=' + (getKey(window.location.href, 'refer') || 0);
        }
        url = url.replace('https://', location.protocol + '//').replace('http://', location.protocol + '//');
        if (location.hostname == 'testvip.kuwo.cn' || location.hostname == 'console.ecom.kuwo.cn') {
            url = url.replace('vip1.kuwo.cn', location.hostname);
        }
        title = returnSpecialChar(title);
        var jsonstr = '{"action":"control_inapp_url","url":"' + url + '","title":"' + title + '","pagetype":"' + (type || '') + '"}';
        if (navigator.userAgent.indexOf('kuwopage') > -1) {
            this.callNative(jsonstr);
        } else {
        	try{
        		if((typeof deviceUtils == 'object') && (typeof deviceUtils.ver != 'undefined') || (typeof PROPERTIES.device == 'object') && (typeof PROPERTIES.device.MY_VERSION_NAME != 'undefined')){
        			this.callNative(jsonstr);
        			return false;
        		}
        	}catch(e){}
            window.location.href = url;
        }
    },
	/**通知服务器支付完成*/
	payFinished: function (data) {
		var jsonstr = '{"action":"pay_finished","callback":"", "success":"true","product":"'+data+'"}';
		this.callNative(jsonstr);
	},
	/**设置网页容器标题*/
	setPageTitle: function (title) {
		try{
			if(osUtils.isIos()){
				this.callNative('{"action":"set_title","title":"'+title+'"}');
			}else{
				window.KuwoInterface.set_title(title);
			}
		}catch(e){}
	}
	
};//end 

//PC本地方法调用 -----------------------------------------------------------------------------------------------------------------------
var mboxNativeUtils={
	
	/**
	 * 本地接口-基础
	 * @param {} call
	 * @return {}
	 */
	callClient: function (call) {
	    try {
	        return window.external.callkwmusic(call);
	    } catch (e) {
	        return "";
	    }
	},
	
	/**从音乐盒获取用户信息*/
	getUserInfo: function() {
		return this.callClient('UserState');
	},
	/**从音乐盒获取版本信息*/
	getVer: function () {
		return this.callClient('GetVer');
	},
	/**关闭窗口*/
	closePanel: function () {
		return this.callClient('CloseWindow');
	},
	/**获取产品信息*/
	getProductInfo: function () {
		return this.callClient('GetBuyInfo');
	},
	/**支付成功通知*/
	succNotify: function (type) {
		var str = 'PayResult'
		if(type){
			str = str + '?type=' + type;
		}
		LogTraceUtils.doFromSrcInit('callback_successful','P20180409')
		return this.callClient(str);
	},
	/**调登录框*/
	showLoginBox: function () {
		this.callClient('UserLogin?src=login');
		return false;
	}
}

// 工具 ---------------------------------------------------------------------------------------------------------------------------------
var utils = {
	/**
	 * 空字符串声明
	 * 
	 * 非全局声明变量的“全局变量”  以 "_" 开头
	 * 
	 * @type String
	 */
	_emptyString:'',
	/**
	 * 判断字符串是否空
	 * @param {} str
	 * @return true or false
	 */
	isEmpty: function(str){
		return !str || str.length <= 0;
	},
	/**
	 * 判断字符串非空
	 * @param {} str
	 * @return true or false
	 */
	isNotEmpty: function(str){
		return !this.isEmpty(str);
	},
	/**
	 * 加载JS
	 * 
	 * @param {} filename
	 */
	loadJs: function(filename){
		var fileref = document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src",filename);
		document.getElementsByTagName("head")[0].appendChild(fileref);
	},
	/**
	 * 记录日志
	 * @param {} loginfo  '/xxx'
	 */
	logTrace: function(loginfo) {
		var img = new Image();
		img.src = PROPERTIES.projectname + '/pv/mobile'+loginfo+'.jpg'; 
	},
	logTracePc: function(loginfo) {
		var img = new Image();
		img.src = PROPERTIES.projectname + '/pv/pc'+loginfo+'.jpg'; 
	},
	/**
	 * 截取字符串 包含中文处理
	 * (串,长度,增加...) 
	 * @param {} str
	 * @param {} len
	 * @param {} hasDot
	 * @return {}
	 */
	subString: function (str, len, hasDot) {  
		if(this.isEmpty(str)){
			return '';
		}
	    var newLength = 0;  
	    var newStr = "";  
	    var chineseRegex = /[^\x00-\xff]/g;  
	    var singleChar = "";  
	    var strLength = str.replace(chineseRegex,"**").length;  
	    for(var i = 0;i < strLength;i++) {  
	        singleChar = str.charAt(i).toString();  
	        if(singleChar.match(chineseRegex) != null) {  
	            newLength += 2;  
	        } else { newLength++;  }
	        if(newLength > len) { break;}  
	        newStr += singleChar;  
	    }  
	    if(hasDot && strLength > len) {  
	        newStr += "...";  
	    }  
	    return newStr;  
	},
	getLength:function(s)   
	{  
	    var len = 0;  
	    for(var i=0; i<s.length; i++)   
	    {  
	        var c = s.substr(i,1);  
	        var ts = escape(c);  
	        if(ts.substring(0,2) == "%u")   
	        {  
	            len+=2;  
	        } else   
	        {  
	            len+=1;  
	        }  
	    }  
	    return len;  
	},
	/**
	 * 处理数字显示问题，缺少的位数以 “0” 填充
	 * 
	 * @param {} str 要补全的数字
	 * @param {} wantLength 理想的位数 （大于str的长度时有效）
	 */
	numberMerge: function(str, wantLength){
		if(this.isEmpty(str)){
			str = '0';
		}
		if(this.isNotEmpty(wantLength)){
			var length = str.length;
			var sub = wantLength - length;  
			if(sub > 0){
				var zeros=this._emptyString;
				for(var i=0; i<sub; i++){
					zeros += '0';
				}
				str = zeros+str;
			}
		}
		return str;
	},
	/**格式化日期 为'yyyy/MM/dd HH:mm:ss'格式*/
	formatDate: function(date){
		
		var year = date. getFullYear();
		var month = date. getMonth()+1;
		var day = date. getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		
		month = month<10 ? '0'+month : month;
		day = day<10 ? '0'+day : day;
		hour = hour<10 ? '0'+hour: hour;
		min = min<10 ? '0'+min: min;
		sec = sec<10 ? '0'+sec: sec;
		
		var dataStr = year+'/'+month+'/'+day+' '+hour+':'+min+':'+sec;
		return dataStr;
	},
	/**格式化 时间 yyyy-MM-dd*/
	formatDate1: function(date){
		
		var year = date. getFullYear();
		var month = date. getMonth()+1;
		var day = date. getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		
		month = month<10 ? '0'+month : month;
		day = day<10 ? '0'+day : day;
		
		var dataStr = year+'-'+month+'-'+day;
		return dataStr;
	},
	/**格式化 时间 yyyyMMdd*/
	formatDate2: function(date){
		
		var year = date. getFullYear();
		var month = date. getMonth()+1;
		var day = date. getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		
		month = month<10 ? '0'+month : month;
		day = day<10 ? '0'+day : day;
		
		var dataStr = year+''+month+''+day;
		return dataStr;
	},
	/**生成随机整数*/
	randomInt: function(){
		var number = parseInt(Math.random()*10);
		if(0 == number%2){
			return 1;
		}else{
			return 2;
		}
	},
	/**返回n-m之间的整数  包含n 单不包含m*/
	randomInt2: function(n,m){
		var w = m-n;
		return parseInt(Math.random()*w+n, 10)
	},
	/**生成随机头像*/
	randomHeadPic: function(src){
		if(utils.isEmpty(src) || '-1' != src.indexOf('secretb.gif')){
			var randomInt = utils.randomInt2(1,5);
			if(randomInt <1 || randomInt>4){
				randomInt = 1;
			}
			src = './img/defaultph'+randomInt+'.png';
		}
		return src;
	},
	/**显示loading*/
	showLoading: function(){
		$('#id_mymask_loading').show();
		$('#id_div_progress').show();
	},
	/**隐藏loading*/
	hideLoading: function(){
		$('#id_mymask_loading').hide();
		$('#id_div_progress').hide();
	},
	showAlert: function (msg) {
		$('#id_p_dg_alert_text').text(msg);
		$('#id_mymask').show();
		$('#id_div_dialog_alert').show();
	},
	hideAlert: function () {
		$('#id_p_dg_alert_text').text('alert');
		$('#id_mymask').hide();
		$('#id_div_dialog_alert').hide();
	},
	/**获取url“?”后面的部分*/
	getUrlParams: function(){
		var url = location.href;
		var params = '';
		
		if(url && url.length > 0){
			var index = url.indexOf('?');
			if(-1 != index){
				params = url.substr(index+1, url.length)
			}
		}
		
		return params;
	},
	/**截取 ‘a=b&c=d’ ... 形式的 key对应的value值*/
	getParamValue: function(urlparam, name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = urlparam.match(reg);
		if (r!=null) return unescape(r[2]); return null;
	},
	/**获取IE版本*/
	getIEVersion : function (){
	    var UA = navigator.userAgent;
	    if(/msie/i.test(UA)){
	        return UA.match(/msie (\d+\.\d+)/i)[1];
	    }else if(~UA.toLowerCase().indexOf('trident') && ~UA.indexOf('rv')){
	        return UA.match(/rv:(\d+\.\d+)/)[1];
	    }
	    return false;
	},
	/**解析json**/
	parseJSON: function (str){
		return eval('(' + str + ')');
	},
	/**json字符串中非法 有引号相关的 转换成可以正常解析的json字符串**/
	validateJSONStr: function (data, replaceCharacter){
		try {
			var json = eval("(" + data + ")");
		} catch (e) {
			try {
				var dataArray = data.split("");
				var dataArrayLength = dataArray.length;
				for (var i = 0; i < dataArrayLength; i++) {
					if (dataArray[i] == ':' && dataArray[i + 1] == '"') {
						for (var j = i + 2; j < dataArrayLength; j++) {
							if (dataArray[j] == '"') {
								if (dataArray[j + 1] != ',' && dataArray[j + 1] != '}') {
									dataArray[j] = replaceCharacter || '\\\"';
								} else if (dataArray[j + 1] == ',' || dataArray[j + 1] == '}') {
									break;
								}
							}
						}
					}
				}
				data = dataArray.join('');
			} catch (e) {
			}
		}
		return data;
	}
};


// 日志记录工具 ----------------------------------------------------------------------------------------------------------------------
var LogTraceUtils = {
	
	root: function (params) {
		var img = new Image();
		img.src = PROPERTIES.projectname + '/pv/logtrace1.gif?'+params;
	},
	
	/**获取版本信息对应的参数， 用于java 日志打印*/
	getVersionParams: function (version, abtest) {
		var myab = abtest ? abtest : '0';
		var fs = '';
		try{
			fs = $('#id_ip_cliAction').val() || VipData.property.cliAction;
		}catch(e){
			fs = '';
		}
		var newfromsrc = '';
		try{
			newfromsrc = utils.getParamValue(utils.getUrlParams(), 'newfromsrc');
			if(newfromsrc){
				newfromsrc = '&newfromsrc=' + newfromsrc;
			}else{
				newfromsrc = '';
			}
		}catch(e){
			newfromsrc = '';
		}
		var from='';
        try{
            from = utils.getParamValue(utils.getUrlParams(), 'from');
            if(from){
                from = '&from=' + from;
            }else{
                from = '';
            }
        }catch(e){
            from = '';
        }
		return 'myid=' + PROPERTIES.timestamp 
				+ '&logver=' + version
				+ '&abtest=' + myab 
				+ '&pf='+ osUtils.getPlat()
				+ '&uid='+ PROPERTIES.userinfo.uid
				+ '&duid='+ PROPERTIES.device.MY_DEVICE_UID
				+ '&dvers='+ PROPERTIES.device.MY_VERSION_NAME
				+ '&fs='+ fs
				+ newfromsrc
				+from
				+ '&page='+ LogTraceUtils.pageType
				+ '&source='+ PROPERTIES.device.MY_SOURCE
				+ '&pid=';//TODO1,
	},
	
	/**测试日志打印*/
	logTest: function (testInfo) {
		this.root('logtest='+testInfo);
	},
	
	/**页面初始化统计*/
	doInit: function (version, abtest) {
		var params = 'action=init&'+this.getVersionParams(version, abtest);
		this.root(params);
	},
	
	/**设备信息初始化统计*/
	doDeviceVersionInit: function (version, abtest) {
		var params = 'action=dvcinit&'+this.getVersionParams(version, abtest);
		this.root(params);
	},
	
	/**来源初始化统计*/
	doFromSrcInit: function (fromsrc, version, abtest) {
		var params = 'action='+fromsrc+'&'+this.getVersionParams(version, abtest);
		this.root(params);
	},
	
	/**记录点击支付按钮*/
	doPayBtnClick: function (version, abtest) {
		var params = 'action=payBtnClick&'+this.getVersionParams(version, abtest);
		this.root(params);
	},
	
	/**记录PC支付按钮点击 */
	doPcPayBtnClick: function (version, abtest, vipType, autoPay) {
		var subparams = 'vipType='+vipType+'&autoPay='+autoPay;
		var params = 'action=payBtnClick&'+subparams+'&'+this.getVersionParams(version, abtest);
		this.root(params);
	}
}

//Cookie -------------------------------------------------------------------------------------------------------------------------------
var cookieUtis = {
	getCookie: function (name) {    
		 var nameEQ = name + "=";    
		 var ca = document.cookie.split(';');    //把cookie分割成组    
		 for(var i=0;i < ca.length;i++) {    
		 var c = ca[i];                      //取得字符串    
		 while (c.charAt(0)==' ') {          //判断一下字符串有没有前导空格    
		 c = c.substring(1,c.length);      //有的话，从第二位开始取    
		 }    
		 if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name    
		 return unescape(c.substring(nameEQ.length,c.length));    //解码并截取我们要值    
		 }    
		 }
		 return false;
	},
	    
	//清除cookie    
	clearCookie: function (name) {    
	 setCookie(name, "", -1);
	},
	    
	//设置cookie    
	setCookie: function (name, value, seconds) {    
		 seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。    
		 var expires = "";    
		 if (seconds != 0 ) {//设置cookie生存时间    
		 var date = new Date();    
		 date.setTime(date.getTime()+(seconds*1000));    
		 expires = "; expires="+date.toGMTString();    
		 }    
		 document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值    
	}
}

//处理浏览器兼容问题 --------------------------------------------------------------------------------------------------------------
var PatchUtils = {
	/**Object.key() 方法兼容*/
    initObjectKey: function() {
        if (!Object.keys) {
            Object.keys = (function() {
                var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({
                    toString: null
                }).propertyIsEnumerable('toString'),
                dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
                dontEnumsLength = dontEnums.length;

                return function(obj) {
                    if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

                    var result = [];

                    for (var prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) result.push(prop);
                    }

                    if (hasDontEnumBug) {
                        for (var i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                        }
                    }
                    return result;
                }
            })()
        };
    }
}

/*
 单曲支付页面
 1、mobile/v2/appStore/pay.jsp
 2、mobile/v2/andrPay.jsp
 3、mobile/v2/iosPay.jsp
 音乐包引导相关
 */

// 取一个字符串的hash
function getHashCode(str) {
	var hash = 0;
	var len = str.length;
	if (len == 0) return hash;
	for (i = 0; i < len; i++) {
		var ch = "";
		ch = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + ch;
		hash = hash & hash;
	}
	if (hash < 0) {
		hash = -hash;
	}
	return hash;
}
// 获取 图片域名的随机数
function getImgNumber(pic) {
	var num = (getHashCode(pic + PROPERTIES.device.MY_DEVICE_UID) % 10) + 1;
	if (num >= 5) {
		if (num >= 8) {
			num = 4;
		} else {
			num = 3;
		}
	} else {
		if (num >= 2) {
			num = 2;
		}
	}
	return num;
}
//通过歌曲或者专辑图片地址获取全路径
function getPic(pic, type, srcSize, desSize) {
	pic = pic || '';
	var picStr = location.protocol + '//kwimg' + getImgNumber(pic) + '.kuwo.cn/star/';
	if (type == 'album') {
		picStr += 'albumcover';
	} else if (type == 'artist') {
		picStr += 'starheads';
	}
	picStr += '/';
	picStr += pic.replace(srcSize + '/', desSize + '/');
	if (pic.indexOf('http') > -1) {
		picStr = pic.replace(srcSize + '/', desSize + '/');
	}
	return picStr;
}
//拼歌曲播放下载相关参数
function getMusicObj(music) {
	var musicObj = {};
	musicObj.id = music.MUSICRID.replace('MUSIC_', '');
	musicObj.name = music.SONGNAME;
	musicObj.artist = music.ARTIST;
	musicObj.album = music.ALBUM;
	musicObj.formats = music.FORMATS;
	musicObj.pay = music.PAY;
	musicObj.psrc = music.psrc || '';
	return musicObj;
}
//歌曲操作拼接json调用客户端
function musicListOption(type, musicList, psrc) {
	var musicStr = '[';
	$.each(musicList, function (k, v) {
		if (k >= 1) {
			musicStr += ',';
		}
		musicStr += '{"musicrid":"' + v.id + '","name":"' + returnSpecialChar(v.name) + '","formats":"' + v.formats + '","artist":"' + returnSpecialChar(v.artist) + '","album":"' + returnSpecialChar(v.album) + '","pay":"' + v.pay + '","psrc":"' + (psrc || v.psrc) + '"}';
	});
	musicStr += ']';
	if (musicList.length > 0) {
		nativeUtils.musicOption(type, musicStr);
	}
}

try{
	//适用于加载完成后立即初始化图片延迟加载
	function initImgLazyLoad() {
		var doInit = function () {
			$('.lazy-load').imglazyload();
			$.fn.imglazyload.detect();
		};
		if (window.Vue) {
			Vue.nextTick(function () {
				doInit();
			});
		} else {
			doInit();
		}
	}
	//替换文件名的过滤器
	Vue.filter('name', function (value) {
		return showSpecialChar(value);
	});
}catch(e){}

//检查特殊字符
function showSpecialChar(s) {
	s = s || '';
	return s.replace(/&nbsp;/g, ' ').replace(/\&amp;/g, "&").replace(/&apos;/g, '\'').replace(/\&quot;/g, "\"").replace(/\%26apos\%3B/g, "'").replace(/\%26quot\%3B/g, "\"").replace(/\%26amp\%3B/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
//替换特殊字符
function returnSpecialChar(s) {
	s = '' + s;
	return s.replace(/\&amp;/g, "&").replace(/\&nbsp;/g, " ").replace(/\&apos;/g, "'").replace(/\&quot;/g, "\\\"").replace(/\%26apos\%3B/g, "'").replace(/\%26quot\%3B/g, "\\\"").replace(/\%26amp\%3B/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\t/g, "");
}
//图片加载失败
function imgOnError(obj, type) {
	obj.onerror = null;
	if (type === 1) {
		obj.src = location.protocol + '//image.kuwo.cn/newvip/vipzone/v1/error_banner.png';
	} else if (type === 2) {
		obj.src = location.protocol + '//image.kuwo.cn/newvip/vipzone/v1/error_ost.png';
	} else {
		obj.src = location.protocol + '//image.kuwo.cn/newvip/vipzone/v1/error_common.png';
	}
}

function getKey(url, key) {
	//获取某个url字符串中 key的value  比如 xxx.com?a=1&b=2
	url = url.toString();
	if (url.indexOf('#') >= 0) {
		url = url.substring(0, url.indexOf('#'));
	}
	var value = '';
	var begin = url.indexOf(key + '=');
	if (begin >= 0) {
		var tmp = url.substring(begin + key.length + 1);
		var eqIdx = tmp.indexOf('=');
		var end = 0;
		if (eqIdx >= 0) {
			tmp = tmp.substring(0, eqIdx);
			end = tmp.lastIndexOf('&');
		} else {
			end = tmp.length;
		}
		if (end >= 0) {
			try {
				value = decodeURIComponent(tmp.substring(0, end));
			} catch (e) {
				value = tmp.substring(0, end);
			}
		} else {
			try {
				value = decodeURIComponent(tmp);
			} catch (e) {
				value = tmp;
			}
		}
	}
	return value;
}
