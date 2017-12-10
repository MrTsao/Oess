// focus.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    height: 0,
    width: 0,
    bseurl: '',
    rpxrate: 0.0, //rpx-px比率
    PAGE: "DOC_LIST",
    hideclass: "",
    realhide: false,
    RCNT: 10,//每次请求数量
    HOTS: [],
    searchval: "",//搜索内容
    moreLoading: false,
    moreLoadingComplete: false,
    currenttime: 0,
  },
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this
    var height = 0;
    var width = 0;
    var SysInfo = wx.getSystemInfoSync()

    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", that.data.RCNT)
    jsPost.AddCell("CCNT", that.data.HOTS.length)
    Post.call(this, this, "LOAD", jsPost, function (that, data) {
      that.setData({
        height: SysInfo.windowHeight,
        width: SysInfo.windowWidth,
        rpxrate: Math.floor(SysInfo.windowWidth / 750 * 100) / 100,
        HOTS: data.HOTS,
        bseurl: app.globalData.bseurl,
        hideclass: "hideLoad"
      })
      setTimeout(function () {
        that.setData({
          realhide: true
        });
      }, 800);
    });
  },
  onPullDownRefresh() {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", this.data.HOTS.length < 10 ? 10 : this.data.HOTS.length)
    jsPost.AddCell("CCNT", 0)
    Post.call(this, this, "LOAD", jsPost, function (that, data) {
      that.setData({
        HOTS: data.HOTS,
        moreLoading: false,
        moreLoadingComplete: false
      })
    });
    wx.stopPullDownRefresh()
  },
  onReachBottom: function (e) {
    if (!this.data.moreLoadingComplete) {
      this.setData({
        moreLoading: true
      })

      var jsPost = new util.jsonRow()
      jsPost.AddCell("RCNT", this.data.RCNT)
      jsPost.AddCell("CCNT", this.data.HOTS.length)
      Post.call(this, this, "MORE", jsPost, function (that, data) {
        let loadComplete = false;
        if (data.HOTS.length < 1)
          loadComplete = true;
        that.setData({
          HOTS: that.data.HOTS.concat(data.HOTS),
          moreLoading: false,
          moreLoadingComplete: true
        })
      })
    }
  }
})
//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  util.Post(that, action, data, function (that, res) {
    if (res) {
      //回调
      typeof doAfter == "function" && doAfter(that, res)
    }
  })
}
