// pages/tabbar/study/random/random.js
var util = require('../../../utils/util.js')
var sUtil = require('../sutil.js')
var app = getApp()
Page({
  data: {
    PAGE: "RANDOM",
    hideclass: "",
    realhide: false,
    q_type: ["单选题", "多选题", "不定项题", "判断题", "主观题", "填空题", "简答题", "其他"],
    exerises: [],
    ecnt: 0,//有效答题数
    start_time: null,
    index: 0,//当前答题数量
    auto_next: false,//自动下一题
    // right: 0,
    // error: 0,
    comm_text: '',
    comm_len: 0,
    r_id: '',//评论ID
    show_comment_module: false,
    show_content: false
  },
  setautonext: function (e) {
    var that = this
    that.setData({
      auto_next: !that.data.auto_next
    })
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
    })
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
    })
  },
  //------------------------END-----答题---------------------------

  //------------------------START-----左右滑动控制------------------
  touchStart: function (e) {
    sUtil.touchStart(e)
  },
  touchMove: function (e) {
    sUtil.touchMove(e)
  },
  touchEnd: function (e) {
    sUtil.touchEnd(e, this, function (that, objExamItem) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("BID", objExamItem.bid)
      Post.call(this, that, "NEXT", jsPost)
    }, function (that) {
      //刷新评论
      let iIndex = that.data.index
      let sExe = that.data.exerises
      let sId = sExe[iIndex].qid
      let jsPost = new util.jsonRow()
      jsPost.AddCell("QID", sId)
      Post.call(that, that, "REFRESHCOMMENT", jsPost)
    })
  },
  //------------------------END-----左右滑动控制--------------------
  //------------------------START-----上、下一题------------------
  nextexam: function (e) {
    sUtil.nextexam(this, function (that, objExamItem) {
      let jsPost = new util.jsonRow()
      jsPost.AddCell("BID", objExamItem.bid)
      Post.call(this, that, "NEXT", jsPost)
    })
  }, 
  preexam: function (e) {
    sUtil.preexam(this)
  },
  //------------------------END-----上、下一题--------------------

  //------------------------START-----评论-------------------------
  doComments: function (e) {
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
  onLoad: function (options) {
    Post.call(this, this, "LOAD")
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.TXT,
      desc: '',
      path: '/pages/study/random/random'
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () { }
})

function Post(that, action, data) {
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
  util.Post(that, action, jsPost, function (that, res, mod) {
    if (mod == "END") {
      wx.showModal({
        showCancel: false,
        title: '体验已完成！',
        content: '您已完成所有的随机练习体验模式，如需继续，请完成会员充值！谢谢！',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
      return
    }
    if (res) {
      //更新数据
      if (jsPost.arrjson.ACTION == "LOAD") {
        let iIndex = that.data.index
        if (res.exerises.length > 5) {
          iIndex = 2
        }
        that.setData({
          exerises: that.data.exerises.concat(res.exerises)
          , ecnt: res.ecnt
          , index: iIndex
          , start_time: new Date()
          , show_content: true
          , hideclass: "hideLoad"
        })
        setTimeout(function () {
          that.setData({
            realhide: true
          });
        }, 200);
      }
      else if (jsPost.arrjson.ACTION == "NEXT") {
        that.setData({
          exerises: that.data.exerises.concat(res.exerises)
        })
      }
      else if (jsPost.arrjson.ACTION == "COMMENT") {
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
      else if (jsPost.arrjson.ACTION == "REFRESHCOMMENT") {
        //题目评论
        let cExes = that.data.exerises
        cExes[that.data.index].feeds = res.feeds
        that.setData({
          exerises: cExes
        })
      }
    }
    else if (jsPost.arrjson.ACTION == "ANSWERED" && that.data.auto_next) {
      //答题后，自动下一题的情况下处理
      var iIndex = that.data.index
      if (iIndex == that.data.exerises.length - 2) {
        var jsPost1 = new util.jsonRow()
        jsPost1.AddCell("BID", that.data.exerises[iIndex].bid)
        Post.call(this, that, "NEXT", jsPost1)
      }
      setTimeout(function () {
        that.setData({
          index: ++iIndex
          , start_time: new Date()
        });
      }, 1000)
    }
    else {
      // console.log('error')
    }
  })
}
