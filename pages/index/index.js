//index.js
//获取应用实例
var stroke = require('../../utils/Stroke.js')
var strokeBuilder = stroke.initBuilder('baseCanvas');

var pen = require('../../utils/Pen.js')
var penBuilder = pen.initBuilder('pen');

var controlPanel = require('../../utils/ControlPanel.js')
var controlPanelBuilder = controlPanel.initBuilder('controlPanel');

var eventRegistryModule = require('../../utils/EventRegistry.js')
var EventRegistry = eventRegistryModule.initBuilder('controlPanel');

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    title: "手指涂鸦板",
    screenWidth: 0,
    screenHeight: 0,
    showControlPanel: false
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
    controlPanelBuilder.draw()
    EventRegistry.setListender(penBuilder, ['start', 'move', 'end', 'cancel'],
        [
            penBuilder.start,
            penBuilder.move,
            penBuilder.end,
            penBuilder.cancel])
    EventRegistry.setListender(strokeBuilder, ['start', 'move', 'end', 'cancel'], [strokeBuilder.start, strokeBuilder.move, strokeBuilder.end, strokeBuilder.cancel])
  },
  onReady: function(e) {
  },
  cvsStart: function(e) {
    EventRegistry.start(e);
    //strokeBuilder.start(e);
    //penBuilder.start(e);
    //controlPanelBuilder.start(e);
  },
  cvsEnd: function(e) {
    EventRegistry.end(e);
    //strokeBuilder.end(e);
    //penBuilder.end(e);
    //controlPanelBuilder.tap(e);
  },
  cvsMove: function(e) {
    EventRegistry.move(e);
    //strokeBuilder.move(e);
    //penBuilder.move(e);
  },
  cvsCancel: function(e) {
    EventRegistry.cancel(e);
  }
})
