// pages/trade/member.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "GOODS",
    M: '',
    tp: 'MR',
    goods: [],
    yearList: ["全部"],
    region: ['重庆市', '全部', '全部'],
    customItem: '全部',
    date: 0,
    TTL_AMT: 0,
    selecteditems: [],
    allchecked: false
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.Post(this, "LOAD", null, function (that, data, a, m) {
      var yearList = that.data.yearList
      for (var i = 0; i < data.goods.length; i++) {
        if (data.goods[i].IN_YEAR && yearList.indexOf(data.goods[i].IN_YEAR) == -1) {
          yearList.push(data.goods[i].IN_YEAR)
        }
      }
      that.setData({
        goods: data.goods,
        M: m,
        tp: options.tp || "MR",
        yearList: yearList
      })
    });
  },
  purchmember: function (e) {
    let id = e.currentTarget.dataset.id;
    var jsPost = new util.jsonRow()
    jsPost.AddCell("ID", id)
    util.Post(this, "PMEMBER", jsPost, function (that, data) {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: function (res) {
          wx.showToast({
            title: '支付成功!',
          })
          wx.navigateBack({
            delta: 1
          })
        },
        fail: function (res) {
          wx.showModal({
            title: '支付失败',
            content: res.errMsg,
          })
        },
        complete: function (res) {
          console.log(res)
        }
      })
    })
  },
  startTrade: function (e) {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("ID", this.data.selecteditems.join(","))
    util.Post(this, "PMEMBER", jsPost, function (that, data) {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: function (res) {
          wx.showToast({
            title: '支付成功!',
          })
          wx.redirectTo({
            url:'member'
          })
        },
        fail: function (res) {
          wx.showModal({
            title: '支付失败',
            content: res.errMsg,
          })
        },
        complete: function (res) {
          console.log(res)
        }
      })
    })
  },
  buygoods: function (e) {
    this.setData({
      tp: e.currentTarget.dataset.type
    })
  },
  selected: function (e) {
    let selectedid = e.detail.value;
    let selecteditems = this.data.selecteditems;
    let goods = this.data.goods;
    let year = this.data.yearList[this.data.date];
    let region = this.data.region;
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].GOODS_TYPE == 'PP' && (year == '全部' || goods[i].IN_YEAR == year) && (region[0] == '全部' || goods[i].PLACE_CDE == region[0]) && (region[2] == '全部' || goods[i].STATION_CDE == region[2])) {
        if (selectedid.includes(goods[i].GOODS_ID)) {
          if (!selecteditems.includes(goods[i].GOODS_ID)) {
            selecteditems.push(goods[i].GOODS_ID)
          }
        } else {
          if (selecteditems.includes(goods[i].GOODS_ID)) {
            selecteditems.splice(selecteditems.indexOf(goods[i].GOODS_ID), 1)
          }
        }
      }
    }
    var ttl = 0;
    for (var i = 0; i < goods.length; i++) {
      if (selecteditems.includes(goods[i].GOODS_ID)) {
        goods[i].check = true;
        ttl += goods[i].GOODS_AMT;
      } else {
        goods[i].check = false;
      }
    }

    this.setData({
      selecteditems: selecteditems,
      goods: goods,
      TTL_AMT: ttl
    })
  },
  selectadd: function (e) {
    let allchecked = !this.data.allchecked;
    let selecteditems = this.data.selecteditems;
    let goods = this.data.goods;
    let year = this.data.yearList[this.data.date];
    let region = this.data.region;
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].GOODS_TYPE == 'PP' && (year == '全部' || goods[i].IN_YEAR == year) && (region[0] == '全部' || goods[i].PLACE_CDE == region[0]) && (region[2] == '全部' || goods[i].STATION_CDE == region[2])) {
        if (!selecteditems.includes(goods[i].GOODS_ID) && allchecked) {
          selecteditems.push(goods[i].GOODS_ID)
        } else {
          if (selecteditems.includes(goods[i].GOODS_ID)) {
            selecteditems.splice(selecteditems.indexOf(goods[i].GOODS_ID), 1)
          }
        }
      }
    }
    var ttl = 0;
    for (var i = 0; i < goods.length; i++) {
      if (selecteditems.includes(goods[i].GOODS_ID)) {
        goods[i].check = true;
        ttl += goods[i].GOODS_AMT;
      } else {
        goods[i].check = false;
      }
    }
    this.setData({
      selecteditems: selecteditems,
      goods: goods,
      TTL_AMT: ttl,
      allchecked: allchecked
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
    util.Post(this, "LOAD", null, function (that, data, a, m) {
      var yearList = that.data.yearList
      for (var i = 0; i < data.goods.length; i++) {
        if (data.goods[i].IN_YEAR && yearList.indexOf(data.goods[i].IN_YEAR) == -1) {
          yearList.push(data.goods[i].IN_YEAR)
        }
      }
      that.setData({
        goods: data.goods,
        yearList: yearList
      })
      wx.stopPullDownRefresh()
    });
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