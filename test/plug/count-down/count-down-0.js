//时间设置格式:'2017/06/03 00:00:00'
function countDown(deadline,obj) {
    var EndTime= new Date(deadline);
    var NowTime = new Date();
    var count_num =(EndTime.getTime() - NowTime.getTime())/1000;
    decline (count_num,obj);
    countDownInitialize (count_num,obj);
}
function decline (count_num,obj) {
    var timer=null;
    timer=setInterval(function () {
        count_num--;
        if (count_num<0) {
            count_num=0;
            //关闭定时器
            clearInterval(timer);
            return;
        }
        countDownInitialize (count_num,obj);
    },1000)
}
function countDownInitialize (count_num,obj) {
    var t=count_num;
    var getTime={
        d:0,
        h:0,
        /*m:0,*/
        s:0
    }
    if(t>=0){
        getTime={
            d:toTwo(Math.floor(t/60/60/24)),
            h:toTwo(Math.floor(t/60/60%24)),
            /*m:toTwo(Math.floor(t/60%60)),*/
            s:toTwo(Math.floor(t%60))
        }
    } else{
        return;
    }
    writeHtml(obj,getTime);
}
function writeHtml(obj,data) {
    var data_arr=[];
    for (var i in data) {
        data_arr.push(data[i]);
    }
    for (var i = 0; i < obj.length; i++) {
        obj[i].innerHTML=data_arr[i];
    }
}
function toTwo (num) {
    if (num<10) {
        return '0'+num;
    }else{
        return ''+num;
    }
}
