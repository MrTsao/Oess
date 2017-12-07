//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    PAGE: "INDEX",
    M: null,
    menuhide: true,//是否折叠菜单 
    menuIndex: 0,
    height:0,
    menu: [{
      id: "1"
      , txt: "综合基础知识"
    }, {
      id: "2"
      , txt: "管理基础知识"
    }, {
      id: "3"
      , txt: "教育公共基础知识"
    }, {
      id: "4"
      , txt: "综合基础教育类"
    }],//菜单内容
    HOTS: [{
      id: "item-1",
      url: "/image/index.png"
    }],
    showItems: [{
      img: "../../image/index-img/1.png",
      txt: "章节练习",
      url: "/pages/study/chapter/chapter"
    }, {
      img: "../../image/index-img/2.png",
      txt: "在线刷题",
      url: "/pages/study/random/random_mde"
    }, {
      img: "../../image/index-img/3.png",
      txt: "历年真题",
      url: "/pages/study/real/real"
    }, {
      img: "../../image/index-img/4.png",
      txt: "模拟考试",
      url: "/pages/study/realsimulate/realsimulate"
    }, {
      img: "../../image/index-img/6.png",
      txt: "电子资料",
      url: "/pages/doc/doclist"
    }, {
      img: "../../image/index-img/8.png",
      txt: "高频考题",
      url: "/pages/high/highexam"
    }, {
      img: "../../image/index-img/9.png",
      txt: "高频错题",
      url: "/pages/high/higherror"
    }, {
      img: "../../image/index-img/10.png",
      txt: "我的错题",
      url: "/pages/high/myerror"
    }],
    chapters: [],
    COLOR: ['#6699cc', '#778899', '#99cc66', '#5F9EA0', '#8FBC8F', '#BDB76B']
  },
  startTrade: function () {
    wx.navigateTo({
      url: '/pages/trade/member?tp=MR',
    })
  },
  //展开或隐藏菜单
  menucontrol: function (e) {
    this.setData({
      menuhide: !this.data.menuhide
    })
  },
  subitemcontrol: function (e) {
    this.setData({
      menuIndex: e.currentTarget.dataset.idx
      , menuhide: !this.data.menuhide
    });
  },
  onLoad: function () {
    var that = this
    var SysInfo = wx.getSystemInfoSync()
    var chapterscatch = wx.getStorageSync('CHAPTER_HEAD_LIST') || [];
    if (chapterscatch.length > 0) {
      that.setData({
        chapters: chapterscatch
      })
      setTimeout(function () {
        util.Post(that, "LOAD", null, function (that, data, a, m) {
          for (let i = 0; i < data.HOTS.length; i++) {
            data.HOTS[i].url = app.globalData.bseurl + data.HOTS[i].INFO_IMG_URL
          }
          that.setData({
            chapters: data.CHAPTER,
            HOTS: data.HOTS,
            M: m,
            height: SysInfo.windowHeight
          })
          wx.setStorageSync('CHAPTER_HEAD_LIST', data.CHAPTER);//缓存
        })
      }, 1000)
    } else {
      util.Post(that, "LOAD", null, function (that, data, a, m) {
        for (let i = 0; i < data.HOTS.length; i++) {
          data.HOTS[i].url = app.globalData.bseurl + data.HOTS[i].INFO_IMG_URL
        }
        that.setData({
          chapters: data.CHAPTER,
          HOTS: data.HOTS,
          M: m,
          height: SysInfo.windowHeight
        })
        wx.setStorageSync('CHAPTER_HEAD_LIST', data.CHAPTER);//缓存
      });
    }
  },
  onPullDownRefresh: function () {
    util.Post(this, "LOAD", null, function (that, data, a, m) {
      that.setData({
        chapters: data.CHAPTER,
        M: m
      })
      wx.setStorageSync('CHAPTER_HEAD_LIST', data.CHAPTER);//缓存
    });
    wx.stopPullDownRefresh()
  },
  navtoacive: function (e) {
    let id = e.currentTarget.dataset.id
    let txt = e.currentTarget.dataset.txt
    let url = e.currentTarget.dataset.url
    if (id) {
      wx.navigateTo({
        url: '../focus/focusItem?id=' + id + '&txt=' + txt + '&url=' + url,
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: "轻松事考",
      desc: '选择轻松事考！事业成功！',
      path: '/pages/index/index'
    }
  }
})
