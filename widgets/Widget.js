export class Widget {
    constructor() {
        this.isShow = true
        this.hasHitArea = false
    }

    checkHitArea(x, y) {
        return false
    }

    ontouchstart(e) {}
    ontouchmove(e) {}
    ontouchend(e) {}
    ontouchcancel(e) {}

    addChild(widget) {
        //TODO
    }
}