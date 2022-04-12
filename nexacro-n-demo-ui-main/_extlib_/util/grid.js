/**
 * @fileoverview 그리드 공통 기능 라이브러리
 */

/**
 * 컬럼 숨김 정보 구분자
 * @type {String}
 * @const
 */
const SEPARATOR_HIDING_INFOS = "||^||";

/**
 * 컬럼 숨김 정보
 * @type {Array}
 */
nexacro.Grid.prototype._hidingInfos = [];

/**
 * head cell에 match되는 body cell을 얻어온다
 * @param {number} headCellIndex head cell index
 * @param {boolean=} useColspan head cell 이 colspan 일 경우에도 반환값을 받을지 여부
 * @memberOf nexacro.Grid
 */
nexacro.Grid.prototype.getBodyCellIndex = function (headCellIndex, useColspan) {
    // Max Head Row Index
    var maxHeadRow = 0;
    for (var i = 0, len = this.getCellCount("head"); i < len; i++) {
        var row = this.getCellProperty("head", i, "row");
        if (maxHeadRow < row) {
            maxHeadRow = row;
        }
    }
    // Max Body Row Index
    var maxBodyRow = 0;
    for (var i = 0, len = this.getCellCount("body"); i < len; i++) {
        var row = this.getCellProperty("body", i, "row");
        if (maxBodyRow < row) {
            maxBodyRow = row;
        }
    }

    if (maxHeadRow == 0 && maxBodyRow == 0) {
        return headCellIndex;
    }

    // Body Row 가 1개 이상일 경우
    // Head의 row 가 Body의 row 보다 클 경우 차이 row 를 뺀 것을 대상으로 찾고
    // Body의 row 가 Head의 row 보다 크거나 같을 경우 row index가 같은 대상을 찾는다.
    var cellIndex = -1;
    var sRow = -1;
    var nRow = parseInt(this.getCellProperty("head", headCellIndex, "row"));
    var nCol = parseInt(this.getCellProperty("head", headCellIndex, "col"));
    var nColspan = parseInt(this.getCellProperty("head", headCellIndex, "colspan"));

    if (maxHeadRow > maxBodyRow) {
        sRow = nRow - (maxHeadRow - maxBodyRow);
        sRow = (sRow < 0 ? 0 : sRow);
    } else {
        sRow = nRow;
    }

    var cRow, cCol, cColspan;
    for (var i = 0, len = this.getCellCount("body"); i < len; i++) {
        cRow = parseInt(this.getCellProperty("body", i, "row"));
        cCol = parseInt(this.getCellProperty("body", i, "col"));
        cColspan = parseInt(this.getCellProperty("body", i, "colspan"));

        // colspan 이 적용된 cell 도 반환값을 사용할 경우 첫번째 항목에 매칭되는 index
        if (useColspan) {
            if (sRow == cRow && nCol <= cCol && cCol < (nCol + nColspan)) {
                cellIndex = i;
                break;
            }
        } else {
            if (sRow == cRow && nCol == cCol && nColspan == cColspan) {
                cellIndex = i;
                break;
            }
        }
    }
    return cellIndex;
};

/**
 * 주어진 칼럼정보에 해당하는 칼럼을 찾아 숨긴다.
 * @param  {number} col 컬럼 인덱스
 * @param  {number} headCellIndex 셀 인덱스
 * @memberOf nexacro.Grid
 */
nexacro.Grid.prototype.hideGridColumn = function (col, headCellIndex) {
    var columns = [];
    var info = {
        'col': col,
        'band': this.getFormatColProperty(col, "band"),
        'size': this.getRealColSize(col)
    };
    columns.push(info);

    // 해당 칼럼의 subcell 여부를 체크
    var band, bands = ["head", "body", "summ"];
    var cnt, subCell = 0,
        colspan = 0;
    for (var i = 0, len = bands.length; i < len; i++) {
        band = bands[i];
        cnt = this.getCellCount(band);
        for (var j = 0; j < cnt; j++) {
            if (col == this.getCellProperty(band, j, "col")) {
                subCell = Math.max(subCell, this.getCellProperty(band, j, "subcell"));
                colspan = Math.max(colspan, this.getCellProperty(band, j, "colspan"));
            }
        }
    }

    if (colspan > 1 && subCell > 0) {
        for (var i = 1; i < subCell; i++) {
            info = {
                'col': col + 1,
                'band': this.getFormatColProperty(col + 1, "band"),
                'size': this.getRealColSize(col + 1)
            };
            columns.push(info);
        }
    }

    var text = "";
    // checkbox 로 사용시
    if (this.getCellProperty("head", headCellIndex, "displaytype") == "checkbox") {
        text = "[CheckBox]]";
    }
    else {
        text = this.getCellProperty("head", headCellIndex, "text");
        if (nexacro.isEmpty(text)) {
            // subcell 이 존재할 경우
            var subcell = grid.getCellProperty("head", headCellIndex, "subcell");
            if (subcell > 0) {
                text = "";
                for (var i = 0; i < subcell; i++) {
                    if (i > 0) text += ' ';
                    text += this.getSubCellProperty("head", headCellIndex, i, "text");
                }
            }
        }
    }

    // 숨김 처리
    this.set_enableevent(false);
    for (var i = 0, len = columns.length; i < len; i++) {
        this.setFormatColProperty(columns[i].col, "size", 0);
    }
    this.set_enableevent(true);

    var hidingInfo = {
        'columns': columns,
        'text': text
    };
    this._hidingInfos.push(hidingInfo);
};

/**
 * 대상 그리드에 숨겨진 모든 칼럼을 보여준다.
 * @memberOf nexacro.Grid
 */
nexacro.Grid.prototype.showGridColumnAll = function () {
    var hidingInfos = this._hidingInfos;
    var info, columns;
    this.set_enableevent(false);
    for (var i = 0, len = hidingInfos.length; i < len; i++) {
        info = hidingInfos[i];
        columns = info.columns;

        for (var j = 0, len2 = columns.length; j < len2; j++) {
            this.setFormatColProperty(columns[j].col, "size", columns[j].size);
        }
    }
    this.set_enableevent(true);

    this._hidingInfos = [];
};

/**
 * 주어진 칼럼정보 index 에 해당하는 칼럼을 찾아 보여준다.
 * @param  {array} indexes 보여질 칼럼 정보 index
 * @memberOf nexacro.Grid
 */
nexacro.Grid.prototype.showGridColumnByIndex = function (indexes) {
    var hidingInfos = this._hidingInfos;
    var index, info, columns;

    this.set_enableevent(false);
    for (var i = 0, len = indexes.length; i < len; i++) {
        index = indexes[i];
        info = hidingInfos[index];
        columns = info.columns;

        for (var j = 0, len2 = columns.length; j < len2; j++) {
            this.setFormatColProperty(columns[j].col, "size", columns[j].size);
        }

        hidingInfos.removeAt(index);
    }
    this._hidingInfos = hidingInfos;
    this.set_enableevent(true);
};

/**
 * 컬럼 숨김 정보를 String으로 변환하여 가져온다.
 * @return {string} 컬럼 숨김 정보
 * @memberOf nexacro.Grid
 */
nexacro.Grid.prototype.getHidingInfos = function () {
    var hidingInfos = this._hidingInfos;

    if (hidingInfos.length == 0) {
        return;
    }

    var tmpStr = "";

    for (var i = 0, len = hidingInfos.length; i < len; i++) {
        if (hidingInfos[i]) {
            tmpStr += "{";
            var columns = hidingInfos[i].columns;
            var tmpColStr = "[";

            for (var j = 0, colLen = columns.length; j < colLen; j++) {
                tmpColStr += "{'col': " + columns[j].col + ", ";
                tmpColStr += "'band': '" + columns[j].band + "', ";
                tmpColStr += "'size': " + columns[j].size + "}";

                if (j < colLen - 1) tmpColStr += ", ";
            }

            tmpColStr += "]";

            tmpStr += "'columns': " + tmpColStr + ", ";
            tmpStr += "'text': '" + hidingInfos[i].text + "'";
            tmpStr += "}";

            if (i < len - 1) tmpStr += SEPARATOR_HIDING_INFOS;
        }
    }

    return tmpStr;
};

/**
 * string으로 된 컬럼 숨김 정보를 그리드에 설정한다.
 * @param {string} text 컬럼 숨김 정보
 * @memberOf nexacro.Grid
 */
nexacro.Grid.prototype.setHidingInfos = function (text) {
    this._hidingInfos = [];
    var hidingInfos = text.split(SEPARATOR_HIDING_INFOS);

    for (var i = 0, len = hidingInfos.length; i < len; i++) {
        var hidingInfo = eval("(" + hidingInfos[i] + ")");
        this._hidingInfos.push(hidingInfo);
    }
};