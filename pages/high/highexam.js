// pages/highexam.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "HIGH_EXAM",
    hideclass: "",
    realhide: false,
    scrollH: 0,
    curPages: 1,
    col1cnt: 0,
    col2cnt: 0,
    steelcol1: 0,
    steelcol2: 0,
    q_type: ["单选题", "多选题", "不定项题", "判断题", "主观题", "其他"],
    col1: [],
    col2: [],
    COLOR: ['#6699cc','#BC8F8F', '#778899', '#99cc66', '#5F9EA0','#66CDAA', '#8FBC8F', '#BDB76B']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var SysInfo = wx.getSystemInfoSync()
    var jsPost = new util.jsonRow()
    jsPost.AddCell("CURPAGE", this.data.curPages)
    jsPost.AddCell("TYPE", 'HEXAM')
    util.Post(this, "LOAD", jsPost, function (that, data, a, m) {
      if (data.exams) {
        let col1 = that.data.col1
        let col2 = that.data.col2
        let steelcol1 = that.data.steelcol1
        let steelcol2 = that.data.steelcol2
        let col1cnt = that.data.col1cnt
        let col2cnt = that.data.col2cnt
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
          cnt = Math.ceil(cnt / 20)
          if (col1cnt <= col2cnt) {
            col1cnt += cnt;
            steelcol1 += 1
            col1cnt += Math.floor(steelcol1 / 2)
            steelcol2 = 0
            col1.push(data.exams[i])
          } else {
            col2cnt += cnt;
            steelcol1 = 0
            steelcol2 += 1
            col2cnt += Math.floor(steelcol2 / 2)
            col2.push(data.exams[i])
          }
        }
        that.setData({
          scrollH: SysInfo.windowHeight,
          col1: col1,
          col2: col2,
          col1cnt: col1cnt,
          col2cnt: col2cnt,
          steelcol1: steelcol1,
          steelcol2: steelcol2,
          curPages: that.data.curPages + 1,
          hideclass: "hideLoad"
        })
        setTimeout(function () {
          that.setData({
            realhide: true
          });
        }, 800);
      }
    });
  },
  loadExames: function (e) {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("CURPAGE", this.data.curPages)
    jsPost.AddCell("TYPE", 'HEXAM')
    util.Post(this, "LOAD", jsPost, function (that, data, a, m) {
      if (data.exams) {
        let col1 = that.data.col1
        let col2 = that.data.col2
        let steelcol1 = that.data.steelcol1
        let steelcol2 = that.data.steelcol2
        let col1cnt = that.data.col1cnt
        let col2cnt = that.data.col2cnt
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
          cnt = Math.ceil(cnt / 20)
          if (col1cnt <= col2cnt) {
            col1cnt += cnt;
            steelcol1 += 1
            col1cnt += Math.floor(steelcol1 / 2)
            steelcol2 = 0
            col1.push(data.exams[i])
          } else {
            col2cnt += cnt;
            steelcol1 = 0
            steelcol2 += 1
            col2cnt += Math.floor(steelcol2 / 2)
            col2.push(data.exams[i])
          }
        }
        that.setData({
          col1: col1,
          col2: col2,
          col1cnt: col1cnt,
          col2cnt: col2cnt,
          steelcol1: steelcol1,
          steelcol2: steelcol2,
          curPages: that.data.curPages + 1
        })
      }
    });
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