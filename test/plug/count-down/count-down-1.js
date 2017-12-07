;(function (window,document) {
    var CountDown= function (deadline,targetDom,callback) {
        if(!(this instanceof CountDown))return new CountDown(deadline,targetDom,callback);

        if ((typeof targetDom)==='string') {
            this.targetDom=document.querySelectorAll(targetDom);
        } else{
            this.targetDom=targetDom;
        }
        this.deadline=deadline;
        this.init(callback);
    };
    CountDown.prototype={
        init:function(callback){
            this.decline (callback);
            this.getTime (callback);
        },
        decline:function(callback){
            var _this=this;
            this.timer=setInterval(function () {
                _this.getTime(callback);
            },1000)
        },
        getTime:function(callback){
            var EndTime= new Date(this.deadline);
            var NowTime = new Date();
            var count_num =(EndTime.getTime() - NowTime.getTime())/1000;
            this.count_num=count_num;
            this.getNewTime={
                d:0,
                h:0,
                /*m:0,*/
                s:0
            }
            if(count_num>=0){
                this.getNewTime={
                    d:this.toTwo(Math.floor(this.count_num/60/60/24)) + ' 天',
                    h:this.toTwo(Math.floor(this.count_num/60/60%24)) + ' 时',
                    /*m:this.toTwo(Math.floor(this.count_num/60%60)),*/
                    s:this.toTwo(Math.floor(this.count_num%60)) + ' 秒'
                }
            } else{
                clearInterval(this.timer);
                this.getNewTime={
                    d:'00 天',
                    h:'00 时',
                    /*m:'00 分',*/
                    s:'00 秒'
                }
                this.write();
                callback&&callback();
                return false;
            }
            this.write();
        },
        write:function(){
            var data_arr=[];
            var data=this.getNewTime;
            for (var i in data) {
                data_arr.push(data[i]);
            }
            for (var i = 0; i < this.targetDom.length; i++) {
                this.targetDom[i].innerHTML=data_arr[i];
            }
        },
        toTwo:function(num){
            if (num<10) {
                return '0'+num;
            }else{
                return ''+num;
            }
        }
    };
    // 暴露方法
    window.CountDown = CountDown;
})(window,document)
