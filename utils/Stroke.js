var Stroke = {
    init: function(canvasId) {
        this.canvasId = canvasId;
        this.points = [];
        return this;
    },
    start: function(e) {
        this.startTime = e.timeStamp;
        this.points = [];
        this._draw(e);
    },
    move: function(e) {
        this._draw(e);
    },
    end: function(e) {
        this.points = []
    },
    _eToX: function(e) {
        return e.touches[0].pageX || e.touches[0].x
    },
    _eToY: function(e) {
        return e.touches[0].pageY - 50 || e.touches[0].y - 50
    },
    _draw: function(e) {
        var x = this._eToX(e);
        var y = this._eToY(e);
        if (this.points.length > 0) {
            var lastX = this._eToX(this.points[this.points.length - 1])
            var lastY = this._eToY(this.points[this.points.length - 1])
        } else {
            var lastX = x; var lastY = y;
        }

        if (e.timeStamp - this.startTime < 1000) {
            return
        }
        var context = wx.createContext()
        context.setStrokeStyle("#888888")
        context.setLineWidth(4)
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.stroke()
        
        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: true,
            actions: context.getActions() // 获取绘图动作数组
        })
        this.points.push(e);
    }
}
module.exports = {
    initBuilder: function(canvasId) {
        return Stroke.init(canvasId);
    }
}