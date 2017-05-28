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

class IndexPage {
    constructor() {
        this.eventList = ['controlpanelchange']
        this.data = {
            motto: 'Hello World',
            userInfo: {},
            title: "手指涂鸦板",
            screenWidth: 0,
            screenHeight: 0,
            showControlPanel: false
        }
    }
    //事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    }
    onLoad() {
        console.log('onLoad')
        var that = this

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
        EventRegistry.getInstance().setListener(this)
    }
    controlpanelchange(e) {
        this.saveImage()
    }
    onReady(e) {
    }
    onUnload() {
        this.saveImage()
    }
    onHide() {
        this.saveImage()
    }
    cvsTouchStart(e) {
        EventRegistry.getInstance().ontouchstart(e);
    }
    cvsTouchEnd(e) {
        EventRegistry.getInstance().ontouchend(e);
    }
    cvsTouchMove(e) {
        EventRegistry.getInstance().ontouchmove(e);
    }
    cvsTouchCancel(e) {
        EventRegistry.getInstance().ontouchcancel(e);
    }
}

var page = new IndexPage()
console.log('>>>>>>>>>>')
console.log(page.cvsTouchStart)
Page(new IndexPage())