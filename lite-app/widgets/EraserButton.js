import { Widget } from 'Widget'
import {EventRegistry} from '../utils/EventRegistry'

export class EraserButton extends Widget {
    constructor() {
        super()
        this.eventList.push(...['ontouchstart', 'ontouchend'])
        
        this.x = 170
        this.y = 485
        this.width = 50
        this.height = 50
        this.innerX = 185
        this.innerY = 500
        this.innerWidth = 21
        this.innerHeight = 21
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
        EventRegistry.getInstance().trigger({penType: 'eraser', changedTouches: e.changedTouches}, 'pentypechange')
        return true
    }

    drawActions(ctx) {
        ctx.setStrokeStyle('gray')
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.rect(this.innerX, this.innerY, this.innerWidth, this.innerHeight)
        ctx.stroke();
    }
}