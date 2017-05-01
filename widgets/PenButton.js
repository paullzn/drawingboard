import { Widget } from 'Widget'
import {EventRegistry} from '../utils/EventRegistry'
export class PenButton extends Widget {
    constructor() {
        super()
        this.eventList.push(...['ontouchstart', 'ontouchend'])

        this.x = 100
        this.y = 485
        this.width = 50
        this.height = 50
        this.paddingY = 8
        this.paddingX = 15
        this.innerWidth = 20
        this.innerHeight = 20
    }

    checkHitArea(point) {
        if (this.isShow && point.x >= this.x && point.x <= this.x + this.width
            && point.y >= this.y && point.y <= this.y + this.height) {
                return true
            }
        return false
    }

    ontouchstart(e) {}

    ontouchend(e) {
        EventRegistry.getInstance().trigger({penType: 'pen', changedTouches: e.changedTouches}, 'pentypechange')
        return true
    }

    drawActions(ctx) {
        ctx.setStrokeStyle('gray')
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.moveTo(this.x + this.width / 2, this.y + this.paddingY);
        ctx.lineTo(this.x + this.paddingX, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width - this.paddingX, this.y + this.height / 2);
        ctx.lineTo(125, this.y + this.paddingY);
        ctx.rect(this.x + this.paddingX, this.y + this.height / 2, this.innerWidth, this.innerHeight)
        ctx.stroke()
    }
}