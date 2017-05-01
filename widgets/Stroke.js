import {Widget} from 'Widget'
import { Utils } from '../utils/utils'
export class Stroke extends Widget {
    constructor(canvasId) {
        super()
        this.canvasId = canvasId;
        this.points = [];
    }

    checkHitArea() {
        return true
    }
    ontouchstart(e) {
        this.startTime = e.timeStamp;
        this.points = [];
        this._draw(e);
        return true
    }
    ontouchmove(e) {
        this._draw(e);
        return true
    }
    ontouchend(e) {
        this.points = []
        return true
    }
    _draw(e) {
        let point = Utils.getXYFromEvent(e)
        point.y -= 50
        if (this.points.length > 0) {
            var lastPoint = this.points[this.points.length - 1]
        } else {
            var lastPoint = point;
        }

        if (e.timeStamp - this.startTime < 1000) {
            return
        }
        var context = wx.createContext()
        context.setStrokeStyle("#888888")
        context.setLineWidth(4)
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(point.x, point.y);
        context.stroke()
        
        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: true,
            actions: context.getActions() // 获取绘图动作数组
        })
        this.points.push(point);
    }
}
