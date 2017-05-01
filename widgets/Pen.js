import { Widget } from 'Widget'
import { Utils } from '../utils/utils'
export class Pen extends Widget {
    constructor(canvasId) {
        super()
        this.canvasId = canvasId;
        this.eventList.push(...['ontouchstart', 'ontouchend', 'ontouchmove', 'pentypechange'])

        this.prepareColor = '#ff0000'
        this.actionColor = '#888888'

        this.drawR = 5
        this.cleanR = 30

        this.drawLineWidth = 4
        this.cleanLineWidth = 1

        this.penType = 'pen'
    }

    checkHitArea() {
        return true
    }

    ontouchstart(e) {
        console.log(e)
        this.startTime = e.timeStamp
        this._draw(e)
        return true
    }
    ontouchmove(e) {
        this._draw(e);
        return true
    }
    ontouchend(e) {
        this.startTime = e.timeStamp;
        this._draw(e);
        return true
    }

    pentypechange(e) {
        this.penType = e.penType
        this._clean()
        return true
    }

    _clean() {
        let context = wx.createContext()
        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: false,
            actions: []
        })
    }

    _draw(e) {
        let point = Utils.getXYFromEvent(e)
        point.y -= 50

        let context = wx.createContext()
        let radius = this.drawR
        let strokeStyle = this.prepareColor
        let lineWidth = this.drawLineWidth

        if (e.timeStamp - this.startTime > 1000) {
            strokeStyle = this.actionColor
        }

        if (this.penType != 'pen') {
            radius = this.cleanR
            lineWidth = this.cleanLineWidth
        }
        
        context.setStrokeStyle(strokeStyle)
        context.setLineWidth(lineWidth)
        context.arc(point.x, point.y, radius, 0, 2 * Math.PI, true)      
        context.stroke()
        
        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: false,
            actions: context.getActions() // 获取绘图动作数组
        })
    }
}
