// servicelist.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: { avatarUrl: "/image/icon.png" },
    HEAD_IMG: "",
    PAGE: "PROFILE",
    region: {
      region: ['重庆市', '全部', '全部'],
      eclass: ["综合基础知识", "管理基础知识", "教育公共基础知识", "综合基础教育类"]
    },
    ucid: '',
    customItem: '全部',
    items: [{
      id: "profile",
      txt: "个人资料",
      color: "#3CB371",
      img: "/image/user.png",
      ty: "url",
      url: "/pages/services/profile",
      spilted: true
    }, {
      id: "account",
      txt: "我的积分",
      color: "#cd853f",
      img: "/image/doller.png",
      ty: "txt",
      val: "USER_SCORE"
    }, {
      id: "collections",
      txt: "我的收藏",
      color: "#BDB76B",
      img: "/image/Reading.png",
      ty: "url",
      url: "/pages/services/collections",
      val: "COLL",
      spilted: true
    }, {
      id: "locations",
      txt: "报考地区",
      color: "#8FBC8F",
      img: "/image/location.png",
      ty: "pick",
      op: [{
        mode: "region",
        bindchange: "bindRegionChange",
        value: "region"
      }],
      val: "REGION",
      spilted: true
    }, {
      id: "class",
      txt: "练习科目",
      color: "#778899",
      img: "/image/class.png",
      ty: "pick",
      op: [{
        mode: "selector",
        bindchange: "bindClassChange",
        value: "eclass"
      }],
      val: "EXAM_CLASS"
    }, {
      id: "command",
      txt: "推荐给朋友",
      color: "#008B8B",
      img: "/image/share.png",
      ty: "url",
      url: "/pages/services/recommend",
      val: "RECOMM"
    }],
    info: [{ RATE: '-', DT: '-', US: '-' }],
    week: 0,
    COLOR: ['#6699cc', '#BC8F8F', '#778899', '#5F9EA0', '#51AD8F', '#81B281', '#A8A35D']
  },
  navtourl: function (e) {
    let url = e.currentTarget.dataset.url
    let user = this.data.info[0].USER_CDE
    if (url != "" && user && user != "") {
      wx.navigateTo({
        url: url + "?urid=" + user,
      })
    }
  },
  bindRegionChange: function (e) {
    let info = this.data.info
    info[0].REGION = e.detail.value.join("-")
    this.setData({
      info: info
    })
    var jsPost = new util.jsonRow()
    jsPost.AddCell("REGION", info[0].REGION)
    util.Post(this, "UPDATE-REGION", jsPost)
  },
  bindClassChange: function (e) {
    let info = this.data.info
    if (info[0].EXAM_CLASS != this.data.region.eclass[e.detail.value].id) {
      info[0].EXAM_CLASS = this.data.region.eclass[e.detail.value].id
      this.setData({
        info: info
      })
      wx.setStorageSync('_UCID', this.data.region.eclass[e.detail.value].id);//缓存
      var jsPost = new util.jsonRow()
      jsPost.AddCell("CLASS", this.data.region.eclass[e.detail.value].id)
      util.Post(this, "UPDATE-CLASS", jsPost)
    }
  },
  onLoad: function (options) {
    var that = this
    let dt = new Date()
    var classcatch = wx.getStorageSync('CLASS_HEAD_LIST') || [];
    let region = that.data.region
    region.eclass = classcatch
    var ucid = wx.getStorageSync('_UCID') || "RID0H9201TY701D8";
    //调用应用实例的方法获取全局数据
    app.getUserInfo(null, function (user) {
      that.setData({
        userInfo: user,
        region: region,
        ucid: ucid
      })
    })
    Post.call(this, this, "LOAD", null, function (that, data) {
      if (data.info.length > 0) {
        data.info[0].US = util.formatString(data.info[0].US)
      }
      that.setData({
        info: data.info,
        week: dt.getDay()
      })
    });
  },
  onPullDownRefresh: function () {
    Post.call(this, this, "LOAD", null, function (that, data) {
      if (data.info.length > 0) {
        data.info[0].US = util.formatString(data.info[0].US)
      }
      let dt = new Date()
      that.setData({
        info: data.info,
        week: dt.getDay()
      })
      wx.stopPullDownRefresh()
    });
  },
  onShow() {
    var ucid = wx.getStorageSync('_UCID') || "RID0H9201TY701D8";
    let info = this.data.info
    if (info[0].EXAM_CLASS != ucid) {
      info[0].EXAM_CLASS = ucid
      this.setData({
        info: info
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
    else {
      // console.log('error')
    }
  })
}