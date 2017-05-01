import { Widget } from 'Widget'

export class ResetButton extends Widget {
    constructor() {
        super()
        this.eventList.push(...['ontouchstart', 'ontouchend'])

        this.x = 240
        this.y = 485
        this.width = 50
        this.height = 50
        this.r = 15
    }

    checkHitArea(point) {
        if (this.isShow && point.x >= this.x && point.x <= this.x + this.width
            && point.y >= this.y && point.y <= this.y + this.height) {
                return true
            }
        return false
    }

    ontouchstart(e) {
    }

    ontouchend(e) {
        let ctx = wx.createContext()
        wx.drawCanvas({
            canvasId: 'baseCanvas',
            reserve: false,
            actions: ctx.getActions() // 获取绘图动作数组
        })
        return true
    }

    drawActions(ctx) {
        ctx.setStrokeStyle('gray')
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2 + this.r)
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.r, Math.PI / 2, Math.PI / 4 * 3, true)
        ctx.stroke();
    }
}