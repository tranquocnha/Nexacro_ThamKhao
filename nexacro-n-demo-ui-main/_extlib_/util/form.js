if (nexacro._Browser != "Runtime") {
    if (window.console) {
        window.trace = window.console.log;
        var console = window.console || { log: function () { } };
    }
}

function loadScript(url, callback) {
    if (system.navigatorname === "nexacro") return;

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = false;

    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback(url);
            }
        };
    } else {  //Others
        script.onload = function () {
            callback(url);
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};

/**
 * 지정된 항목이 처음 나오는 배열 위치를 반환한다.
 * @param {object} item 찾고자 하는 Item.
 * @param {number=} from 검색의 시작 위치 (default: 0).
 * @param {boolean=} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
 * @return {number} 검색된 배열 위치. 없다면 -1 리턴.
 * @memberOf Array
 */
Array.prototype.indexOf = function (item, from, strict) {
    var len = this.length;
    if (from == null) from = 0;
    strict = !!strict;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);

    if (from < 0) {
        from += len;
    }

    if (strict) {
        for (; from < len; from++) {
            if (this[from] === item) {
                return from;
            }
        }
    }
    else {
        for (; from < len; from++) {
            if (this[from] == item) {
                return from;
            }
        }
    }

    return -1;
}

/**
 * 지정된 항목이 처음 나오는 배열 위치를 뒤에서부터 찾아 반환한다.
 * @param {object} item 찾고자 하는 Item.
 * @param {number=} from 검색 시작 위치 (default: Last Index).
 * @param {boolean=} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
 * @return {number} 검색된 배열 위치. 없다면 -1 리턴.
 * @memberOf Array
 */
Array.prototype.lastIndexOf = function (item, from, strict) {
    var i;

    if (from == null) {
        from = this.length - 1;
    }
    else if (from < 0) {
        from = Math.max(0, this.length + from);
    }

    var strict = strict || false;

    if (strict) {
        for (i = from; i >= 0; i--) {
            if (this[i] === item) {
                return i;
            }
        }
    }
    else {
        for (i = from; i >= 0; i--) {
            if (this[i] == item) {
                return i;
            }
        }
    }

    return -1;
}

/**
 * 지정된 항목이 배열에 포함되어 있는지 확인한다.
 * @param {object} item 찾고자 하는 Item.
 * @param {boolean=} strict true: 형변환 없이 비교('==='), false: 형변환 후 비교('==') (default: false).
 * @return {boolean} 포함되어 있다면 true, 없다면 false를 리턴.
 * @memberOf Array
 */
Array.prototype.contains = function (item, strict) {
    if (this.indexOf(item, null, strict) === -1) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 원하는 위치의 항목을 배열에서 삭제 처리한다.
 * @param {number} index remove하고자 하는 item index.
 * @memberOf Array
 */
Array.prototype.removeAt = function (index) {
    this.splice(index, 1);
}

/**
 * 원하는 항목을 배열에서 삭제 처리한다.
 * @param {object} item remove하고자 하는 item.
 * @memberOf Array
 */
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);

    if (index !== -1) {
        this.splice(index, 1);
    }
}

/**
 * value의 빈값 여부 반환.<br>
 * 1. null, undefined type : true 반환<br>
 * 2. string, array type : length 가 0인 경우 true 반환<br>
 * 3. object type : 하위 속성이 존재할 경우 true 반환<br>
 * 4. boolean, number, date type : false 반환
 *
 * @param {*} value 확인할 value.
 * @return {boolean} empty 여부.
 * @memberOf nexacro
 */
nexacro.isEmpty = function (value) {
    // null, undefined ==> true
    if (value == null) return true;

    // String, Array ==> length == 0
    if (nexacro._isString(value) || nexacro._isArray(value)) {
        return value.length == 0 ? true : false;
    }
    else if (nexacro._isObject(value)) {
        for (var p in value) {
            if (value.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }

    return false;
};

nexacro.Form.prototype.getCurrentLayoutName = function () {
    return this._current_layout_name;
};

nexacro.Form.prototype.gfnFormOnLoad = function () {
    this.addEventHandler("onlayoutchanged", function (obj, e) {
        nexacro.applyI18n(obj);
        var p = this.parent.parent,
            height = obj._layout_list[e.newlayout].height;
        p["mainPageOnLoad"].call(p, height);
    }, this);

    nexacro.applyI18n(this);

    var p = this.parent.parent,
        height = this._layout_list[this.getCurrentLayoutName()].height;
    if (this.parent.name == "divMain") {
        p["mainPageOnLoad"].call(p, height);
    } else if (this.parent.name == "divDesc") {
        p["descPageOnLoad"].call(p, height);
    }
};

nexacro.applyI18n = function (obj) {
    var comps = obj.components;

    for (var i = 0, len = comps.length; i < len; i++) {
        var comp = comps[i], messageid = "";

        if (comp instanceof Div || comp instanceof PopupDiv) {
            messageid = comp.messageid;
            messageid && comp.set_text(nexacro.getApplication().messages[messageid]);
            nexacro.applyI18n(comp.form);
            comp.form.resetScroll();
        } else if (comp instanceof Tab) {
            var tabpages = comp.tabpages;
            for (var i = 0, len = tabpages.length; i < len; i++) {
                messageid = tabpages[i].messageid;
                messageid && tabpages[i].set_text(nexacro.getApplication().messages[messageid]);
                nexacro.applyI18n(tabpages[i].form);
                tabpages[i].form.resetScroll();
            }
        } else if (comp instanceof CheckBox || comp instanceof GroupBox
            || comp instanceof Static || comp instanceof ImageViewer
            || comp instanceof Button) {
            messageid = comp.messageid;
            messageid && comp.set_text(nexacro.getApplication().messages[messageid]);
            comp.tooltipmessageid && comp.set_tooltiptext(nexacro.getApplication().messages[comp.tooltipmessageid]);
        } else if (comp instanceof Calendar || comp instanceof Combo
            || comp instanceof Edit || comp instanceof MaskEdit
            || comp instanceof Spin || comp instanceof TextArea) {
            messageid = comp.messageid;
            messageid && comp.set_displaynulltext(nexacro.getApplication().messages[messageid]);
        } else if (comp instanceof Grid) {
            var nCount = comp.getCellCount("head");
            for (var j = 0; j < nCount; j++) {
                messageid = comp.getCellProperty("head", j, "messageid");
                messageid && comp.setCellProperty("head", j, "text", nexacro.getApplication().messages[messageid]);
            }
        }
    }

    obj.resetScroll();
};

nexacro.Form.prototype.openMain = function () {
    var app = nexacro.getApplication(),
        rootForm = app.mainframe.childframe.form,
        topForm = app.mainframe.childframe.form.divTop.form;

    // background style
    rootForm["Static01"].set_visible(false);
    rootForm["Static03"].set_visible(true);
    rootForm["Static04"].set_visible(true);

    if (topForm.getCurrentLayoutName() == "default") {
        topForm["setMainTitle"].call(topForm);
        rootForm["setDescVisible"].call(rootForm, false);
    } else {
        rootForm["divLeftMenu"].set_width(0);
        rootForm["divWork"].set_width(1263);
    }

    rootForm["divWork"].set_url("frame::main.xfdl");

    rootForm.resetScroll();

    if (system.navigatorname.indexOf("nexacro") == -1) {
        MyHistory.setLocationHash("main", "");
    }
};

nexacro.Form.prototype.openMenu = function (menuId) {
    var app = nexacro.getApplication(),
        rowIdx = app.gdsMenu.findRowNF("id", menuId);

    if (rowIdx > -1) {
        var upid = app.gdsMenu.getColumnNF(rowIdx, "upid"),
            menuName = app.gdsMenu.getColumnNF(rowIdx, "caption"),
            menuUrl = app.gdsMenu.getColumnNF(rowIdx, "url"),
            rootForm = app.mainframe.childframe.form,
            topForm = app.mainframe.childframe.form.divTop.form,
            topButton = topForm.components["btnMenu_" + upid];

        // background style
        rootForm["Static01"].set_visible(true);
        rootForm["Static03"].set_visible(false);
        rootForm["Static04"].set_visible(false);

        rootForm["divWork"].set_url("frame::work.xfdl");

        if (topButton) topButton.click();

        if (topForm.getCurrentLayoutName() == "default") {
            topForm["setMenuTitle"].call(topForm, menuName);
            rootForm["setDescVisible"].call(rootForm, true);
        } else {
            rootForm["divLeftMenu"].set_width(273);
            rootForm["divWork"].set_width(990);
        }

        var leftForm = app.mainframe.childframe.form.divLeftMenu.form.divSubMenu.form,
            leftButton = leftForm.components["btnMenu_" + menuId];

        if (leftButton) leftButton.click();

        if (system.navigatorname.indexOf("nexacro") == -1) {
            gtag('event', 'page_view', {
                page_path: menuUrl,
                page_title: menuName
            });
        }
    }
};

nexacro.Form.prototype.openPopup = function (frameId, formUrl, objArgList, options, sPopupCallback, bModeless) {
    var nLeft = -1, nTop = -1, nWidth = 1, nHeight = 1,
        bShowTitle = true, bShowStatus = false, bLayered = false, nOpacity = 1,
        bAutoSize = true, bResizable = true, sOpenstatus = "normal", sDragMoveType = "all",
        sTitleText = "", objParentFrame = this.getOwnerFrame();

    options += "";
    var aVal = options.trim().split(" ");
    for (var i = 0; i < aVal.length; i++) {
        var aVal2 = aVal[i].trim().split("=");
        switch (aVal2[0]) {
            case "top":
                nTop = parseInt(aVal2[1]);
                break;
            case "left":
                nLeft = parseInt(aVal2[1]);
                break;
            case "width":
                nWidth = parseInt(aVal2[1]);
                break;
            case "height":
                nHeight = parseInt(aVal2[1]);
                break;
            case "title":
            case "titlebar":
            case "showtitlebar":
                bShowTitle = aVal2[1];
                break;
            case "titletext":
                sTitleText = aVal2[1];
                break;
            case "status":
            case "statusbar":
            case "showstatusbar":
                bShowStatus = aVal2[1];
                break;
            case "layered":
                bLayered = aVal2[1];
                break;
            case "opacity":
                nOpacity = aVal2[1];
                break;
            case "autosize":
                bAutoSize = aVal2[1];
                break;
            case "resizable":
                bResizable = aVal2[1];
                break;
            case "round":
                bRound = aVal2[1];
                break;
            case "openstatus":
                sOpenstatus = aVal2[1];
                break;
        }
    }
    var sOpenalign = "";
    sOpenalign = "center middle";

    if (nWidth == 1) nWidth = 600;
    if (nHeight == 1) nHeight = 500;

    if (nLeft == -1) {
        nLeft = (nexacro.getApplication().mainframe.width - nWidth) / 2;
        if (bModeless) nLeft += system.clientToScreenX(nexacro.getApplication().mainframe, 0);
    }
    if (nTop == -1) {
        nTop = (nexacro.getApplication().mainframe.height - nHeight) / 2;
        if (bModeless) nTop += system.clientToScreenY(nexacro.getApplication().mainframe, 0);
    }

    if (bModeless) {
        //열린 modeless 팝업 화면이 존재하면 focus 처리 후 리턴.
        var objPopFrams = nexacro.getPopupFrames();

        var objPopFrame = objPopFrams[frameId];
        if (objPopFrame) {
            objPopFrame.setFocus();
            if (bReload == "true") {
                //arguments 셋팅
                if (!nexacro.isEmpty(objArgList)) {
                    if (!objPopFrame.arguments) objPopFrame.arguments = {};

                    for (var key in objArgList) {
                        if (objArgList.hasOwnProperty(key)) {
                            objPopFrame.arguments[key] = objArgList[key];
                        }
                    }
                }
                objPopFrame.form.reload();
            }
            return;
        }

        var sOpenStyle = "";

        if (bShowTitle == "false") sOpenStyle += "showtitlebar=false";
        if (bShowStatus == "true") sOpenStyle += " showstatusbar=true";
        if (bAutoSize == "false") sOpenStyle += " autosize=false";
        if (bResizable == "false") {
            sOpenStyle += " resizable=false";
        } else {
            sOpenStyle += " resizable=true";
        }
        nexacro.open(frameId, formUrl, objParentFrame, objArgList, sOpenStyle, nLeft, nTop, nWidth, nHeight, this);
    } else {
        newChild = new nexacro.ChildFrame;

        newChild.init(frameId, nLeft, nTop, nWidth, nHeight, null, null, formUrl);

        newChild.set_background("transparent");
        newChild.set_dragmovetype(sDragMoveType);
        newChild.set_showtitlebar(bShowTitle);
        newChild.set_titlebarheight(30);
        newChild.set_autosize(bAutoSize);
        newChild.set_resizable(bResizable);
        newChild.set_titletext(sTitleText);
        newChild.set_showstatusbar(bShowStatus);
        newChild.set_openalign(sOpenalign);
        newChild.set_layered(bLayered);
        newChild.set_opacity(nOpacity);
        newChild.set_boxShadow("0 3px 9px rgba(0,0,0,.5)");
        newChild.set_openstatus(sOpenstatus);

        //arguments 셋팅
        if (!nexacro.isEmpty(objArgList)) {
            if (!newChild.arguments) newChild.arguments = {};
            for (var key in objArgList) {
                if (objArgList.hasOwnProperty(key)) newChild.arguments[key] = objArgList[key];
            }
        }

        newChild.showModal(objParentFrame, objArgList, this, sPopupCallback);
    }
};

/**
 * @class 입력받은 Number에 컴마를 추가한다. <br>
 * @param {Number} nNumber - 숫자
 * @param {Number} [nDetail] - 반올림할 소숫점 이하의 자릿수.
 * @return {String} Comma 가 포함하고 있는 숫자
 */
nexacro.Form.prototype.gfnAppendComma = function (nNumber, nDetail) {
    if (nNumber == null) return "";
    if (nDetail == null) nDetail = 0;

    nNumber = parseFloat(nNumber);
    nNumber = nexacro.round(nNumber, nDetail);

    var strNumber = new String(nNumber);
    var arrNumber = strNumber.split(".");
    var strFormatNum = "";
    var j = 0;

    for (var i = arrNumber[0].length - 1; i >= 0; i--) {
        if (i != strNumber.length && j == 3) {
            strFormatNum = arrNumber[0].charAt(i) + "," + strFormatNum;
            j = 0;
        } else {
            strFormatNum = arrNumber[0].charAt(i) + strFormatNum;
        }
        j++;
    }

    if (arrNumber.length > 1) strFormatNum = strFormatNum + "." + arrNumber[1];

    return strFormatNum;
};