//chapter.js
//获取应用实例
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    PAGE: "CHAPTER",
    M: null,
    hideclass: "",
    realhide: false,
    userInfo: {},
    eclass: [],
    ucid: '',
    chapters: [],
    COLOR: ['#6699cc', '#778899', '#99cc66', '#5F9EA0', '#8FBC8F', '#BDB76B']
  },
  //事件处理函数
  startTrade: function () {
    wx.navigateTo({
      url: '/pages/trade/member?tp=MR',
    })
  },
  onLoad: function () {
    var that = this
    var ucid = wx.getStorageSync('_UCID') || "RID0H9201TY701D8";
    app.getUserInfo(null, function (user) {
      that.setData({
        userInfo: user,
        ucid: ucid
      })
    })
    util.Post(this, "LOAD", null, function (that, data, a, m) {
      that.setData({
        eclass: data.ECLASS,
        chapters: data.CHAPTER,
        ucid: data.UCID,
        M: m,
        hideclass: "hideLoad"
      })
      setTimeout(function () {
        that.setData({
          realhide: true
        });
      }, 800);
    });
  },
  onPullDownRefresh: function () {
    util.Post(this, "LOAD", null, function (that, data, a, m) {
      that.setData({
        chapters: data.CHAPTER,
        M: m
      })
      wx.stopPullDownRefresh()
    })
  },
  onShow: function () {
    var ucid = wx.getStorageSync('_UCID') || "RID0H9201TY701D8";
    if (ucid != this.data.ucid) {
      this.setData({
        ucid: ucid
      })
    }
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
  },
  bindClassChange: function (e) {
    let idx = e.detail.value
    if (this.data.ucid != this.data.eclass[idx].id) {
      this.setData({
        ucid: this.data.eclass[idx].id
      })
      wx.setStorageSync('_UCID', this.data.eclass[idx].id);
      var jsPost = new util.jsonRow()
      jsPost.AddCell("CLASS", this.data.eclass[idx].id)
      util.Post(this, "UPDATE-CLASS", jsPost)
    }
  }
})
