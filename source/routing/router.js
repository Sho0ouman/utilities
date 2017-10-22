var Router = (function () {
    var container,
        currState,
        preState,
        currController,
        routers;

    var events = {
        onPreStateChanged: function () {},
        onStateChanged: function () {}
    };

    (function init() {
        routers = [];
        container = document.getElementsByTagName("router-master");
    }());

    function register(r) {
        routers.push(r);
        if (r.default)
            go(r.name);
        listenToUrlChange();
    }

    function listenToUrlChange() {
        setInterval(function () {
            var url = window.location.hash;
            url = url.slice(1, url.length);
            if (url !== "") {
                if (url !== currState.url) {
                    var r = getRouter({
                        url: url
                    })
                    if (r)
                        go(r.name);
                }
            }
        }, 60);
    }

    function getRouter(obj) {
        var k = Object.keys(obj)[0];
        var r = routers.filter(function (e) {
            return e[k] === obj[k];
        });
        if (r.length > 0)
            return r[0];
    }

    function rend(str, scope) {
        var bindingBoard = {};
        var elements = new DOMParser().parseFromString(str, "text/html").firstChild.childNodes[1].children;
        do {
            container[0].appendChild(elements[0]);
        } while (elements.length > 0)
        var bindingElements = container[0].querySelectorAll("input[ng-model],textarea[ng-model],select[ng-model]");
        var displayElements = container[0].querySelectorAll("[ng-bind]:not(input):not(textarea):not(select)");

        for (var i = 0; i < bindingElements.length; i++) {
            var path = bindingElements[i].getAttribute('ng-model');

            bindingElements[i].addEventListener('input', function (e) {
                input = e.currentTarget;
                var path = input.getAttribute('ng-model');
                objectDeepAccess(scope, path, input.value);
                for (var j = 0; j < bindingBoard[path].display.length; j++)
                    bindingBoard[path].display[j].innerText = objectDeepAccess(scope, path);
            });

            if (!bindingBoard.hasOwnProperty(path))
                bindingBoard[path] = {
                    display: [],
                    input: []
                };
            bindingBoard[path].input.push(bindingElements[i]);
        }

        for (var i = 0; i < displayElements.length; i++) {
            var path = displayElements[i].getAttribute('ng-bind');
            displayElements[i].innerText = objectDeepAccess(scope, path);
            if (!bindingBoard.hasOwnProperty(path))
                bindingBoard[path] = {
                    display: [],
                    input: []
                };
            bindingBoard[path].display.push(displayElements[i]);
        }
    }

    function objectDeepAccess(obj, path, value) {
        var _obj = obj;
        var pList = path.split('.');
        var len = pList.length - 1;
        for (var i = 0; i < len; i++) {
            var e = pList[i];
            if (!_obj.hasOwnProperty(e)) _obj[e] = {};
            _obj = _obj[e];
        }
        if (value !== undefined)
            _obj[pList[len]] = value;
        else
            return _obj[pList[len]];
    }

    function go(name) {
        var execute = true,
            nextState = getRouter({
                name: name
            }),
            prevState = getRouter({
                url: window.location.hash
            }),
            eObj = {
                preventDefault: function () {
                    execute = false;
                }
            },
            scope = {};
        events["onPreStateChanged"](eObj, prevState, nextState);
        if (execute) {
            container[0].innerHTML = "";
            if (typeof nextState.controller === 'function') {
                nextState.controller(scope);
                loadHtml(prevState, nextState, scope, eObj);
            } else if (typeof nextState.controller === 'string') {
                loadController(nextState.controller, function () {
                    currController(scope);
                    loadHtml(prevState, nextState, scope, eObj);
                });
            }
        }
    }

    function loadHtml(prevState, nextState, scope, eObj) {
        if (nextState.template) {
            rend(nextState.template, scope);
            changeURL(prevState, nextState);
            events["onStateChanged"](eObj, currState);
        } else if (nextState.templatePath) {
            loadFile(nextState.templatePath, function (content) {
                rend(content, scope);
                changeURL(prevState, nextState);
                events["onStateChanged"](eObj, nextState);
            });
        }
    }

    function loadFile(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.send(null);
    }

    function loadController(src, callback) {
        var script,
            tag,
            r = false;

        var oldFiles = document.querySelector('script[curr-controller]');
        if (oldFiles) oldFiles.remove();

        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src.indexOf(".js") !== src.length - 3 ? src + ".js" : src;
        script.setAttribute('curr-controller', '');
        script.onload = script.onreadystatechange = function () {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                callback();
            }
        };
        tag = document.getElementsByTagName('script')[0];
        tag.parentNode.insertBefore(script, tag);
    }

    function changeURL(prevState, nextState) {
        preState = prevState;
        window.location.hash = nextState.url;
        currState = nextState;
    }

    return {
        register: function (r) {
            debugger;
            register(r);
            return this;
        },
        go: function (name) {
            go(name);
        },
        reload: function () {
            go(currState.name);
        },
        onPreStateChanged: function (callback) {
            return events["onPreStateChanged"] = callback;
        },
        onStateChanged: function (callback) {
            events["onStateChanged"] = callback;
        },
        on: function (eventName, callback) {
            eventName = "on" + eventName.charAt(0).toUpperCase() + eventName.substring(1);
            events[eventName] = callback;
        },
        Controller: function (controller) {
            currController = controller;
        }
    }
}())
