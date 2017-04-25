var Pen = {
    init: function(canvasId) {
        this.canvasId = canvasId;
        return this;
    },
    start: function(e) {
        console.log(e);
        this.startTime = e.timeStamp;
        this._draw(e);
    },
    move: function(e) {
        this._draw(e);
    },
    end: function(e) {
        this.startTime = e.timeStamp;
        this._draw(e);
    },
    _eToX: function(e) {
        return e.touches[0].pageX || e.touches[0].x
    },
    _eToY: function(e) {
        return e.touches[0].pageY - 50 || e.touches[0].y - 50
    },
    _draw: function(e) {
        console.log(e);
        console.log(this.points);
        var x = this._eToX(e);
        var y = this._eToY(e);

        var context = wx.createContext()
        if (e.timeStamp - this.startTime > 1000) {
            context.setStrokeStyle("#888888")    
        } else {
            context.setStrokeStyle("#ff0000")

        }
        
        context.setLineWidth(4)
        context.arc(x, y, 5, 0, 2 * Math.PI, true)      
        context.stroke()
        
        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: false,
            actions: context.getActions() // 获取绘图动作数组
        })
    }



}

module.exports = {
    initBuilder: function(canvasId) {
        return Pen.init(canvasId);
    }
}