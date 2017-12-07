/**
 * Created by lenovo on 2017/8/13.
 */
//获取屏幕宽高
var winWid=window.innerWidth;
console.log(winWid);
document.body.style.width=winWid+'px';
var winHei=window.innerHeight;
document.body.style.height=winHei+'px';
$('.outerContainer').css({
    width: winWid+'px',
    height: winHei+'px'
})
$('.sliderImages').css({
    width: $('.sliderImages li').length*winWid+'px'
})
for (var i=0;i<$('.sliderImages li').length;i++) {
    $('.sliderImages li').eq(i).css({
        left: winWid*i+'px',
        width: winWid+'px'
    })
}
//公司相册轮播图
$('.sliderContainer')[0].num=0;
//拖动开始
$('.sliderContainer')[0].addEventListener("touchstart",function(ev){
    console.log(111);
    ev.preventDefault();
    $('.sliderContainer')[0].start=0;
    $('.sliderContainer')[0].start=getStyle($('.sliderImages')[0],'margin-left');
    $('.sliderContainer')[0].disx=ev.touches[0].pageX-this.offsetLeft;
});
//拖动过程
$('.sliderContainer')[0].addEventListener("touchmove",function(ev){
    console.log(222);
    ev.preventDefault();
    if ($('.sliderContainer')[0].x==0) {
        return;
    }
    //移动距离处理
    $('.sliderContainer')[0].x=ev.touches[0].pageX-$('.sliderContainer')[0].disx;
    $('.sliderImages').css({
        marginLeft: $('.sliderContainer')[0].start+$('.sliderContainer')[0].x+'px'
    });
    console.log($('.sliderContainer')[0].start,$('.sliderContainer')[0].x);
});
//拖动结束
$('.sliderContainer')[0].addEventListener("touchend",function(ev){
    console.log(333);
    ev.preventDefault();
    $('.sliderContainer')[0].endPos=getStyle($('.sliderImages')[0],'margin-left');
    var dif=$('.sliderContainer')[0].endPos-$('.sliderContainer')[0].start;

    if (dif>0) {
        $('.sliderContainer')[0].num--;
        if ($('.sliderContainer')[0].num<=0) {
            $('.sliderContainer')[0].num=0;
        }
        $('.sliderImages').animate({
            marginLeft: -winWid*$('.sliderContainer')[0].num+'px'
        },'slow')
    }
    else if (dif<0) {
        $('.sliderContainer')[0].num++;
        if ($('.sliderContainer')[0].num>=$('.sliderImages li').length-1) {
            $('.sliderContainer')[0].num=$('.sliderImages li').length-1;
        }
        $('.sliderImages').animate({
            marginLeft: -winWid*$('.sliderContainer')[0].num+'px'
        },'slow')

    }
    else if (dif==0) {
        return;
    }
});
mui('.images').on('tap','li',function () {
    $('body').addClass('overFlow');
    $('.sliderContainer')[0].num=$(this).index();
    $('.sliderImages').css({
        marginLeft: -winWid*$('.sliderContainer')[0].num+'px'
    })
    $('.outerContainer').css({
        top: window.pageYOffset+'px'
    })
    $('.outerContainer').fadeIn(400,function () {
        $('.sliderImages').animate({
            marginTop:'0px',
            opacity:1
        },'slow')
        $('.sliderContainer').on('tap',function () {
            $('body').removeClass('overFlow');
            $('.outerContainer').fadeOut('slow',function () {
                $('.sliderImages').css({
                    marginTop:'-4rem',
                    opacity:0
                })
            })
        })
    })
})
//获取元素样式
function getStyle(ele,attr){
    return parseFloat(ele.currentStyle?ele.currentStyle[attr]:getComputedStyle(ele)[attr]);
}