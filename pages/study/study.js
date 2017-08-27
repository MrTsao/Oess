// pages/study/study.js
var app = getApp();
Page({
  data: {
    headinfo: {},
    Items: [
      [{
        id: "t1",
        open: false,
        bkImg: "../../image/Trademark.png",
        selectBkImg: "../../image/Trademark.png",
        text: "历年真题",
        page: "real"
      },{
        id: "t2",
        open: false,
        bkImg: "../../image/SheriffSelected.png",
        selectBkImg: "../../image/SheriffSelected.png",
        text: "随机练习",
        page: "random"
      }, {
        id: "t3",
        open: false,
        bkImg: "../../image/real.png",
        selectBkImg: "../../image/real.png",
        text: "全真模拟",
        page: "realsimulate"
      }], [{
        id: "t4",
        open: false,
        bkImg: "../../image/External.png",
        selectBkImg: "../../image/External.png",
        text: "专项训练",
        page: "special"
      }]
    ]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //调用应用实例的方法获取全局数据
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        headinfo: {
          score: 88,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          province: userInfo.province,
          city: userInfo.city
        }
      })
    })
  },
  selectedTap: function (e) {
    var id = e.currentTarget.id, list = this.data.Items;
    for (var i = 0, len = list.length; i < len; ++i) {
      var subList = list[i];
      for (var j = 0, jLen = subList.length; j < jLen; ++j) {
        if (subList[j].id != id) {
          subList[j].open = false
        } else {
          subList[j].open = true
        }
      }
    }
    this.setData({
      Items: list
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})