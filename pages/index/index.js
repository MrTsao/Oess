//index.js
//获取应用实例
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    PAGE: "INDEX",
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //  util.Post(this, "LOAD", null, function (that, data) {
    //    console.log(data)
    //  });
  }
  , load: function (e) {
    util.Post(this, "LOAD", null, function (that, data) {
      console.log(data)
    });
  }
})
