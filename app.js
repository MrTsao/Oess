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

    if (!openkey.OPEN_KEY || !user.nickName || isNeedNewSession) {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo;
                wx.setStorageSync('user', res.userInfo);//userInfo
              }
            })
            util.getOpenId(that.globalData.url, res.code, function (res) {
              that.globalData.openData = res.data
              wx.setStorageSync('openkey', res.data);//存储openid  
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

    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
    }
    if (that.globalData.openData) {
      //防止缓存清除后，跳转出错
      wx.setStorageSync('openkey', that.globalData.openData)//存储openid
      typeof fuser == "function" && fuser(that.globalData.openData)
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