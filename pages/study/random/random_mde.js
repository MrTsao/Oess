// pages/study/random/random_mde.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: { avatarUrl: "/image/icon.png"},
    PAGE: "RANDOM",
    M: '',
    summaryValues: [],
    summaryItems: [{
      txt: "练习量",
      color: "#cd853f",
      val: "BATCH_COUNT",
      img: "/image/exam.png"
    }, {
      txt: "正确率",
      color: "#008B8B",
      val: "RATE",
      img: "/image/crate.png"
    }, {
      txt: "总用时",
      color: "#3CB371",
      val: "USE_SECOND",
      img: "/image/time.png"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // })
    var that = this
    app.getUserInfo(null, function (user) {
      that.setData({
        userInfo: user
      })
    })
    util.Post(this, "GETSUMMARY", null, function (that, data, a, m) {
      //格式化练习时间
      let objSummaries = data.summaries
      objSummaries[0].USE_SECOND = util.formatString(objSummaries[0].USE_SECOND)

      that.setData({
        summaryValues: objSummaries,
        M: m
      })
    });
  },
  startTrade: function (e) {
    wx.navigateTo({
      url: '/pages/trade/member?tp=MR',
    })
  },
  startTran: function (e) {
    wx.navigateTo({
      url: 'random',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    util.Post(this, "GETSUMMARY", null, function (that, data, a, m) {
      //格式化练习时间
      let objSummaries = data.summaries
      objSummaries[0].USE_SECOND = util.formatString(objSummaries[0].USE_SECOND)
      that.setData({
        summaryValues: objSummaries,
        M: m
      })
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})