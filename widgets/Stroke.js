import {Widget} from 'Widget'
import { Utils } from '../utils/utils'
export class Stroke extends Widget {
    constructor(canvasId) {
        super()
        this.canvasId = canvasId;
        this.points = [];
        this.eventList.push(...['ontouchstart', 'ontouchend', 'ontouchmove', 'pentypechange'])
        this.penType = 'pen'

        this.strokeColor = '#888888'
        this.canvasColor = '#ffffff'
        this.lineWidth = 3
        this.eraserWidth = 60
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
    pentypechange(e) {
        console.log('PenTypeChange!!!!')
        console.log(e)
        this.penType = e.penType
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
        context.setLineCap('round')
        context.setLineJoin('round')
        let color = this.strokeColor
        let lineWidth = this.lineWidth
        if (this.penType != 'pen') {
            color = this.canvasColor
            lineWidth = this.eraserWidth
        }

        context.setStrokeStyle(color)
        context.setLineWidth(lineWidth)
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
