//index.js
//获取应用实例
import { Stroke } from '../../widgets/Stroke'
import { Pen } from '../../widgets/Pen'
import { ControlPanel } from '../../widgets/ControlPanel'
import { EventRegistry } from '../../utils/EventRegistry'

let stroke = new Stroke('baseCanvas')
let pen = new Pen('pen')
let controlPanel = new ControlPanel('controlPanel')
let eventRegistry = new EventRegistry('controlPanel')

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
    eventRegistry.setListener(controlPanel, ['ontouchstart', 'ontouchend'])
    eventRegistry.setListener(pen, ['ontouchstart', 'ontouchmove', 'ontouchend'])
    eventRegistry.setListener(stroke, ['ontouchstart', 'ontouchmove', 'ontouchend'])
  },
  onReady: function(e) {
  },
  cvsTouchStart: function(e) {
    eventRegistry.ontouchstart(e);
  },
  cvsTouchEnd: function(e) {
    eventRegistry.ontouchend(e);
  },
  cvsTouchMove: function(e) {
    eventRegistry.ontouchmove(e);
  },
  cvsTouchCancel: function(e) {
    eventRegistry.ontouchcancel(e);
  }
})
