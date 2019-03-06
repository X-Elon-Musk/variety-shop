var Share = {
  prop: {
    outbox: null,
    audioIds: '',
    sharepic: ''
  },
  //初始化用户登陆
  initUserInfo: function (callbackFunction) {
    var uid = cookieUtis.getCookie("userid");
    var sid = cookieUtis.getCookie("websid");
    var uname = cookieUtis.getCookie("username");
    var t3 = cookieUtis.getCookie("t3");
    // console.log(2223, uname, uid, sid);
    if (t3) {
      //第三方登录处理
      uname = cookieUtis.getCookie("uname3");
    }

    if (!uid || uid == '0') {
      cookieUtis.setCookie('uname3', '');
      uid = '';
      sid = '';
      uname = '';
      PROPERTIES.userinfo.uname = uname;
      PROPERTIES.userinfo.uid = uid;
      PROPERTIES.userinfo.sid = sid;

      if (Activity.onlyOnce == 0) {
        LogTraceUtils.doDeviceVersionInit(Activity.version);
        Activity.onlyOnce++;
      }

      if (callbackFunction) callbackFunction();
      return false;
    }
    //去服务器检查 用户是否登陆
    $.post('/fans/user/validate', {
      sid: sid,
      uid: uid
    }, function (data) {
      var data = eval("(" + data + ")");
      console.log(data);
      if (200 != data.meta.code) {
        cookieUtis.setCookie('uname3', '');
        uid = '';
        sid = '';
        uname = '';
      }
      try {
        $('#h_login').hide();
        $('#h_logout').show();
        PROPERTIES.userinfo.uname = uname;
        PROPERTIES.userinfo.uid = uid;
        PROPERTIES.userinfo.sid = sid;
        // --- 购买成功后，根据链接参数来判断
        Activity.successCallback();
        // --- 购买成功后，根据链接参数来判断
        $('#userId').val(PROPERTIES.userinfo.uid);
        $('#sessionId').val(PROPERTIES.userinfo.sid);
        $('#userName').val(PROPERTIES.userinfo.uname);
        if (Activity.onlyOnce == 0) {
          LogTraceUtils.doDeviceVersionInit(Activity.version);
          Activity.onlyOnce++;
        }
      } catch (e) {}
      if (callbackFunction) callbackFunction();
    }); //end post

  },
  //弹出登陆框（盒外）
  showLoginOutBox: function () {
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
  },
  //根据手机端传过来的uid再次去后台接口取用户信息，解决用户名问题
  reInitUserInfo: function (uid) {
    $.post('/fans/commonServlet', {
      op: 'getuserinfo',
      uid: uid
    }, function (data) {
      // console.log(data); // {"NAME":"Timor","PIC":"","UID":"428917506"}
      var d = eval('(' + data + ')').data;
      console.log(2211, d);
      PROPERTIES.userinfo.nikename = d.NAME || '';
      PROPERTIES.userinfo.pic = d.PIC || '';
      Share.setUserInfo();
    });
  },
  setUserInfo: function () {
    console.log(99,PROPERTIES.userinfo);
    try {
      if (PROPERTIES.userinfo.pic&&PROPERTIES.userinfo.uid) {
        console.log(101);
        $('.user_img_box').html('<img id="#userPic" class="user_img" src="' + (PROPERTIES.userinfo.pic || '') + '" alt="">');
      } else {
        console.log(104);
        $('.user_img_box').html('<img id="#userPic" class="user_img" src="http://image.kuwo.cn/vip/fans/pc/pub/def120.png" alt="">');
      }

    } catch (e) {
      // $('.sw_yfemnrhy').html("开通");
    }
  },
  getSubString: function (str, len, hasDot) {
    try {
      var newLength = 0;
      var newStr = "";
      var chineseRegex = /[^\x00-\xff]/g;
      var singleChar = "";
      var strLength = str.replace(chineseRegex, "**").length;
      for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
          newLength += 2;
        } else {
          newLength++;
        }
        if (newLength > len) {
          break;
        }
        newStr += singleChar;
      }
      if (hasDot && strLength > len) {
        newStr += "...";
      }
      return newStr;
    } catch (e) {
      return str;
    }
  }
};


var Activity = {
  paperfile: 'preferential9yuan2019',
  pageType: 'vip',
  version: 'A20190225',
  // 用户当前状态：1、领取失败，2、领取成功，3、已领取过，4、不符合条件
  userState: 0,
  // 是否在盒外：1、在，0、不在
  outApp: 0,
  onlyOnce: 0,
  version_NAME_: '',
  version_num: '',
  // 分享文案中金额
  iosShareMoney: 188,
  arShareMoney: 180,
  // src: 'ShiYiActivityLC1',
  // src2: 'ShiYiActivityLC2',
  src: 'ipoRenewOneLux11.4',
  iosConfig:{
    // 连续包月
    auto:{
      src: 'newRenewOneLux12',// 新客首月9元，续费12元一个月
      payType:'127',
    },
    // 非连续包月
    noAuto:{
      src: 'zhangyiIos',// 1个月豪华vip18元
      payType:'119'
    }
  },
  anConfig:{
    auto:{
      src: 'renewOneLux15',// 新客首月9元，续费12元一个月
      // 微信payType
      wxpayType:'122',
      // 支付宝payType
      zfpayType:'39'
    },
    noAuto:{
      src: '',
      // 微信payType
      wxpayType:'123',
      // 支付宝payType
      zfpayType:'102'
    }
  },
  retryCount: 4,
  actionPrefix: '',
  productObj: {
    service: 'newvip',
    vipType: 'vip_7',
    vipId: '12',
    vip:'vip'
  },
  payTypeObj: {
    'weChat': 123,
    'aliPay': 102,
    'applePay': 119
  },
  props: {},
  //是否是测试环境
  isTest: function () {
    if (window.location.hostname == 'console.ecom.kuwo.cn' || window.location.hostname == 'testvip.kuwo.cn') {
      return true;
    } else {
      return false;
    }
  },
  getHost: function () {
    if (this.isTest()) {
      return window.location.protocol + '//' + window.location.hostname;
    } else {
      return location.protocol + '//vip1.kuwo.cn';
    }
  },
  // 测试人员需要用沙河测试，测试时需要在测试地址后面添加字段（isSandBox=1）
  getReceiptUrl: function () {
    var params = utils.getUrlParams();
    var isSandBox = utils.getParamValue(params, 'isSandBox');
    if (this.isTest()) {
      return 'https://pay.kuwo.cn/pay_TEST/dopay';
    } else {
      if (isSandBox == 1 || PROPERTIES.device.isSandBox == 1) {
        return 'https://pay.kuwo.cn/pay_sandbox/dopay';
      } else {
        return 'https://pay.kuwo.cn/pay/dopay';
      }
    }
  },
  //判断用户是否已经登录
  checkUserIsLogin: function () {
    var userId = PROPERTIES.userinfo.uid;
    var isLogin = true;
    try {
      if (typeof userId == 'undefined' || !userId || userId == '0' || userId == '' || userId == 'null') {
        isLogin = false;
      }
    } catch (e) {}
    return isLogin;
  },
  goToLogin: function () {
    //调用登录
    var jsonStr = '{"action":"control_login", "callback":"loginsuccess"}';
    if (osUtils.isIos()) {
      //不支持登陆回调版本的 IOS 要使用此方法来弹出登陆
      jsonStr = '{"action":"to_loginAndRegist", "callback":"loginsuccess"}';
    }
    nativeUtils.callNative(jsonStr);
  },
  //初始化用户信息
  initUserInfo: function () {
    if (osUtils.isIos()) {
      var jsonstr = '{"action":"pay_getallinfo","callback":["getuesrinfo","getvipinfo"]}';
      // console.log(jsonstr);
      nativeUtils.callNative(jsonstr);
    } else {
      var jsonstr = '{"action":"pay_getuesrinfo","callback":"getuesrinfo"}';
      nativeUtils.callNative(jsonstr);
    }
  },

  onTouchMove: function (inFlag) {
    if (inFlag) {
      document.addEventListener('touchmove', this.onHandler, false);
    } else {
      document.removeEventListener('touchmove', this.onHandler, false);
    }
  },
  onHandler: function (e) {
    e.preventDefault();
  },

  // 分享  url 分享地址，title 分享标题, desc 分享描述, pic 要分享的图片
  // 盒内
  share: function (url, title, desc, pic) {
    var hdweibo = '';
    var hdqqspace = '';
    var hdwxmsg = '';
    var hdwxdes = '';
    var hdurl = '';
    var fspic = pic;

    hdurl = url; //分享的链接
    hdweibo = title + "        " + desc;
    hdqqspace = desc;
    hdwxdes = desc;
    hdwxmsg = title;
    var imgurl = fspic;
    var jsonstr = '{"action":"control_share_webpage","weibo":"' + hdweibo + '","qqspace":"' + hdqqspace + '","wxmsg":"' + hdwxmsg + '","wxdes":"' + hdwxdes + '","url":"' + hdurl + '","imgurl":"' + imgurl + '","needconfirm":""}';
    if (osUtils.isIos()) {
      jsonstr = '{"action":"control_share_webpage","weibo":"' + hdweibo + '","qqspace":"' + hdqqspace + '","wxmsg":"' + hdwxmsg + '","wxdes":"' + hdwxdes + '","url":"' + hdurl + '","imageurl":"' + imgurl + '","needconfirm":""}';
    }
    nativeUtils.callNative(jsonstr);
  },
  setQQShareInfo: function (title, desc, pic, url) {
    setShareInfo({
      title: title,
      summary: desc,
      pic: pic,
      url: url
    });
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
  delCookie: function (cookieName) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 100);
    var delCookie = function (path) {
      document.cookie = cookieName + "=; path=" + path + "; domain=kuwo.cn; expires=" + exp.toGMTString();
      document.cookie = cookieName + "=; path=" + path + "; expires=" + exp.toGMTString();
    };
    delCookie('/');
    delCookie('/vip');
    delCookie('/fans');
  },
  //json对象转拼url get 字符串 {a:1,b:2} -> a=1&b=2
  jsonToUrlParams: function (json) {
    var urlParams = '';
    $.each(json, function (k, v) {
      urlParams += (k + '=' + v + '&');
    });
    if (urlParams) {
      urlParams = urlParams.substring(0, urlParams.length - 1);
    }
    return urlParams;
  },

  //在盒外
  isOutApp: function () {
    if (window.location.href.indexOf('fromkw=share') > -1 || Activity.isWeChat() || Activity.isWeiBo()) {
      return true;
    }
    return false;
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
  toast: function (obj) {
    try {
        var option = obj;
        if (typeof option != 'object') {
            option = {
                msg: obj,
                dom: ''
            };
        }
        var className = option.className || '';
        var html = '';
        html += '<div class="toast-wrap toastAnimate" id="toastContent">';
        html += '   <span class="toast-msg ' + className + '">' + option.msg + '</span>';
        html += '</div>';
        $('#toastContent').remove();
        $('body').append(html);
        if (option.dom) {
            clearTimeout(window['domFocusTimeout']);
            window['domFocusTimeout'] = setTimeout(function () {
                option.dom.focus();
            }, 2000);
        }
    } catch (e) {
    }
  },
  initPage: function () {
    var that=this;
    //歌手信息
    /* $('.xn_tywgn').click(function () {
      try {
        var attr = $(this).attr('attr');
        // attr = attr - 1;
        //LogTraceUtils.doClick('singerList', this.userinfo);
        nativeUtils.gotoPanel('gs', Activity.props.singerinfo1[attr].id, Activity.props.singerinfo1[attr].name);
      } catch (e) {}

    }); */
    //专辑信息
    /* $("#section_member_songs").on("click", ".xn_tywgan", function (event) {
      try {
        var target = $(event.target).parent(".xn_tywgan");
        if (target.prop("nodeName") == "DIV") {
          var attr = $(target).attr('attr');
          nativeUtils.gotoPanel('gd', Activity.props.albumInfo[attr].id, Activity.props.albumInfo[attr].name);
        }
      } catch (e) {}
    }) */

    $(".section_getButton1").on("click", "#go_get", function (event) {
      var $this = $(this);
      // 首先判断是否登录以及是盒内盒外
      if (!Activity.checkUserIsLogin()) {
        if (Activity.isOutApp()) {
          Share.showLoginOutBox();
        } else {
          Activity.goToLogin();
        }
        return false;
      }
      var uid=PROPERTIES.userinfo.uid;
      if (!uid) return false;
      var params = 'op=addVipLux7ForUser&uid=' + uid;
      $.get('/vip/v2/user/vip?' + params, function (res) {
        console.log(1298, res);
        var res = utils.parseJSON(res);
        if ('200' != res.meta.code) {
          return false;
        }
        if (res.data && res.data == '200') {
          console.log(503,'领取成功');
          Activity.userState=2;
          $('.section_one1').addClass('undis');
          $('.section_one2').removeClass('undis');
          $('.section_img_true').removeClass('undis');
          $('.text_content1').html('领取成功').removeClass('undis');
          $('.little_img').removeClass('undis');
          $('.card_one').removeClass('undis');
          if (Activity.isOutApp()) {
            $('.button_item_box').removeClass('undis');
          } else {
            $('.common_buttons .button_item').html('立即开始体验');
            $('.common_buttons').removeClass('undis');
          }
          var paramsCard = 'op=addVipLux7Coupon&uid=' + uid;
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
          })
        } else if (res.data && res.data == '300') {
          console.log(505,'领取过');
          Activity.userState=3;
          var paramsCard = 'op=addVipLux7Coupon&uid=' + uid;
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
              if (Activity.isOutApp()) {
                $('.button_item_box').removeClass('undis');
              } else {
                $('.common_buttons .button_item').html('使用代金券');
                $('.common_buttons').removeClass('undis');
              }
            } else{
              console.log(479,"领取失败");
            }
          })
          
        } else if (res.data && res.data == '400') {
          alert("会员数量已经领完");
          console.log(507,'已领完');
        } else{
          // 领取失败
          Activity.userState=1;
        }
      })
    })

    $(".common_buttons").on("click", ".button_item", function (event) {
      var $this = $(this);
      // 首先判断是否登录以及是盒内盒外
      if (!Activity.checkUserIsLogin()) {
        if (Activity.isOutApp()) {
          Share.showLoginOutBox();
        } else {
          Activity.goToLogin();
        }
        return false;
      }
      if (Activity.isOutApp()) {
        console.log(504,'盒外');
      } else {
        if (Activity.userState=='1') {
          $(".section_getButton1").trigger("click");
        } else if (Activity.userState=='2') {
          
        } else if (Activity.userState=='3') {
          if (osUtils.isIos()) {
            location.href = '/vip/added/mobile/v2/appStore/superVip.jsp?fromsrc=vip_newMember&r=' + Math.random();
          } else{
            location.href = '/vip/added/mobile/v2/andrSuperVip.jsp?fromsrc=membersOnly&r=' + Math.random();
          }
        } else if (Activity.userState=='4') {
          // 关闭当前窗口
          nativeUtils.callNative('{"action":"closercmwindow"}');
        }
      }
    })



    if (Activity.isOutApp()) {
      // 添加金额判断
      var shareMoney = '';
      /* $('.vip_purchase_container').each(function() {
        if ('none'!= $(this).css("display")) {
          shareMoney=$(this).find('.shareMoney').html();
        }
      }) */


      var link = Activity.getHost() + '/vip/added/activity/' + Activity.paperfile + '/index.html?fromkw=share';
      if (osUtils.isIos()) {
        link += '&platform=ios';
        shareMoney = Activity.iosShareMoney;
      } else {
        link += '&platform=android';
        shareMoney = Activity.arShareMoney;
      }
      var pic = 'http://image.kuwo.cn/activity/' + Activity.paperfile + '/shareImg2018.png';
      var title = '购物节狂欢 豪华VIP买1年送1年';
      var desc = '立省' + shareMoney + '元！享两年贵宾音乐体验';
      wxShare.init(title, desc, pic, link);
      Activity.setQQShareInfo(title, desc, pic, link);
    }
    //点击分享按钮
    $('.header_share').on('click', function () {
      var myhtml = Activity.getHost() + '/vip/added/activity/' + Activity.paperfile + '/index.html?fromkw=share';
      var shareMoney = '';
      if (osUtils.isIos()) {
        myhtml += '&platform=ios';
        shareMoney = Activity.iosShareMoney;
      } else {
        myhtml += '&platform=android';
        shareMoney = Activity.arShareMoney;
      }
      var pic = 'http://image.kuwo.cn/activity/' + Activity.paperfile + '/shareImg2018.png';
      var title = '购物节狂欢 豪华VIP买1年送1年';
      var desc = '立省' + shareMoney + '元！享两年贵宾音乐体验';
      Activity.share(myhtml, title, desc, pic);
    });

    // 立即支持
    $('.super_btn').on('click', function () {
      nativeUtils.callNative('{"action":"web_control_showMiniPlayer","isShowMiniPlayer":"0"}');
      // return;
      /* if (!osUtils.isAndroid()) {
        Activity.toast('非常抱歉，本活动仅安卓设备方可参与。');
        return;
      } */
      var $this = $(this);
      // 首先判断是否登录以及是盒内盒外
      if (!Activity.checkUserIsLogin()) {
        if (Activity.isOutApp()) {
          Share.showLoginOutBox();
        } else {
          Activity.goToLogin();
        }
        return false;
      }

      var price = $this.attr('price');
      var month = $this.attr('month');
      
      // 是否在盒外
      if (Activity.isOutApp()) {

        console.log(568,'盒外');
      } else {
        if (osUtils.isIos()) {
          /* $('#payType').val('119');
          Activity.payOrder('119');
          return false; */
          if ($('#autoRenewals_ios').hasClass('f_atuopay')) { // 勾选了自动续费
            price=9;
          } else { // 未勾选自动续费
            price=18;
          }
          $('#pay_now_ios').attr({
            'price': price,
            'month': month
          });
          $('.pay_pop_ios .z_skdgw').html(price + '元');
          $('#pay_pop_ios').show();
          $('.pay_pop_ios .z_tc').addClass('to_top');
          if (month == '1') {
            $('#offer_tips_ios').html('限时福利');
          }
        } else {
          if ($('#autoRenewals').hasClass('f_atuopay')) { // 勾选了自动续费
            price=9;
          } else { // 未勾选自动续费
            price=15;
          }
          $('#pay_now').attr({
            'price': price,
            'month': month
          });
          $('.pay_pop_an .z_skdgw').html(price + '元');
          $('#pay_pop-ups').show();
          $('.pay_pop_an .z_tc').addClass('to_top');
          /* if (month == '1') {
            $('#offer_tips').html('立省7.5元');
          } */
        }
      }
      $('#cash').val(price);
      $('#price').val(price);
      window.Month_ = month;
    });

    // 点击遮罩层，关闭支付弹窗
    $('#closePaymentWindow').on('click', function () {
      $('.z_tc').removeClass('to_top');
      $('#pay_pop-ups').hide();
    });

    // 选择支付方式
    $('#select_wx').on('click', function () { // 选择微信
      var dataType = $(this).attr('data-type');
      $('#select_wx').find('.z_sigdtr2_').hide().siblings('.z_sigdtr1_').show();
      $('#select_zfb').find('.z_sigdtr1_').hide().siblings('.z_sigdtr2_').show();
      $(this).addClass("on");
      // $('#pay_now').attr('data-type', dataType);
      if ($('#autoRenewals').hasClass('f_atuopay')) { // 勾选了自动续费
        $('#pay_now').attr('data-type', '122');
      } else { // 未勾选自动续费
        $('#pay_now').attr('data-type', '123');
      }
    });
    $('#select_zfb').on('click', function () { // 选择支付宝
      var dataType = $(this).attr('data-type');
      $('#select_wx').find('.z_sigdtr1_').hide().siblings('.z_sigdtr2_').show();
      $('#select_zfb').find('.z_sigdtr2_').hide().siblings('.z_sigdtr1_').show();
      $('#select_wx').removeClass("on");
      if ($('#autoRenewals').hasClass('f_atuopay')) { // 勾选了自动续费
        console.log(646,39);
        $('#pay_now').attr('data-type', '39');
      } else { // 未勾选自动续费
        $('#pay_now').attr('data-type', '102');
      }
    });
    // 立即支付
    $('#pay_now').on('click', function () {
      nativeUtils.callNative('{"action":"web_control_showMiniPlayer","isShowMiniPlayer":"0"}');
      try {
        var $this = $(this);
        if (Activity.isOutApp()) {
          if ($this.attr('data-type') == '123') $this.attr('data-type', '124');
          if ($this.attr('data-type') == '102') $this.attr('data-type', '101');
        }
        $('#payType').val($this.attr('data-type'));
        Activity.payOrder($this.attr('data-type'));
      } catch (e) {};

    });
    $('#pay_now_ios').on('click', function () {
      nativeUtils.callNative('{"action":"web_control_showMiniPlayer","isShowMiniPlayer":"0"}');
      try {
        var $this = $(this);
        /* if (Activity.isOutApp()) {
          if ($this.attr('data-type') == '123') $this.attr('data-type', '124');
          if ($this.attr('data-type') == '102') $this.attr('data-type', '101');
        } */
        $('#payType').val($this.attr('data-type'));
        Activity.payOrder($this.attr('data-type'));
      } catch (e) {};

    });
    // 点击遮罩层，关闭支付弹窗
    $('#closePaymentWindow_ios').on('click', function () {
      $('.pay_pop_ios .z_tc').removeClass('to_top');
      $('#pay_pop_ios').hide();
    });
    // ios点击自动付费
    $('#autoRenewals_ios').on('click', function () {
      $('.pay_pop_ios .chosen').toggle();
      $('.pay_pop_ios .notSelected').toggle();
      $('#autoRenewals_ios').toggleClass('f_atuopay');
      var price = '';
      var month = 1;
      if ($('#autoRenewals_ios').hasClass('f_atuopay')) { // 勾选了自动续费
        price = '9';
        // $('#select_zfb').hide();
        $('#offer_tips_ios').show();
        // $('#select_wx').trigger('click');
        $('#pay_now_ios').attr('data-type', '127');
        // 勾选自动续费,关闭提示框
        $('#auto_tips').hide();
      } else { // 未勾选自动续费
        price = '18';
        // $('#select_zfb').show();
        $('#offer_tips_ios').hide();
        $('#pay_now_ios').attr('data-type', '119');
        // 未勾选自动续费,出提示框
        $('#auto_tips').show();
      }

      $('#cash').val(price);
      $('#price').val(price);
      $('#pay_now_ios').attr({ 'price': price, 'month': month });
      $('.pay_pop_ios .z_skdgw').html(price + '元');
    });
    // 点击遮罩层，关闭支付弹窗
    $('#closePaymentWindow').on('click', function () {
      $('.pay_pop_an .z_tc').removeClass('to_top');
      $('#pay_pop-ups').hide();
    });
    // 安卓点击自动付费
    $('#autoRenewals').on('click', function () {
      $('.pay_pop_an .chosen').toggle();
      $('.pay_pop_an .notSelected').toggle();
      $('#autoRenewals').toggleClass('f_atuopay');
      var price = '';
      var month = 1;
      if ($('#autoRenewals').hasClass('f_atuopay')) { // 勾选了自动续费
        price = '9';
        // $('#select_zfb').hide();
        $('#offer_tips').show();
        $('#select_wx').trigger('click');
        if ($('#select_wx').hasClass("on")) {
          $('#pay_now').attr('data-type', '122');
        } else {
          console.log(745,'39');
          $('#pay_now').attr('data-type', '39');
        }
        // 勾选自动续费,关闭提示框
        $('#auto_tips').hide();
      } else { // 未勾选自动续费
        price = '15';
        // $('#select_zfb').show();
        $('#offer_tips').hide();
        if ($('#select_wx').hasClass("on")) {
          $('#pay_now').attr('data-type', '123');
        } else {
          $('#pay_now').attr('data-type', '102');
        }
        // 未勾选自动续费,出提示框
        $('#auto_tips').show();
      }

      $('#cash').val(price);
      $('#price').val(price);
      $('#pay_now').attr({ 'price': price, 'month': month });
      $('.pay_pop_an .z_skdgw').html(price + '元');
    });
    // 点击取消特惠资格按钮
    $('#cancal_btn').on('click', function () {
      that.cancalBtnClick(Activity.version);
      $('#auto_tips').hide();
    });
    // 点击享受特惠资格按钮
    $('#submit_btn').on('click', function () {
      that.submitBtnClick(Activity.version);
      if (osUtils.isIos()) {
        $('#autoRenewals_ios').trigger('click');
      } else {
        $('#autoRenewals').trigger('click');
      }
      $('#auto_tips').hide();
    });

    // 盒外登录
    $('#h_login').on('click', function () {
      Share.showLoginOutBox();
    });

    // 注册  退出登录事件
    $('#h_logout').on('click', function () {
      Activity.delCookie('websid');
      Activity.delCookie('username');
      Activity.delCookie('userid');
      Activity.delCookie('uname3');
      Activity.delCookie('t3');
      if (Activity.isWeChat()) { // 部分安卓系统的微信内，location.reload()无效。
        var _baseUrl = location.protocol + '//' + location.hostname;
        var urlParams = utils.getUrlParams();
        if (urlParams) { // 链接中有参数
          location.href = _baseUrl + '/vip/added/activity/' + Activity.paperfile + '/index.html?' + urlParams + '&R=' + Math.random();
        } else { // 链接中无参数
          location.href = _baseUrl + '/vip/added/activity/' + Activity.paperfile + '/index.html?fromkw=share&R=' + Math.random();
        }
      } else {
        window.location.reload();
      }
    });

    // 跳往二级页面
    // $('.play').on('click', function () {
    //   var url_ = Activity.getHost() + '/vip/added/activity/'+Activity.paperfile+'/play.html';
    //   if (Activity.isOutApp()) {
    //     url_ += '?fromkw=share';
    //   }
    //   location.href = url_;
    // });

  },
  // 点击取消特惠资格按钮统计
	cancalBtnClick: function (version, abtest) {
		var params = 'action=cancalBtnClick20190225&'+LogTraceUtils.getVersionParams(version, abtest);
		LogTraceUtils.root(params);
  },
  // 点击享受特惠资格按钮统计
  submitBtnClick: function (version, abtest) {
		var params = 'action=submitBtnClick20190225&'+LogTraceUtils.getVersionParams(version, abtest);
		LogTraceUtils.root(params);
	},
  /**验证是否需要调用sdk支付端-- true是需要 false 是不需要*/
  doClientSDKValidate: function (payType) {
    //首先，走普通的sdk端支付肯定需要启用
    if ('102' == payType || '111' == payType || '123' == payType || '100' == payType || '99' == payType || '98' == payType) return true;
    //其次，是支付宝自动续费，且没有签约过  启用sdk 已签约的情况下也强行启动sdk跳过去第三方支付后肯定会有提示
    //if('39' == payType && !VipInfo.config._signState.ZFB) return true;
    if ('39' == payType) return true;
    //最后，是微信自动续费，且没有签约过 启用sdk 已签约的情况下也强行启动sdk跳过去第三方支付后肯定会有提示
    //if('122' == payType && !VipInfo.config._signState.WX) return true;
    if ('122' == payType) return true;
    //一般走到这的时候 只有已签约且为自动续费的用户，所以可以这这块重置form里的payType
    $('#payType').val(payType);
    return false;
  },
  //调用支付客户端
  callClient: function (msg, payType, callback_url, customerid) {
    var jsonStr = '';
    try {
        if ('102' == payType ) {
            jsonStr = '{"action":"pay_start_aliclient","pay_aliclient_msginfo":"' + msg + '","callback_url":"' + callback_url + '"}';
        }else if('39' == payType){
            if (osUtils.isAndroid()) callback_url = '';//安卓支付宝自动续费出了问题，不能启用回调
            jsonStr = '{"action":"pay_start_aliclient_renewal","pay_aliclient_msginfo":"' + msg + '","callback_url":"' + callback_url + '"}';
        } else if ('123' == payType  ||  '100' == payType || '99' == payType || '98' == payType ) {
            jsonStr = '{"action":"pay_start_wxclient","pay_wxclient_msginfo":"' + msg + '","callback_url":"' + callback_url + '"}';
        }else if( '122' == payType){
            jsonStr = '{"action":"pay_start_wxclient_renewal","pay_wxclient_msginfo":"' + msg + '","callback_url":"' + callback_url + '"}';
        }

    }catch (e){alert(e)}

    nativeUtils.callNative(jsonStr);
  },
  payOrder: function (payType) {
    console.log('zhifu');
    LogTraceUtils.doPayBtnClick(Activity.version);
    var payType = payType;
    var attr = window.Month_;
    var price = $('#price').val();
    if (osUtils.isIos()&&price=='9') {
      price='12';
      $('#price').val(price);
      console.log(850,price);
    }
    var productObj = Activity.productObj;
    $('#vipType').val(productObj.vipType);

    // LogTraceUtils.root('action=pricePayBtnClick&price=' + price + '&month=' + attr + '&payType=' + payType + '&' + LogTraceUtils.getVersionParams(Activity.version));

    KWLoading.start();
    if (PROPERTIES.device.isHD && payType == '123') {
      //安卓HD微信普通支付需要更换payType
      payType = '100';
      $('#payType').val(payType);
    }
    if (PROPERTIES.device.isTS && payType == '123') {
      //安卓听书微信普通支付需要更换payType
      payType = '99';
      $('#payType').val(payType);
    }
    if (PROPERTIES.device.isGOOGLEHD && payType == '123') {
      //googleplay微信普通支付需要更换payType
      payType = '98';
      $('#payType').val(payType);
    }
    // 如果是安卓的话platform传‘ar’
    if (Activity.isOutApp()) {
      var platform = osUtils.getPlat();
      if (platform == 'an') {
        platform = 'ar';
      }
      PROPERTIES.userinfo.platform = platform;
    }
    var vipJson = '';
    var jsonParam = '';

    // var src = Activity.src;
    var src = PROPERTIES.device.MY_DEVICE_UID || '';
    var autoPay = ('39' == payType || '122' == payType|| '127' == payType) ? 'yes' : 'no';
    /* if (price == '0') {
      src = Activity.src;
    } */
    if (osUtils.isIos()) {
      if ('127' == payType) {
        src = Activity.iosConfig.auto.src;
      } else {
        src = Activity.iosConfig.noAuto.src;
      }
    } else {
      if ('39' == payType || '122' == payType) {
        src = Activity.anConfig.auto.src;
      }
    }

    vipJson = '{';
    vipJson += '"vip":';
    vipJson += '[{';
    vipJson += '"cnt":"' + attr + '",';
    vipJson += '"id":"' + productObj.vipId + '",';
    vipJson += '"type":"' + productObj.vipType + '",';
    vipJson += '"price":"' + price + '"';
    vipJson += '}]';
    vipJson += '}';
    jsonParam = '{';
    jsonParam += '"cash":"' + price + '",';
    jsonParam += '"payType":"' + payType + '",';
    jsonParam += '"autoPay":"' + autoPay + '",';
    jsonParam += '"checkCode": "",';
    jsonParam += '"platform":"' + PROPERTIES.userinfo.platform + '",';
    jsonParam += '"src":"' + src + '",';
    jsonParam += '"act":"OPEN_VIP",';
    jsonParam += '"clientAct":"' + src + '",';
    jsonParam += '"uid":"' + PROPERTIES.userinfo.uid + '",';
    jsonParam += '"userName":"NoUse",';
    jsonParam += '"products":';
    jsonParam += vipJson;
    jsonParam += '}';

    var urlparams = '';
    urlparams = utils.getUrlParams();
    urlparams += "&device_info=" + PROPERTIES.device.MY_DEVICE_UID + "&source=" +
      PROPERTIES.device.MY_SOURCE + "&version_name=" +
      PROPERTIES.device.MY_VERSION_NAME + '&' +
      LogTraceUtils.getVersionParams(Activity.version);

    var postJson = {
      'op': 'pay',
      'jsonStr': jsonParam,
      'math': Math.random(),
      'urlparams': urlparams,
    };

    // var priorCallbackRedirectUrl = Activity.getHost() + '/vip/added/activity/'+Activity.paperfile+'/index.html?success=successful';
    // if (Activity.isOutApp()) {
    //   var platform = utils.getParamValue(utils.getUrlParams(), 'platform');
    //   priorCallbackRedirectUrl += '&fromkw=share&platform=' + platform;
    // }
    // postJson['priorCallbackRedirectUrl'] = priorCallbackRedirectUrl;

    if (Activity.checkUserIsLogin()) {
      postJson['uid'] = PROPERTIES.userinfo.uid;
      postJson['sid'] = PROPERTIES.userinfo.sid;
    }
    $.post(PROPERTIES.projectname + '/v2/userbase/pay', postJson, function (data) {
      if (!(Activity.isOutApp())) { // 如果是盒内支付，success后就KWLoading.end
        KWLoading.end();
      }
      data = eval("(" + data + ")");
      if (data.meta.code == '200') {
        try {
          var jsonResult = data.data;
          var service = productObj.service;
          var payTypeD = payType;
          var platform = PROPERTIES.userinfo.platform;
          var cashD = jsonResult.credit;
          var customerid = jsonResult.id;
          var vipType = productObj.vipType;
          var userName = PROPERTIES.userinfo.username;
          var sessionId = PROPERTIES.userinfo.sid;
          var userId = PROPERTIES.userinfo.uid;
          $('#cash').val(cashD);
          $('#customerid').val(customerid);
          $('#id_ip_payCallBackUrl').val(jsonResult.callBackUrl);
          $('#payForm').attr('action', jsonResult.url);
        } catch (e) {}
        // alert(payType);
        if ('122' == payType || '39' == payType) {//微信自动续费需要弹框确认用户是否支付
          var content = '请您在新打开的页面完成付款，然后根据情况做出选择';
          $('#id_p_confirmm_content').text(content);
          $('#id_div_dialog_kewbpay').show();
        }
        if (Activity.doClientSDKValidate(payType)) {
          //支付宝/微信客户端支付
          try {
            var service = $('#service').val();
            var payTypeD = payType;
            var platform = $('#platform').val();
            var cashD = jsonResult.credit;
            var customerid = $('#customerid').val();
            var vipType = $('#vipType').val();
            var userName = $('#userName').val();
            var sessionId = $('#sessionId').val();
            var userId = $('#userId').val();
            if (PROPERTIES.userinfo.virtualUid) {
              userId = '';
            }
            var mburl = jsonResult.url + '?service=' + service + '&payType=' + payTypeD
              + '&platform=' + platform + '&cash=' + cashD + '&customerid=' + customerid
              + '&vipType=' + vipType + '&userName=' + userName + '&sessionId=' + sessionId
              + '&userId=' + userId + '&type=' + osUtils.getPlat();
            if (PROPERTIES.userinfo.virtualUid) {
              mburl += ('&virtualUid=' + PROPERTIES.userinfo.virtualUid);
              mburl += ('&virtualSid=' + PROPERTIES.userinfo.virtualSid);
            }
            var callback_url = jsonResult.callBackUrl;
            $('#id_ip_payCallBackUrl').val(callback_url);
          } catch (e) {}

          Activity.callClient(mburl, payTypeD, callback_url, customerid);
        } else if ('112' == payType || '119' == payType || '127' == payType) {
          try {
            var receiptUrl = Activity.getReceiptUrl();
            var callBackUrl = Activity.getHost() + PROPERTIES.projectname + '/pay/callback';
            
            var price = $('#price').val();
            var pId = Activity.getPid(price);
            console.log(1014,pId);
            var jsonStr = '{"action":"pay_type","type":"' + payType + '","customId":"' + jsonResult.id + '","receiptUrl":"' + receiptUrl + '","callBackUrl":"' + callBackUrl + '","pId":"' + pId + '","cash":"' + price + '","kwb":"' + price + '","service":"' + productObj.service + '"}';
            console.log(jsonStr)
            nativeUtils.callNative(jsonStr);
          } catch (e) { }
        } else {
          if (payType == 122 || payType == 123 || payType == 102 || payType == 39) {
            $('#errorPayType').val(payType);
          }
          $("#form1").attr("action", jsonResult.url);
          $("#form1").submit();
        }

        // LogTraceUtils.doFromSrcInit('generate', PROPERTIES.logtrace.vipmCurrentVersion, Main.getVipMABVal());
      } else {
        try {
          KWLoading.end();
          dialog.alert({
            msg: '支付失败：' + data.meta.desc
          });
        } catch (e) {};

      }
    });
  },

  //获取当前自动订阅的pid
  getPid: function (price) {
    if (price == 9||price == 12) {
      return 'tj_kuwo_supervip_renewal_12';
    } else {
      return 'tj_kuwo_music_vip_' + price;
    }
  },
  // --- 2018 --- 盒外支付相关 ↓

  //微信内支付 （非自动续费）
  weChatInPay: function () {
    $.ajax({
      type: 'post',
      url: '/fans/pay/wxweb',
      data: {
        op: 'callWechat',
        callURL: Activity.getPayUrl().replace('dopay', '') + '/wechat/getcode?state=newvip|' + $('#customerid').val(),
        uid: PROPERTIES.userinfo.uid,
        sid: PROPERTIES.userinfo.sid
      },
      dataType: 'text',
      success: function (data) {
        KWLoading.end();
        data = eval("(" + data + ")");
        var openURL = data.openURL;
        if (openURL) {
          window.location.href = openURL;
        }
        Activity.weChatPayMsg();
      }
    });
  },
  //微信外微信支付 (非自动续费)
  weChatOutPay: function () {
    var urlParams = {
      service: $('#service').val(),
      payType: $('#payType').val(),
      type: osUtils.getPlat(),
      cash: $('#cash').val(),
      customerid: $('#customerid').val(),
      vipType: $('#vipType').val(),
      userName: PROPERTIES.userinfo.uname,
      userId: PROPERTIES.userinfo.uid,
      sessionId: PROPERTIES.userinfo.sid,
      src: $('#id_src').val(),
      goodsUnit: ''
    };
    $.post('/fans/pay/wxweb', {
      mburl: Activity.getPayUrl() + '?' + Activity.jsonToUrlParams(urlParams),
      op: 'getDeeplink',
      uid: PROPERTIES.userinfo.uid,
      sid: PROPERTIES.userinfo.sid
    }, function (data) {
      KWLoading.end();
      data = eval("(" + data + ")");
      var deeplink = data.deeplink;
      if (deeplink) {
        window.location.href = deeplink;
      }
      Activity.weChatPayMsg();
    });
  },
  //支付宝H5
  aliWapPay: function () {
    $('#id_type').val(osUtils.getPlat());
    $('#platform').val(osUtils.getPlat());
    KWLoading.end();
    $('#payForm').submit();
  },
  weChatPayMsg: function () {
    Activity.retryCount = 4;
    dialog.confirm({
      msg: '请您在新打开的页面完成付款，然后根据情况做出选择',
      submitInfo: '已付款',
      cancelInfo: '未付款',
      submitClick: function () {
        Activity.retryCount--;
        Activity.doTimeoutStateRefresh();
      }
    });
  },
  doTimeoutStateRefresh: function () {
    if (Activity.retryCount <= 0) {
      dialog.alert({
        msg: '请联系客服：Q群2098325073；电话010-87939630(工作日10:00-18:30)'
      });
      return false;
    }
    KWLoading.start();
    setTimeout(function () {
      Activity.refreshStatus();
    }, 3000);
  },
  //刷新支付状态
  refreshStatus: function () {
    var morderid = $('#customerid').val();
    $.post('/vip/v2/user/vip', {
      op: 'goi',
      orderId: morderid
    }, function (data) {
      KWLoading.end();
      var json = eval("(" + data + ")");
      if (200 == json.meta.code) {
        if (1 != json.data.status) {
          dialog.confirm({
            msg: '系统还未更新到您的支付状态，请稍后点击重试',
            submitInfo: '重试',
            cancelInfo: '取消',
            submitClick: function () {
              Activity.retryCount--;
              Activity.doTimeoutStateRefresh();
            }
          });
          return false;
        }
      } else {
        dialog.alert({
          msg: json.meta.desc
        });
        return false;
      }
      console.log($('#id_ip_payCallBackUrl').val());
      // 支付成功后跳转页面
      window.location.href = $('#id_ip_payCallBackUrl').val();
    });
  },
  /**隐藏confirm*/
  hideConfirm: function (){
    $('#id_div_dialog_kewbpay').hide();
    location.reload();
  },
  //获取支付url
  getPayUrl: function () {
    if (window.location.host == 'vip1.kuwo.cn') {
      return 'https://pay.kuwo.cn/pay/dopay';
    } else {
      return 'https://pay.kuwo.cn/pay_TEST/dopay';
      //return 'https://pay.kuwo.cn/pay_PING/dopay';
    }
  },
  // --- 2018 --- 盒外支付相关 ↑


  successCallback: function () {
    var success = '';
    var urlParams = utils.getUrlParams();
    success = utils.getParamValue(urlParams, 'success');
    orderId = utils.getParamValue(urlParams, 'orderId');
    if (success == 'successful') {
      $.ajax({
        url: Activity.getHost() + '/vip/v2/user/vip?op=goi&orderId=' + orderId,
        success: function (data) {
          data = eval("(" + data + ")");
          if (data.meta.code == '200') {
            $('#success_callback').show();
            $('.allCov').addClass('fixed_all');

            $('.suc_suc').on('click', function () {
              $('#success_callback').hide();
              $('.allCov').removeClass('fixed_all');
            });
          }
        }
      })
    }
  },

  // 信息滚动swiper
  // initUserSwiper: function () {
  //   var userList = Activity.props.userList;
  //   var html = '';
  //   $.each(userList, function (k, v) {
  //     html += '<p class="swiper-slide swiper_box3"><span class="swiper_box4">' + v + '</span></p>';
  //   });
  //   $('#userListSwiper').find('.swiper-wrapper').html(html);
  //   var userListSwiper = new Swiper('#userListSwiper', {
  //     loop: true,
  //     speed: 2000,
  //     direction: 'vertical',
  //     height: 300,
  //     autoplay: true,
  //     onlyExternal: true,
  //     loopedSlides: userList.length
  //   });

  // },
  // 精选歌单
  /* initMemberSons: function () {
    var albumInfo = Activity.props.albumInfo,
      num = 0;
    var changeSongs = function (start) {

      var end = start + 6;
      if (end >= albumInfo.length) {
        end = albumInfo.length;
      }
      var html = '',
        getalbumInfo = albumInfo.slice(start, end);
      $.each(getalbumInfo, function (k, v) {
        html += '<div class="section_item song_item f_l xn_tywgan" attr="' + (start + k) + '"><img class="xn_tyjhha" src="' + v.pic + '" width="100%"><p class="xn_tykantq">' + v.name + '</p></div>';
      });
      $('#section_member_songs').html(html);
    }
    changeSongs(num);
    $('#member_button').on('click', function () {
      num += 6;
      if (num >= albumInfo.length - 1) {
        num = 0;
      }
      changeSongs(num);
    });
  }, */
  // 个性音乐体验
  /* specificEvent: function () {
    $('#hifi').on('click', function () {
      // 新版本能调到HiFi页面

      if ((osUtils.isAndroid() && Activity.version_num >= 9060) || (osUtils.isIos() && Activity.version_num >= 9120)) {
        var jsonstr = '{"action":"turnOnTheSound"}';
        nativeUtils.callNative(jsonstr);
      } else {
        window.location.href = '/vip/added/member_Centre/src/swiper_vip.html?page=10';
      }

    });
    $('#exclusiveSkin').on('click', function () {
      // 专属皮肤
      // nativeUtils.callNative('{"action":"change_skin","channel":"0"}');
      var _baseUrl = location.protocol + '//' + location.hostname;
      var url = _baseUrl;
      console.log(1077,Activity.version_num);
      // return;
      if ((osUtils.isAndroid() && Activity.version_num >= 9070) || (osUtils.isIos() && Activity.version_num >= 9140)) {
        url += '/vip/added/webView/pendantH5/avatar.html?r=' + Math.random();
      } else {
        url += '/vip/added/member_Centre/src/swiper_vip.html?page=11';
      }
      location.href = url;
    });
  }, */
  // initPageEvent: function () {
  //   // 独家福利文案
  //   $('.exclusive_title').on('click', function () {
  //     $('.exclusive_arrow').toggleClass('exclusive_arrow_rotate');
  //     $('.exclusive_imgs').toggleClass('exclusive_imgs_margin');
  //     $('.exclusive_text').toggle();
  //   });
  // },
  // 获取设备信息
  feedbackDeviceinfo: function () {
    var jsonstr = '{"action":"control_get_deviceinfo","pagetype":"def"}';
    nativeUtils.callNative(jsonstr);
  },
  // 领取判断
  getJudge: function () {
    var params = 'op=addVipLux7ForUser&uid=' + uid;
    $.get('/vip/v2/user/vip?' + params, function (res) {
      console.log(1298, res);
      var res = utils.parseJSON(res);
      if ('200' != res.meta.code) {
        return false;
      }
      if (res.data && res.data == 'ok') {
        $(this).prev(".write_input_change").removeClass("border_wrong");
        alert("修改成功！");
        window.location.reload();
      } else {
        alert("修改失败！");
      }
    })
  },
  init: function () {
    // var vConsole = new VConsole();
    // this.initPageEvent();
    // Activity.initUserSwiper(); // 初始化轮播图
    // Activity.initSingerSwiper(); // 初始化轮播图
    // this.initMemberSons(); // 精选歌单
    // this.specificEvent(); // 个性音乐体验
    LogTraceUtils.pageType = Activity.pageType;
    if (osUtils.isIos()) {
      try {
        FastClick.attach(document.body);
      } catch (e) {}
    }
    /* try {
      var fromsrc = utils.getParamValue(utils.getUrlParams(), 'fromsrc');
      $('#id_ip_cliAction').val(fromsrc);
    } catch (e) {}; */
    if (Activity.isOutApp()) { // 盒外
      console.log('盒外');
      Activity.outApp=1;
      var platform = utils.getParamValue(utils.getUrlParams(), 'platform');
      if (platform == 'ios') { // 如果platform=ios，说明是由ios分享来的
        $('#super_ios').show();
      } else if (platform == 'android') { // 如果platform=android，说明是由android分享来的
        $('#super_an').show();
      }
      $('#h_login').show();
      Share.initUserInfo(function () {

        Share.reInitUserInfo(PROPERTIES.userinfo.uid);
      });
    } else { // 盒内
      Activity.outApp=0;
      if (osUtils.isIos()) { // ios
        $('#super_ios').show();
      } else {
        $('#super_an').show();
      }
      nativeUtils.callNative('{"action":"web_control_showMiniPlayer","isShowMiniPlayer":"0"}');
      nativeUtils.setPageTitle('7天体验会员');
      Activity.initUserInfo();
      console.log(1141);
      nativeUtils.getDeviceinfo();
      // $('.header_share').show();
    }
    Activity.initPage();
    KWLoading.init();
  }

}



var retry = 0; //用户无登录 重试次数
console.log(2);
function feedback_deviceinfo(data) {
  var uf = eval('(' + data + ')');
  if (uf) {
    var duid = uf['uid'];
    var source = uf['src'];
    var version_name = uf['ver'];
    var uname = uf['uname'];
    PROPERTIES.device.MY_DEVICE_UID = duid;
    PROPERTIES.device.MY_VERSION_NAME = version_name;
    PROPERTIES.device.MY_SOURCE = source;
    PROPERTIES.device.isShowMiniPlayer = uf.isShowMiniPlayer; //是否显示播放控制栏
    if (uf.isSandBox) {
      PROPERTIES.device.isSandBox = uf.isSandBox || 0; //是否是沙盒环境
    }
    PROPERTIES.device.supportHideMiniController = uf.supportHideMiniController; //是否支持显示关闭播放控制栏
    PROPERTIES.device.userId = PROPERTIES.userinfo.uid = uf.userid;
    PROPERTIES.device.sessionId = PROPERTIES.userinfo.sid = uf.usersid;
    if (Activity.onlyOnce == 0) {
      LogTraceUtils.doDeviceVersionInit(Activity.version);
      Activity.onlyOnce++;
    }
    $('#userId').val(PROPERTIES.userinfo.uid);
    $('#sessionId').val(PROPERTIES.userinfo.sid);
    $('#userName').val(uname);
    if (!Activity.checkUserIsLogin()) {
      var virtualUid = uf['temporary_uid'];
      var virtualSid = uf['temporary_sid'];
      if (virtualUid && virtualUid != '-1' && virtualUid != -1) {
        PROPERTIES.userinfo.virtualUid = virtualUid;
        PROPERTIES.userinfo.virtualSid = virtualSid;
        return false;
      }
      retry++;
      if (retry > 3) {
        return false;
      }
      nativeUtils.callNative('{"action":"get_temporary_userinfo","callback":"feedback_deviceinfo"}');
    }
    // --- 购买成功后，根据链接参数来判断
    Activity.successCallback();
    // --- 购买成功后，根据链接参数来判断
  }
  commonGetDeviceinfo(data);
}
function feedback_ardeviceinfo(data) {
  try {
    data = utils.validateJSONStr(data);
  } catch (e) {}
  var uf = eval('(' + data + ')');
  if (uf) {
    var duid = uf['device_uid'];
    var version_name = uf['version_name'];
    var source = uf['source'];
    var uname = uf['uname'];
    PROPERTIES.device.MY_DEVICE_UID = duid;
    PROPERTIES.device.MY_VERSION_NAME = version_name;
    PROPERTIES.device.MY_SOURCE = source;
    PROPERTIES.device.isShowMiniPlayer = uf.isShowMiniPlayer;
    PROPERTIES.device.supportHideMiniController = uf.supportHideMiniController;
    PROPERTIES.device.supportSuper = uf.supportSuper;
    PROPERTIES.device.userId = PROPERTIES.userinfo.uid = uf.uid;
    PROPERTIES.device.sessionId = PROPERTIES.userinfo.sid = uf.sid;
    PROPERTIES.device.isHD = (uf['app_type'] == 'hd'); //pad安装包
    PROPERTIES.device.isTS = (uf['app_type'] == 'tingshu'); //听书安装包
    PROPERTIES.device.isGOOGLEHD = (uf['app_type'] == 'googlehd'); //googleplay安装包
    if (Activity.onlyOnce == 0) {
      LogTraceUtils.doDeviceVersionInit(Activity.version);
      Activity.onlyOnce++;
    }
    $('#userId').val(PROPERTIES.userinfo.uid);
    $('#sessionId').val(PROPERTIES.userinfo.sid);
    $('#userName').val(uname);
    if (!Activity.checkUserIsLogin()) {
      var virtualUid = uf['temporary_uid'];
      var virtualSid = uf['temporary_sid'];
      if (virtualUid && virtualUid != '-1' && virtualUid != -1) {
        PROPERTIES.userinfo.virtualUid = virtualUid;
        PROPERTIES.userinfo.virtualSid = virtualSid;
        return false;
      }
      retry++;
      if (retry > 3) {
        return false;
      }
      nativeUtils.callNative('{"action":"get_temporary_userinfo","callback":"feedback_ardeviceinfo"}');
    }
    // --- 购买成功后，根据链接参数来判断
    Activity.successCallback();
    // --- 购买成功后，根据链接参数来判断
  }
  commonGetDeviceinfo(data);
}

function loginsuccess() {
  //登录成功回调
  window.location.reload();
  /* nativeUtils.callNative('{"action":"web_control_showMiniPlayer","isShowMiniPlayer":"0"}');*/
}

function getuesrinfo(data) {
  try {
    data = utils.validateJSONStr(data);
  } catch (e) {}
  if (!data || '' == data) {
    return;
  }
  var data = eval("(" + data + ")");
  PROPERTIES.userinfo = data;
  Share.setUserInfo();
}
// 获取设备信息
function commonGetDeviceinfo(data){
  var uf = eval('(' + data + ')');
  if (uf) {
    var version_name = uf['ver'];
    try {
      if (uf.user_appstore_access && uf.user_appstore_access > 0) {
        PROPERTIES.device.user_appstore_access = uf.user_appstore_access
      }
    } catch (e) {}
    // PROPERTIES.device.MY_VERSION_NAME = version_name;

    try {
      if (osUtils.isIos()) {
        var version_num = PROPERTIES.device.MY_VERSION_NAME.replace('kwplayer_ip_', '');
      } else {
        var version_num = PROPERTIES.device.MY_VERSION_NAME.replace('kwplayer_ar_', '');
      }
      
    } catch (e) {
      var version_num = '';
    }
    version_num = version_num.replace(/\./g, '');
    Activity.version_num=version_num;
  }
}







$(function () {
  Activity.init();
});