//index.js
//获取应用实例
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    PAGE: "INDEX",
    userInfo: {},
    background: [{
      id: "item-1",
      url: "https://www.yondo.cc/wxapp/images/102.png"
    }, {
      id: "item-2",
      url: "https://www.yondo.cc/wxapp/images/101.png"
    }],
    delItems: [{
      img: "../../image/index-img/5.png",
      txt: "招考公告",
      url: "real"
    }, {
      img: "../../image/index-img/7.png",
      txt: "时事政治",
      url: "real"
    }],
    showItems: [{
      img: "../../image/index-img/1.png",
      txt: "章节练习",
      url: "real"
    }, {
      img: "../../image/index-img/2.png",
      txt: "在线刷题",
      url: "real"
    }, {
      img: "../../image/index-img/3.png",
      txt: "历年真题",
      url: "real"
    }, {
      img: "../../image/index-img/4.png",
      txt: "模拟考试",
      url: "real"
    }, {
      img: "../../image/index-img/6.png",
      txt: "电子资料",
      url: "real"
    }, {
      img: "../../image/index-img/8.png",
      txt: "高频考题",
      url: "real"
    }, {
      img: "../../image/index-img/9.png",
      txt: "高频错题",
      url: "real"
    }, {
      img: "../../image/index-img/10.png",
      txt: "我的错题",
      url: "real"
    }]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //  util.Post(this, "LOAD", null, function (that, data) {
    //    console.log(data)
    //  });
  }
  , load: function (e) {
    util.Post(this, "LOAD", null, function (that, data) {
      console.log(data)
    });
  }
})
