//chapter.js
//获取应用实例
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    PAGE: "CHAPTER",
    M: null,
    userInfo: {
      avatarUrl: "/image/icon.png"
    },
    chapters: [],
    COLOR: ['#6699cc', '#778899', '#99cc66', '#5F9EA0', '#8FBC8F', '#BDB76B']
  },
  //事件处理函数
  bindViewTap: function () {
  },
  onLoad: function () {
    var that = this
    app.getUserInfo(null, function (user) {
      that.setData({
        userInfo: user
      })
    })
    util.Post(this, "LOAD", null, function (that, data, a, m) {
      that.setData({
        chapters: data.CHAPTER,
        M: m
      })
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: "章节练习",
      desc: '',
      path: '/pages/study/chapter/chapter'
    }
  }
})
