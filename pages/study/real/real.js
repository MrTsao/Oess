// pages/tabbar/study/real/real.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    PAGE: "REAL",
    hideclass: "",
    realhide: false,
    COLOR: ['#6699cc', '#778899', '#99cc66', '#5F9EA0', '#8FBC8F', '#BDB76B'],
    batches: [],
    yearList: ["全部"],
    height: 0,
    rpxrate: 0.0, //rpx-px比率
    region: ['重庆市', '全部', '全部'],
    customItem: '全部',
    date: 0,
    purch_status: false
  },
  onShow: function () {
    util.Post(this, "LOAD", null, function (that, res) {
      if (res) {
        //更新数据
        var yearList = that.data.yearList
        for (var i = 0; i < res.batches.length; i++) {
          if (yearList.indexOf(res.batches[i].IN_YEAR) == -1) {
            yearList.push(res.batches[i].IN_YEAR)
          }
        }
        that.setData({
          batches: res.batches,
          yearList: yearList,
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
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  onLoad: function (options) {
    var SysInfo = wx.getSystemInfoSync()
    this.setData({
      height: SysInfo.windowHeight,
      rpxrate: Math.floor(SysInfo.windowWidth / 750 * 100) / 100,
    })
  },
  onPullDownRefresh() {
    util.Post(this, "LOAD", null, function (that, res) {
      if (res) {
        //更新数据
        var yearList = that.data.yearList
        for (var i = 0; i < res.batches.length; i++) {
          if (yearList.indexOf(res.batches[i].IN_YEAR) == -1) {
            yearList.push(res.batches[i].IN_YEAR)
          }
        }
        that.setData({
          batches: res.batches,
          yearList: yearList
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  navitoexe: function (e) {
    var sPURCHED = e.currentTarget.dataset.purched
    var sREAL_BATCH_ID = e.currentTarget.dataset.real_batch_id
    if (sPURCHED == "1") {
      var sIN_YEAR = e.currentTarget.dataset.in_year
      var sPARTY_TYPE = e.currentTarget.dataset.party_type
      wx.navigateTo({
        url: 'real_exe?id=' + sREAL_BATCH_ID + '&txt=' + sIN_YEAR + '年' + sPARTY_TYPE
      })
    } else {
      wx.navigateTo({
        url: '/pages/trade/member?tp=PP&id=' + sREAL_BATCH_ID
      })
    }
  },
  switchpurchstatus: function () {
    let purch_status = this.data.purch_status;
    this.setData({
      purch_status: !purch_status
    })
  },
  onReachBottom: function () { }
})
