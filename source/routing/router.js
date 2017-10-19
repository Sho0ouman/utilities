var Router = (function () {
    var container,
        currState,
        routers;

    (function init() {
        routers = [];
        container = document.getElementsByTagName("router-master");
    }());

    function register(r) {
        routers.push(r);
    }

    function getRouter(name) {
        var r = routers.filter(function (e) {
            return e.name === name;
        });
        if (r.length > 0)
            return r[0];
    }

    function findModelPropIndicesOf(str) {
        var openIndices = [];
        var closeIndices = [];
        for (var i = 0; i < str.length; i++) {
            var val = i === str.length - 1 ? val = str[i] : str[i] + str[i + 1];
            if (val === "{{")
                openIndices.push(i);
            else if (val === "}}")
                closeIndices.push(i);
        }
        return {
            openIndices: openIndices,
            closeIndices: closeIndices
        };
    }

    function rend(str, scope) {
        var bindingBoard = {};
        var elements = new DOMParser().parseFromString(str, "text/html").firstChild.childNodes[1].children;
        var i = 0;
        do {
            var prop;
            var e = elements[i];
            if (e.tagName === "INPUT" || e.tagName === "SELECT" || e.tagName === "TEXTAREA") {
                if (e.hasAttribute('ng-model'))
                    prop = e.getAttribute('ng-model');
                if (!scope.hasOwnProperty(prop))
                    throw "Error3";
                if (!bindingBoard.hasOwnProperty(prop)) {
                    bindingBoard[prop] = {};
                    if (!bindingBoard[prop].input)
                        bindingBoard[prop].input = [];
                    bindingBoard[prop].input.push(e);
                } else {
                    if (!bindingBoard[prop].input)
                        bindingBoard[prop].input = [];
                    bindingBoard[prop].input.push(e);
                }
            } else {
                if (e.hasAttribute('ng-bind')) {
                    prop = e.getAttribute('ng-bind');
                    if (!scope.hasOwnProperty(prop))
                        throw "Error3";
                    if (!bindingBoard.hasOwnProperty(prop)) {
                        bindingBoard[prop] = {};
                        if (!bindingBoard[prop].display)
                            bindingBoard[prop].display = [];
                        bindingBoard[prop].display.push(e);
                    } else {
                        if (!bindingBoard[prop].display)
                            bindingBoard[prop].display = [];
                        bindingBoard[prop].display.push(e);
                    }
                }
            }
            container[0].appendChild(e);
        } while (elements.length > 0)

        for (k in bindingBoard) {
            if (bindingBoard.hasOwnProperty(k)) {
                if (bindingBoard[k].input)
                    for (var i = 0; i < bindingBoard[k].input.length; i++) {
                        var input = bindingBoard[k].input[i];
                        input.addEventListener('input', function () {
                            scope[k] = input.value;
                            for (var j = 0; j < bindingBoard[k].display.length; j++)
                                bindingBoard[k].display[j].innerText = scope[k];
                        }, false);
                    }
                if (bindingBoard[k].display)
                    for (var j = 0; j < bindingBoard[k].display.length; j++)
                        bindingBoard[k].display[j].innerText = scope[k];
            }
        }
    }

    function go(name) {
        var r = getRouter(name);
        var scope = {};
        container[0].innerHTML = "";
        // var oldScope = window.$scope;
        // window.$scope = scope;
        r.controller(scope);
        // scope = window.$scope;
        // window.$scope = oldScope;
        rend(r.template, scope);
        // container[0].innerHTML = renderTemplate(r.template, scope);
        window.location.hash = r.url;
        currState = r;
    }

    function replaceModel(str, openIndices, closeIndices, scope) {
        var result = "";
        for (var i = 0; i < openIndices.length; i++) {
            var open = openIndices[i];
            var close = closeIndices[i];
            var prop = str.substring(open + 2, close);
            if (!scope.hasOwnProperty(prop))
                throw "Error2";
            if (i === 0)
                result += str.substring(0, open) + scope[prop];
            else
                result += str.substring(closeIndices[i - 1] + 2, open) + scope[prop];
        }
        result += str.substring(closeIndices[closeIndices.length - 1] + 2);
        return result;
    }

    function renderTemplate(str, scope) {
        str = str.replace(/\s+/g, ' ');
        var indices = findModelPropIndicesOf(str);
        if (indices.openIndices.length !== indices.closeIndices.length)
            throw "Error1";
        var result = replaceModel(str, indices.openIndices, indices.closeIndices, scope);
        return result;
    }

    return {
        register: function (r) {
            register(r);
        },
        go: function (name) {
            go(name);
        },
        reload: function () {
            go(currState.name);
        }
    }
}())
