var Attacklab = Attacklab || {};
Attacklab.wmd_env = {};
Attacklab.account_options = {};
Attacklab.wmd_defaults = {version: 1, output: "HTML", lineLength: 40, delayLoad: false};
if (!Attacklab.wmd) {
    Attacklab.wmd = function () {
        Attacklab.loadEnv = function () {
            var mergeEnv = function (env) {
                if (!env) {
                    return;
                }
                for (var key in env) {
                    Attacklab.wmd_env[key] = env[key];
                }
            };
            mergeEnv(Attacklab.wmd_defaults);
            mergeEnv(Attacklab.account_options);
            mergeEnv(top["wmd_options"]);
            Attacklab.full = true;
            var buttons = "bold italic | link blockquote code image | ol ul heading hr";
            Attacklab.wmd_env.buttons = Attacklab.wmd_env.buttons || buttons;
        };
        Attacklab.loadEnv();

        var files = ["showdown.js", "wmd-base.js", "wmd-plus.js"];

        Attacklab.fileLoaded = function (name) {
            arguments.callee.count = arguments.callee.count || 0;
            if (++arguments.callee.count >= files.length) {
                var go = function () {
                    Attacklab.wmdBase();
                    Attacklab.Util.startEditor();
                };
                if (Attacklab.wmd_env.delayLoad) {
                    window.setTimeout(go, 0);
                } else {
                    go();
                }
            }
        };

        Attacklab.editorInit = function () {
            Attacklab.wmdPlus();
        };

        var addScript = function (name, nocache) {
            var url = Attacklab.basePath + name;
            if (nocache) {
                url += "?nocache=" + (new Date()).getTime();
            }
            var element = document.createElement("script");
            element.src = url;
            top.document.documentElement.firstChild.appendChild(element);
        };

        var prefixOf = function (name) {
            var re = RegExp("(.*)" + name + "(\\?(.+))?$", "g");
            var scriptEls = document.getElementsByTagName("script");
            for (var i = 0; i < scriptEls.length; i++) {
                if (re.test(scriptEls[i].src)) {
                    var match = RegExp.$1;
                    if (/wmd-editor.com/.test(scriptEls[i].src)) {
                        return null;
                    }
                    return match;
                }
            }
        };

        Attacklab.basePath = prefixOf("wmd.js") || "http://static.wmd-editor.com/v2/";
        for (var f, i = 0; f = files[i]; i++) {
            addScript(f, false);
        }
    };
    Attacklab.wmd();
}
