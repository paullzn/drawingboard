//profile.js

import { Server } from '../../backends/Server'

var app = getApp()
Page({
    data: {
        currentTab: 0,
        screenWidth: 0,
        screenHeight: 0,
        orgedArtworks: [[]]
    },
    _render: function(artworks) {
        let orgedArtworks = [[]]
        let row_index = 0
        let i = 0
        while (i < artworks.length) {
            orgedArtworks[row_index].push(artworks[i])
            if (orgedArtworks[row_index].length >= 3) {
                ++row_index
            }
            ++i
        }
        console.log(orgedArtworks)
        this.setData({
            orgedArtworks: orgedArtworks
        })
        
    },
    onLoad: function() {
        var that = this;
        wx.getSystemInfo({  
            success: function (res) {
                that.setData({
                    screenWidth: res.windowWidth,
                    screenHeight: res.windowHeight
                })
            }
        })

        Server.getInstance().get_artwork(null,
            that,
            function (status, data) {
                that._render(data.artworks)
            },
            function (status, data) {

            }
        )
    }
}) 