// pages/daily/daily.js
var util = require('../../utils/util.js')
var sUtil = require('../study/sutil.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "QUESTIONS",
    hideclass: "",
    realhide: false,
    start_time: "",
    q_type: ["单选题", "多选题", "不定项题", "判断题", "主观题", "填空题", "简答题", "其他"],
    exerises: [],
    ecnt: 0,//有效答题数
    index: 0,//当前答题数量
    comm_text: '',
    comm_len: 0,
    r_id: '',//评论ID
    show_comment_module: false,
    scrollH: 0,
    scurrentdt: '',
    week: 0,
    COLOR: ['#6699cc', '#BC8F8F', '#778899', '#5F9EA0', '#51AD8F', '#81B281', '#A8A35D'],
    weeks: ["日", "一", "二", "三", "四", "五", "六"],
    comm_text: '',
    comm_len: 0,
    r_id: '',//评论ID
    show_comment_module: false,
    showarrorw: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var SysInfo = wx.getSystemInfoSync()
    let dt = new Date();
    this.setData({
      week: dt.getDay(),
      start_time: dt,
      scrollH: SysInfo.windowHeight,
      scurrentdt: util.formatTime(dt, "date")
    })
    Post.call(this, this, "DAILY")
  },
  //------------------------START-----答题---------------------------
  selected: function (e) {
    //选择项确定
    sUtil.selectedOptions(e, this, function (that, objExamItem) {
      //单项选择时回调有效
      var jsPost = new util.jsonRow()
      jsPost.AddCell("ID", objExamItem.id)
      jsPost.AddCell("QID", objExamItem.qid)
      jsPost.AddCell("BID", objExamItem.bid)
      jsPost.AddCell("SEQ", objExamItem.seq)
      jsPost.AddCell("u_answer", objExamItem.u_answer)
      jsPost.AddCell("u_second", objExamItem.u_second)
      Post.call(this, that, "ANSWERED", jsPost)
    }, true)
  },
  submitMultiVal: function (e) {
    //多选、不定项提交答案
    sUtil.submitMultiAnswer(e, this, function (that, objExamItem) {
      //非单项选择时回调
      var jsPost = new util.jsonRow()
      jsPost.AddCell("ID", objExamItem.id)
      jsPost.AddCell("QID", objExamItem.qid)
      jsPost.AddCell("BID", objExamItem.bid)
      jsPost.AddCell("SEQ", objExamItem.seq)
      jsPost.AddCell("u_answer", objExamItem.u_answer)
      jsPost.AddCell("u_second", objExamItem.u_second)
      Post.call(this, that, "ANSWERED", jsPost)
    }, true)
  }, doComments: function (e) {
    //评论题目窗口
    this.setData({
      r_id: '',
      show_comment_module: true
    })
  },
  doDisComm: function (e) {
    //评论-评论
    let iIndex = this.data.index
    let sExe = this.data.exerises
    let iFeedIndex = e.currentTarget.dataset.idx
    let rid = sExe[iIndex].feeds[iFeedIndex].id
    this.setData({
      r_id: rid,
      show_comment_module: true
    })
  },
  InputComm: function (e) {
    //输入评论时，实时显示长度
    this.setData({
      comm_text: e.detail.value,
      comm_len: e.detail.value.length
    })
  },
  SubmitComm: function (e) {
    //提交评论
    let iIndex = this.data.index
    let sExe = this.data.exerises
    let sId = sExe[iIndex].qid
    var jsPost = new util.jsonRow()
    jsPost.AddCell("QID", sId)
    jsPost.AddCell("RID", this.data.r_id)
    jsPost.AddCell("TEXT", this.data.comm_text)
    Post.call(this, this, "COMMENT", jsPost)
  },
  CloseComm: function (e) {
    //关闭评论
    this.setData({
      r_id: '',
      show_comment_module: false
    })
  },
  doLike: function (e) {
    //评论点赞
    sUtil.like(e, this, function (that, sId) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("DID", sId)
      Post.call(this, that, "LIKE", jsPost)
    })
  },
  //------------------------END-----评论---------------------------
  doColl: function (e) {
    //收藏
    sUtil.collect(e, this, function (that, sId) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("QID", sId)
      Post.call(this, that, "COLL", jsPost)
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
    var SysInfo = wx.getSystemInfoSync()
    let dt = new Date();
    let week = dt.getDay()
    let orgweek = this.data.week
    if (week != orgweek) {
      this.setData({
        week: week,
        start_time: dt,
        scrollH: SysInfo.windowHeight,
        scurrentdt: util.formatTime(dt, "date")
      })
      Post.call(this, this, "DAILY")
    } else {
      this.setData({
        scrollH: SysInfo.windowHeight
      })
    }
   //console.log(SysInfo.windowHeight)
  },
  swiperchange: function (e) {
    let showarrorw = e.detail.current
    this.setData({
      showarrorw: showarrorw
    })
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
    Post.call(this, this, "DAILY")
    wx.stopPullDownRefresh();
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


function Post(that, action, data) {
  //数据请求执行方法
  util.Post(that, action, data, function (that, res) {
    if (res) {
      //更新数据
      if (action == "DAILY") {
        that.setData({
          exerises: that.data.exerises.concat(res.exerises)
          , hideclass: "hideLoad"
          , ecnt: res.ecnt
        })
        setTimeout(function () {
          that.setData({
            realhide: true
          });
        }, 800);
      }
      else if (action == "COMMENT") {
        //题目评论
        let cExes = that.data.exerises
        cExes[that.data.index].feeds = res.feeds
        that.setData({
          exerises: cExes,
          comm_text: '',
          comm_len: 0,
          r_id: '',
          show_comment_module: false
        })
      }
      else if (action == "REFRESHCOMMENT") {
        //题目评论
        let cExes = that.data.exerises
        cExes[that.data.index].feeds = res.feeds
        that.setData({
          exerises: cExes
        })
      }
    }
    else if (action == "ANSWERED" && that.data.auto_next) {
      //答题后，自动下一题的情况下处理
      var iIndex = that.data.index
      if (iIndex == that.data.exerises.length - 2) {
        var jsPost1 = new util.jsonRow()
        jsPost1.AddCell("BID", that.data.exerises[iIndex].bid)
        Post.call(this, that, "NEXT", jsPost1)
      }
      that.setData({
        index: ++iIndex
        , start_time: new Date()
      })
    }
  })
}
