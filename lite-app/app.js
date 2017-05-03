//app.js
App({

  onLaunch: function() {  
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      var that = this  
      var user = wx.getStorageSync('user') || {};    
      //var userInfo = wx.getStorageSync('userInfo') || {};   
      //that.globalData.userInfo = userInfo
      that.globalData.user = user
      console.log(user.openid)
      console.log(user.expiresin)
      //console.log(userInfo)
      if (true || !user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) {
          console.log('try login..')
          wx.login({
          success: function(res){
              if(res.code) {
                  /*wx.getUserInfo({
                      success: function (res) {
                          var objz={};
                          objz.avatarUrl=res.userInfo.avatarUrl;
                          objz.nickName=res.userInfo.nickName;
                          console.log(objz);
                          wx.setStorageSync('userInfo', objz);//存储userInfo
                          that.globalData.userInfo = objz
                      }
                  });*/
                  var d = that.globalData;//这里存储了appid、secret、token串
                  var l = 'https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';
                  console.log('login for openid..')
                  wx.request({
                      url: l,   
                      data: {},
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      // header: {}, // 设置请求的 header
                      success: function(res){
                          var obj={};
                          obj.openid = res.data.openid;
                          obj.expires_in = Date.now()+res.data.expires_in;
                          console.log(obj);
                          wx.setStorageSync('user', obj); // 存储openid
                          that.globalData.user = obj
                          console.log(obj.openid)
                          console.log(obj.expiresin)
                      }
                  });
              } else {
                  console.log('获取用户登录态失败！' + res.errMsg)
              }
          }    
        });   
      }   
  },
  globalData: {
    appid: 'test-appid',
    secret: 'test-appsecret',
    userInfo: null,
    user: null
  }
})
