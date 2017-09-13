// pages/tabbar/study/real/real.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    PAGE: "REAL",
    COLOR: ['#6699cc', '#778899', '#99cc66', '#5F9EA0', '#8FBC8F', '#BDB76B'],
    batches: [],
    yearList: ["全部"],
    height: 0,
    rpxrate: 0.0, //rpx-px比率
    region: ['重庆市', '全部', '全部'],
    customItem: '全部',
    date: 0
  },
  onShow: function () {
    Post.call(this, this, "LOAD")
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
    //Post.call(this, this, "LOAD")
    var SysInfo = wx.getSystemInfoSync()
    this.setData({
      height: SysInfo.windowHeight,
      rpxrate: Math.floor(SysInfo.screenWidth / 750 * 100) / 100,
    })
  },
  onPullDownRefresh() {
    Post.call(this, this, "LOAD")
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () { }
})

function Post(that, action, data) {
  //数据请求执行方法
  util.Post(that, action, data, function (that, res) {
    if (res) {
      //更新数据
      if (action == "LOAD") {
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

      }
    }
    else {
      // console.log('error')
    }
  })
}
