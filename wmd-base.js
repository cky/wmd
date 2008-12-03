var Attacklab = Attacklab || {};
Attacklab.wmdBase = function () {
    var self = top;
    var wmd = self["Attacklab"];
    var doc = self["document"];
    var RE = self["RegExp"];
    var nav = self["navigator"];
    wmd.Util = {};
    wmd.Position = {};
    wmd.Command = {};
    var util = wmd.Util;
    var position = wmd.Position;
    var command = wmd.Command;
    wmd.Util.IE = (nav.userAgent.indexOf("MSIE") != -1);
    wmd.Util.oldIE = (nav.userAgent.indexOf("MSIE 6.") != -1 || nav.userAgent.indexOf("MSIE 5.") != -1);
    wmd.Util.newIE = !wmd.Util.oldIE && wmd.Util.IE;

    util.makeElement = function (type, noStyle) {
        var elem = doc.createElement(type);
        if (!noStyle) {
            var style = elem.style;
            style.margin = "0";
            style.padding = "0";
            style.clear = "none";
            style.cssFloat = "none";
            style.textAlign = "left";
            style.position = "relative";
            style.lineHeight = "1em";
            style.border = "none";
            style.color = "black";
            style.backgroundRepeat = "no-repeat";
            style.backgroundImage = "none";
            style.minWidth = style.minHeight = "0";
            style.maxWidth = style.maxHeight = "90000px";
        }
        return elem;
    };

    util.getStyle = function (el, prop) {
        var upcaseDash = function (str) {
            return str.replace(/-(\S)/g, function (_, m1) {
                return m1.toUpperCase();
            });
        };

        if (el.currentStyle) {
            prop = upcaseDash(prop);
            return el.currentStyle[prop];
        } else if (self.getComputedStyle) {
            return doc.defaultView.getComputedStyle(el, null).getPropertyValue(prop);
        }
        return "";
    };

    util.getElementsByClass = function (cls, context, tag) {
        var result = [];
        if (context == null) {
            context = doc;
        }
        if (tag == null) {
            tag = "*";
        }

        var els = context.getElementsByTagName(tag);
        var nels = els.length;
        var re = new RE("(^|\\s)" + cls + "(\\s|$)");
        for (var i = 0, j = 0; i < nels; i++) {
            if (re.test(els[i].className.toLowerCase())) {
                result[j] = els[i];
                j++;
            }
        }
        return result;
    };

    util.addEvent = function (el, event, listener) {
        if (el.attachEvent) {
            el.attachEvent("on" + event, listener);
        } else {
            el.addEventListener(event, listener, false);
        }
    };

    util.removeEvent = function (el, event, listener) {
        if (el.detachEvent) {
            el.detachEvent("on" + event, listener);
        } else {
            el.removeEventListener(event, listener, false);
        }
    };

    util.regexToString = function (re) {
        var result = {};
        var str = re.toString();
        result.expression = str.replace(/\/([gim]*)$/, "");
        result.flags = RE.$1;
        result.expression = result.expression.replace(/(^\/|\/$)/g, "");
        return result;
    };

    util.stringToRegex = function (str) {
        return new RE(str.expression, str.flags);
    };

    util.elementOk = function (el) {
        if (!el || !el.parentNode) {
            return false;
        }
        if (util.getStyle(el, "display") == "none") {
            return false;
        }
        return true;
    };

    util.skin = function (el, bgimg, height, width) {
        var style;
        var msie = (nav.userAgent.indexOf("MSIE") != -1);
        if (msie) {
            util.fillers = [];
        }

        var halfh = height / 2;
        for (var corner = 0; corner < 4; corner++) {
            var div = util.makeElement("div");
            style = div.style;
            style.overflow = "hidden";
            style.padding = "0";
            style.margin = "0";
            style.lineHeight = "0px";
            style.height = halfh + "px";
            style.width = "50%";
            style.maxHeight = halfh + "px";
            style.position = "absolute";
            if (corner & 1) {
                style.top = "0";
            } else {
                style.bottom = -height + "px";
            }
            left.zIndex = "-1000";
            if (corner & 2) {
                style.left = "0";
            } else {
                style.marginLeft = "50%";
            }
            if (msie) {
                var span = util.makeElement("span");
                style = span.style;
                style.height = "100%";
                style.width = width;
                style.filter = "progid:DXImageTransform.Microsoft." +
                    "AlphaImageLoader(src='" + wmd.basePath + "images/bg.png')";
                style.position = "absolute";
                if (corner & 1) {
                    style.top = "0";
                } else {
                    style.bottom = "0";
                }
                if (corner & 2) {
                    style.left = "0";
                } else {
                    style.right = "0";
                }
                div.appendChild(span);
            } else {
                style.backgroundImage = "url(" + bgimg + ")";
                style.backgroundPosition= (corner & 2 ? "left" : "right") +
                    " " + (corner & 1 ? "top" : "bottom");
            }
            el.appendChild(div);
        }

        var fill = function (left) {
            var div = util.makeElement("div");
            if (util.fillers) {
                util.fillers.push(div);
            }
            style = div.style;
            style.overflow = "hidden";
            style.padding = "0";
            style.margin = "0";
            style.marginTop = halfh + "px";
            style.lineHeight = "0px";
            style.height = "100%";
            style.width = "50%";
            style.position = "absolute";
            style.zIndex = "-1000";
            if (msie) {
                var span = util.makeElement("span");
                style = span.style;
                style.height = "100%";
                style.width = width;
                style.filter = "progid:DXImageTransform.Microsoft." +
                    "AlphaImageLoader(src='" + wmd.basePath +
                    "images/bg-fill.png',sizingMethod='scale')";
                style.position = "absolute";
                div.appendChild(span);
                if (left) {
                    style.left = "0";
                } else {
                    style.right = "0";
                }
            } else {
                style.backgroundImage = "url(" + wmd.basePath + "images/bg-fill.png)";
                style.backgroundRepeat = "repeat-y";
                if (left) {
                    style.backgroundPosition = "left top";
                } else {
                    style.backgroundPosition = "right top";
                }
            }
            if (!left) {
                div.style.marginLeft = "50%";
            }
            return div;
        };
        el.appendChild(fill(true));
        el.appendChild(fill(false));
    };

    util.setImage = function (el, img) {
        img = wmd.basePath + img;
        if (nav.userAgent.indexOf("MSIE") != -1) {
            var child = el.firstChild;
            var style = child.style;
            style.filter = "progid:DXImageTransform.Microsoft." +
                "AlphaImageLoader(src='" + img + "')";
        } else {
            el.src = img;
        }
        return el;
    };

    util.createImage = function (img, width, height) {
        img = wmd.basePath + img;
        if (nav.userAgent.indexOf("MSIE") != -1) {
            var el = util.makeElement("span");
            var style = el.style;
            style.display = "inline-block";
            style.height = "1px";
            style.width = "1px";
            el.unselectable = "on";
            var span = util.makeElement("span");
            style = span.style;
            style.display = "inline-block";
            style.height = "1px";
            style.width = "1px";
            style.filter = "progid:DXImageTransform.Microsoft." +
                "AlphaImageLoader(src='" + img + "')";
            span.unselectable = "on";
            el.appendChild(span);
        } else {
            var el = util.makeElement("img");
            el.style.display = "inline";
            el.src = img;
        }
        el.style.border = "none";
        el.border = "0";
        if (width && height) {
            el.style.width = width + "px";
            el.style.height = height + "px";
        }
        return el;
    };

    util.prompt = function (text, defval, callback) {
        var style;
        var frame, background, input;

        var checkEscape = function (key) {
            var code = (key.charCode || key.keyCode);
            if (code == 27) {
                close(true);
            }
        };

        var close = function (isCancel) {
            util.removeEvent(doc.body, "keydown", checkEscape);
            var text = input.value;
            if (isCancel) {
                text = null;
            }
            frame.parentNode.removeChild(frame);
            background.parentNode.removeChild(background);
            callback(text);
            return false;
        };

        if (defval == undefined) {
            defval = "";
        }

        var showBackground = function () {
            background = util.makeElement("div");
            style = background.style;
            doc.body.appendChild(background);
            style.position = "absolute";
            style.top = "0";
            style.left = "0";
            style.backgroundColor = "#000";
            style.zIndex = "1000";
            var isKonq = /konqueror/.test(nav.userAgent.toLowerCase());
            if (isKonq) {
                style.backgroundColor="transparent";
            } else {
                style.opacity = "0.5";
                style.filter = "alpha(opacity=50)";
            }
            var pageSize = position.getPageSize();
            style.width = "100%";
            style.height = pageSize[1] + "px";
        };

        var makeForm = function () {
            frame = doc.createElement("div");
            style = frame.style;
            style.border = "3px solid #333";
            style.backgroundColor = "#ccc";
            style.padding = "10px;";
            style.borderTop = "3px solid white";
            style.borderLeft = "3px solid white";
            style.position = "fixed";
            style.width = "400px";
            style.zIndex = "1001";

            var question = util.makeElement("div");
            style = question.style;
            style.fontSize = "14px";
            style.fontFamily = "Helvetica, Arial, Verdana, sans-serif";
            style.padding = "5px";
            question.innerHTML = text;
            frame.appendChild(question);

            var form = util.makeElement("form");
            form.onsubmit = function () {
                return close();
            };
            style = form.style;
            style.padding = "0";
            style.margin = "0";
            style.cssFloat = "left";
            style.width = "100%";
            style.textAlign = "center";
            style.position = "relative";
            frame.appendChild(form);

            input = doc.createElement("input");
            input.value = defval;
            style = input.style;
            style.display = "block";
            style.width = "80%";
            style.marginLeft = style.marginRight = "auto";
            style.backgroundColor = "white";
            style.color = "black";
            form.appendChild(input);

            var okButton = doc.createElement("input");
            okButton.type = "button";
            okButton.onclick = function () {
                return close();
            };
            okButton.value = "OK";
            style = okButton.style;
            style.margin = "10px";
            style.display = "inline";
            style.width = "7em";

            var cancelButton = doc.createElement("input");
            cancelButton.type = "button";
            cancelButton.onclick = function () {
                return close(true);
            };
            cancelButton.value = "Cancel";
            style = cancelButton.style;
            style.margin = "10px";
            style.display = "inline";
            style.width = "7em";
            if (/mac/.test(nav.platform.toLowerCase())) {
                form.appendChild(cancelButton);
                form.appendChild(okButton);
            } else {
                form.appendChild(okButton);
                form.appendChild(cancelButton);
            }

            util.addEvent(doc.body, "keydown", checkEscape);
            style = frame.style;
            style.top = "50%";
            style.left = "50%";
            style.display = "block";
            if (wmd.Util.oldIE) {
                style.position = "absolute";
                style.top = doc.documentElement.scrollTop + 200 + "px";
                style.left = "50%";
            }
            doc.body.appendChild(frame);
            style.marginTop = -(position.getHeight(frame) / 2) + "px";
            style.marginLeft = -(position.getWidth(frame) / 2) + "px";
        };

        showBackground();
        self.setTimeout(function () {
            makeForm();
            var deflen = defval.length;
            if (input.selectionStart != undefined) {
                input.selectionStart = 0;
                input.selectionEnd = deflen;
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(false);
                range.moveStart("character", -deflen);
                range.moveEnd("character", deflen);
                range.select();
            }
            input.focus();
        }, 0);
    };

    util.objectsEqual = function(lhs, rhs) {
        for (var key in lhs) {
            if (lhs[key] != rhs[key]) {
                return false;
            }
        }
        for (key in rhs) {
            if (lhs[key] != rhs[key]) {
                return false;
            }
        }
        return true;
    };

    util.cloneObject = function (obj) {
        var result = {};
        for (var key in obj) {
            result[key] = obj[key];
        }
        return result;
    };

    util.escapeUnderscores = function (str) {
        return str.replace(/(\S)(_+)(\S)/g, function (_, m1, m2, m3) {
            return m1 + m2.replace(/_/g, "&#95;") + m3;
        });
    };

    position.getPageSize = function () {
        var scrollWidth, scrollHeight;
        var maxWidth, maxHeight;
        if (self.innerHeight && self.scrollMaxY) {
            scrollWidth = doc.body.scrollWidth;
            scrollHeight = self.innerHeight + self.scrollMaxY;
        } else if (doc.body.scrollHeight > doc.body.offsetHeight) {
            scrollWidth = doc.body.scrollWidth;
            scrollHeight = doc.body.scrollHeight;
        } else {
            scrollWidth = doc.body.offsetWidth;
            scrollHeight = doc.body.offsetHeight;
        }

        var innerWidth, innerHeight;
        if (self.innerHeight) {
            innerWidth = self.innerWidth;
            innerHeight = self.innerHeight;
        } else if (doc.documentElement && doc.documentElement.clientHeight) {
            innerWidth = doc.documentElement.clientWidth;
            innerHeight = doc.documentElement.clientHeight;
        } else if (doc.body) {
            innerWidth = doc.body.clientWidth;
            innerHeight = doc.body.clientHeight;
        }

        maxWidth = Math.max(scrollWidth, innerWidth);
        maxHeight = Math.max(scrollHeight, innerHeight);
        return [maxWidth, maxHeight, innerWidth, innerHeight];
    };

    position.getPixelVal = function (val) {
        if (val && /^(-?\d+(\.\d*)?)px$/.test(val)) {
            return RE.$1;
        }
        return undefined;
    };

    position.getTop = function (el, isInner) {
        var result = el.offsetTop;
        if (!isInner) {
            while (el = el.offsetParent) {
                result += el.offsetTop;
            }
        }
        return result;
    };

    position.setTop = function (el, newTop, isInner) {
        var curTop = position.getPixelVal(el.style.top);
        if (curTop == undefined) {
            el.style.top = newTop + "px";
            curTop = newTop;
        }
        var offset = position.getTop(el, isInner) - curTop;
        el.style.top = (newTop - offset) + "px";
    };

    position.getLeft = function (el, isInner) {
        var result = el.offsetLeft;
        if (!isInner) {
            while (el = el.offsetParent) {
                result += el.offsetLeft;
            }
        }
        return result;
    };

    position.setLeft = function (el, newLeft, isInner) {
        var curLeft = position.getPixelVal(el.style.left);
        if (curLeft == undefined) {
            el.style.left = newLeft + "px";
            curLeft = newLeft;
        }
        var offset = position.getLeft(el, isInner) - curLeft;
        el.style.left = (newLeft - offset) + "px";
    };

    position.getHeight = function (el) {
        return el.offsetHeight || el.scrollHeight;
    };

    position.setHeight = function (el, newHeight) {
        var curHeight = position.getPixelVal(el.style.height);
        if (curHeight == undefined) {
            el.style.height = newHeight + "px";
            curHeight = newHeight;
        }
        var offset = position.getHeight(el) - curHeight;
        if (offset > newHeight) {
            offset = newHeight;
        }
        el.style.height = (newHeight - offset) + "px";
    };

    position.getWidth = function (el) {
        return el.offsetWidth || el.scrollWidth;
    };

    position.setWidth = function (el, newWidth) {
        var curWidth = position.getPixelVal(el.style.width);
        if (curWidth == undefined) {
            el.style.width = newWidth + "px";
            curWidth = newWidth;
        }
        var offset = position.getWidth(el) - curWidth;
        if (offset > newWidth) {
            offset = newWidth;
        }
        el.style.width = (newWidth - offset) + "px";
    };

    position.getWindowHeight = function () {
        if (self.innerHeight) {
            return self.innerHeight;
        } else if (doc.documentElement && doc.documentElement.clientHeight) {
            return doc.documentElement.clientHeight;
        } else if (doc.body) {
            return doc.body.clientHeight;
        }
    };

    wmd.inputPoller = function (el, callback, interval) {
        var poller = this;
        var lastStart;
        var lastEnd;
        var lastValue, handle;

        this.tick = function () {
            if (!util.elementOk(el)) {
                return;
            }
            if (el.selectionStart || el.selectionStart == 0) {
                var start = el.selectionStart;
                var end = el.selectionEnd;
                if (start != lastStart || end != lastEnd) {
                    lastStart = start;
                    lastEnd = end;
                    if (lastValue != el.value) {
                        lastValue = el.value;
                        return true;
                    }
                }
            }
            return false;
        };

        var poll = function () {
            if (util.getStyle(el, "display") == "none") {
                return;
            }
            if (poller.tick()) {
                callback();
            }
        };

        var init = function () {
            if (interval == undefined) {
                interval = 500;
            }
            handle = self.setInterval(poll, interval);
        };

        this.destroy = function () {
            self.clearInterval(handle);
        };

        init();
    };

    wmd.undoManager = function (el, callback) {
        var undoObj = this;
        var undoBuf = [];
        var undoPtr = 0;
        var mode = "none";
        var lastState;
        var poller;
        var timer;
        var stateObj;

        var setMode = function (newMode, noSave) {
            if (mode != newMode) {
                mode = newMode;
                if (!noSave) {
                    saveState();
                }
            }
            if (!wmd.Util.IE || mode != "moving") {
                timer = self.setTimeout(refreshState, 1);
            } else {
                stateObj = null;
            }
        };

        var refreshState = function () {
            stateObj = new wmd.textareaState(el);
            poller.tick();
            timer = undefined;
        };

        this.setCommandMode = function () {
            mode = "command";
            saveState();
            timer = self.setTimeout(refreshState, 0);
        };

        this.canUndo = function () {
            return undoPtr > 1;
        };

        this.canRedo = function () {
            return undoBuf[undoPtr + 1] != undefined;
        };

        this.undo = function () {
            if (undoObj.canUndo()) {
                if (lastState) {
                    lastState.restore();
                    lastState = null;
                } else {
                    undoBuf[undoPtr] = new wmd.textareaState(el);
                    undoBuf[--undoPtr].restore();
                    if (callback) {
                        callback();
                    }
                }
            }
            mode = "none";
            el.focus();
            refreshState();
        };

        this.redo = function () {
            if (undoObj.canRedo()) {
                undoBuf[++undoPtr].restore();
                if (callback) {
                    callback();
                }
            }
            mode = "none";
            el.focus();
            refreshState();
        };

        var saveState = function () {
            var curState = stateObj || new wmd.textareaState(el);
            if (!curState) {
                return false;
            }
            if (mode == "moving") {
                if (!lastState) {
                    lastState = curState;
                }
                return;
            }
            if (lastState) {
                if (undoBuf[undoPtr-1].text != lastState.text) {
                    undoBuf[undoPtr++] = lastState;
                }
                lastState = null;
            }
            undoBuf[undoPtr++] = curState;
            undoBuf[undoPtr + 1] = null;
            if (callback) {
                callback();
            }
        };

        var handleUndoRedo = function (event) {
            var handled = false;
            if (event.ctrlKey || event.metaKey) {
                var code = (event.charCode || event.keyCode) | 96;
                var codeStr = String.fromCharCode(code);
                switch (codeStr) {
                case "y":
                    undoObj.redo();
                    handled = true;
                    break;
                case "z":
                    if (!event.shiftKey) {
                        undoObj.undo();
                    } else {
                        undoObj.redo();
                    }
                    handled = true;
                    break;
                }
            }
            if (handled) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                if (self.event) {
                    self.event.returnValue = false;
                }
                return;
            }
        };

        var handleModeChange = function (event) {
            if (!event.ctrlKey && !event.metaKey) {
                var code = event.keyCode;
                if ((code >= 33 && code <= 40) || (code >= 63232 && code <= 63235)) {
                    setMode("moving");
                } else if (code == 8 || code == 46 || code == 127) {
                    setMode("deleting");
                } else if (code == 13) {
                    setMode("newlines");
                } else if (code == 27) {
                    setMode("escape");
                } else if ((code < 16 || code > 20) && code != 91) {
                    setMode("typing");
                }
            }
        };

        var setEventHandlers = function () {
            util.addEvent(el, "keypress", function (event) {
                if ((event.ctrlKey || event.metaKey)
                        && (event.keyCode == 89 || event.keyCode == 90)) {
                    event.preventDefault();
                }
            });

            var handlePaste = function () {
                if (wmd.Util.IE || (stateObj && stateObj.text != el.value)) {
                    if (timer == undefined) {
                        mode = "paste";
                        saveState();
                        refreshState();
                    }
                }
            };

            poller = new wmd.inputPoller(el, handlePaste, 100);
            util.addEvent(el, "keydown", handleUndoRedo);
            util.addEvent(el, "keydown", handleModeChange);
            util.addEvent(el, "mousedown", function () {
                setMode("moving");
            });
            el.onpaste = handlePaste;
            el.ondrop = handlePaste;
        };

        var init = function () {
            setEventHandlers();
            refreshState();
            saveState();
        };

        this.destroy = function () {
            if (poller) {
                poller.destroy();
            }
        };

        init();
    };

wmd.editor=function(_b0,_b1){
if(!_b1){
_b1=function(){
};
}
var _b2=28;
var _b3=4076;
var _b4=0;
var _b5,_b6;
var _b7=this;
var _b8,_b9;
var _ba,_bb,_bc;
var _bd,_be,_bf;
var _c0=[];
var _c1=function(_c2){
if(_bd){
_bd.setCommandMode();
}
var _c3=new wmd.textareaState(_b0);
if(!_c3){
return;
}
var _c4=_c3.getChunks();
var _c5=function(){
_b0.focus();
if(_c4){
_c3.setChunks(_c4);
}
_c3.restore();
_b1();
};
var _c6=_c2(_c4,_c5);
if(!_c6){
_c5();
}
};
var _c7=function(_c8){
_b0.focus();
if(_c8.textOp){
_c1(_c8.textOp);
}
if(_c8.execute){
_c8.execute(_b7);
}
};
var _c9=function(_ca,_cb){
var _cc=_ca.style;
if(_cb){
_cc.opacity="1.0";
_cc.KHTMLOpacity="1.0";
if(wmd.Util.newIE){
_cc.filter="";
}
if(wmd.Util.oldIE){
_cc.filter="chroma(color=fuchsia)";
}
_cc.cursor="pointer";
_ca.onmouseover=function(){
_cc.backgroundColor="lightblue";
_cc.border="1px solid blue";
};
_ca.onmouseout=function(){
_cc.backgroundColor="";
_cc.border="1px solid transparent";
if(wmd.Util.oldIE){
_cc.borderColor="fuchsia";
_cc.filter="chroma(color=fuchsia)"+_cc.filter;
}
};
}else{
_cc.opacity="0.4";
_cc.KHTMLOpacity="0.4";
if(wmd.Util.oldIE){
_cc.filter="chroma(color=fuchsia) alpha(opacity=40)";
}
if(wmd.Util.newIE){
_cc.filter="alpha(opacity=40)";
}
_cc.cursor="";
_cc.backgroundColor="";
if(_ca.onmouseout){
_ca.onmouseout();
}
_ca.onmouseover=_ca.onmouseout=null;
}
};
var _cd=function(_ce){
_ce&&_c0.push(_ce);
};
var _cf=function(){
_c0.push("|");
};
var _d0=function(){
var _d1=util.createImage("images/separator.png",20,20);
_d1.style.padding="4px";
_d1.style.paddingTop="0px";
_b9.appendChild(_d1);
};
var _d2=function(_d3){
if(_d3.image){
var _d4=util.createImage(_d3.image,16,16);
_d4.border=0;
if(_d3.description){
var _d5=_d3.description;
if(_d3.key){
var _d6=" Ctrl+";
_d5+=_d6+_d3.key.toUpperCase();
}
_d4.title=_d5;
}
_c9(_d4,true);
var _d7=_d4.style;
_d7.margin="0px";
_d7.padding="1px";
_d7.marginTop="7px";
_d7.marginBottom="5px";
_d4.onmouseout();
var _d8=_d4;
_d8.onclick=function(){
if(_d8.onmouseout){
_d8.onmouseout();
}
_c7(_d3);
return false;
};
_b9.appendChild(_d8);
return _d8;
}
return;
};
var _d9=function(){
for(var _da in _c0){
if(_c0[_da]=="|"){
_d0();
}else{
_d2(_c0[_da]);
}
}
};
var _db=function(){
if(_bd){
_c9(_be,_bd.canUndo());
_c9(_bf,_bd.canRedo());
}
};
var _dc=function(){
if(_b0.offsetParent){
_ba=util.makeElement("div");
var _dd=_ba.style;
_dd.visibility="hidden";
_dd.top=_dd.left=_dd.width="0px";
_dd.display="inline";
_dd.cssFloat="left";
_dd.overflow="visible";
_dd.opacity="0.999";
_b8.style.position="absolute";
_ba.appendChild(_b8);
_b0.style.marginTop="";
var _de=position.getTop(_b0);
_b0.style.marginTop="0";
var _df=position.getTop(_b0);
_b4=_de-_df;
_e0();
_b0.parentNode.insertBefore(_ba,_b0);
_e1();
util.skin(_b8,wmd.basePath+"images/bg.png",_b2,_b3);
_dd.visibility="visible";
return true;
}
return false;
};
var _e2=function(){
var _e3=wmd.wmd_env.buttons.split(/\s+/);
for(var _e4 in _e3){
switch(_e3[_e4]){
case "|":
_cf();
break;
case "bold":
_cd(command.bold);
break;
case "italic":
_cd(command.italic);
break;
case "link":
_cd(command.link);
break;
}
if(wmd.full){
switch(_e3[_e4]){
case "blockquote":
_cd(command.blockquote);
break;
case "code":
_cd(command.code);
break;
case "image":
_cd(command.img);
break;
case "ol":
_cd(command.ol);
break;
case "ul":
_cd(command.ul);
break;
case "heading":
_cd(command.h1);
break;
case "hr":
_cd(command.hr);
break;
}
}
}
return;
};
var _e5=function(){
if(/\?noundo/.test(doc.location.href)){
wmd.nativeUndo=true;
}
if(!wmd.nativeUndo){
_bd=new wmd.undoManager(_b0,function(){
_b1();
_db();
});
}
var _e6=_b0.parentNode;
_b8=util.makeElement("div");
_b8.style.display="block";
_b8.style.zIndex=100;
if(!wmd.full){
_b8.title+="\n(Free Version)";
}
_b8.unselectable="on";
_b8.onclick=function(){
_b0.focus();
};
_b9=util.makeElement("span");
var _e7=_b9.style;
_e7.height="auto";
_e7.paddingBottom="2px";
_e7.lineHeight="0";
_e7.paddingLeft="15px";
_e7.paddingRight="65px";
_e7.display="block";
_e7.position="absolute";
_b9.unselectable="on";
_b8.appendChild(_b9);
_cd(command.autoindent);
var _e8=util.createImage("images/bg.png");
var _e9=util.createImage("images/bg-fill.png");
_e2();
_d9();
if(_bd){
_d0();
_be=_d2(command.undo);
_bf=_d2(command.redo);
var _ea=nav.platform.toLowerCase();
if(/win/.test(_ea)){
_be.title+=" - Ctrl+Z";
_bf.title+=" - Ctrl+Y";
}else{
if(/mac/.test(_ea)){
_be.title+=" - Ctrl+Z";
_bf.title+=" - Ctrl+Shift+Z";
}else{
_be.title+=" - Ctrl+Z";
_bf.title+=" - Ctrl+Shift+Z";
}
}
}
var _eb="keydown";
if(nav.userAgent.indexOf("Opera")!=-1){
_eb="keypress";
}
util.addEvent(_b0,_eb,function(_ec){
var _ed=false;
if(_ec.ctrlKey||_ec.metaKey){
var _ee=(_ec.charCode||_ec.keyCode);
var _ef=String.fromCharCode(_ee).toLowerCase();
for(var _f0 in _c0){
var _f1=_c0[_f0];
if(_f1.key&&_ef==_f1.key||_f1.keyCode&&_ec.keyCode==_f1.keyCode){
_c7(_f1);
_ed=true;
}
}
}
if(_ed){
if(_ec.preventDefault){
_ec.preventDefault();
}
if(self.event){
self.event.returnValue=false;
}
}
});
util.addEvent(_b0,"keyup",function(_f2){
if(_f2.shiftKey&&!_f2.ctrlKey&&!_f2.metaKey){
var _f3=(_f2.charCode||_f2.keyCode);
switch(_f3){
case 13:
_c7(command.autoindent);
break;
}
}
});
if(!_dc()){
_bc=self.setInterval(function(){
if(_dc()){
self.clearInterval(_bc);
}
},100);
}
util.addEvent(self,"resize",_e1);
_bb=self.setInterval(_e1,100);
if(_b0.form){
var _f4=_b0.form.onsubmit;
_b0.form.onsubmit=function(){
_f5();
if(_f4){
return _f4.apply(this,arguments);
}
};
}
_db();
};
var _f5=function(){
if(wmd.showdown){
var _f6=new wmd.showdown.converter();
}
var _f7=_b0.value;
var _f8=function(){
_b0.value=_f7;
};
_f7=util.escapeUnderscores(_f7);
if(!/markdown/.test(wmd.wmd_env.output.toLowerCase())){
if(_f6){
_b0.value=_f6.makeHtml(_f7);
self.setTimeout(_f8,0);
}
}
return true;
};
var _e0=function(){
var _f9=util.makeElement("div");
var _fa=_f9.style;
_fa.paddingRight="15px";
_fa.height="100%";
_fa.display="block";
_fa.position="absolute";
_fa.right="0";
_f9.unselectable="on";
var _fb=util.makeElement("a");
_fa=_fb.style;
_fa.position="absolute";
_fa.right="10px";
_fa.top="5px";
_fa.display="inline";
_fa.width="50px";
_fa.height="25px";
_fb.href="http://www.wmd-editor.com/";
_fb.target="_blank";
_fb.title="WMD: The Wysiwym Markdown Editor";
var _fc=util.createImage("images/wmd.png");
var _fd=util.createImage("images/wmd-on.png");
_fb.appendChild(_fc);
_fb.onmouseover=function(){
util.setImage(_fc,"images/wmd-on.png");
_fb.style.cursor="pointer";
};
_fb.onmouseout=function(){
util.setImage(_fc,"images/wmd.png");
};
_b8.appendChild(_fb);
};
var _e1=function(){
if(!util.elementOk(_b0)){
_b8.style.display="none";
return;
}
if(_b8.style.display=="none"){
_b8.style.display="block";
}
var _fe=position.getWidth(_b0);
var _ff=position.getHeight(_b0);
var _100=position.getLeft(_b0);
if(_b8.style.width==_fe+"px"&&_b5==_ff&&_b6==_100){
if(position.getTop(_b8)<position.getTop(_b0)){
return;
}
}
_b5=_ff;
_b6=_100;
var _101=100;
_b8.style.width=Math.max(_fe,_101)+"px";
var root=_b8.offsetParent;
var _103=position.getHeight(_b9);
var _104=_103-_b2+"px";
_b8.style.height=_104;
if(util.fillers){
util.fillers[0].style.height=util.fillers[1].style.height=_104;
}
var _105=3;
_b0.style.marginTop=_103+_105+_b4+"px";
var _106=position.getTop(_b0);
var _100=position.getLeft(_b0);
position.setTop(root,_106-_103-_105);
position.setLeft(root,_100);
_b8.style.opacity=_b8.style.opacity||0.999;
return;
};
this.undo=function(){
if(_bd){
_bd.undo();
}
};
this.redo=function(){
if(_bd){
_bd.redo();
}
};
var init=function(){
_e5();
};
this.destroy=function(){
if(_bd){
_bd.destroy();
}
if(_ba.parentNode){
_ba.parentNode.removeChild(_ba);
}
if(_b0){
_b0.style.marginTop="";
}
self.clearInterval(_bb);
self.clearInterval(_bc);
};
init();
};
wmd.textareaState=function(_108){
var _109=this;
var _10a=function(_10b){
if(util.getStyle(_108,"display")=="none"){
return;
}
var _10c=nav.userAgent.indexOf("Opera")!=-1;
if(_10b.selectionStart!=undefined&&!_10c){
_10b.focus();
_10b.selectionStart=_109.start;
_10b.selectionEnd=_109.end;
_10b.scrollTop=_109.scrollTop;
}else{
if(doc.selection){
if(doc.activeElement&&doc.activeElement!=_108){
return;
}
_10b.focus();
var _10d=_10b.createTextRange();
_10d.moveStart("character",-_10b.value.length);
_10d.moveEnd("character",-_10b.value.length);
_10d.moveEnd("character",_109.end);
_10d.moveStart("character",_109.start);
_10d.select();
}
}
};
this.init=function(_10e){
if(_10e){
_108=_10e;
}
if(util.getStyle(_108,"display")=="none"){
return;
}
_10f(_108);
_109.scrollTop=_108.scrollTop;
if(!_109.text&&_108.selectionStart||_108.selectionStart=="0"){
_109.text=_108.value;
}
};
var _110=function(_111){
_111=_111.replace(/\r\n/g,"\n");
_111=_111.replace(/\r/g,"\n");
return _111;
};
var _10f=function(){
if(_108.selectionStart||_108.selectionStart=="0"){
_109.start=_108.selectionStart;
_109.end=_108.selectionEnd;
}else{
if(doc.selection){
_109.text=_110(_108.value);
var _112=doc.selection.createRange();
var _113=_110(_112.text);
var _114="\x07";
var _115=_114+_113+_114;
_112.text=_115;
var _116=_110(_108.value);
_112.moveStart("character",-_115.length);
_112.text=_113;
_109.start=_116.indexOf(_114);
_109.end=_116.lastIndexOf(_114)-_114.length;
var _117=_109.text.length-_110(_108.value).length;
if(_117){
_112.moveStart("character",-_113.length);
while(_117--){
_113+="\n";
_109.end+=1;
}
_112.text=_113;
}
_10a(_108);
}
}
return _109;
};
this.restore=function(_118){
if(!_118){
_118=_108;
}
if(_109.text!=undefined&&_109.text!=_118.value){
_118.value=_109.text;
}
_10a(_118,_109);
_118.scrollTop=_109.scrollTop;
};
this.getChunks=function(){
var _119=new wmd.Chunks();
_119.before=_110(_109.text.substring(0,_109.start));
_119.startTag="";
_119.selection=_110(_109.text.substring(_109.start,_109.end));
_119.endTag="";
_119.after=_110(_109.text.substring(_109.end));
_119.scrollTop=_109.scrollTop;
return _119;
};
this.setChunks=function(_11a){
_11a.before=_11a.before+_11a.startTag;
_11a.after=_11a.endTag+_11a.after;
var _11b=nav.userAgent.indexOf("Opera")!=-1;
if(_11b){
_11a.before=_11a.before.replace(/\n/g,"\r\n");
_11a.selection=_11a.selection.replace(/\n/g,"\r\n");
_11a.after=_11a.after.replace(/\n/g,"\r\n");
}
_109.start=_11a.before.length;
_109.end=_11a.before.length+_11a.selection.length;
_109.text=_11a.before+_11a.selection+_11a.after;
_109.scrollTop=_11a.scrollTop;
};
this.init();
};
wmd.Chunks=function(){
};
wmd.Chunks.prototype.findTags=function(_11c,_11d){
var _11e,_11f;
var _120=this;
if(_11c){
_11f=util.regexToString(_11c);
_11e=new RE(_11f.expression+"$",_11f.flags);
this.before=this.before.replace(_11e,function(_121){
_120.startTag=_120.startTag+_121;
return "";
});
_11e=new RE("^"+_11f.expression,_11f.flags);
this.selection=this.selection.replace(_11e,function(_122){
_120.startTag=_120.startTag+_122;
return "";
});
}
if(_11d){
_11f=util.regexToString(_11d);
_11e=new RE(_11f.expression+"$",_11f.flags);
this.selection=this.selection.replace(_11e,function(_123){
_120.endTag=_123+_120.endTag;
return "";
});
_11e=new RE("^"+_11f.expression,_11f.flags);
this.after=this.after.replace(_11e,function(_124){
_120.endTag=_124+_120.endTag;
return "";
});
}
};
wmd.Chunks.prototype.trimWhitespace=function(_125){
this.selection=this.selection.replace(/^(\s*)/,"");
if(!_125){
this.before+=RE.$1;
}
this.selection=this.selection.replace(/(\s*)$/,"");
if(!_125){
this.after=RE.$1+this.after;
}
};
wmd.Chunks.prototype.skipLines=function(_126,_127,_128){
if(_126==undefined){
_126=1;
}
if(_127==undefined){
_127=1;
}
_126++;
_127++;
var _129,_12a;
this.selection=this.selection.replace(/(^\n*)/,"");
this.startTag=this.startTag+RE.$1;
this.selection=this.selection.replace(/(\n*$)/,"");
this.endTag=this.endTag+RE.$1;
this.startTag=this.startTag.replace(/(^\n*)/,"");
this.before=this.before+RE.$1;
this.endTag=this.endTag.replace(/(\n*$)/,"");
this.after=this.after+RE.$1;
if(this.before){
_129=_12a="";
while(_126--){
_129+="\\n?";
_12a+="\n";
}
if(_128){
_129="\\n*";
}
this.before=this.before.replace(new RE(_129+"$",""),_12a);
}
if(this.after){
_129=_12a="";
while(_127--){
_129+="\\n?";
_12a+="\n";
}
if(_128){
_129="\\n*";
}
this.after=this.after.replace(new RE(_129,""),_12a);
}
};
command.prefixes="(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)";
command.unwrap=function(_12b){
var _12c=new RE("([^\\n])\\n(?!(\\n|"+command.prefixes+"))","g");
_12b.selection=_12b.selection.replace(_12c,"$1 $2");
};
command.wrap=function(_12d,len){
command.unwrap(_12d);
var _12f=new RE("(.{1,"+len+"})( +|$\\n?)","gm");
_12d.selection=_12d.selection.replace(_12f,function(_130,line){
if(new RE("^"+command.prefixes,"").test(_130)){
return _130;
}
return line+"\n";
});
_12d.selection=_12d.selection.replace(/\s+$/,"");
};
command.doBold=function(_132){
return command.doBorI(_132,2,"strong text");
};
command.doItalic=function(_133){
return command.doBorI(_133,1,"emphasized text");
};
command.doBorI=function(_134,_135,_136){
_134.trimWhitespace();
_134.selection=_134.selection.replace(/\n{2,}/g,"\n");
_134.before.search(/(\**$)/);
var _137=RE.$1;
_134.after.search(/(^\**)/);
var _138=RE.$1;
var _139=Math.min(_137.length,_138.length);
if((_139>=_135)&&(_139!=2||_135!=1)){
_134.before=_134.before.replace(RE("[*]{"+_135+"}$",""),"");
_134.after=_134.after.replace(RE("^[*]{"+_135+"}",""),"");
return;
}
if(!_134.selection&&_138){
_134.after=_134.after.replace(/^([*_]*)/,"");
_134.before=_134.before.replace(/(\s?)$/,"");
var _13a=RE.$1;
_134.before=_134.before+_138+_13a;
return;
}
if(!_134.selection&&!_138){
_134.selection=_136;
}
var _13b=_135<=1?"*":"**";
_134.before=_134.before+_13b;
_134.after=_13b+_134.after;
};
command.stripLinkDefs=function(_13c,_13d){
_13c=_13c.replace(/^[ ]{0,3}\[(\d+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm,function(_13e,id,_140,_141,_142){
_13d[id]=_13e.replace(/\s*$/,"");
if(_141){
_13d[id]=_13e.replace(/["(](.+?)[")]$/,"");
return _141+_142;
}
return "";
});
return _13c;
};
command.addLinkDef=function(_143,_144){
var _145=0;
var _146={};
_143.before=command.stripLinkDefs(_143.before,_146);
_143.selection=command.stripLinkDefs(_143.selection,_146);
_143.after=command.stripLinkDefs(_143.after,_146);
var _147="";
var _148=/(\[(?:\[[^\]]*\]|[^\[\]])*\][ ]?(?:\n[ ]*)?\[)(\d+)(\])/g;
var _149=function(def){
_145++;
def=def.replace(/^[ ]{0,3}\[(\d+)\]:/,"  ["+_145+"]:");
_147+="\n"+def;
};
var _14b=function(_14c,_14d,id,end){
if(_146[id]){
_149(_146[id]);
return _14d+_145+end;
}
return _14c;
};
_143.before=_143.before.replace(_148,_14b);
if(_144){
_149(_144);
}else{
_143.selection=_143.selection.replace(_148,_14b);
}
var _150=_145;
_143.after=_143.after.replace(_148,_14b);
if(_143.after){
_143.after=_143.after.replace(/\n*$/,"");
}
if(!_143.after){
_143.selection=_143.selection.replace(/\n*$/,"");
}
_143.after+="\n\n"+_147;
return _150;
};
command.doLinkOrImage=function(_151,_152,_153){
_151.trimWhitespace();
_151.findTags(/\s*!?\[/,/\][ ]?(?:\n[ ]*)?(\[.*?\])?/);
if(_151.endTag.length>1){
_151.startTag=_151.startTag.replace(/!?\[/,"");
_151.endTag="";
command.addLinkDef(_151,null);
}else{
if(/\n\n/.test(_151.selection)){
command.addLinkDef(_151,null);
return;
}
var _154;
var _155=function(_156){
if(_156!=null){
_151.startTag=_151.endTag="";
var _157=" [999]: "+_156;
var num=command.addLinkDef(_151,_157);
_151.startTag=_152?"![":"[";
_151.endTag="]["+num+"]";
if(!_151.selection){
if(_152){
_151.selection="alt text";
}else{
_151.selection="link text";
}
}
}
_153();
};
if(_152){
_154=util.prompt("<p style='margin-top: 0px'><b>Enter the image URL.</b></p><p>You can also add a title, which will be displayed as a tool tip.</p><p>Example:<br />http://wmd-editor.com/images/cloud1.jpg   \"Optional title\"</p>","http://",_155);
}else{
_154=util.prompt("<p style='margin-top: 0px'><b>Enter the web address.</b></p><p>You can also add a title, which will be displayed as a tool tip.</p><p>Example:<br />http://wmd-editor.com/   \"Optional title\"</p>","http://",_155);
}
return true;
}
};
command.bold={};
command.bold.description="Strong <strong>";
command.bold.image="images/bold.png";
command.bold.key="b";
command.bold.textOp=command.doBold;
command.italic={};
command.italic.description="Emphasis <em>";
command.italic.image="images/italic.png";
command.italic.key="i";
command.italic.textOp=command.doItalic;
command.link={};
command.link.description="Hyperlink <a>";
command.link.image="images/link.png";
command.link.key="l";
command.link.textOp=function(_159,_15a){
return command.doLinkOrImage(_159,false,_15a);
};
command.undo={};
command.undo.description="Undo";
command.undo.image="images/undo.png";
command.undo.execute=function(_15b){
_15b.undo();
};
command.redo={};
command.redo.description="Redo";
command.redo.image="images/redo.png";
command.redo.execute=function(_15c){
_15c.redo();
};
util.findPanes=function(_15d){
_15d.preview=_15d.preview||util.getElementsByClass("wmd-preview",null,"div")[0];
_15d.output=_15d.output||util.getElementsByClass("wmd-output",null,"textarea")[0];
_15d.output=_15d.output||util.getElementsByClass("wmd-output",null,"div")[0];
if(!_15d.input){
var _15e=-1;
var _15f=doc.getElementsByTagName("textarea");
for(var _160=0;_160<_15f.length;_160++){
var _161=_15f[_160];
if(_161!=_15d.output&&!/wmd-ignore/.test(_161.className.toLowerCase())){
_15d.input=_161;
break;
}
}
}
return _15d;
};
util.makeAPI=function(){
wmd.wmd={};
wmd.wmd.editor=wmd.editor;
wmd.wmd.previewManager=wmd.previewManager;
};
util.startEditor=function(){
if(wmd.wmd_env.autostart==false){
wmd.editorInit();
util.makeAPI();
return;
}
var _162={};
var _163,_164;
var _165=function(){
try{
var _166=util.cloneObject(_162);
util.findPanes(_162);
if(!util.objectsEqual(_166,_162)&&_162.input){
if(!_163){
wmd.editorInit();
var _167;
if(wmd.previewManager!=undefined){
_164=new wmd.previewManager(_162);
_167=_164.refresh;
}
_163=new wmd.editor(_162.input,_167);
}else{
if(_164){
_164.refresh(true);
}
}
}
}
catch(e){
}
};
util.addEvent(self,"load",_165);
var _168=self.setInterval(_165,100);
};
wmd.previewManager=function(_169){
var _16a=this;
var _16b,_16c;
var _16d,_16e;
var _16f,_170;
var _171=3000;
var _172="delayed";
var _173=function(_174,_175){
util.addEvent(_174,"input",_175);
_174.onpaste=_175;
_174.ondrop=_175;
util.addEvent(self,"keypress",_175);
util.addEvent(_174,"keypress",_175);
util.addEvent(_174,"keydown",_175);
_16c=new wmd.inputPoller(_174,_175);
};
var _176=function(){
var _177=0;
if(self.innerHeight){
_177=self.pageYOffset;
}else{
if(doc.documentElement&&doc.documentElement.scrollTop){
_177=doc.documentElement.scrollTop;
}else{
if(doc.body){
_177=doc.body.scrollTop;
}
}
}
return _177;
};
var _178=function(){
if(!_169.preview&&!_169.output){
return;
}
var text=_169.input.value;
if(text&&text==_16f){
return;
}else{
_16f=text;
}
var _17a=new Date().getTime();
if(!_16b&&wmd.showdown){
_16b=new wmd.showdown.converter();
}
text=util.escapeUnderscores(text);
if(_16b){
text=_16b.makeHtml(text);
}
var _17b=new Date().getTime();
_16e=_17b-_17a;
_17c(text);
_170=text;
};
var _17d=function(){
if(_16d){
self.clearTimeout(_16d);
_16d=undefined;
}
if(_172!="manual"){
var _17e=0;
if(_172=="delayed"){
_17e=_16e;
}
if(_17e>_171){
_17e=_171;
}
_16d=self.setTimeout(_178,_17e);
}
};
var _17f;
var _180;
var _181=function(_182){
if(_182.scrollHeight<=_182.clientHeight){
return 1;
}
return _182.scrollTop/(_182.scrollHeight-_182.clientHeight);
};
var _183=function(_184,_185){
_184.scrollTop=(_184.scrollHeight-_184.clientHeight)*_185;
};
var _186=function(){
if(_169.preview){
_17f=_181(_169.preview);
}
if(_169.output){
_180=_181(_169.output);
}
};
var _187=function(){
if(_169.preview){
_169.preview.scrollTop=_169.preview.scrollTop;
_183(_169.preview,_17f);
}
if(_169.output){
_183(_169.output,_180);
}
};
this.refresh=function(_188){
if(_188){
_16f="";
_178();
}else{
_17d();
}
};
this.processingTime=function(){
return _16e;
};
this.output=function(){
return _170;
};
this.setUpdateMode=function(_189){
_172=_189;
_16a.refresh();
};
var _18a=true;
var _17c=function(text){
_186();
var _18c=position.getTop(_169.input)-_176();
if(_169.output){
if(_169.output.value!=undefined){
_169.output.value=text;
_169.output.readOnly=true;
}else{
var _18d=text.replace(/&/g,"&amp;");
_18d=_18d.replace(/</g,"&lt;");
_169.output.innerHTML="<pre><code>"+_18d+"</code></pre>";
}
}
if(_169.preview){
_169.preview.innerHTML=text;
}
_187();
if(_18a){
_18a=false;
return;
}
var _18e=position.getTop(_169.input)-_176();
if(nav.userAgent.indexOf("MSIE")!=-1){
self.setTimeout(function(){
self.scrollBy(0,_18e-_18c);
},0);
}else{
self.scrollBy(0,_18e-_18c);
}
};
var init=function(){
_173(_169.input,_17d);
_178();
if(_169.preview){
_169.preview.scrollTop=0;
}
if(_169.output){
_169.output.scrollTop=0;
}
};
this.destroy=function(){
if(_16c){
_16c.destroy();
}
};
init();
};
};
if(Attacklab.fileLoaded){
Attacklab.fileLoaded("wmd-base.js");
}

