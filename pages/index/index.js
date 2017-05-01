//index.js
//获取应用实例
import { Stroke } from '../../widgets/Stroke'
import { Pen } from '../../widgets/Pen'
import { ControlPanel } from '../../widgets/ControlPanel'
import { EventRegistry } from '../../utils/EventRegistry'

let stroke = new Stroke('baseCanvas')
let pen = new Pen('pen')
let controlPanel = new ControlPanel('controlPanel')

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
    controlPanel.draw()
    EventRegistry.getInstance().setListener(controlPanel, ['ontouchstart', 'ontouchend'])
    EventRegistry.getInstance().setListener(pen, ['ontouchstart', 'ontouchmove', 'ontouchend'])
    EventRegistry.getInstance().setListener(stroke, ['ontouchstart', 'ontouchmove', 'ontouchend'])
  },
  onReady: function(e) {
  },
  cvsTouchStart: function(e) {
    EventRegistry.getInstance().ontouchstart(e);
  },
  cvsTouchEnd: function(e) {
    EventRegistry.getInstance().ontouchend(e);
  },
  cvsTouchMove: function(e) {
    EventRegistry.getInstance().ontouchmove(e);
  },
  cvsTouchCancel: function(e) {
    EventRegistry.getInstance().ontouchcancel(e);
  }
})
