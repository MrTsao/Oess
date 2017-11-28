// pages/tabbar/study/real/real.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    PAGE: "REAL_SIMULATE",
    M:'',
    hideclass: "",
    realhide: false,
    batches: [],
    height: 0
  },
  startTrade:function(){
    wx.navigateTo({
      url: '/pages/trade/member?tp=MR',
    })
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          height: res.screenHeight * 2
        })
      }
    })
  },
  onShow: function () {
    util.Post(this, "LOAD", null, function (that, res, a, m) {
      if (res) {
        let objbatches = res.batches
        for (var i = 0; i < objbatches.length; i++) {
          objbatches[i].EXAM_USER_DT = util.formatString(objbatches[i].EXAM_USER_DT)
        }
        that.setData({
          batches: objbatches,
          M: m,
          hideclass: "hideLoad"
        })
        setTimeout(function () {
          that.setData({
            realhide: true
          });
        }, 800);
      }
    })
  },
  onPullDownRefresh() {
    util.Post(this, "LOAD", null, function (that, res) {
      if (res) {
        let objbatches = res.batches
        for (var i = 0; i < objbatches.length; i++) {
          objbatches[i].EXAM_USER_DT = util.formatString(objbatches[i].EXAM_USER_DT)
        }
        that.setData({
          batches: objbatches
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  addbatch() {
    util.Post(this, "ADD", null, function (that, res) {
      if (res) {
        let objbatches = res.batches
        for (var i = 0; i < objbatches.length; i++) {
          objbatches[i].EXAM_USER_DT = util.formatString(objbatches[i].EXAM_USER_DT)
        }
        that.setData({
          batches: objbatches
        })
      }
    })
  },
  exebatch() {
    wx.navigateTo({
      url: 'realsimulate_exe?id=' + this.data.batches[0].EXAM_BATCH_ID + '&txt=' + this.data.batches[0].BATCH_NO,
    })
  }
})
