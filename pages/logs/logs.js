//logs.js
import {Utils} from '../../utils/utils'
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return Utils.formatTime(new Date(log))
      })
    })
  }
})
