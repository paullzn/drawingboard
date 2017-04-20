//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    title: "手指涂鸦板",
    screenWidth: 0,
    screenHeight: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    wx.getSystemInfo({  
      success: function (res) {
        that.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        })
      }
    })
  },
  onReady: function(e) {
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createContext()

    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    context.moveTo(160, 100)
    context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    context.moveTo(140, 100)
    context.arc(100, 100, 40, 0, Math.PI, false)
    context.moveTo(85, 80)
    context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    context.moveTo(125, 80)
    context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    context.stroke()

    // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
    wx.drawCanvas({
      canvasId: 'target',
      actions: context.getActions() // 获取绘图动作数组
    })
  },
  cvsStart: function(e) {
    console.log("start:");
    console.log(e);
  },
  cvsEnd: function(e) {
    console.log("end:");
    console.log(e);
  },
  cvsMoveFake: function(e) {
    console.log("cvsMove fake")
    console.log(e)
    var x = e.touches[0].pageX || e.touches[0].x;
    var y = e.touches[0].pageY || e.touches[0].y;

    var context = wx.createContext()
    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.arc(x, y, 2, 0, 2 * Math.PI, true)
    context.stroke()
    
    wx.drawCanvas({
      canvasId: 'target',
      reserve: true,
      actions: context.getActions() // 获取绘图动作数组
    })
  },
  cvsCancel: function(e) {
    console.log("cancel:");
    console.log(e);
  }
})
