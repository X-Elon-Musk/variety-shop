class NewActivity {
  constructor(){
    // 用户当前状态：1、领取失败，2、领取成功，3、已领取过，4、不符合条件
    this.userState=0;
    // 是否在盒外：1、在，0、不在
    this.outApp=0;
  }
  //弹出登陆框（盒外）
  showLoginOutBox () {
    cookieUtis.setCookie('uname3', '');
    var myhtml = window.location.href;
    var begin = myhtml.substring(0, myhtml.indexOf('?', 1));
    var end = myhtml.substring(myhtml.indexOf('?', 1), myhtml.length);
    myhtml = begin + escape(end);
    var url = location.protocol + '//vip1.kuwo.cn/fans/fanss/outbox_login.jsp?return_url=' + encodeURIComponent(myhtml);
    if (PROPERTIES.debug == true) {
      url = 'http://console.ecom.kuwo.cn/fans/fanss/outbox_login.jsp?return_url=' + encodeURIComponent(myhtml);
    }
    location.href = url;
    return;
  }
  //在盒外
  isOutApp () {
    if (window.location.href.indexOf('fromkw=share') > -1 || Activity.isWeChat() || Activity.isWeiBo()) {
      return true;
    }
    return false;
  }
  //判断用户是否已经登录
  checkUserIsLogin () {
    var userId = PROPERTIES.userinfo.uid;
    var isLogin = true;
    try {
      if (typeof userId == 'undefined' || !userId || userId == '0' || userId == '' || userId == 'null') {
        isLogin = false;
      }
    } catch (e) {}
    return isLogin;
  }
  // 去登陆
  goToLogin () {
    //调用登录
    var jsonStr = '{"action":"control_login", "callback":"loginsuccess"}';
    if (osUtils.isIos()) {
      //不支持登陆回调版本的 IOS 要使用此方法来弹出登陆
      jsonStr = '{"action":"to_loginAndRegist", "callback":"loginsuccess"}';
    }
    nativeUtils.callNative(jsonStr);
  }
  initPageEvents () {
    var that=this;
    $(".section_getButton1").on("click", "#go_get", function () {
      /* // 首先判断是否登录以及是盒内盒外
      if (!that.checkUserIsLogin()) {
        if (that.isOutApp()) {
          that.showLoginOutBox();
        } else {
          that.goToLogin();
        }
        return false;
      } */
      that.setMember();
    })
  }
  async setMember () {
    var res=await this.getMember();
    var res = utils.parseJSON(res);
    if ('200' != res.meta.code) {
      return false;
    }
    if (res.data && res.data == '200') {
      console.log(503,'领取成功');
      this.userState=2;
      $('.section_one1').addClass('undis');
      $('.section_one2').removeClass('undis');
      $('.section_img_true').removeClass('undis');
      $('.text_content1').html('领取成功').removeClass('undis');
      $('.little_img').removeClass('undis');
      $('.card_one').removeClass('undis');
      if (this.isOutApp()) {
        $('.button_item_box').removeClass('undis');
      } else {
        $('.common_buttons .button_item').html('立即开始体验');
        $('.common_buttons').removeClass('undis');
      }
      /* var paramsCard = 'op=addVipLux7Coupon&uid=' + uid;
      $.get('/vip/v2/user/vip?' + paramsCard, function (resCard) {
        console.log(445, resCard);
        var resCard = utils.parseJSON(resCard);
        if ('200' != resCard.meta.code) {
          return false;
        }
        if (resCard.data && resCard.data == 'ok') {
          $('.card_two').removeClass('undis');
        } else{
          console.log("领取失败");
        }
      }) */
      var resCard=await this.getCoupon();
      var resCard = utils.parseJSON(resCard);
      if ('200' != resCard.meta.code) {
        return false;
      }
      if (resCard.data && resCard.data == 'ok') {
        $('.card_two').removeClass('undis');
      } else{
        console.log("领取失败");
      }
    } else if (res.data && res.data == '300') {
      console.log(505,'领取过');
      this.userState=3;
      var resCard=await this.getCoupon();
      var resCard = utils.parseJSON(resCard);
      if ('200' != resCard.meta.code) {
        return false;
      }
      if (resCard.data && resCard.data == 'ok') {
        $('.section_one1').addClass('undis');
        $('.section_one2').removeClass('undis');
        $('.section_img_false').removeClass('undis');
        $('.text_content2').removeClass('undis');
        $('.little_img').removeClass('undis');
        $('.card_two').removeClass('undis');
        if (this.isOutApp()) {
          $('.button_item_box').removeClass('undis');
        } else {
          $('.common_buttons .button_item').html('使用代金券');
          $('.common_buttons').removeClass('undis');
        }
      } else{
        console.log(479,"领取失败");
      }
      /* var paramsCard = 'op=addVipLux7Coupon&uid=' + uid;
      $.get('/vip/v2/user/vip?' + paramsCard, function (resCard) {
        console.log(445, resCard);
        var resCard = utils.parseJSON(resCard);
        if ('200' != resCard.meta.code) {
          return false;
        }
        if (resCard.data && resCard.data == 'ok') {
          $('.section_one1').addClass('undis');
          $('.section_one2').removeClass('undis');
          $('.section_img_false').removeClass('undis');
          $('.text_content2').removeClass('undis');
          $('.little_img').removeClass('undis');
          $('.card_two').removeClass('undis');
          if (this.isOutApp()) {
            $('.button_item_box').removeClass('undis');
          } else {
            $('.common_buttons .button_item').html('使用代金券');
            $('.common_buttons').removeClass('undis');
          }
        } else{
          console.log(479,"领取失败");
        }
      }) */
      
    } else if (res.data && res.data == '400') {
      alert("会员数量已经领完");
      console.log(507,'已领完');
    } else{
      // 领取失败
      this.userState=1;
    }
  }
  // 获取会员
  async getMember (){
    var uid=PROPERTIES.userinfo.uid||'451917703';
    if (!uid) return false;
    var params = 'op=addVipLux7ForUser&uid=' + uid;
    var res=await this.ajaxAsync('/vip/v2/user/vip?' + params);
    console.log(394,res);
    return res;
  }
  // 获取代金券
  async getCoupon (){
    var uid=PROPERTIES.userinfo.uid||'451917703';
    if (!uid) return false;
    var paramsCard = 'op=addVipLux7Coupon&uid=' + uid;
    var res=await this.ajaxAsync('/vip/v2/user/vip?' + paramsCard);
    console.log(1606,res);
    return res;
  }
  async ajaxAsync(url){
    var response=await new Promise(function (resolve,reject) {
      $.get(url,function (res) {
        resolve(res);
      })
    })
    return response;
  }
  init(){
    this.initPageEvents()
  }
}

$(function () {
  new NewActivity().init();
});