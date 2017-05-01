import { Utils } from '../utils/utils'

var eventRegistryInstance = null;
export class EventRegistry {

    static getInstance() {
        if (!eventRegistryInstance) {
            eventRegistryInstance = new EventRegistry()
        }
        return eventRegistryInstance
    }
    constructor() {
        this.registry = {};
        return this;
    }

    trigger(eventData, eventName) {
        this._eventHandle(eventData, eventName)
    }

    setListener(receiver) {
        var that = this;
        console.log(receiver.eventList)
        for(var i = 0; i < receiver.eventList.length; ++i) {
            let event = receiver.eventList[i];
            if (!this.registry[event]) this.registry[event] = []
            for(var key in receiver.children) {
                this.setListener(receiver.children[key])
            }
            that.registry[event].push({receiver: receiver, callback: receiver[event]})
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
