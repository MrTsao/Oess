//app.js
var util = require('/utils/util.js');
App({
  onLaunch: function () {
    this.getUserInfo(null,null)
  },
  getUserInfo: function (cb, fuser) {
    var that = this
    var user = wx.getStorageSync('user') || {};
    var openkey = wx.getStorageSync('openkey') || {};
    var isNeedNewSession = false;
    wx.checkSession({
      success: function (e) {   //登录态未过期
      },
      fail: function () {   //登录态过期了
        isNeedNewSession = true;
      }
    })

    if (that.globalData.userInfo && !user){
      wx.setStorageSync('user', that.globalData.userInfo);
      user = that.globalData.userInfo;
    }

    if (that.globalData.openData && !openkey) {
      wx.setStorageSync('openkey', that.globalData.userInfo);
      openkey = that.globalData.openData;
    }

    if (!openkey.OPEN_KEY || !user.nickName || isNeedNewSession) {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res2) {
                that.globalData.userInfo = res2.userInfo;
                wx.setStorageSync('user', res2.userInfo);//userInfo
              }
            })
            util.getOpenId(that.globalData.url, res.code, function (res3) {
              that.globalData.openData = res3.data
              wx.setStorageSync('openkey', res3.data);//存储openid  
            })
          }
          else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    } else {
      that.globalData.userInfo = user;
      that.globalData.openData = openkey;
    } 
  },
  globalData: {
    userInfo: null,
    openData: null,
    url: 'https://www.yondo.cc/wxapp/wxget.axd',
    uploadurl: 'https://www.yondo.cc/wxapp/wxupload.axd',
    bseurl: 'https://www.yondo.cc/'
  }
})