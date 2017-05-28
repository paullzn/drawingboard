var __instance = null

export class Server {
    constructor() {
        this.host = 'http://localhost:8219/api/v1/'
    }

    static getInstance() {
        if (!__instance) {
            __instance = new Server()
        }
        return __instance
    }

    request(req) {
        var app = getApp()
        var clientSuccessCallback = req.success;
        var clientFailureCallback = req.fail;
        var that = this;
        if (!app.globalData.user) {
            app.globalData.user = wx.getStorageSync('user');
        }
        if (app.globalData.user) {
            req.header = {'loginsession': app.globalData.user.token}
        }

        function successCallback(res) {
            if (res.statusCode == 403) {
                that.login(function () {
                    that.request(req)
                },
                function () {
                    console.log('login failed, cannot making request to ' + req.url)
                })
            } else if (res.statusCode == 200 || res.statusCode == 400) {
                clientSuccessCallback(res);
            } else {
                console.log('request failed for status: ' + res.statusCode)
            }
        }
        function failureCallback(res) {
            console.log('request failed with ' + res.statusCode + ' ' + res.data)
        }
        req.success = successCallback;
        req.fail = failureCallback;
        wx.request(req);
    }

    login(successCallback, failCallback) {
        var app = getApp()
        var that = this  
        var user = wx.getStorageSync('user') || {};
        console.log('try login..')
        wx.login({
            success: function(res) {
                if(res.code) {
                    wx.request({
                        url: that.host + 'account/login?type=wechat-liteapp&msg=' + res.code,   
                        data: {},
                        method: 'POST',
                        success: function(res){
                            if (res.statusCode == 200) {
                                var obj = {}
                                obj.id = res.data.id
                                obj.username = res.data.username
                                obj.token = res.data.token
                                console.log(obj);
                                wx.setStorageSync('user', obj); // 存储openid
                                app.globalData.user = obj
                                successCallback()
                            } else {
                                console.log('获取用户登录态失败！' + res.statusCode)
                                console.log(res.data)
                                failCallback()
                            }
                        },
                        fail: function(res) {
                            console.log('获取用户登录态失败！' + res.statusCode)
                            console.log(res.data)
                            failCallback()
                        }
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                    failCallback()
                }
            }
        });
    }

    gen_artwork_id() {
        return '';
    }

    put_artwork(artwork_id, image) {

    }

    get_artwork(artwork_id, receiver, successCallback, failureCallback) {
        var that = this
        var data = {}
        if (artwork_id) {
            var data = {
                artwork_id: artwork_id
            }
        }
        this.request({url: that.host + 'artwork', data: data, method: 'GET',
            success: function(res) {
                successCallback(res.statusCode, res.data)
            },
            fail: function(res) {
                failureCallback(res.statusCode, res.data)
            }
        })
    }

    test() {
        this.get_artwork("1493740570,dcaa1a99-0e86-4edb-b993-9c631aafe8c2",
            null,
            function successCallback(status, data) {
                console.log("success")
                console.log(status, data)
            },
            function failureCallback(status, data) {
                console.log("failure")
                console.log(status, data)
            }
        )
    }
}