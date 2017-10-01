var Loader = (function () {

    function load(module) {
        var moduleFile = module + ".js";
        var result = httpGet(moduleFile);
        return eval(result);
    }

    function loadAsync(module, callback) {
        var moduleFile = module + ".js";
        httpGetAsync(moduleFile, callback);
    }

    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                callback(eval(xmlHttp.responseText));
        }
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.send(null);
    }

    function httpGet(theUrl) {
        try {
            var xmlHttp = new XMLHttpRequest();

            xmlHttp.open("GET", theUrl, false);
            xmlHttp.send(null);
            return xmlHttp.responseText;
        } catch (e) {
            console.error(e);
        }
    }

    return {
        use: function (module, callback) {
            try {
                switch (arguments.length) {
                    case 1:
                        return load(module);
                        break;
                    case 2:
                        loadAsync(module, callback);
                        break;
                }
            } catch (e) {

            }
        }
    }
}());
