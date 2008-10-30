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

_7.setLeft=function(_77,_78,_79){
var _7a=_7.getPixelVal(_77.style.left);
if(_7a==undefined){
_77.style.left=_78+"px";
_7a=_78;
}
var _7b=_7.getLeft(_77,_79)-_7a;
_77.style.left=(_78-_7b)+"px";
};
_7.getHeight=function(_7c){
var _7d=_7c.offsetHeight;
if(!_7d){
_7d=_7c.scrollHeight;
}
return _7d;
};
_7.setHeight=function(_7e,_7f){
var _80=_7.getPixelVal(_7e.style.height);
if(_80==undefined){
_7e.style.height=_7f+"px";
_80=_7f;
}
var _81=_7.getHeight(_7e)-_80;
if(_81>_7f){
_81=_7f;
}
_7e.style.height=(_7f-_81)+"px";
};
_7.getWidth=function(_82){
var _83=_82.offsetWidth;
if(!_83){
_83=_82.scrollWidth;
}
return _83;
};
_7.setWidth=function(_84,_85){
var _86=_7.getPixelVal(_84.style.width);
if(_86==undefined){
_84.style.width=_85+"px";
_86=_85;
}
var _87=_7.getWidth(_84)-_86;
if(_87>_85){
_87=_85;
}
_84.style.width=(_85-_87)+"px";
};
_7.getWindowHeight=function(){
if(_1.innerHeight){
return _1.innerHeight;
}else{
if(_3.documentElement&&_3.documentElement.clientHeight){
return _3.documentElement.clientHeight;
}else{
if(_3.body){
return _3.body.clientHeight;
}
}
}
};
_2.inputPoller=function(_88,_89,_8a){
var _8b=this;
var _8c;
var _8d;
var _8e,_8f;
this.tick=function(){
if(!_6.elementOk(_88)){
return;
}
if(_88.selectionStart||_88.selectionStart==0){
var _90=_88.selectionStart;
var _91=_88.selectionEnd;
if(_90!=_8c||_91!=_8d){
_8c=_90;
_8d=_91;
if(_8e!=_88.value){
_8e=_88.value;
return true;
}
}
}
return false;
};
var _92=function(){
if(_6.getStyle(_88,"display")=="none"){
return;
}
if(_8b.tick()){
_89();
}
};
var _93=function(){
if(_8a==undefined){
_8a=500;
}
_8f=_1.setInterval(_92,_8a);
};
this.destroy=function(){
_1.clearInterval(_8f);
};
_93();
};
_2.undoManager=function(_94,_95){
var _96=this;
var _97=[];
var _98=0;
var _99="none";
var _9a;
var _9b;
var _9c;
var _9d;
var _9e=function(_9f,_a0){
if(_99!=_9f){
_99=_9f;
if(!_a0){
_a1();
}
}
if(!_2.Util.IE||_99!="moving"){
_9c=_1.setTimeout(_a2,1);
}else{
_9d=null;
}
};
var _a2=function(){
_9d=new _2.textareaState(_94);
_9b.tick();
_9c=undefined;
};
this.setCommandMode=function(){
_99="command";
_a1();
_9c=_1.setTimeout(_a2,0);
};
this.canUndo=function(){
return _98>1;
};
this.canRedo=function(){
if(_97[_98+1]){
return true;
}
return false;
};
this.undo=function(){
if(_96.canUndo()){
if(_9a){
_9a.restore();
_9a=null;
}else{
_97[_98]=new _2.textareaState(_94);
_97[--_98].restore();
if(_95){
_95();
}
}
}
_99="none";
_94.focus();
_a2();
};
this.redo=function(){
if(_96.canRedo()){
_97[++_98].restore();
if(_95){
_95();
}
}
_99="none";
_94.focus();
_a2();
};
var _a1=function(){
var _a3=_9d||new _2.textareaState(_94);
if(!_a3){
return false;
}
if(_99=="moving"){
if(!_9a){
_9a=_a3;
}
return;
}
if(_9a){
if(_97[_98-1].text!=_9a.text){
_97[_98++]=_9a;
}
_9a=null;
}
_97[_98++]=_a3;
_97[_98+1]=null;
if(_95){
_95();
}
};
var _a4=function(_a5){
var _a6=false;
if(_a5.ctrlKey||_a5.metaKey){
var _a7=(_a5.charCode||_a5.keyCode)|96;
var _a8=String.fromCharCode(_a7);
switch(_a8){
case "y":
_96.redo();
_a6=true;
break;
case "z":
if(!_a5.shiftKey){
_96.undo();
}else{
_96.redo();
}
_a6=true;
break;
}
}
if(_a6){
if(_a5.preventDefault){
_a5.preventDefault();
}
if(_1.event){
_1.event.returnValue=false;
}
return;
}
};
var _a9=function(_aa){
if(!_aa.ctrlKey&&!_aa.metaKey){
var _ab=_aa.keyCode;
if((_ab>=33&&_ab<=40)||(_ab>=63232&&_ab<=63235)){
_9e("moving");
}else{
if(_ab==8||_ab==46||_ab==127){
_9e("deleting");
}else{
if(_ab==13){
_9e("newlines");
}else{
if(_ab==27){
_9e("escape");
}else{
if((_ab<16||_ab>20)&&_ab!=91){
_9e("typing");
}
}
}
}
}
}
};
var _ac=function(){
_6.addEvent(_94,"keypress",function(_ad){
if((_ad.ctrlKey||_ad.metaKey)&&(_ad.keyCode==89||_ad.keyCode==90)){
_ad.preventDefault();
}
});
var _ae=function(){
if(_2.Util.IE||(_9d&&_9d.text!=_94.value)){
if(_9c==undefined){
_99="paste";
_a1();
_a2();
}
}
};
_9b=new _2.inputPoller(_94,_ae,100);
_6.addEvent(_94,"keydown",_a4);
_6.addEvent(_94,"keydown",_a9);
_6.addEvent(_94,"mousedown",function(){
_9e("moving");
});
_94.onpaste=_ae;
_94.ondrop=_ae;
};
var _af=function(){
_ac();
_a2();
_a1();
};
this.destroy=function(){
if(_9b){
_9b.destroy();
}
};
_af();
};
_2.editor=function(_b0,_b1){
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
var _c3=new _2.textareaState(_b0);
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
if(_2.Util.newIE){
_cc.filter="";
}
if(_2.Util.oldIE){
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
if(_2.Util.oldIE){
_cc.borderColor="fuchsia";
_cc.filter="chroma(color=fuchsia)"+_cc.filter;
}
};
}else{
_cc.opacity="0.4";
_cc.KHTMLOpacity="0.4";
if(_2.Util.oldIE){
_cc.filter="chroma(color=fuchsia) alpha(opacity=40)";
}
if(_2.Util.newIE){
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
var _d1=_6.createImage("images/separator.png",20,20);
_d1.style.padding="4px";
_d1.style.paddingTop="0px";
_b9.appendChild(_d1);
};
var _d2=function(_d3){
if(_d3.image){
var _d4=_6.createImage(_d3.image,16,16);
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
_ba=_6.makeElement("div");
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
var _de=_7.getTop(_b0);
_b0.style.marginTop="0";
var _df=_7.getTop(_b0);
_b4=_de-_df;
_e0();
_b0.parentNode.insertBefore(_ba,_b0);
_e1();
_6.skin(_b8,_2.basePath+"images/bg.png",_b2,_b3);
_dd.visibility="visible";
return true;
}
return false;
};
var _e2=function(){
var _e3=_2.wmd_env.buttons.split(/\s+/);
for(var _e4 in _e3){
switch(_e3[_e4]){
case "|":
_cf();
break;
case "bold":
_cd(_8.bold);
break;
case "italic":
_cd(_8.italic);
break;
case "link":
_cd(_8.link);
break;
}
if(_2.full){
switch(_e3[_e4]){
case "blockquote":
_cd(_8.blockquote);
break;
case "code":
_cd(_8.code);
break;
case "image":
_cd(_8.img);
break;
case "ol":
_cd(_8.ol);
break;
case "ul":
_cd(_8.ul);
break;
case "heading":
_cd(_8.h1);
break;
case "hr":
_cd(_8.hr);
break;
}
}
}
return;
};
var _e5=function(){
if(/\?noundo/.test(_3.location.href)){
_2.nativeUndo=true;
}
if(!_2.nativeUndo){
_bd=new _2.undoManager(_b0,function(){
_b1();
_db();
});
}
var _e6=_b0.parentNode;
_b8=_6.makeElement("div");
_b8.style.display="block";
_b8.style.zIndex=100;
if(!_2.full){
_b8.title+="\n(Free Version)";
}
_b8.unselectable="on";
_b8.onclick=function(){
_b0.focus();
};
_b9=_6.makeElement("span");
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
_cd(_8.autoindent);
var _e8=_6.createImage("images/bg.png");
var _e9=_6.createImage("images/bg-fill.png");
_e2();
_d9();
if(_bd){
_d0();
_be=_d2(_8.undo);
_bf=_d2(_8.redo);
var _ea=_5.platform.toLowerCase();
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
if(_5.userAgent.indexOf("Opera")!=-1){
_eb="keypress";
}
_6.addEvent(_b0,_eb,function(_ec){
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
if(_1.event){
_1.event.returnValue=false;
}
}
});
_6.addEvent(_b0,"keyup",function(_f2){
if(_f2.shiftKey&&!_f2.ctrlKey&&!_f2.metaKey){
var _f3=(_f2.charCode||_f2.keyCode);
switch(_f3){
case 13:
_c7(_8.autoindent);
break;
}
}
});
if(!_dc()){
_bc=_1.setInterval(function(){
if(_dc()){
_1.clearInterval(_bc);
}
},100);
}
_6.addEvent(_1,"resize",_e1);
_bb=_1.setInterval(_e1,100);
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
if(_2.showdown){
var _f6=new _2.showdown.converter();
}
var _f7=_b0.value;
var _f8=function(){
_b0.value=_f7;
};
_f7=_6.escapeUnderscores(_f7);
if(!/markdown/.test(_2.wmd_env.output.toLowerCase())){
if(_f6){
_b0.value=_f6.makeHtml(_f7);
_1.setTimeout(_f8,0);
}
}
return true;
};
var _e0=function(){
var _f9=_6.makeElement("div");
var _fa=_f9.style;
_fa.paddingRight="15px";
_fa.height="100%";
_fa.display="block";
_fa.position="absolute";
_fa.right="0";
_f9.unselectable="on";
var _fb=_6.makeElement("a");
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
var _fc=_6.createImage("images/wmd.png");
var _fd=_6.createImage("images/wmd-on.png");
_fb.appendChild(_fc);
_fb.onmouseover=function(){
_6.setImage(_fc,"images/wmd-on.png");
_fb.style.cursor="pointer";
};
_fb.onmouseout=function(){
_6.setImage(_fc,"images/wmd.png");
};
_b8.appendChild(_fb);
};
var _e1=function(){
if(!_6.elementOk(_b0)){
_b8.style.display="none";
return;
}
if(_b8.style.display=="none"){
_b8.style.display="block";
}
var _fe=_7.getWidth(_b0);
var _ff=_7.getHeight(_b0);
var _100=_7.getLeft(_b0);
if(_b8.style.width==_fe+"px"&&_b5==_ff&&_b6==_100){
if(_7.getTop(_b8)<_7.getTop(_b0)){
return;
}
}
_b5=_ff;
_b6=_100;
var _101=100;
_b8.style.width=Math.max(_fe,_101)+"px";
var root=_b8.offsetParent;
var _103=_7.getHeight(_b9);
var _104=_103-_b2+"px";
_b8.style.height=_104;
if(_6.fillers){
_6.fillers[0].style.height=_6.fillers[1].style.height=_104;
}
var _105=3;
_b0.style.marginTop=_103+_105+_b4+"px";
var _106=_7.getTop(_b0);
var _100=_7.getLeft(_b0);
_7.setTop(root,_106-_103-_105);
_7.setLeft(root,_100);
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
_1.clearInterval(_bb);
_1.clearInterval(_bc);
};
init();
};
_2.textareaState=function(_108){
var _109=this;
var _10a=function(_10b){
if(_6.getStyle(_108,"display")=="none"){
return;
}
var _10c=_5.userAgent.indexOf("Opera")!=-1;
if(_10b.selectionStart!=undefined&&!_10c){
_10b.focus();
_10b.selectionStart=_109.start;
_10b.selectionEnd=_109.end;
_10b.scrollTop=_109.scrollTop;
}else{
if(_3.selection){
if(_3.activeElement&&_3.activeElement!=_108){
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
if(_6.getStyle(_108,"display")=="none"){
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
if(_3.selection){
_109.text=_110(_108.value);
var _112=_3.selection.createRange();
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
var _119=new _2.Chunks();
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
var _11b=_5.userAgent.indexOf("Opera")!=-1;
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
_2.Chunks=function(){
};
_2.Chunks.prototype.findTags=function(_11c,_11d){
var _11e,_11f;
var _120=this;
if(_11c){
_11f=_6.regexToString(_11c);
_11e=new _4(_11f.expression+"$",_11f.flags);
this.before=this.before.replace(_11e,function(_121){
_120.startTag=_120.startTag+_121;
return "";
});
_11e=new _4("^"+_11f.expression,_11f.flags);
this.selection=this.selection.replace(_11e,function(_122){
_120.startTag=_120.startTag+_122;
return "";
});
}
if(_11d){
_11f=_6.regexToString(_11d);
_11e=new _4(_11f.expression+"$",_11f.flags);
this.selection=this.selection.replace(_11e,function(_123){
_120.endTag=_123+_120.endTag;
return "";
});
_11e=new _4("^"+_11f.expression,_11f.flags);
this.after=this.after.replace(_11e,function(_124){
_120.endTag=_124+_120.endTag;
return "";
});
}
};
_2.Chunks.prototype.trimWhitespace=function(_125){
this.selection=this.selection.replace(/^(\s*)/,"");
if(!_125){
this.before+=_4.$1;
}
this.selection=this.selection.replace(/(\s*)$/,"");
if(!_125){
this.after=_4.$1+this.after;
}
};
_2.Chunks.prototype.skipLines=function(_126,_127,_128){
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
this.startTag=this.startTag+_4.$1;
this.selection=this.selection.replace(/(\n*$)/,"");
this.endTag=this.endTag+_4.$1;
this.startTag=this.startTag.replace(/(^\n*)/,"");
this.before=this.before+_4.$1;
this.endTag=this.endTag.replace(/(\n*$)/,"");
this.after=this.after+_4.$1;
if(this.before){
_129=_12a="";
while(_126--){
_129+="\\n?";
_12a+="\n";
}
if(_128){
_129="\\n*";
}
this.before=this.before.replace(new _4(_129+"$",""),_12a);
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
this.after=this.after.replace(new _4(_129,""),_12a);
}
};
_8.prefixes="(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)";
_8.unwrap=function(_12b){
var _12c=new _4("([^\\n])\\n(?!(\\n|"+_8.prefixes+"))","g");
_12b.selection=_12b.selection.replace(_12c,"$1 $2");
};
_8.wrap=function(_12d,len){
_8.unwrap(_12d);
var _12f=new _4("(.{1,"+len+"})( +|$\\n?)","gm");
_12d.selection=_12d.selection.replace(_12f,function(_130,line){
if(new _4("^"+_8.prefixes,"").test(_130)){
return _130;
}
return line+"\n";
});
_12d.selection=_12d.selection.replace(/\s+$/,"");
};
_8.doBold=function(_132){
return _8.doBorI(_132,2,"strong text");
};
_8.doItalic=function(_133){
return _8.doBorI(_133,1,"emphasized text");
};
_8.doBorI=function(_134,_135,_136){
_134.trimWhitespace();
_134.selection=_134.selection.replace(/\n{2,}/g,"\n");
_134.before.search(/(\**$)/);
var _137=_4.$1;
_134.after.search(/(^\**)/);
var _138=_4.$1;
var _139=Math.min(_137.length,_138.length);
if((_139>=_135)&&(_139!=2||_135!=1)){
_134.before=_134.before.replace(_4("[*]{"+_135+"}$",""),"");
_134.after=_134.after.replace(_4("^[*]{"+_135+"}",""),"");
return;
}
if(!_134.selection&&_138){
_134.after=_134.after.replace(/^([*_]*)/,"");
_134.before=_134.before.replace(/(\s?)$/,"");
var _13a=_4.$1;
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
_8.stripLinkDefs=function(_13c,_13d){
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
_8.addLinkDef=function(_143,_144){
var _145=0;
var _146={};
_143.before=_8.stripLinkDefs(_143.before,_146);
_143.selection=_8.stripLinkDefs(_143.selection,_146);
_143.after=_8.stripLinkDefs(_143.after,_146);
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
_8.doLinkOrImage=function(_151,_152,_153){
_151.trimWhitespace();
_151.findTags(/\s*!?\[/,/\][ ]?(?:\n[ ]*)?(\[.*?\])?/);
if(_151.endTag.length>1){
_151.startTag=_151.startTag.replace(/!?\[/,"");
_151.endTag="";
_8.addLinkDef(_151,null);
}else{
if(/\n\n/.test(_151.selection)){
_8.addLinkDef(_151,null);
return;
}
var _154;
var _155=function(_156){
if(_156!=null){
_151.startTag=_151.endTag="";
var _157=" [999]: "+_156;
var num=_8.addLinkDef(_151,_157);
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
_154=_6.prompt("<p style='margin-top: 0px'><b>Enter the image URL.</b></p><p>You can also add a title, which will be displayed as a tool tip.</p><p>Example:<br />http://wmd-editor.com/images/cloud1.jpg   \"Optional title\"</p>","http://",_155);
}else{
_154=_6.prompt("<p style='margin-top: 0px'><b>Enter the web address.</b></p><p>You can also add a title, which will be displayed as a tool tip.</p><p>Example:<br />http://wmd-editor.com/   \"Optional title\"</p>","http://",_155);
}
return true;
}
};
_8.bold={};
_8.bold.description="Strong <strong>";
_8.bold.image="images/bold.png";
_8.bold.key="b";
_8.bold.textOp=_8.doBold;
_8.italic={};
_8.italic.description="Emphasis <em>";
_8.italic.image="images/italic.png";
_8.italic.key="i";
_8.italic.textOp=_8.doItalic;
_8.link={};
_8.link.description="Hyperlink <a>";
_8.link.image="images/link.png";
_8.link.key="l";
_8.link.textOp=function(_159,_15a){
return _8.doLinkOrImage(_159,false,_15a);
};
_8.undo={};
_8.undo.description="Undo";
_8.undo.image="images/undo.png";
_8.undo.execute=function(_15b){
_15b.undo();
};
_8.redo={};
_8.redo.description="Redo";
_8.redo.image="images/redo.png";
_8.redo.execute=function(_15c){
_15c.redo();
};
_6.findPanes=function(_15d){
_15d.preview=_15d.preview||_6.getElementsByClass("wmd-preview",null,"div")[0];
_15d.output=_15d.output||_6.getElementsByClass("wmd-output",null,"textarea")[0];
_15d.output=_15d.output||_6.getElementsByClass("wmd-output",null,"div")[0];
if(!_15d.input){
var _15e=-1;
var _15f=_3.getElementsByTagName("textarea");
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
_6.makeAPI=function(){
_2.wmd={};
_2.wmd.editor=_2.editor;
_2.wmd.previewManager=_2.previewManager;
};
_6.startEditor=function(){
if(_2.wmd_env.autostart==false){
_2.editorInit();
_6.makeAPI();
return;
}
var _162={};
var _163,_164;
var _165=function(){
try{
var _166=_6.cloneObject(_162);
_6.findPanes(_162);
if(!_6.objectsEqual(_166,_162)&&_162.input){
if(!_163){
_2.editorInit();
var _167;
if(_2.previewManager!=undefined){
_164=new _2.previewManager(_162);
_167=_164.refresh;
}
_163=new _2.editor(_162.input,_167);
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
_6.addEvent(_1,"load",_165);
var _168=_1.setInterval(_165,100);
};
_2.previewManager=function(_169){
var _16a=this;
var _16b,_16c;
var _16d,_16e;
var _16f,_170;
var _171=3000;
var _172="delayed";
var _173=function(_174,_175){
_6.addEvent(_174,"input",_175);
_174.onpaste=_175;
_174.ondrop=_175;
_6.addEvent(_1,"keypress",_175);
_6.addEvent(_174,"keypress",_175);
_6.addEvent(_174,"keydown",_175);
_16c=new _2.inputPoller(_174,_175);
};
var _176=function(){
var _177=0;
if(_1.innerHeight){
_177=_1.pageYOffset;
}else{
if(_3.documentElement&&_3.documentElement.scrollTop){
_177=_3.documentElement.scrollTop;
}else{
if(_3.body){
_177=_3.body.scrollTop;
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
if(!_16b&&_2.showdown){
_16b=new _2.showdown.converter();
}
text=_6.escapeUnderscores(text);
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
_1.clearTimeout(_16d);
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
_16d=_1.setTimeout(_178,_17e);
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
var _18c=_7.getTop(_169.input)-_176();
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
var _18e=_7.getTop(_169.input)-_176();
if(_5.userAgent.indexOf("MSIE")!=-1){
_1.setTimeout(function(){
_1.scrollBy(0,_18e-_18c);
},0);
}else{
_1.scrollBy(0,_18e-_18c);
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

