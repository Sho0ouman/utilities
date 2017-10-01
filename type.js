(function () {
    "use strict";
    return {
        TYPES: {
            ARRAY: 'array',
            BOOLEAN: 'boolean',
            DATE: 'date',
            FUNCTION: 'function',
            NUMBER: 'number',
            OBJECT: 'object',
            STRING: 'string'
        },
        getTypeOf(obj) {
            "use strict";
            var toString = Object.prototype.toString.call(obj);
            var type = toString.substring(toString.indexOf(' ') + 1, toString.length - 1).toLowerCase();
            return type;
        },
        is(obj, type) {
            "use strict";
            return this.GetTypeOf(obj) === type;
        },
        isString(obj) {
            "use strict";
            return this.is(obj, this.TYPES.STRING);
        },
        isNumber(obj) {
            "use strict";
            return this.is(obj, this.TYPES.NUMBER);
        },
        isArray(obj) {
            "use strict";
            return this.is(obj, this.TYPES.ARRAY);
        },
        isFunction(obj) {
            "use strict";
            return this.is(obj, this.TYPES.FUNCTION);
        },
        isObject(obj) {
            "use strict";
            return this.is(obj, this.TYPES.OBJECT);
        },
        isBoolean(obj) {
            "use strict";
            return this.is(obj, this.TYPES.BOOLEAN);
        },
        isDate(obj) {
            "use strict";
            return this.is(obj, this.TYPES.DATE);
        },
        isPrototypeOf(obj, prototype) {
            "use strict";
            var patternKeys = Object.keys(prototype);
            if (patternKeys.length !== Object.keys(obj).length)
                return false;
            for (var property in prototype) {
                if (prototype.hasOwnProperty(property)) {
                    if (!obj.hasOwnProperty(property))
                        return false;
                    var prototypePropertyType = this.getTypeOf(prototype[property]);
                    if (prototypePropertyType !== this.getTypeOf(obj[property]))
                        return false;
                    else
                    if (prototypePropertyType === 'function' && prototype[property].toString() !== obj[property].toString())
                        return false;
                }
            }
            return true;
        }
    };
}());
