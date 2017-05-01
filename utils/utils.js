export class Utils {
    static dis(x1, y1, x2, y2) {
        return Math.sqrt(
            (x1 - x2) * (x1 - x2) +
            (y1 - y2) * (y1 - y2)
        )
    }
    static formatTime(date) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()

        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()

        return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
    static getXYFromEvent(e) {
        let touch = null;
        if (e.touches && e.touches.length > 0) {
            touch = e.touches[0]
        } else if (e.changedTouches) {
            touch = e.changedTouches[0]
        } else {
            touch = {}
        }
        return {
            x: touch.pageX || touch.x,
            y: touch.pageX || touch.y
        }
    }
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}