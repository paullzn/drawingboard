var EventRegistry = {
    init: function(canvasId) {
        this.canvasId = canvasId;
        this.registry = {};
        return this;
    },
    setListender: function(receiver, methods, callbacks) {
        var that = this;
        for(var i = 0; i < methods.length; ++i) {
            var method = methods[i];
            var callback = callbacks[i];
            if (this.registry[method]) {
                that.registry[method].push({receiver: receiver, callback: callback})
            } else {
                that.registry[method] = [{receiver: receiver, callback: callback}]
            }
        }
    },
    _eventHandle: function(e, method) {
        if (this.registry[method]) {
            this.registry[method].forEach(function(item, index, listeners) {
                item.callback.call(item.receiver, e)
            })
        }
    },
    start: function(e) {
        this._eventHandle(e, 'start');
    },
    move: function(e) {
        this._eventHandle(e, 'move');
    },
    end: function(e) {
        this._eventHandle(e, 'end');
    },
    cancel: function(e) {
        this._eventHandle(e, 'cancel')
    },
}

module.exports = {
    initBuilder: function(canvasId) {
        return EventRegistry.init(canvasId);
    }
}