import {Widget} from 'Widget'
import {Utils} from '../utils/utils'
export class ControlPanel extends Widget {
    constructor(canvasId) {
        super()
        this.canvasId = canvasId;
        this.isOpen = false;

        this.x = 10
        this.y = 450
        this.width = 300
        this.height = 100
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
    _drawEraserButton(ctx) {
        ctx.setStrokeStyle('gray')
        ctx.rect(170, 485, 50, 50)
        ctx.rect(185, 500, 20, 20)
        ctx.stroke();
    }
    _drawResetButton(ctx) {
        ctx.setStrokeStyle('gray')
        ctx.rect(240, 485, 50, 50)
        ctx.moveTo(265, 510)
        ctx.arc(265, 510, 15, Math.PI / 4, Math.PI / 4 * 3, true)
        ctx.stroke();
    }
    _drawPenButton(ctx) {
        ctx.setStrokeStyle('gray')
        ctx.rect(100, 485, 50, 50)
        ctx.moveTo(125, 490);
        ctx.lineTo(115, 510);
        ctx.lineTo(135, 510);
        ctx.lineTo(125, 490);
        ctx.rect(115, 510, 20, 20)
        ctx.stroke()
    }
    _drawPanel(ctx) {
        ctx.setFillStyle('#efefef')
        ctx.setStrokeStyle('#efefef')
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
        this._drawPenButton(ctx);
        this._drawEraserButton(ctx);
        this._drawResetButton(ctx);
    }
    draw() {
        var ctx = wx.createContext()
        this._drawMainButton(ctx);
        if (this.isOpen) {
            this._drawPanel(ctx)
        }

        wx.drawCanvas({
            canvasId: this.canvasId,
            reserve: false,
            actions: ctx.getActions() // 获取绘图动作数组
        })
    }
}