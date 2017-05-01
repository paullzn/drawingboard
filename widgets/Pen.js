import { Widget } from 'Widget'
import { Utils } from '../utils/utils'
export class Pen extends Widget {
    constructor(canvasId) {
        super()
        this.canvasId = canvasId;
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
    _draw(e) {
        let point = Utils.getXYFromEvent(e)
        point.y -= 50

        var context = wx.createContext()
        if (e.timeStamp - this.startTime > 1000) {
            context.setStrokeStyle("#888888")    
        } else {
            context.setStrokeStyle("#ff0000")

        }
        
        context.setLineWidth(4)
        context.arc(point.x, point.y, 5, 0, 2 * Math.PI, true)      
        context.stroke()
        
        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: false,
            actions: context.getActions() // 获取绘图动作数组
        })
    }
}
