// chapter_exec.js
var util = require('../../../utils/util.js')
var sUtil = require('../sutil.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RSID: '',
    TXT: '',
    PAGE: "CHAPTER_EXEC",
    TTLCNT: 0,
    hideclass: "",
    realhide: false,
    q_type: ["单选题", "多选题", "不定项题", "判断题", "主观题", "填空题", "简答题", "其他"],
    exerises: [],
    summaries: [],
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
    show_ctrl_panel: false
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
      var jsPost = new util.jsonRow()
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

  //------------------------START-----弹出的控制面板--------------------
  showCtrlPanel: function (e) {
    this.setData({
      show_ctrl_panel: !this.data.show_ctrl_panel
    })
  },
  closeCtrlPanel: function (e) {
    this.setData({
      show_ctrl_panel: false
    })
  },
  submitExam: function (e) {
    Post.call(this, this, "FINISHEDEXAM")
  },
  setExamIndex: function (e) {
    this.setData({
      index: e.currentTarget.dataset.idx,
      show_ctrl_panel: !this.data.show_ctrl_panel
    })
  },
  //------------------------END-----弹出的控制面板--------------------

  //------------------------START-----评论-------------------------
  doComments: function (e) {
    //评论题目窗口
    this.setData({
      r_id: '',//为空，对当前的题目进行评论
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.txt + '-章节练习'
    })
    //加载时执行
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      RSID: options.id
      , TTLCNT: options.TTLCNT
      , TXT: options.txt
      , start_time: new Date()
    })
    var exerises = wx.getStorageSync('CHAPTER_' + options.id) || [];
    var summaries = wx.getStorageSync('CHAPTER_SUM' + options.id) || [];
    if (exerises.length > 0 && summaries.length > 0) {
      let iIndex = 0
      for (var i = 0; i < exerises.length; i++) {
        if (!exerises[i].is_answered) {
          iIndex = i;
          break;
        }
      }
      that.setData({
        exerises: exerises
        , summaries: summaries
        , ecnt: exerises.length
        , index: iIndex,
        hideclass: "hideLoad"
      })
      setTimeout(function () {
        that.setData({
          realhide: true
        });
      }, 200);
    } else {
      Post.call(this, this, "LOAD")
    }
  },
  onReachBottom: function () { }
})

function Post(that, action, data) {
  if (!that.data.RSID)
    return
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("RSID", that.data.RSID)
  util.Post(that, action, jsPost, function (that, res) {
    if (res) {
      //更新数据
      if (action == "LOAD") {
        let iIndex = that.data.index
        for (var i = 0; i < res.exerises.length; i++) {
          if (!res.exerises[i].is_answered) {
            iIndex = i;
            break;
          }
        }
        //格式化练习时间
        // let objSummaries = res.data.data.summaries
        // objSummaries[0].USE_SECOND = util.formatString(objSummaries[0].USE_SECOND)

        that.setData({
          exerises: that.data.exerises.concat(res.exerises)
          , summaries: res.summaries
          , ecnt: res.ecnt
          , index: iIndex,
          hideclass: "hideLoad"
        })
        setTimeout(function () {
          that.setData({
            realhide: true
          });
        }, 200);
      }
      else if (action == "NEXT") {
        that.setData({
          exerises: that.data.exerises.concat(res.exerises)
        })
      }
      else if (action == "FINISHEDEXAM") {
        that.setData({
          summaries: res.summaries
        })
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
        var jsPost = new util.jsonRow()
        jsPost.AddCell("BID", that.data.exerises[iIndex].bid)
        Post.call(this, that, "NEXT", jsPost)
      }
      else if (iIndex == that.data.exerises.length - 1) {
        wx.showToast({
          title: "已经是最后一题"
        })
        --iIndex
      }
      //     that.setData({
      //       index: ++iIndex
      //       , start_time: new Date()
      //    })
      setTimeout(function () {
        that.setData({
          index: ++iIndex
          , start_time: new Date()
        });
      }, 1000)
    }
    wx.setStorageSync('CHAPTER_' + that.data.RSID, that.data.exerises);//缓存
    wx.setStorageSync('CHAPTER_SUM' + that.data.RSID, that.data.summaries);//缓存
  })
}
