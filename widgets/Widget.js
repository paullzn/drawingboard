export class Widget {
    constructor() {
        this.isShow = true
        this.hasHitArea = false
        this.children = {}
        this.eventList = []
    }

    checkHitArea(point) {
        return false
    }

    ontouchstart(e) {}
    ontouchmove(e) {}
    ontouchend(e) {}
    ontouchcancel(e) {}

    addChild(widgetId, widget) {
        this.children[widgetId] = widget
    }

    drawChildActions(widgetId, ctx) {
        this.children[widgetId].drawActions(ctx)
    }

    hideChildren() {
        for (var widgetId in this.children) {
            this.children[widgetId].hide()
        }
    }

    hide() {
        this.isShow = false
        this.hideChildren()
    }

    showChildren() {
        for (var widgetId in this.children) {
            this.children[widgetId].show()
        }
    }

    show() {
        this.isShow = true
    }
}