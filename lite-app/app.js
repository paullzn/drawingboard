//app.js

import {Server} from 'backends/Server'

App({

  onLaunch: function() {  
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      setTimeout(function() {
          //Server.getInstance().test()
      }, 1)
  },
  globalData: {
    user: null
  }
})
