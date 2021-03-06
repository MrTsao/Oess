// pages/highexam.js
var _SUCCESS = true;//
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "HIGH_EXAM",
    M: '',
    hideclass: "",
    realhide: false,
    moreLoadingComplete: false,
    scrollH: 0,
    rowWords: 0,
    curPages: 1,
    q_type: ["单选题", "多选题", "不定项题", "判断题", "主观题", "填空题", "简答题", "其他"],
    col1: [],
    col2: [],
    col1cnt: 0,
    col2cnt: 0,
    COLOR: ['#6699cc', '#BC8F8F', '#778899', '#5F9EA0', '#51AD8F', '#81B281', '#A8A35D', '#808080']
  },
  startTrade: function () {
    wx.navigateTo({
      url: '/pages/trade/member?tp=MR',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var SysInfo = wx.getSystemInfoSync()
    var rowWords = Math.floor((SysInfo.windowWidth * 0.48 * (100 / (Math.floor(SysInfo.windowWidth / 750 * 100))) - 40) / 30)
    this.setData({
      scrollH: SysInfo.windowHeight,
      rowWords: rowWords
    }, function () {
      LoadingData(that, function (that) {
        that.setData({
          hideclass: "hideLoad"
        })
        setTimeout(function () {
          that.setData({
            realhide: true
          });
        }, 200);
      })
    })
  },
  loadExames: function (e) {
    if (this.data.moreLoadingComplete || !_SUCCESS) {
      return;
    }
    _SUCCESS = false
    LoadingData(this)
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
    _SUCCESS = true
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
    this.onLoad()
    wx.stopPullDownRefresh()
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

function LoadingData(topthis, callback) {
  var jsPost = new util.jsonRow()
  jsPost.AddCell("CURPAGE", topthis.data.curPages)
  jsPost.AddCell("TYPE", 'HERROR')
  util.Post(topthis, "LOAD", jsPost, function (that, data, a, m) {
    if (data.exams && data.exams.length > 0) {
      let col1 = that.data.col1
      let col2 = that.data.col2
      let col1cnt = that.data.col1cnt
      let col2cnt = that.data.col2cnt
      let rowWords = that.data.rowWords
      for (let i = 0; i < data.exams.length; i++) {
        let examstr = data.exams[i].Q_DESC
        let cnt = 0
        for (let j = 0; j < examstr.length; j++) {
          if (examstr.charCodeAt(j) > 127 || examstr.charCodeAt(j) == 94) {
            cnt += 2;
          } else {
            cnt++;
          }
        }
        cnt = Math.ceil(cnt / (rowWords * 2))
        if (col1cnt <= col2cnt) {
          col1cnt += cnt
          col1.push(data.exams[i])
        } else {
          col2cnt += cnt
          col2.push(data.exams[i])
        }
      }
      that.setData({
        M: m,
        col1: col1,
        col2: col2,
        col1cnt: col1cnt,
        col2cnt: col2cnt,
        curPages: that.data.curPages + 1
      })
      _SUCCESS = true
    } else {
      that.setData({
        moreLoadingComplete: true
      })
    }
    typeof callback == "function" && callback(that)
  });
}