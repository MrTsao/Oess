// servicelist.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: { avatarUrl: "/image/icon.png"},
    HEAD_IMG: "",
    PAGE: "PROFILE",
    items: [{
      txt: "个人资料",
      color: "#3CB371",
      img: "/image/user.png",
      url: "/pages/profile/profile",
      spilted: true
    },{
      txt: "我的余额",
      color: "#cd853f",
      img: "/image/doller.png",
      url: "/pages/profile/profile"
    },{
      txt: "我的收藏",
      color: "#BDB76B",
      img: "/image/Reading.png",
      url: "/",
      spilted:true
    }, {
      txt: "报考地区",
      color: "#8FBC8F",
      img: "/image/location.png",
      url: "/",
      spilted: true
    }, {
      txt: "练习科目",
      color: "#778899",
      img: "/image/class.png",
      url: "/"
    }, {
      txt: "推荐给朋友",
      color: "#008B8B",
      img: "/image/share.png",
      url: "/"
    }],
    info: [{ RATE: '-', DT: '-', US: '-' }],
    week: 0,
    COLOR: ['#6699cc', '#BC8F8F', '#778899', '#5F9EA0', '#51AD8F', '#81B281', '#A8A35D']
  },
  onLoad: function (options) {
    var that = this
    let dt = new Date()
    //调用应用实例的方法获取全局数据
    app.getUserInfo(null, function (user) {
      that.setData({
        userInfo: user
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
  }
})

//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  util.Post(that, action, data, function (that,res) {
    if (res) {
      //回调
      typeof doAfter == "function" && doAfter(that, res)
    }
    else {
      // console.log('error')
    }
  })
}