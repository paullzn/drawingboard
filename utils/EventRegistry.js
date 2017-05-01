import { Utils } from '../utils/utils'

export class EventRegistry {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.registry = {};
        return this;
    }
    setListener(receiver, events) {
        var that = this;
        for(var i = 0; i < events.length; ++i) {
            var event = events[i];
            if (this.registry[event]) {
                that.registry[event].push({receiver: receiver, callback: receiver[event]})
            } else {
                that.registry[event] = [{receiver: receiver, callback: receiver[event]}]
            }
        }
    }
    _eventHandle(e, event) {
        if (this.registry[event]) {
            for(var i = 0; i < this.registry[event].length; ++i) {
                let item = this.registry[event][i]
                if (item.receiver.checkHitArea) {
                    if (item.receiver.checkHitArea(Utils.getXYFromEvent(e))) {
                        let continuePop = item.callback.call(item.receiver, e)
                        if (!continuePop) {
                            break
                        }
                    }
                } else {
                    item.callback.call(item.receiver, e)
                }
            }
        }
    }
    ontouchstart(e) {
        this._eventHandle(e, 'ontouchstart');
    }
    ontouchmove(e) {
        this._eventHandle(e, 'ontouchmove');
    }
    ontouchend(e) {
        this._eventHandle(e, 'ontouchend');
    }
    ontouchcancel(e) {
        this._eventHandle(e, 'ontouchcancel')
    }
}
