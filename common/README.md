# less:

```
.positionCenter{
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.positionX{
  position: absolute;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  -moz-transform: translate(-50%, 0);
  -ms-transform: translate(-50%, 0);
  -o-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
.positionY{
  position: absolute;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  -moz-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  -o-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
.bg(@url){
  background-image: @url;
  background-size: 100% 100%;
}
.font(@fs,@li,@co){
  font-size: @fs;
  line-height: @li;
  color: @co;
}
.borderBox(@w,@h,@bgColor,@border: 0,@radius: 0){
  width: @w;
  height: @h;
  background-color: @bgColor;
  box-sizing: border-box;
  border: @border;
  border-radius: @radius;
}
.flexCenter{
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -o-box;
  display: box;
  display: -webkit-flex;
  display: flex;
  justify-content: space-around;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.flexX{
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -o-box;
  display: box;
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  flex-flow: row wrap;
}

flex-flow: row wrap;
justify-content: space-between;
```

# css:

```
设置body高度铺满整个屏幕
html, body {
    height: 100%;
}
.clearfix:after {
    content: " ";
    display: block;
    clear: both;
    height: 0;
}
.clearfix {
    zoom: 1;
}
.f_l {
  float: left;
}
.f_r {
  float: right;
}
.undis {
  display: none;
}
- 不换行
.ellips {
    word-break: break-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
- 自动换行
.breakword{
    white-space:normal;
    word-wrap:break-word; 
    word-break:break-all;
}
- 两行，超过的话。。。
.line-clamp{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
- 固定宽度内让文字均匀分布
.justify{
  text-align:justify;
  text-align-last:justify;
}
- 改变input输入框的placeholder字体颜色
input::-webkit-input-placeholder{
    color: rgba(106, 121, 137, 0.6)!important;
}
　　input:-moz-placeholder{
    color: rgba(106, 121, 137, 0.6)!important;
}
　　input::-moz-placeholder{
    color: rgba(106, 121, 137, 0.6)!important;
}
　　input:-ms-input-placeholder{
    color: rgba(106, 121, 137, 0.6)!important;
}
- 动态计算长度值，calc()函数支持 "+", "-", "*", "/" 运算；
height: calc(100% - 250px);

- 移除 input type="number" 时浏览器自带的上下箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type="number"]{
    -moz-appearance: textfield;
}

- 改变输入框的光标颜色和内容文字颜色
input, textarea, [contenteditable] { 
    color: #34495e; 
    caret-color: #42b983; 
}

- portrait 竖屏
@media screen and (orientation:portrait) {
	/* portrait-specific styles */
	body{
		background-image:url('./image/0.jpg');

	}
}
- landscape 横屏
@media screen and (orientation:landscape) {
	/* landscape-specific styles */
	body{
		background-image:url('./image/1.jpg');
	}
}
.bg{
  background: #fff url(./0.png) repeat fixed top center;
}
- 控制页面文字不能被选中
body{
  -moz-user-select:none;/*火狐*/
  -webkit-user-select:none;/*webkit浏览器*/
  -ms-user-select:none;/*IE10*/
  -khtml-user-select:none;/*早期浏览器*/
  user-select:none;
}


```

# js:

- 视口大小
	rem 根据根(html)节点的字体大小计算
```
(function(){
	var html = document.querySelector("html");
	var width = html.getBoundingClientRect().width;
	html.style.fontSize = width/25 + "px";
})();
@w:1/30rem;
```
- 获取屏幕宽高
```
var winWid=window.innerWidth;
document.body.style.width=winWid+'px';
var winHei=window.innerHeight;
document.body.style.height=winHei+'px';
//在窗口或框架被调整大小时重新赋值body宽高
window.onresize=function () {
	winWid=window.innerWidth;
	document.body.style.width=winWid+'px';
	winHei=window.innerHeight;
	document.body.style.height=winHei+'px';
}
```
- 禁止浏览器默认行为

```
document.querySelector('body').addEventListener('touchmove', function (ev) {
	ev.preventDefault();
});
```
- 获取角度
```
function getAngle(x1,y1,x2,y2) {
	//直角边长
	var x=Math.abs(x1-x2);
	var y=Math.abs(y1-y2);
	return 360*Math.atan(y/x)/(2*Math.PI);
}
```
- 向列表中一子节点的后面插入一个项目
```
function insertAfter(newElement,targetElement){
	var parent=targetElement.parentNode;
	if(parent.lastChild==targetElement){
		parent.appendChild(newElement);
	}else{
		parent.insertBefore(newElement,targetElement.nextSibling);
	}
}
```
- 获取元素属性
```
function getBound (obj) {
	return obj.getBoundingClientRect();
}
```
- 获取元素样式
```
function getStyle(ele,attr){
	return parseFloat(ele.currentStyle?ele.currentStyle[attr]:getComputedStyle(ele)[attr]);
}
```
- 获取时间
```
function getTime () {
	var date=new Date();
	//获取年份
	var year=date.getFullYear();
	//获取月份
	var month=date.getMonth()+1;
	//获取天
	var d=date.getDate();
	//获取小时
	var h=date.getHours();
	//获取分钟
	var min=date.getMinutes();
	//获取秒钟
	var se=date.getSeconds();
	return year+'-'+toTwo (month)+'-'+toTwo (d)+' '+' '+toTwo (h)+':'+toTwo (min)+':'+toTwo (se);
}
```
- 补零
```
function toTwo (num) {
	if (num<10) {
		return '0'+num;
	}else{
		return ''+num;
	}
}
```
- 拖拽元素
```
function objDrag (dragObj,moveObj) {
	dragObj.onmousedown = function(ev){
		//记录鼠标距离box边缘的位置。
		var disx = ev.clientX - moveObj.offsetLeft;
		var disy = ev.clientY - moveObj.offsetTop;
		document.onmousemove = function(ev){
			//获取到移动过程中鼠标的位置，然后减去鼠标到box边缘的位置。
			var x = ev.clientX - disx;
			var y = ev.clientY - disy;
			moveObj.style.left = x+'px';
			moveObj.style.top = y+'px';
		};
		//鼠标抬起的时候把move事件注销，这样box就不会在移动了。
		document.onmouseup = function(){
			document.onmousemove =document.onmouseup= null;
		};
	};
}
```
- 检测obj1是否碰撞obj2如果是就返回true，否则false
```
function CollisionTest(obj1,obj2){
	var pos1 = getBound(obj1);
	var pos2 = getBound(obj2);
	//排除掉所有不能碰撞的结果，剩下的就是碰撞。
	/*if(pos1.bottom<pos2.top||pos1.left>pos2.right||pos1.top>pos2.bottom||pos1.right<pos2.left){
		return false;
	}else{
		return true;
	}*/
	return !(pos1.bottom<pos2.top||pos1.left>pos2.right||pos1.top>pos2.bottom||pos1.right<pos2.left);
}
```
- 图片预加载
```
function preloadimages(arr){   
    var newimages=[], loadedimages=0
    var postaction=function(){}  //此处增加了一个postaction函数
    var arr=(typeof arr!="object")? [arr] : arr
    function imageloadpost(){
        loadedimages++
        if (loadedimages==arr.length){
            postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image();
        newimages[i].src=arr[i];
        newimages[i].onload=function(){
            imageloadpost();
        }
        newimages[i].onerror=function(){
            imageloadpost();
        }
    }
    return { //此处返回一个空白对象的done方法
        done:function(f){
            postaction=f || postaction
        }
    }
}
```
- 获取地址栏URL参数
```
function getRequest(url) {
	var theRequest = new Object();
	var strs;
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
```
- 页码
```
function getPageList(pageList, size, page) {
    var firstPage = 1;
    var maxPage = 21;
    if (size > maxPage && page > 3) {
        firstPage = page - 3;
		if(firstPage > 1){
       	 	pageList.push(1);
		}
    }
    var lastPage = size;
    if (size > maxPage && page + 4 < size) {
        lastPage = page + 4;
    }
    for (var i = firstPage; i <= lastPage; i++) {
        pageList.push(i);
    }
	//console.log(pageList);
    if (size > maxPage && page + 4 < size) {
        pageList.push(size);
    }
}
```
- 监听滚动，是否滚动到底部
```
function scrollMonitor(height,callback) {
	window.onscroll = function() {
		var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
		//居上滚动了多少高度
		var scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
		//页面总高度
		var clientH = document.documentElement.clientHeight || document.body.clientHeight;
		//页面可视区域的高度
		if (scrollH-clientH-scrollT<height) {
			callback&&callback();
		}
	}
}
```
- 检测是否是PC
```
function isPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
	}
	return flag;
}
```
- 数组从大到小排列
```
function arrSort(arr) {
	arr.sort(sortNumber);
}
function sortNumber(a,b) {
	    return b-a;
}
```
- 获取地址栏参数方法
> 方法一：
```
function getRequest(url) {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
调用:
getRequest(location.search);或者getRequest('?userId=3&name=coding');
```
> 方法二：
```
function getRequestString(url,name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = url.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
调用:
getRequestString('id=123&url=http://.com','url');或者getRequest('abc.html?id=123&url=http://.com');
```
- 计算N！
```
function factorial(n) {
    if (n === 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
```
