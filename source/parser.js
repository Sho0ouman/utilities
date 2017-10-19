var Parser = (function () {
    function parse(value, props, useOnly) {
        var result = [];
        if (!isArray(value))
            value = [value];
        if (!isArrayOf(value, 'object'))
            throw new Error("The input data should be object or array of object.");
        for (var j = 0; j < value.length; j++) {
            result.push(parseObj(value[j], props, useOnly));
        }
        if (result.length === 1)
            return result[0];
        return result;
    }

    function parseObj(obj, props, useOnly) {
        if (!props)
            return obj;
        if (props && getType(props) !== 'object')
            throw new Error("Invalid Property description.");
        var nObj = {},
            keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i],
                p = props[k];
            nObj = executeProp(obj, nObj, props, p, k);
        }
        nObj = merge(obj, nObj, props, useOnly);
        return nObj;
    }

    function executeProp(obj, nObj, props, p, k) {
        if (getType(p) !== 'object')
            throw new Error("Invalid Property description.");
        if (props.hasOwnProperty(k)) {
            if (obj.hasOwnProperty(k)) {
                if (!p.skip) {
                    var val = obj[k];
                    if (p.value)
                        val = getValue(p.value, obj);
                    if (p.name && (getType(p.name) === 'string' || getType(p.name) === 'number'))
                        nObj[p.name] = val;
                    else
                        nObj[k] = val;
                }
            } else {
                if (props[k].value)
                    nObj[k] = getValue(props[k].value, obj);
                else
                    nObj[k] = undefined;
            }
        }
        return nObj;
    }

    function merge(obj, nObj, props, useOnly) {
        if (!useOnly) {
            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j++) {
                var k = keys[j];
                if (obj.hasOwnProperty(k))
                    if (!props.hasOwnProperty(k))
                        nObj[k] = obj[k];
            }
        }
        return nObj;
    }

    function getValue(v, obj) {
        if (getType(v) === 'function')
            return v(obj);
        return v;
    }

    function getType(v) {
        var s = Object.prototype.toString.call(v);
        return s.substring(s.indexOf(' ') + 1, s.length - 1).toLowerCase();
    }

    function isArray(v) {
        return getType(v) === 'array';
    }

    function isArrayOf(v, t) {
        if (!isArray(v))
            return false;
        for (var i = 0; i < v.length; i++)
            if (getType(v[i]) !== t)
                return false;
        return true;
    }

    return {
        parse: function (v, options) {
            return parse(v, options);
        }
    }
}());
