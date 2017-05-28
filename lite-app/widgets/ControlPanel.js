import {Widget} from 'Widget'
import {EraserButton} from 'EraserButton'
import {PenButton} from 'PenButton'
import {ResetButton} from 'ResetButton'
import {Utils} from '../utils/utils'

import {EventRegistry} from '../utils/EventRegistry'

export class ControlPanel extends Widget {
    constructor(canvasId) {
        super()
        this.canvasId = canvasId;
        this.isOpen = false;
        this.eventList.push(...['ontouchstart', 'ontouchend'])

        this.addChild('resetButton', new ResetButton())
        this.addChild('penButton', new PenButton())
        this.addChild('eraserButton', new EraserButton())

        this.x = 10
        this.y = 468
        this.width = 300
        this.height = 82
        this.mainCenterX = 50
        this.mainCenterY = 510
        this.mainCenterR = 30
    }

    checkHitArea(point) {
        if (!this.isOpen) {
            if (Utils.dis(point.x, point.y, this.mainCenterX, this.mainCenterY) <
                this.mainCenterR) {
                return true
            } else {
                return false
            }
        } else {
            if (point.x >= this.x && point.x <= this.x + this.width &&
                point.y >= this.y && point.y <= this.y + this.height) {
                return true
            } else {
                return false
            }
        }
        
    }
    ontouchend(e) {
        this.isOpen = !this.isOpen
        EventRegistry.getInstance().trigger(({controlPanelOpen: this.isOpen, changedTouches: e.changedTouches}, 'controlpanelchange'))
        this.draw()
    }
    _eToX(e) {
        return e.touches[0].pageX || e.touches[0].x
    }
    _eToY(e) {
        return e.touches[0].pageY - 50 || e.touches[0].y - 50
    }
    _drawMainButton(ctx) {
        ctx.setFillStyle("#FFCD00")
        ctx.setStrokeStyle("#ddab00")
        ctx.setLineWidth(1)
        ctx.arc(this.mainCenterX, this.mainCenterY, this.mainCenterR, 0, 2 * Math.PI, true)
        ctx.fill();
        ctx.stroke();
    }
    _drawPanel(ctx) {
        ctx.setFillStyle('#efefef')
        ctx.setStrokeStyle('#efefef')
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
        this.drawChildActions('penButton', ctx)
        this.drawChildActions('eraserButton', ctx)
        this.drawChildActions('resetButton', ctx)
    }
    draw() {
        var ctx = wx.createContext()
        this._drawMainButton(ctx);
        if (this.isOpen) {
            this._drawPanel(ctx)
            this.showChildren()
        } else {
            this.hideChildren()
        }

        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: false,
            actions: ctx.getActions() // 获取绘图动作数组
        })
    }
}