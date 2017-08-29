
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatString(n) {
  var leave = n % (12 * 30 * 24 * 3600)
  var months = Math.floor(leave / (30 * 24 * 3600))
  // //计算出相差天数
  var leave0 = leave % (30 * 24 * 3600)
  var days = Math.floor(leave0 / (24 * 3600))
  // //计算出小时数
  var leave1 = leave0 % (24 * 3600)     //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600))
  // //计算相差分钟数
  var leave2 = leave1 % (3600)         //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60))
  // //计算相差秒数
  var leave3 = leave2 % (60)    //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3)
  var strFormat = ""
  if (months > 0) { strFormat += formatNumber(months) + "个月" }
  if (days > 0) { strFormat += formatNumber(days) + "天" }
  if (hours > 0) { strFormat += formatNumber(hours) + "小时" }
  if (minutes > 0) { strFormat += formatNumber(minutes) + "分" }
  if (seconds > 0) { strFormat += formatNumber(seconds) + "秒" }
  if (strFormat == "") { strFormat = "0秒" }
  return strFormat
}

function formatTimeString(n) {
  var leave = n % (12 * 30 * 24 * 3600)
  var months = Math.floor(leave / (30 * 24 * 3600))
  // //计算出相差天数
  var leave0 = leave % (30 * 24 * 3600)
  var days = Math.floor(leave0 / (24 * 3600))
  // //计算出小时数
  var leave1 = leave0 % (24 * 3600)     //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600))
  // //计算相差分钟数
  var leave2 = leave1 % (3600)         //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60))
  // //计算相差秒数
  var leave3 = leave2 % (60)    //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3)
  var strFormat = ""
  if (months > 0) { strFormat = months.toString() + "个月前" }
  else if (days > 0) { strFormat = days.toString() + "天前" }
  else if (hours > 0) { strFormat = hours.toString() + "小时前" }
  else if (minutes > 0) { strFormat = minutes.toString() + "分钟前" }
  else if (seconds > 0 || strFormat == "") { strFormat = "刚刚" }
  return strFormat
}

function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽 
  var originalHeight = e.detail.height;//图片原始高 
  var originalScale = originalHeight / originalWidth;//图片高宽比 
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高 
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比 
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比 
        //图片缩放后的宽为屏幕宽 
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else {//图片高宽比大于屏幕高宽比 
        //图片缩放后的高为屏幕高 
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }

    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}

/**
* url 请求地址
* success 成功的回调
* fail 失败的回调
*/
function _post_json(url, jsPost, success, fail) {
  let app = getApp();
  wx.showNavigationBarLoading()
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
      'Cookie': 'ASP.NET_SessionId=' + app.globalData.openData.SESSION_ID
    },
    method: 'POST',
    data: jsPost.GetStr(),
    success: function (res) {
      //wx.hideToast()
      wx.hideNavigationBarLoading()
      if (res.data.msg == "err") {
        console.log(res.data.data);
      } else {
        if (res.data.msg != "") {
          if (res.data.msg == "NO_SESSION") {
            wx.setStorageSync('openkey', null);
            app.getUserInfo();
          } else {
            wx.showToast({
              title: res.data.msg || "错误"
            })
          }
        }
        success(res);
      }
    },
    fail: function (res) {
      console.log(res);
    }
  });
  //console.log("----end----_post-----");
}

function jsonRow() { this.arrjson = {}; }
jsonRow.prototype = {
  AddCell: function (sName, sValue) {
    if (!sName) return; this.arrjson[sName] = sValue;
  },
  GetStr: function () {
    var _strjson = "";
    for (var m in this.arrjson) {
      if (_strjson == "") { _strjson = "\"" + m + "\":\"" + this.arrjson[m] + "\""; } else { _strjson += ",\"" + m + "\":\"" + encodeURIComponent(this.arrjson[m]) + "\""; }
    }
    if (_strjson == "") return ""; else return "{" + _strjson + "}";
  }
};

//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  var app = getApp();
  app.getOpenInfo(function () {
    var jsPost = data || new jsonRow()
    var ppage = that.data.PAGE || "BseHandler"
    jsPost.AddCell("PAGE", ppage)
    jsPost.AddCell("ACTION", action)
    jsPost.AddCell("OPEN_KEY", app.globalData.openData.OPEN_KEY)
    _post_json(app.globalData.url, jsPost, function (res) {
      typeof doAfter == "function" && doAfter(that, res.data.data)
    })
  })
}

function _getOpenId(url, rescode, doAfter) {
  var jsPost = new jsonRow()
  jsPost.AddCell("PAGE", "BseHandler")
  jsPost.AddCell("ACTION", "OPENID")
  jsPost.AddCell("CODE", rescode)
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: 'POST',
    data: jsPost.GetStr(),
    success: function (res) {
      if (res.data.msg == "err") {
        console.log(res.data.data);
      } else {
        typeof doAfter == "function" && doAfter(res.data)
      }
    },
    fail: function (res) {
      console.log(res);
    }
  });
}

module.exports = {
  formatTime: formatTime,
  formatTimeString: formatTimeString,
  formatString: formatString,
  imageUtil: imageUtil,
  Post: Post,
  jsonRow: jsonRow,
  getOpenId: _getOpenId
}
