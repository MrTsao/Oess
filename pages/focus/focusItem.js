// pages/focus/focusItem.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    NID: '',
    TXT: '',
    BGURL: '',
    BSURL: '',
    PAGE: "NEWS_ITEM",
    hideclass: "",
    realhide: false,
    imagewidth: 0,
    imageheight: 0,
    NODES: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.txt
    })
    //调用应用实例的方法获取全局数据
    this.setData({
      NID: options.id,
      TXT: options.txt,
      BGURL: options.url,
      BSURL: app.globalData.bseurl,
      NODES: ""
    })

    Post.call(this, this, "LOAD", null, function (that, data) {
      that.setData({
        NODES: data.NODES,
        hideclass: "hideLoad"
      })
      setTimeout(function () {
        that.setData({
          realhide: true
        });
      }, 200);
    });
  },
  imageLoad: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
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
    // Post.call(this, this, "LOAD", jsPost, function (that, data) {
    //   that.setData({
    //     NODES: data.NODES
    //   })
    // });
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
    var that = this
    return {
      title: that.data.TXT,
      desc: '',
      path: '/pages/focus/focusItem?id=' + that.data.NID + '&txt=' + that.data.TXT + '&url=' + that.data.BGURL
    }
  }
})


//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("NID", that.data.NID)
  util.Post(that, action, jsPost, function (that,res) {
    if (res) {
      //回调
      typeof doAfter == "function" && doAfter(that, res)
    }
    else {
      // console.log('error')
    }
  })
}
