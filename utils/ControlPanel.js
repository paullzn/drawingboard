var ControlPanel = {
    init: function(canvasId) {
        this.canvasId = canvasId;
        this.isShow = false;
        return this;
    },
    start: function(e) {
        console.log(e);
    },
    end: function(e) {
    },
    _eToX: function(e) {
        return e.touches[0].pageX || e.touches[0].x
    },
    _eToY: function(e) {
        return e.touches[0].pageY - 50 || e.touches[0].y - 50
    },
    _drawMainButton: function(ctx) {
        ctx.setFillStyle("#FFCD00")
        ctx.setStrokeStyle("#ddab00")
        ctx.setLineWidth(1)
        ctx.arc(60, 500, 40, 0, 2 * Math.PI, true)
        ctx.fill();
        ctx.stroke();
    },
    _drawPanel: function(ctx) {
        ctx.setStrokeStyle('gray')
        ctx.rect(10, 250, 300, 300);
        ctx.stroke();
    },
    draw: function() {
        var ctx = wx.createContext()
        this._drawMainButton(ctx);
        if (this.isShow) {
            this._drawPanel(ctx)
        }

        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: false,
            actions: ctx.getActions() // 获取绘图动作数组
        })
    }



}

module.exports = {
    initBuilder: function(canvasId) {
        return ControlPanel.init(canvasId);
    }
}