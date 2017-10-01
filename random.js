(function () {
    "use strict"

    function getRandom(x, y) {
        var to = 0,
            from = 0;
        if (arguments.length !== 2)
            throw "It is expected 2 parameters, but it is found " + arguments.length;
        if (typeof (x) !== 'number' || typeof (y) !== 'number')
            throw "Accepted parameters type is Number";
        if (x > y)
            to = x,
            from = y;
        else
            to = y,
            from = x;
        return Math.floor(Math.random() * ((to - from) + 1) + from);
    }

    return {
        Random(x, y) {
            return getRandom(x, y);
        }
    }
}())
