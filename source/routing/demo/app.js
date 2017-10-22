(function () {
    Router.register({
        name: "state1",
        url: "state1",
        default: true,
        controller: "state1/controller",
        templatePath: "state1/template.html",
    }).register({
        name: "state2",
        url: "state2",
        controller: "state2/controller",
        templatePath: "state2/template.html"
    });

    Router.on('preStateChanged', (function (e, p, n) {
        document.getElementById("spinner").style.display = "inline";
    }));

    Router.onStateChanged(function (e, p, n) {
        document.getElementById("spinner").style.display = "none";
    });
}());
