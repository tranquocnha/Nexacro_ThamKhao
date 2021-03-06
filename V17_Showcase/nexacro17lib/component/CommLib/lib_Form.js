lib_Form ={
/*
 ===============================================================================
 == 폼과 관련된 공통함수들은 여기에 작성한다.
 ===============================================================================
 ● gfn_FormOnLoad      : Form Load 시 공통 기능 처리
 ● gfn_FormSetInit     : Form에 속한 컨트롤들의 초기화 처리
 ● gfn_AllCallFunction : Form에 속한 모든 컴포넌트를 함수의 인자로 넘겨주고 함수 호출처리
 ● gfn_setTitle        : 컨트롤의 title을 공통 영역에 정의한 MsgId를 바탕으로 변경시키는 함수
 ● gfn_setAuth         : 컨트롤의 기능들에 대한 권한을 설정한다.
 ● gfn_setEnableCtrl   : 화면안의 컨트롤을 활성화 또는 비활성화 처리
 ● gfn_setDefault      : 화면안의 컨트롤의 default 속성을 설정한다.
 ● gfn_Alert           : 메세지 코드에 따른 실제 메세지값을 찾은 후 팝업창을 생성해서 해당 값을 보여주는 함수
 ● gfn_Confirm         : 메세지 코드에 따른 실제 메세지값을 찾은 후 팝업창을 생성해서 해당 값을 보여주는 함수
 ● gfn_Dialog          : Modal Dialog실행 함수
 ● gfn_Open            : Modaless Dialog실행 함수
 ● gfn_NewChildFrame   : 신규 ChildFrame 생성
 */
  
/************************
 *  공통 Script Include
 ************************/
//include "lib::lib_Service.xjs"
//include "lib::lib_Grid.xjs"
//include "lib::lib_String.xjs"
//include "lib::lib_Util.xjs"
//include "lib::lib_Data.xjs"


/*******************************************************************************
 * Function Name: gfn_FormOnLoad
 * Description	: Form Load 시 공통 기능 처리
 * Arguments	: obj :열린 화면 객체
 * Return 		: None
 ********************************************************************************/

gfn_FormOnLoad: function (obj)
{
	lib_Form.gfn_AllCallFunction(obj, lib_Form.gfn_FormSetInit, true);
},


/*******************************************************************************
 * Function Name: gfn_FormSetInit
 * Description	: Form에 속한 컨트롤들의 초기화 처리
 * Arguments	: obj :객체
 * Return 		: None
 ********************************************************************************/
gfn_FormSetInit: function (obj)
{
	
	lib_Form.gfn_setTitle(obj);

	lib_Form.gfn_setDefault(obj);

	//gfn_setFlag(obj);
},

/********************************************************************************
 * Function Name: gfn_getComponentValue
 * Description	: 프로그램의 특정 컴포넌트의 Attribute값을 찾는 함수
 *				  (ex) gfn_getComponentValue("stInputBox", "value")
 * Arguments	: strID(Component의 ID값), strAttributeNM(Attribute Name)
 * Return 		: Attribute	값
 ********************************************************************************/
gfn_getComponentValue: function (objId, sProp)
{
	var idObj = lib_Form.gfn_getComponent(objId);
	if (lib_Form.gfn_isNull(idObj)) 
	{
		return "";
	}
	return idObj[sProp];
},

/********************************************************************************
 * Function Name: gfn_getComponent
 * Description	: 프로그램의 특정 컴포넌트를 컴포넌트의 id값을
 * 				  이용하여 찾아내는 함수
 * Arguments	: componentId(Component의 ID값), obj:찾기시작할 container
 * Return 		: Component Object
 ********************************************************************************/
gfn_getComponent: function (objId, obj)
{
	if (lib_Form.gfn_isNull(obj)) 
	{
		obj = this;
	}
	return lib_Form.gfn_AllCallFunction(obj, gfn_isComponent, true, objId);
},

/********************************************************************************
 * Function Name: gfn_isComponent
 * Description	: 프로그램의 특정 컴포넌트를 컴포넌트의 id값을
 * 				  이용하여 찾아내는 함수
 * Arguments	: obj:컴포넌트 container, id: component Id
 * Return 		: Component Object
 ********************************************************************************/
gfn_isComponent: function (Obj, id)
{
	if (Obj.name == id) 
	{
		return Obj;
	}
},

/*******************************************************************************
 * Function Name: gfn_AllCallFunction
 * Description	: Form에 속한 모든 컴포넌트를 함수의 인자로 넘겨주고 함수 호출처리
 * Arguments	: obj :컨테이너(Form, Div), FunctionObj: 호출함수, bObjects: Invisible object 포함여부, paramObj: 함수에 넘겨줄 파라메터
 * Return 		: retVal
 ********************************************************************************/
gfn_AllCallFunction: function (obj, FunctionObj, bObjects, paramObj)
{
	var strType;
	var retVal;

	for (var i = 0; i < obj.components.length; i++) 
	{
		strType = obj.components[i].toString().toUpperCase();

		//retVal: functionObj.call(this, obj.components[i], paramObj);
		 
		//if (gfn_isNull(retVal) == false) 
		//{
			//return retVal;
		//}
		//trace("#### " + i );
		lib_Form.gfn_setTitle(obj.components[i]);
		lib_Form.gfn_setDefault(obj.components[i]);


		if (obj.components[i].components) 
		{
			switch (strType) 
			{
				case "[OBJECT TAB]":
					//retVal = lib_Form.gfn_AllCallFunction(obj.components[i], FunctionObj, bObjects, paramObj);
					//if (gfn_isNull(retVal) == false) 
					//{
					//	return retVal;
					//}
					lib_Form.gfn_setTitle(obj.components[i]);
					lib_Form.gfn_setDefault(obj.components[i]);
					break;
				case "[OBJECT TABPAGE]":
				case "[OBJECT DIV]":
				case "[OBJECT POPUPDIV]":
					if (lib_Form.gfn_isNull(obj.components[i].url) == true) 
					{
						//retVal = lib_Form.gfn_AllCallFunction(obj.components[i], FunctionObj, bObjects, paramObj);
						//if (lib_Form.gfn_isNull(retVal) == false) 
						//{
						//	return retVal;
						//}
						lib_Form.gfn_setTitle(obj.components[i]);
						lib_Form.gfn_setDefault(obj.components[i]);
					}
					break;
			}
		}
	}

	if (bObjects == true && obj.objects) 
	{
		for (var i = 0; i < obj.objects.length; i++) 
		{
			//retVal: functionObj.call(this, obj.objects[i], paramObj);
			//if (lib_Form.gfn_isNull(retVal) == false) 
			//{
			//	return retVal;
			//}
				lib_Form.gfn_setTitle(obj.objects[i]);
				lib_Form.gfn_setDefault(obj.objects[i]);			
		}
	}
},

/********************************************************************************
 * Function Name	: gfn_setTitle
 * Description		: 컨트롤의 title을 공통 영역에 정의한 Domain을 바탕으로 변경시키는 함수
 * Arguments		: obj:컨트롤
 * Return 			:
 ********************************************************************************/
gfn_setTitle: function (obj)
{
	var sText;
	var sCode;

	var strType = obj.toString().toUpperCase();

	switch (strType) 
	{
		case "[OBJECT GRID]":
			for (var i = 0; i < obj.getCellCount("head"); i++) 
			{
				var sCode = obj.getCellProperty('head', i, "text");
				var sText = lib_Form.gfn_getDomainText(sCode);
				if (sCode != sText) 
				{
					obj.setCellProperty("head", i, "text", sText);
				}
			}
			break;
		case "[OBJECT DATASET]":
			for (var i = 0; i < obj.getRowCount(); i++) 
			{
				for (var nCol = 0; nCol < obj.getColCount(); nCol++) 
				{
					sCode = obj.getColumn(i, nCol);
					sText = lib_Form.gfn_getDomainText(sCode);
					if (sCode != sText) 
					{
						obj.setColumn(i, nCol, sText);
					}
				}
			}
			break;
		case "[OBJECT COMBO]":
		case "[OBJECT RADIO]":
		case "[OBJECT LISTBOX]":
			var rtn = obj.getInnerDataset();			
			if (lib_Form.gfn_isNull(rtn)) 
			{
				break;
			}    

				
			if (rtn.toString().toUpperCase() != "[OBJECT DATASET]") 
			{
				break;
			}
			for (var i = 0; i < rtn.getRowCount(); i++) 
			{

				sCode = rtn.getColumn(i, obj.datacolumn);
				sText = lib_Form.gfn_getDomainText(sCode);
				if (sCode != sText) 
				{
					rtn.setColumn(i, "datacolumn", sText);
					if(rtn.index == 0 ){
						rtn.set_index(-1);
						rtn.set_index(0);
					}
				}
			}
			break;
		case "[OBJECT EDIT]":
		case "[OBJECT MASKEDIT]":
		case "[OBJECT CALENDAR]":
		case "[OBJECT TEXTAREA]":
			sText = lib_Form.gfn_getDomainText(obj.value);
			if (sText != obj.value) 
			{
				obj.set_value(sText);
			}
			break;
		case "[OBJECT FILEUPLOAD]":
			sText = lib_Form.gfn_getDomainText(obj.buttontext);
			if (sText != obj.buttontext) 
			{
				obj.set_buttontext(sText);
			}
			break;
		default:
			//alert("192 " + obj.text);
			sText = lib_Form.gfn_getDomainText(obj.text);
			// alert("194 " + sText);
			if (sText != obj.text) 
			{
				obj.set_text(sText);
			}
			break;
	}
},

/**********************************************************************************
 * Function Name   : gfn_setFlag
 * Description     : 각 컴포넌트의 Flag설정에 따른 처리
 * Arguments       : obj: 컨트롤 객체
 * Return          :
 **********************************************************************************/
gfn_setFlag: function (obj)
{
	var objApp = nexacro.getApplication() ;
	if (lib_Form.gfn_isNull(obj[objApp.gv_FlagProp])) 
	{
		return;
	}

	var arrEnv = gfn_Split2(obj[objApp.gv_FlagProp], ";", ":");
	var strType = obj.toString().toUpperCase();
	var eInit = [];

	if (lib_Form.gfn_isNull(arrEnv)) 
	{
		return;
	}

	if (strType == "[OBJECT DIV]") 
	{
		obj.set_text(obj[objApp.gv_FlagProp]);
	}

	for (var i = 0; i < arrEnv.length; i++) 
	{
		switch (arrEnv[i][0]) 
		{
			case objApp.gv_ActionFlag:
				gfn_setAuth(obj, arrEnv[i][1]);
				break;
			case objApp.gv_ResizeFlag:
				try 
				{
					addEventHandler("onsize", gfn_frm_OnSize, this);
					gfn_setOrgSize(obj, arrEnv[i][1]);
					eInit["cx"] = getOffsetWidth();
					eInit["cy"] = getOffsetHeight();
					gfn_setResize(obj, eInit);
				}
				catch (e) 
				{
					return false;
				}
				break;
			default:
				break;
		}
	}
},

/**********************************************************************************
 * Function Name   : gfn_setAuth
 * Description     : 컨트롤의 기능들에 대한 권한을 설정한다.
 * Arguments       : obj: 컨트롤 객체, sVal: 권한을 설정값
 * Return          :
 **********************************************************************************/
gfn_setAuth: function (obj, sVal)
{
	var objApp = nexacro.getApplication() ;
	if( parent == "[object ChildFrame]" ){
		var strRole = lib_Form.gfn_getMenuInfo(gfn_getMenuId(), objApp.gv_MenuAuthCol);
	} else {	
		var strRole = parent.gfn_getMenuInfo(parent.gfn_getMenuId(), objApp.gv_MenuAuthCol);
	}
	
	if (lib_Form.gfn_isNull(strRole)) 
	{
		return;
	}

	// strRole = "1001";

	switch (sVal) 
	{
		case objApp.gv_insertAct:
			// 데이터 추가
			if (strRole.substr(0, 1) != "1") 
			{
				gfn_setEnableCtrl(obj, false);
			}
			break;
		case objApp.gv_updateAct:
			// 데이터 수정
			if (strRole.substr(1, 1) != "1") 
			{
				gfn_setEnableCtrl(obj, false);
			}
			break;
		case objApp.gv_deleteAct:
			// 데이터 삭제
			if (strRole.substr(2, 1) != "1") 
			{
				gfn_setEnableCtrl(obj, false);
			}
			break;
		case objApp.gv_commitAct:
			// 데이터 저장 (서버에 저장처리)
			if ((strRole.substr(0, 1) != "1") && 
				(strRole.substr(1, 1) != "1") && 
				(strRole.substr(2, 1) != "1")) 
			{
				gfn_setEnableCtrl(obj, false);
			}
			break;
		case objApp.gv_outputAct:
			// 데이터 프린트 또는 PC(파일)로 저장
			if (strRole.substr(3, 1) != "1") 
			{
				gfn_setEnableCtrl(obj, false);
			}
			break;
		default:
			break;
	}
},

/**********************************************************************************
 * Function Name   : gfn_setDefault
 * Description     : 화면안의 컨트롤의 default 속성을 설정한다.
 * Arguments       : obj: 컨트롤 객체
 * Return          :
 **********************************************************************************/
gfn_setDefault: function (obj)
{
	var strType = obj.toString().toUpperCase();

	switch (strType) 
	{
		case "[OBJECT GRID]":
			if (obj.autofittype == "none") 
			{
				obj.set_cellsizingtype("col");
			}
			obj.set_autoenter("select");
			for (var nCell = 0; nCell < obj.getCellCount("Body"); nCell++) 
			{
				obj.setCellProperty("Body", nCell, "editautoselect", true);
				obj.setCellProperty("Body", nCell, "combodisplayrowcount", 10);
			}
			break;
		case "[OBJECT COMBO]":
			if (obj.displayrowcount == -1) 
			{
				obj.set_displayrowcount(10);
			}
		case "[OBJECT EDIT]":
		case "[OBJECT MASKEDIT]":
		case "[OBJECT TEXTAREA]":
			obj.set_autoselect(true);
			break;
		default:
			break;
	}
},

/**********************************************************************************
 * Function Name   : gfn_setEnableCtrl
 * Description     : 화면안의 컨트롤을 활성화 또는 비활성화 처리
 * Arguments       : obj: 컨트롤 객체, bEnable: 활성화 여부
 * Return          :
 **********************************************************************************/
gfn_setEnableCtrl: function (obj, bEnable)
{
	var strType = obj.toString().toUpperCase();

	switch (strType) 
	{
		case "[OBJECT TAB]":
		case "[OBJECT DIV]":
		case "[OBJECT ACTIVEX]":
			obj.set_enable(bEnable);
			break;
		case "[OBJECT TABPAGE]":
			obj.Parent.removeChild(obj.name);
			break;
		case "[OBJECT GRID]":
		case "[OBJECT LISTBOX]":
			obj.set_readonly(!(bEnable));
			obj.set_enableevent(bEnable);
			break;
		case "[OBJECT EDIT]":
		case "[OBJECT CALENDAR]":
		case "[OBJECT MASKEDIT]":
		case "[OBJECT TEXTAREA]":
			obj.set_readonly(!(bEnable));
			break;
		default:
			obj.set_enable(bEnable);
			obj.set_enableevent(bEnable);
			break;
	}
},

/********************************************************************************
 * Function Name: gfn_Alert
 * Description	: 메세지 코드에 따른 실제 메세지값을 찾은 후 팝업창을
 *				  생성해서 해당 값을 보여주는 함수
 * Arguments	: strMsgId(MessageId)
 *				  strMsgType(메세지 종류 : ERR, WARN, INFO)
 *				  msgArr[](메세지값으로 치환될 Parameter Array)
 * Return 		: 팝업에 해당 메세지값을 표현
 ********************************************************************************/
gfn_Alert: function (strMsgId, strMsgType, msgArr)
{
	// strMsgType : "default", "error", "question", "warning", "information" (default)
	var objApp = nexacro.getApplication() ;
	if (lib_Form.gfn_isNull(strMsgType)) 
	{
		strMsgType = "information";
	}

	var strMsg = lib_Form.gfn_getDomainText(strMsgId, msgArr);

	alert(strMsg, objApp.gv_MsgTitle, strMsgType);

	return;
},

/********************************************************************************
 * Function Name: gfn_Confirm
 * Description	: 메세지 코드에 따른 실제 메세지값을 찾은 후 팝업창을
 *				  생성해서 해당 값을 보여주는 함수
 * Arguments	: strMsgId(MessageId)
 *				  strMsgType(메세지 종류 : ERR, WARN, INFO)
 *				  msgArr[](메세지값으로 치환될 Parameter Array)
 * Return 		: 팝업에 해당 메세지값을 표현
 ********************************************************************************/
gfn_Confirm: function (strMsgId, strMsgType, msgArr)
{
	var objApp = nexacro.getApplication() ;	
	// strMsgType : "default", "error", "question", "warning", "information" (default)
	if (lib_Form.gfn_isNull(strMsgType)) 
	{
		strMsgType = "question";
	}

	var strMsg = lib_Form.gfn_getDomainText(strMsgId, msgArr);

	return confirm(strMsg, objApp.gv_MsgTitle, strMsgType);
},

/**********************************************************************************
 * Function Name: gfn_Dialog
 * Description  : Modal Dialog실행 함수
 * Arguments    : sID		( Popup Form의 ID )
 *				: sURL 		( Popup Form  URL )
 *				: sArg 		( Popup Form으로 전달될 Argument )
 *				: nLeft 	( Popup Form Left Position )
 *				: nTop 		( Popup Form Top Position )
 *				: nWidth 	( Popup Form Width )
 *				: nHeight	( Popup Form Height )
 *				: sStyle 	( Popup Form 기본 유형 )
 *				: sProp 	( Chile Frame의 모든 Property를 설정 )
 * Return       : String ( Dialog창에서 close()에 의해 Return된 값 )
 **********************************************************************************/
gfn_Dialog: function (sID, sURL, sArg, nLeft, nTop, nWidth, nHeight, sStyle, sProp, callback)
{


	var rtn;
	var newChild;
	var MyFrame = getOwnerFrame();
	
	sID = lib_Form.gfn_getDomainText(sID).replace(/\./g, "_");

	newChild = gfn_NewChildFrame(sID, sURL, sArg, nLeft, nTop, nWidth, nHeight, sStyle, sProp);

	newChild.showModal(MyFrame, sArg, this, callback);	

//	newChild.showModalAsync(sID, MyFrame, sArg, this, callback);
},
/**********************************************************************************
 * Function Name: gfn_Open
 * Description  : Modaless Dialog실행 함수
 * Arguments    : sID		( Popup Form의 ID )
 *				: sURL 		( Popup Form  URL )
 *				: sArg 		( Popup Form으로 전달될 Argument )
 *				: nLeft 	( Popup Form Left Position )
 *				: nTop 		( Popup Form Top Position )
 *				: nWidth 	( Popup Form Width )
 *				: nHeight	( Popup Form Height )
 *				: sStyle 	( Popup Form 기본 유형 )
 *				: sProp 	( Chile Frame의 모든 Property를 설정 )
 * Return       : Boolean
 **********************************************************************************/
gfn_Open: function (sID, sURL, sArg, nLeft, nTop, nWidth, nHeight, sStyle, sProp)
{
	var rtn;
	var newChild;
	var MyFrame = getOwnerFrame();

	sID = lib_Form.gfn_getDomainText(sID);

	newChild = gfn_NewChildFrame(sID, sURL, sArg, nLeft, nTop, nWidth, nHeight, sStyle, sProp);

	return newChild.showModeless(sID, MyFrame, sArg);
},

/**********************************************************************************
 * Function Name: gfn_NewChildFrame
 * Description  : 신규 ChildFrame 생성
 * Arguments    : sID		( Popup Form의 ID )
 *				: sURL 		( Popup Form  URL )
 *				: sArg 		( Popup Form으로 전달될 Argument )
 *				: nLeft 	( Popup Form Left Position )
 *				: nTop 		( Popup Form Top Position )
 *				: nWidth 	( Popup Form Width )
 *				: nHeight	( Popup Form Height )
 *				: sStyle 	( Popup Form 기본 유형 )
 *				: sProp 	( Chile Frame의 모든 Property를 설정 )
 * Return       : ChildFrame 객체
 **********************************************************************************/
gfn_NewChildFrame: function (sID, sURL, sArg, nLeft, nTop, nWidth, nHeight, sStyle, sProp)
{
	var objApp = nexacro.getApplication() ;
	
	var newChild;

	newChild = new ChildFrame;
	newChild.init(sID, "absolute", nLeft, nTop, nWidth, nHeight, null, null,  sURL);
	// newChild.autosize = true;
	//newChild.set_showtitlebar(true);
	
	newChild.set_titletext(lib_Form.gfn_getDomainText(sID));


	if (lib_Form.gfn_isNull(sStyle) == false) 
	{
		var aStyle = gfn_Split2(sStyle, ",", "=");
		for (i = 0; i < aStyle.length; i++) 
		{
			newChild[aStyle[i][0]] = aStyle[i][1];
		}
	}

	if (lib_Form.gfn_isNull(sProp) == false) 
	{
		var aProp = gfn_Split2(sProp, ",", "=");
		for (var i = 0; i < aProp.length; i++) 
		{
			newChild[aProp[i][0]] = aProp[i][1];
		}
	}
if(parent.url != null)
{
	newChild.arguments = [];
	newChild.arguments[objApp.gv_MenuIdCol] = parent.gfn_getMenuId();
}

	return newChild;
},

/**********************************************************************************
 * Function Name: gfn_DsGetUpdated
 * Description  : Datset의 갱신여부를  Return 한다.
 * Arguments    : objDs	확인 대상 Dataset
 * Return       : boolean
 **********************************************************************************/
gfn_DsGetUpdated: function (objDs)
{
	gfn_updateToDataset();
	return gfn_DsIsUpdated(objDs);
},

/**********************************************************************************
 * Function Name: gfn_updateToDataset
 * Description  : 컨트롤이 Dataset에 bind되어 있을경우 즉시 value를 Dataset에 적용시킨다.
 * Arguments    :
 * Return       :
 **********************************************************************************/
gfn_updateToDataset: function ()
{
	var objComp = getFocus();
	
	if (objComp != null) 
	{
		try 
		{
			objComp.updateToDataset();
		}
		catch (e) 
		{
		}
	}
},

/********************************************************************************
 * Function Name	: gfn_DsCheckValid
 * Description   	: DataSet 내의 데이터 무결성을 검사하는 함수
 * Parameter		: objDs(DataSet)
 * Return 			:
 ********************************************************************************/
gfn_DsCheckValid: function (objDs)
{
	var objDsValid = objects[objDs.name + "Valid"];

	if (lib_Form.gfn_isNull(objDsValid)) 
	{
		return true;
	}

	var nRowCnt = objDs.getRowCount();
	var nColCnt = objDs.getColCount();

	for (var i = 0; i < nRowCnt; i++) 
	{
		for (var j = 0; j < nColCnt; j++) 
		{
			if (objDs.getRowType(i) == 2 || objDs.getRowType(i) == 4) 
			{
				var rtnVar = gfn_ItemCheck(i, j, objDs, objDsValid);
				if (!rtnVar) 
				{
					return false;
				}
			}
		}
	}
	return true;
},

/********************************************************************************
 * Function Name	: gfn_ItemCheck
 * Description		: DataSet 내의 데이터 무결성을 검사하는 함수
 * Parameter		: rowNum = DataSet row position
 *					  colNum = DataSet Column Index
 *					  objGrd = DataSet(Grid에 bind된 DataSet)
 *					  objDsValid = Dataset(objGrd의 무결성 검사용 DataSet
 * Return 			: true = Data에 문제 없음
 *					  false = 무결성 위한
 ********************************************************************************/
gfn_ItemCheck: function (rowNum, colNum, objGrd, objDsValid)
{
	var arrItem = new Array();
	var strColNm = objGrd.getColID(colNum);

	if (objDsValid.getColumnInfo(strColNm) == null) 
	{
		return true;
	}

	var strCol = objDsValid.getColumn(0, strColNm);
	if (lib_Form.gfn_isNull(strCol)) 
	{
		return true;
	}

	arrItem = strCol.split(",");
	var value = objGrd.getColumn(rowNum, colNum);

	var returnVal;
	var title = "";


	for (var k = 0; k < arrItem.length; k++) 
	{
		var arrItem2 = new Array();

		arrItem2 = arrItem[k].split(":");
		switch (arrItem2[0]) 
		{
			case "title":
				title = lib_Form.gfn_getDomainText("domain." + arrItem2[1]);
				break;
			case "required":
				if (arrItem2[1] == "true") 
				{
					if (lib_Form.gfn_isNull(value)) 
					{
						gfn_Alert("msg.err.validator.required", "warning", title);
						return false;
					}
				}
				break;
			case "minlength":
				if (gfn_Length(value) < arrItem2[1]) 
				{
					gfn_Alert("msg.err.validator.minlength", "warning", title, arrItem2[1]);
					return false;
				}
				break;
			case "maxlength":
				if (gfn_Length(value) > arrItem2[1]) 
				{
					gfn_Alert("msg.err.validator.maxlength", "warning", title, arrItem2[1]);
					return false;
				}
				break;
			case "num":
				if (arrItem2[1] == "f" && !nexacro.isNumeric(value)) 
				{
					gfn_Alert("msg.err.validator.chknumber.f", "warning", title, arrItem2[1]);
					return false;
				}
				else if (arrItem2[1] == "i" && !nexacro.isNumeric(value)) 
				{
					gfn_Alert("msg.err.validator.chknumber.i", "warning", title, arrItem2[1]);
					return false;
				}
				else if (arrItem2[1] == "n" && !nexacro.isNumeric(value)) 
				{
					gfn_Alert("msg.err.validator.chknumber.n", "warning", title, arrItem2[1]);
					return false;
				}
				break;
			case "fromNum":
				if (!nexacro.isNumeric(value) || (parseFloat(arrItem2[1]) > parseFloat(value))) 
				{
					gfn_Alert("msg.err.validator.fromnum", "warning", title, arrItem2[1]);
					return false;
				}
				break;
			case "toNum":
				if (!nexacro.isNumeric(value) || (parseFloat(arrItem2[1]) < parseFloat(value))) 
				{
					gfn_Alert("msg.err.validator.tonum", "warning", title, arrItem2[1]);
					return false;
				}
				break;
			case "format":
				if (lib_Form.gfn_isNull(value)) 
				{
					break;
				}
				if (arrItem2[1] == "mail" && !gfn_checkEmail(value)) 
				{
					gfn_Alert("msg.err.validator.email", "warning", title);
					return false;
				}
				else if (arrItem2[1] == "phone" && !gfn_checkPhone(value)) 
				{
					gfn_Alert("msg.err.validator.phone", "warning", title);
					return false;
				}
				else if (arrItem2[1] == "url" && !gfn_checkURL(value)) 
				{
					gfn_Alert("msg.err.validator.url", "warning", title);
					return false;
				}
				else if (arrItem2[1] == "date" && !gfn_checkDate8(value)) 
				{
					gfn_Alert("msg.err.validator.date8", "warning", title);
					return false;
				}
				else if (arrItem2[1] == "date10" && !gfn_checkDate10(value)) 
				{
					gfn_Alert("msg.err.validator.date10", "warning", title);
					return false;
				}
				else if (arrItem2[1] == "zipcode" && !nexacro.isNumeric(value) && gfn_Length(gfn_Replace(value, " ", "")) != 6) 
				{
					gfn_Alert("msg.err.validator.zipcode", "warning", title);
					return false;
				}
				break;
		}
	}
	return true;
},






////////////////////////////////////////////////////////////////////

/**********************************************************************************
 * Function Name: gfn_TopMenuClick
 * Description  : top 프레임에서 상위 레벨을 선택했을 때의 처리
 * Arguments    : menuid: 윈도우 생성아이디
 * Return       : 없음
 **********************************************************************************/
gfn_TopMenuClick: function (topMenuid)
{
	var objApp = nexacro.getApplication() ;	
	if (lib_Form.gfn_checkMenuStat(topMenuid) == false) 
	{
		return;
	}

	//if (objApp.gv_AppMenuPath) 
	//{
		gv_leftFrame.form.fn_changeMenu(topMenuid);
	//}
},


/**********************************************************************************
 * Function Name: gfn_checkMenuStat
 * Description  : 선택된 메뉴의 상태를 확인해서 오픈할 수 없을 경우에 메시지를 표시한다.
 * Arguments    : menuid: 메뉴아이디
 * Return       : bool: 오픈 가능 여부
 **********************************************************************************/
gfn_checkMenuStat: function (menuId)
{
	var objApp = nexacro.getApplication() ;
 	var menuStat = lib_Form.gfn_getMenuInfo(menuId, objApp.gv_MenuStatCol);
 	if (menuStat == "MAKE") 
 	{
// 		gfn_Alert("msg.menu.stat.make", "infomation");
// 		return false;
 	}
	return true;
	
},


//lib_HTML5_Frame.xjs///////////////////////////////////////////////////////////////////////

/**********************************************************************************
 * Function Name: gfn_openMenu
 * Description  : 메뉴 아이디를  기준으로 신규 윈도우 화면을 생성하고 open 시킴
 * Arguments    : menuid: 메뉴아이디, bReload: Reload 여부, aArgs: 넘겨줄 Argument, favArgs:즐겨찾기에서 넘어왔을 경우체크
 * Return       : 없음
 **********************************************************************************/
gfn_openMenu: function (menuid, bReload, aArgs, favArgs)
{
	var objApp = nexacro.getApplication() ;
	if (lib_Form.gfn_isNull(menuid)) 
	{
		return;
	}


	var nRow = -1;
	var menuFilterGrp ='';
	if (lib_Form.gfn_isNull(favArgs))
		nRow = lib_Form.gfn_findData(objApp.gds_Menu, objApp.gv_MenuIdCol, menuid);
	else {
		//즐겨찾게에서 넘어오면 objApp.gds_Menu를 해당 메뉴그룹으로 다시 filter 한다.
		menuFilterGrp = menuid.substring(0,1) +'000';		
		objApp.gds_Menu.filter(objApp.gv_MenuGIdCol + "=='"+menuFilterGrp+"' && MENU_LEVEL!=0");
		gv_leftFrame.form.ds_Menu.copyData(objApp.gds_Menu, true);
		objApp.gds_Menu.filter();
		
		nRow = lib_Form.gfn_findData(gv_leftFrame.form.ds_Menu, objApp.gv_MenuIdCol, menuid);
	}
	
	if (nRow == -1)
	{
//		gfn_Alert("Menu가 존재하지 않습니다.");
		return;
	}

	if (lib_Form.gfn_isNull(lib_Form.gfn_getMenuInfo(menuid, objApp.gv_MenuUrlCol))) 
	{
		return;
	}

	if (lib_Form.gfn_checkMenuStat(menuid) == false) 
	{
		return;
	}
	
	var winid = lib_Form.gfn_getLookupData(objApp.gds_openMenu, objApp.gv_MenuIdCol, menuid, objApp.gv_WinIdCol);

	if (lib_Form.gfn_isNull(winid) == false) 
	{
		if (lib_Form.gfn_activeFrame(winid, bReload, aArgs) == true) 
		{
			objApp.mainframe.VFrameSet.HFrameSet.VFrameSet1.MdiTabFrame.form.fn_moveTab(winid);
			return;
		}
	} else {
		gv_workFrame.removeChild("MainForm");
	}
 
	if (objApp.gds_openMenu.rowcount >= objApp.gv_openMaxFrame) 
	{
		//gfn_Alert("We can open maximum " + objApp.gv_openMaxFrame + " screens only.");
		//return;
	}

	lib_Form.gfn_openMenuRow(menuid, nRow, aArgs);
},

/**********************************************************************************
 * Function Name: gfn_activeFrame
 * Description  : 윈도우 키를 기준으로 열려있는 화면 여부 확인
 * Arguments    : winid: 윈도우 생성 키, bReload: 화면 Reload여부, aArgs:전달인자
 * Return       : 열린화면이면 true 아니면 false
 **********************************************************************************/
gfn_activeFrame: function (winid, bReload, aArgs)
{
	var objApp = nexacro.getApplication() ;	
	var framesInfo = gv_workFrame.frames;

	if(lib_Form.gfn_isNull(winid)){return true;}
	if (objApp.gv_openOnlyOne == false && bReload == false) 
	{
		return false;
	}
	
// 
// 	for(var i = 0 ; i < framesInfo.length ; i++)
// 	{
// 		if(framesInfo[winid] != framesInfo[i]){	
// 			framesInfo[i].set_visible(false);
// 		}
// 	}
	//trace("debug 2  :::  gfn_activeFrame  " + winid + " / " + framesInfo[winid]);	
	if(framesInfo[winid])
	{
	//trace("framesInfo >> " + winid );
	    objApp.mainframe.VFrameSet.HFrameSet.VFrameSet1.MdiTabFrame.form.fn_moveTab(winid);
		framesInfo[winid].setFocus();

		if (bReload == true) 
		{
			framesInfo[winid].reload();
		}

		return true;
	}
	
	//trace("debug 4  :::  gfn_activeFrame  ");	
	
	return false;
},


/**********************************************************************************
 * Function Name: gfn_openMenuRow
 * Description  : gds_openMenu의 해당 Row의 정보를 기준으로 신규 윈도우 화면을 생성하고 open 시킴
 * Arguments    : menuid: 메뉴아이디, nRow: gds_openMenu의 rowpostion, aArgs:전달인자
 * Return       : 없음
 **********************************************************************************/
gfn_openMenuRow: function (menuid, nRow, aArgs)
{
	var objApp = nexacro.getApplication() ;
	var winid = "win" + menuid + "_" + objApp.gds_openMenu.getRowCount() + "_" + parseInt(Math.random() * 1000);
	var menuExtp = lib_Form.gfn_getMenuInfo(menuid, objApp.gv_MenuTypeCol);
	if (menuExtp == 'EXEC') 
	{
		system.execShell(lib_Form.gfn_getMenuInfo(menuid, objApp.gv_MenuUrlCol) + " " + lib_Form.gfn_getMenuInfo(menuid, objApp.gv_MenuArgCol));
		return;
	}

	var objNewWin = new ChildFrame;
	var strTitle;
	var strTitle_kor;
	var strDesc_Url = "";
	var strDesc_Url_ko = "";
// trace("1 @@ [" + aArgs + "]");
// trace("1-1 @@ " + aArgs.split(" "));
// trace("2 @@ " + aArgs.split(" ")[1]);		
// trace("3 @@ " + aArgs.split(" ")[1].split("=")[1]);
	if( lib_Form.gfn_isNull(aArgs) == false ) {	
		strDesc_Url = aArgs.split(" ")[1].split("=")[1];		
		strDesc_Url_ko = aArgs.split(" ")[2].split("=")[1];
	}

	objNewWin.init(winid, "absolute", 0, 0, gv_workFrame.getOffsetWidth() - 0, gv_workFrame.getOffsetHeight() - 0);
	//objNewWin.set_tooltiptext(winid);
	objNewWin.arguments = [];
	strTitle = lib_Form.gfn_getMenuInfo(menuid, "MENU_NAME");
	strTitle_kor = lib_Form.gfn_getMenuInfo(menuid, "MENU_NAME_KO");

	if (lib_Form.gfn_isNull(aArgs) == false) 
	{
// 		for (var prop; ; ) 
// 		{
// 			objNewWin.arguments[prop] = aArgs[prop];
// 		}
	}
 
	objNewWin.set_openstatus(objApp.gv_openStatus);	
	
	if (lib_Form.gfn_getMenuInfo(menuid, objApp.gv_MenuOPTPCol) == "POP") 
	{
		objNewWin.showModeless(winid, null);
	}
	else 
	{
	    var sPageUrl = lib_Form.gfn_getLookupData(objApp.gds_Menu, objApp.gv_MenuIdCol, menuid, objApp.gv_MenuUrlCol);
	    var sMenuNm = lib_Form.gfn_getLookupData(objApp.gds_Menu, objApp.gv_MenuIdCol, menuid, objApp.gv_MenuNameCol);
		var sGrpNm = aArgs.split(" ")[0].split("=")[1];

		gv_workFrame.addChild(winid, objNewWin);
		//trace(winid+ " / " + menuid+ " / " + strTitle+ " / " + strDesc_Url+ " / " + strDesc_Url_ko);
		lib_Form.gfn_addOpenMenuDs(winid, menuid, strTitle, strDesc_Url, strDesc_Url_ko);

		objNewWin.set_formurl("Frame::workFrame.xfdl");
		//objNewWin.set_formurl(sPageUrl);
		
	    objNewWin.set_dragmovetype("all");
	    objNewWin.set_showtitlebar(false);
	    objNewWin.set_resizable(true);
		//objNewWin.set_openstatus("maximize");
		

		if( objApp.gv_MenuNameCol == "MENU_NAME_KO" ){			
			objNewWin.set_titletext(sGrpNm + " > " + strTitle_kor);
		}else{	
			objNewWin.set_titletext(sGrpNm + " > " + strTitle);
		}	
				 
		objNewWin.arguments["winKey"]   =  winid;
		objNewWin.arguments["menuId"]   =  menuid;
		objNewWin.arguments["menuNm"]   =  sMenuNm;
		objNewWin.arguments["pageUrl"]  =  sPageUrl;
		objNewWin.arguments["descUrl"]  =  strDesc_Url;
		objNewWin.arguments["descUrl_ko"]  =  strDesc_Url_ko;

		objNewWin.show();
		gv_mdiTabFrame.form.fn_addTab(winid, strTitle, strTitle_kor);
		lib_Form.gfn_activeFrame(winid);

	}
},



/**********************************************************************************
 * Function Name: gfn_addOpenMenuDs
 * Description  : 신규 생성된 윈도우(프레임) 화면을 gds_openMenu에 등록
 * Arguments    : winid: 윈도우아이디, menuid: 메뉴아이디, strTitle:타이틀
 * Return       : 없음
 **********************************************************************************/
gfn_addOpenMenuDs: function (winid, menuid, strTitle, strDescUrl, strDescUrl_ko)
{
	var objApp = nexacro.getApplication() ;
	var curRow = objApp.gds_openMenu.addRow();
	objApp.gds_openMenu.setColumn(curRow, objApp.gv_WinIdCol, winid);
 	objApp.gds_openMenu.setColumn(curRow, objApp.gv_MenuIdCol, menuid);
 	objApp.gds_openMenu.setColumn(curRow, objApp.gv_TitleCol, strTitle);
 	objApp.gds_openMenu.setColumn(curRow, objApp.gv_DescUrl, strDescUrl);
 	objApp.gds_openMenu.setColumn(curRow, objApp.gv_DescUrl_ko, strDescUrl_ko);
},


///////////////////////////////////////////////////////////////////////
/**********************************************************************************
 * Function Name: gfn_findData
 * Description  : dataSet object에서 키에 해당되는 Row를 찾아서 rowpostion 전달
 * Arguments    : ObjDs:dataset, strIdCol:키칼럼, strId:키값,
 strSubCol:서브키칼럼, strSubId:서브 키값
 * Return       : rowpostion
 **********************************************************************************/
gfn_findData: function (ObjDs, strIdCol, strId, strSubCol, strSubId)
{
//trace(ObjDs+" / " +  strIdCol+" / " +  strId);
//trace(ObjDs.saveXML());
	//var arrArgument = gfn_findData.arguments;

	if (lib_Form.gfn_isNull(strSubCol)) 
	{
		return ObjDs.findRow(strIdCol, strId);
	}
	return ObjDs.findRowExpr(strIdCol + " == '" + strId + "' && " + strSubCol + " == '" + strSubId + "'");	
	
},

/**********************************************************************************
 * Function Name: gfn_getLookupData
 * Description  : dataSet object에서 키에 해당되는 Row를 찾아서 칼럼값을 전달
 * Arguments    : ObjDs:dataset, strIdCol:키칼럼, strId:키값,  strInfo: dataSet 칼럼,
 strSubCol:서브키칼럼, strSubId:서브 키값
 * Return       : 칼럼값
 **********************************************************************************/
gfn_getLookupData: function (ObjDs, strIdCol, strId, strInfo, strSubCol, strSubId)
{
	var strVal;
	var curRow = lib_Form.gfn_findData(ObjDs, strIdCol, strId, strSubCol, strSubId);
	
	if (curRow < 0) 
	{
		return "";
	}
	
	strVal = ObjDs.getColumn(curRow, strInfo);
	if (lib_Form.gfn_isNull(strVal)) 
	{
		return "";
	}

	return strVal;
},



//////////////////////////////////////////////////////////////////////////

/*******************************************************************************
 * Function Name: gfn_isNull
 * Description  : 입력값이 null에 해당하는 경우 모두를 한번에 체크한다.
 * Arguments    : Val : 체크할 문자열( 예 : null 또는 undefined 또는 "" 또는 "abc" )
 * Return       : Boolean,  Val이 undefined, null, NaN, "", Array.length = 0인 경우 = true
 이외의 경우 = false
 ******************************************************************************/
gfn_isNull: function (Val)
{
	if (new String(Val).valueOf() == "undefined") 
	{
		return true;
	}
	if (Val == null) 
	{
		return true;
	}
	if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) 
	{
		return true;
	}
	if (Val.length == 0) 
	{
		return true;
	}

	return false;
},

//////////////////////////////////////////////////////////
/**********************************************************************************
 * Function Name: gfn_getMenuInfo
 * Description  : menuid 를 기준으로 해당 메뉴의 칼럼값을 전달
 * Arguments    : menuid: 메뉴아이디, menuInfo: 메뉴의 칼럼
 * Return       : 칼럼값
 **********************************************************************************/
gfn_getMenuInfo: function (menuid, menuInfo)
{
	var objApp = nexacro.getApplication() ;
	return lib_Form.gfn_getLookupData(objApp.gds_Menu, objApp.gv_MenuIdCol, menuid, menuInfo);
},

/**********************************************************************************
 * Function Name: gfn_getFrameAguments
 * Description  : child Frame에 등록한 아규먼트를 반환한다.
 * Arguments    : winKey, pageUrl 등등
 * Return       : 반환값
 **********************************************************************************/
gfn_getFrameAguments: function (sVal, objFrame)
{
    return objFrame.arguments[sVal];
},
/**
 * 열려있는 윈도우 화면을 정렬
 * @param	: 	strType: 정렬 타입
 * @return	:   N/A
 */
gfn_ArrangeWin: function(strType) 
{
	// workFrame영역에 open된 childFrame 갯수
	var iFramesCnt = gv_workFrame.frames.length;
	//if (applicaton.gds_openMenu.getRowCount() < 1) return;

	switch(strType)
	{
		case "maximize" :
		for (var i=0; i<iFramesCnt; i++) 
		{
			gv_workFrame.frames[i].set_openstatus("maximize");		
			gv_workFrame.frames[i].set_showtitlebar(false);		
			gv_workFrame.frames[i].set_border("0px solid #006666");
		}
	
		
// 		trace("gv_workFrame.getActiveFrame() ==>"+gv_workFrame.getActiveFrame().name);
// 		gv_workFrame.getActiveFrame().set_showtitlebar(false);
// 		gv_workFrame.getActiveFrame().set_border("0 solid #006666ff");

		//trace('   gfn_ArrangeWin --------------------------------'+gv_workFrame.getActiveFrame().name +'/'+ gv_workFrame.getActiveFrame().openstatus );

        
	   break;
	   case "closeAll" :
		for (var i=iFramesCnt; i>=0; i--) 
		{			
			if( i > 0 ){
				gv_mdiTabFrame.form.gfn_TabOnClose(gv_workFrame.frames[i-1].name);
				if( i == 0 ){
					lib_Form.gfn_callMain();
				}
			}	
		}
	    break;
	   case "hidden" :
		for (i=0; i<iFramesCnt; i++) 
		{
			gv_workFrame.frames[i].set_showtitlebar(true);
			gv_workFrame.frames[i].set_border("1px solid #cccccc");
			gv_workFrame.frames[i].set_borderRadius("round 3 3");
			gv_workFrame.frames[i].set_openstatus("minimize");		
		}
		
		gv_workFrame.arrange(strType);
	    break;
	    default :
		for (i=0; i<iFramesCnt; i++) 
		{			
			//if( gv_workFrame.frames[i].name != "MainForm" ){			
				gv_workFrame.frames[i].set_showtitlebar(true);
				gv_workFrame.frames[i].set_border("1px solid #cccccc");
			//}	

			gv_workFrame.frames[i].set_borderRadius("round 3 3");
			gv_workFrame.frames[i].set_openstatus("normal");							
		}
		
		gv_workFrame.arrange(strType);
	    break;
	   
	}
},


/***************************************************************************************
* FUNCTION NAME : gfn_closeMenu
* DESCRIPTION   : 선택된 WINID 에 해당하는 화면을 Active(Tab/Frame/Menu).
* ARGUMENT      : sWinId - 화면 ChildFrame Object Name
                  bCloseFrame - Frame Close 여부
* RETURN        : 
***************************************************************************************/
gfn_closeMenu : function(sWinID, bCloseFrame)
{	
	var objApp = nexacro.getApplication() ;
	if(gfn_isEmpty(bCloseFrame)) bCloseFrame = true;

	var objActiveFrame='';
	var sAcctiveWinID = "";
	var nRow = objApp.gds_OpenMenu.findRow("WIN_ID", sWinID);

	if(nRow > -1) objApp.gds_OpenMenu.deleteRow(nRow);
	
	//trace( '### 3333333333'+ gv_workFrame.getActiveFrame());
	if(gv_workFrame.getActiveFrame() != null)
		objActiveFrame = gv_workFrame.getActiveFrame().name;
	
	gv_mdiTabFrame.form.gfn_TabOnClose(sWinID);

	//if(bCloseFrame) gfn_closeFrame(sWinID);

	if(objActiveFrame == sWinID && gds_OpenMenu.rowcount > 0){
		if(nRow >= gds_OpenMenu.rowcount)
			sAcctiveWinID = gds_OpenMenu.getColumn(gds_OpenMenu.rowcount-1, "WINID");
		else
			sAcctiveWinID = gds_OpenMenu.getColumn(nRow, "WINID");

		gfn_activeMenu(sAcctiveWinID);
	}
	else{
		gv_tabFrame.form.btn_openMenuList.enable = false;
		gv_tabFrame.form.btn_prevTab.enable = false;
		gv_tabFrame.form.btn_nextTab.enable = false;
		gv_tabFrame.form.btn_MdiList.enable = false;
		gv_tabFrame.form.btn_max.enable = false;
		gv_tabFrame.form.btn_cas.enable = false;
		gv_tabFrame.form.btn_closeAll.enable = false;
	}
},

/*****************************************************************************************
* 함  수  명	: 	gfn_closeFrame
* 입      력	: 	strID: 윈도우 생성키
* 반      환	:   true/false 정상닫힘/닫힘취소 
* 기      능	: 	윈도우 타이틀 탭 닫힘 처리
*****************************************************************************************/
gfn_closeFrame: function(winKey)
{
 	gv_workFrame.frames[winKey].form.f_close();
},

gfn_callMain: function()
{
	var objNewWinMain = new ChildFrame;
	objNewWinMain.init("MainForm", "absolute", 0, 0, gv_workFrame.getOffsetWidth() - 0, gv_workFrame.getOffsetHeight() - 0);					
	gv_workFrame.addChild("MainForm", objNewWinMain);
	objNewWinMain.set_formurl("Frame::mainPotal.xfdl");
	objNewWinMain.set_dragmovetype("none");
	objNewWinMain.set_showtitlebar(false);
	objNewWinMain.set_resizable(false);
	objNewWinMain.set_openstatus("maximize");					
	objNewWinMain.show();	

	gv_vFrameSet1.set_separatesize("0,*");
},

/*
 ===============================================================================
 == Util관련 공통함수들은 여기에 작성한다.
 ===============================================================================
 ● gfn_isHTML5       : 실행되는 환경을 체크
 ● gfn_Decode        : Grid에서 expression으로  표현할때 decode 문처럼 사용할 수 있는 기능.
 ● gfn_Iif           : 조건에 따른 Value 처리
 ● gfn_checkURL      : 입력값이 URL Type인지 체크하는 함수
 ● gfn_checkEmail    : 입력값이 e-mail Type인지 체크하는 함수
 ● gfn_checkPhone    : 입력값이 전화번호 format 인지 체크하는 함수
 ● gfn_getFileExt    : 파일 확장자를 가져온다.
 ● gfn_htmlToChars   : html형식의 문자열에서 태그문자를 특수문자로 변형
 ● gfn_SpecToChars   : 특수문자가 들어있는 문자열에서 html형식의 문자로 변형
 ● gfn_getDomainText : 메세지 값을 문자열 치환하여 메세지 내용을 조회
 */

/**********************************************************************************
 * Function Name: gfn_isHTML5
 * Description  : 실행되는 환경을 체크
 * Arguments    :
 * return       : Boolean
 **********************************************************************************/
gfn_isHTML5 : function ()
{
		
		if((system.navigatorname == "nexacro") || (system.navigatorname == "nexacro ActiveX"))
		{ 
			return false;
		} else {			
			return true;  
		}	
},
  
/**********************************************************************************
 * Function Name: gfn_Decode
 * Description  : Grid에서 expression으로  표현할때 decode 문처럼 사용할 수 있는 기능.
 * Arguments    : decode(strVal, "test", true, false);
 * return       : varRtnValue 로 decode 조건에 맞는 값 리턴.
 **********************************************************************************/
gfn_Decode : function()
{ 
 var i, fn;
 fn = lib_Form.gfn_Decode;
 for( i = 1 ; i < fn.arguments.length ; i+=2 )
 {
  if( fn.arguments[0] == fn.arguments[i] )  
   return fn.arguments[i+1];
 }
 return fn.arguments[i-2];  
},

/**********************************************************************************
 * Function Name: gfn_Iif
 * Description  : 조건에 따른 Value 처리
 * Arguments    : iif(strVal=="test", true, false);
 * return       : iif 조건에 맞는 값 리턴.
 **********************************************************************************/
gfn_Iif : function (expr, v_true, v_false)
{
	return expr ? v_true : v_false;
},

/********************************************************************************
 * Function Name: gfn_checkURL
 * Description  : 입력값이 URL Type인지 체크하는 함수
 * Arguments	: strValue(String)
 * Return 		: true = 입력값이 URL형태일 경우
 ********************************************************************************/
gfn_checkURL : function (strValue)
{
	if (lib_Form.gfn_isNull(strValue)) 
	{
		return false;
	}
	else if (strValue.indexOf(".") == -1) 
	{
		return false;
	}
	else 
	{
		return true;
	}
},


/********************************************************************************
 * Function Name: gfn_checkEmail
 * Description  : 입력값이 e-mail Type인지 체크하는 함수
 * Arguments	: strValue(String)
 * Return 		: true = 입력값이 email형태일 경우
 ********************************************************************************/
gfn_checkEmail : function (strValue)
{
	if (lib_Form.gfn_isNull(strValue)) 
	{
		return false;
	}

	var nIndexOfAt = strValue.indexOf("@");
	var nIndexOfDot = strValue.indexOf(".");
	var nLength = strValue.length;

	// "@" 이 하나도 없거나 맨 끝에 위치한  경우
	if (nIndexOfAt <= 0 || nIndexOfAt == nLength) 
	{
		return false;
	}

	// "." 이 하나도 없거나 맨 끝에 위치한 경우
	if (nIndexOfDot <= 0 || nIndexOfDot == nLength) 
	{
		return false;
	}

	// "@"이 두개 이상 존재하는 경우
	if (strValue.indexOf("@", nIndexOfAt + 1) != -1) 
	{
		return false;
	}

	// ".@" 인 경우 또는 "@."인 경우
	if (strValue.substr(nIndexOfAt - 1, 1) == "." || strValue.substr(nIndexOfAt + 1, 1) == ".") 
	{
		return false;
	}

	// "@" 이후에 "."이 존재하지 않는 경우
	if (strValue.indexOf(".", (nIndexOfAt + 2)) == -1) 
	{
		return false;
	}

	// 공백문자가 존재하는 경우
	if (strValue.indexOf(" ") != -1) 
	{
		return false;
	}

	return true;
},

/********************************************************************************
 * Function Name: gfn_checkPhone
 * Description	: 입력값이 전화번호 format 인지 체크하는 함수
 * Arguments	: strValue(String)
 * Return 		: true = 입력값이 전화번호 형태일 경우
 ********************************************************************************/
gfn_checkPhone : function (strValue)
{
	// null 이거나 "-"이 존재하지 않는 경우
	if (lib_Form.gfn_isNull(strValue) || (!lib_Form.gfn_isNull(strValue) && strValue.indexOf("-") == -1)) 
	{
		return false;
	}
	else if (strValue.indexOf(".") >= 0) 
	{
		return false;
	}
	else 
	{
		// "-" 사이의 값이 숫자가 아닌 경우
		var arrNumbers = strValue.split("-");
		for (var i = 0; i < arrNumbers.length; i++) 
		{
			if (!nexacro.isNumeric(arrNumbers[i])) 
			{
				return false;
			}
		}
	}
	return true;
},

/********************************************************************************
 * Function Name	: gfnCheckDate8
 * Description		: 입력값이 날짜 형태 인지 체크하는 함수
 * Arguments		: strValue(String)
 * Return 			: true = 입력값이 8자리 날짜(yyyyMMdd) 형태일 경우
 ********************************************************************************/
gfn_checkDate8 : function (strValue)
{
	if (lib_Form.gfn_Length(strValue) != 8) 
	{
		return false;
	}
	else if (!this.gfn_DateCheck(strValue)) 
	{
		return false;
	}
	return true;
},

/********************************************************************************
 * Function Name	: gfnCheckDate10
 * Description  	: 입력값이 날짜 형태 인지 체크하는 함수
 * Arguments		: strValue(String)
 * Return 			: true = 입력값이 10자리 날짜 형태일 경우
 *					  허용 입력 타입(yyyy-MM-dd, yyyy/MM/dd, yyyy.MM.dd)
 ********************************************************************************/
gfn_checkDate10 : function (strValue)
{
	return lib_Form.gfn_checkDate8(lib_Form.gfn_Replace(lib_Form.gfn_Replace(lib_Form.gfn_Replace(strValue, "/", ""), "-", ""), ".", ""));
},

/********************************************************************************
 * Function Name: gfn_getFileExt
 * Description  : 파일 확장자를 가져온다.
 * Arguments	: 파일명
 * Return 		: String, 파일 확장자
 ********************************************************************************/
gfn_getFileExt : function (strFileName)
{
	strFileName = "" + strFileName;
	var arrFileName = strFileName.split(".");
	var strFileExt = arrFileName[arrFileName.length - 1];

	return strFileExt.trim();
},

/********************************************************************************
 * Function Name: gfn_getFileName
 * Description  : 파일 경로에서 파일명만 가져온다.
 * Arguments	: 파일명
 * Return 		: String, 파일명
 ********************************************************************************/
gfn_getFileName : function (strFilePath)
{
	var strFileName = "";

	strFilePath = lib_Form.gfn_ToString(strFilePath);
	for (var i = 0; i < strFilePath.length; i++) 
	{
		if (lib_Form.gfn_Right(strFilePath, i + 1).indexOf("\\") > -1) 
		{
			break;
		}
		if (lib_Form.gfn_Right(strFilePath, i + 1).indexOf("\/") > -1) 
		{
			break;
		}
		strFileName = lib_Form.gfn_Right(strFilePath, i + 1);
	}

	return strFileName;
},

/********************************************************************************
 * Function Name: gfn_htmlToChars
 * Description  : html형식의 문자열에서 태그문자를 특수문자로 변형
 * Arguments	: html형식 문자열
 * Return 		: String, 변형문자열
 ********************************************************************************/
gfn_htmlToChars : function (str)
{
	str = "" + str;
	if (lib_Form.gfn_isNull(str)) 
	{
		return "";
	}
	str = lib_Form.gfn_Replace(str, "\&", '&amp;');
	str = lib_Form.gfn_Replace(str, "\'", '&apos;');
	str = lib_Form.gfn_Replace(str, "\"", '&quot;');
	str = lib_Form.gfn_Replace(str, "\'", '&#39;');
	str = lib_Form.gfn_Replace(str, "<", '&lt;');
	str = lib_Form.gfn_Replace(str, ">", '&gt;');
	return str;
},

/********************************************************************************
 * Function Name: gfn_SpecToChars
 * Description  : 특수문자가 들어있는 문자열에서 html형식의 문자로 변형
 * Arguments	: 특수문자 형식 문자열
 * Return 		: String, 파일 확장자
 ********************************************************************************/
gfn_SpecToChars : function (str)
{
	str = "" + str;
	if (lib_Form.gfn_isNull(str)) 
	{
		return "";
	}
	str = lib_Form.gfn_Replace(str, "\&amp;", '&');
	str = lib_Form.gfn_Replace(str, "\&quot;", '"');
	str = lib_Form.gfn_Replace(str, "\&#39;", '\'');
	str = lib_Form.gfn_Replace(str, "\&lt;", '<');
	str = lib_Form.gfn_Replace(str, "\&gt;", '>');
	return str;
},

/********************************************************************
 * Function Name: gfn_getDomainText
 * Description  : 메세지 값을 문자열 치환하여 메세지 내용을 조회한다.
 * Arguments    : TextID: 메세지ID, aArgs: 토큰문자배열
 * 리턴 : 처리 메시지
 ********************************************************************/
gfn_getDomainText : function (TextID, aArgs)
{
	// alert("Util 256 " + TextID);
	var objApp = nexacro.getApplication() ;
	if (lib_Form.gfn_isNull(TextID)) 
	{
		return "";
	}
	
	var nRow = objApp.gds_DomainText.findRow(objApp.gv_DomainIdCol, TextID);
	if (nRow < 0) 
	{
		return TextID;
	}


	var sRtnMsg = objApp.gds_DomainText.getColumn(nRow, objApp.gv_DomainTextCol);

	if (lib_Form.gfn_isNull(aArgs)) 
	{
		return sRtnMsg;
	}

	var sType = typeof (aArgs);

	switch (sType) 
	{
		case "object":
			if (aArgs.length > 0) 
			{
				for (var i = 0; i < aArgs.length; i++) 
				{
					var strVal  = aArgs[i];
					sRtnMsg = lib_Form.gfn_Replace(sRtnMsg, objApp.gv_TxtPrefix + (i + 1),  lib_Form.gfn_getDomainText(strVal));
				}
			}
			else 
			{
				for (var strName; ; ) 
				{
					var strVal  = aArgs[strName];
			
					sRtnMsg = lib_Form.gfn_Replace(sRtnMsg, objApp.gv_TxtPrefix + strName, lib_Form.gfn_getDomainText(strVal));
				}
			}
			break;
		default:
			sRtnMsg = lib_Form.gfn_Replace(sRtnMsg, objApp.gv_TxtPrefix + "1", lib_Form.gfn_getDomainText(aArgs));
			break;
	}
	return sRtnMsg;
},



/*****************************************************************************************
 * 함  수  명	: 	fn_getObjFont
 * 입      력	: 	iFontSize
 sFontName
 * 반      환	: 	Font Object
 * 기      능	: 	Font Object 생성 반환
 *****************************************************************************************/
gfn_getObjFont : function (iFontSize, sFontName, bBold)
{
	var strFont = sFontName + "," + iFontSize;
	if (bBold == true) 
	{
		strFont += ",bold";
	}
	return strFont;
},


/*******************************************************************************
 * Function Name: gfn_isEmpty
 * Description  : 입력값이 Null이거나 빈값인지 체크한다.
 * Arguments    : sValue
 * Return       : true / false
 *******************************************************************************/
gfn_isEmpty : function (Val)
{
	return lib_Form.gfn_isNull(Val);
},


/*******************************************************************************
 * Function Name: gfn_ToString
 * Description  : 입력값을 String으로 변경한다.
 * Arguments    : Val
 * Return       : String
 *******************************************************************************/
gfn_ToString : function (Val)
{
	if (lib_Form.gfn_isNull(Val)) 
	{
		return new String();
	}
	return new String(Val);
},

/*******************************************************************************
 * Function Name	: gfn_Length
 * Description		: 입력값 형태에 따라서 길이 또는 범위를 구하는 함수
 * Parameter		: 객체, 문자열, 배열
 * Return 			: Type에 따라 구해진 길이 또는 범위
 *******************************************************************************/
gfn_Length : function (Val)
{
	return lib_Form.gfn_ToString(Val).length;
},

/**********************************************************************************
 * Function Name: gfn_Right
 * Description  : 문자열의 오른쪽부분을 지정한 길이만큼 Return 한다.
 * Arguments    : Val   (오른부분을 얻어올 원본 문자열)
 *                nSize (얻어올 크기. [Default Value = 0])
 * Return       : String
 **********************************************************************************/
gfn_Right : function (Val, nSize)
{
	var nStart = lib_Form.gfn_ToString(Val).length;
	var nEnd = Number(nStart) - Number(nSize);
	var rtnVal = Val.substring(nStart, nEnd);

	return rtnVal;
},

/**********************************************************************************
 * Function Name: gfn_Left
 * Description  : 문자열의 왼쪽부분을 지정한 길이만큼 Return 한다.
 * Arguments    : Val (외쪽부분을 얻어올 원본 문자열)
 *                     nSize (얻어올 크기. [Default Value = 0])
 * return       : String, 오른쪽 부분이 얻어진 문자열.
 **********************************************************************************/
gfn_Left : function (Val, nSize)
{
	return lib_Form.gfn_ToString(Val).substr(0, nSize);
},

/**********************************************************************************
 * Function Name: gfn_Nvl
 * Description  : 입력값이 존재하는지를 판단하여
 *				  존재하는 경우 입력값을 그대로 반환, 그렇지 않으면
 *				  두 번째 파라미터를 반환하는 함수
 * Arguments    : Val(입력값)
 newVal이 Null일 경우 대체할 값)
 * return       : Null을 대치한 값
 **********************************************************************************/
gfn_Nvl : function (Val, newVal)
{
	if (lib_Form.gfn_isNull(Val)) 
	{
		return newVal;
	}
	return Val;
},


/**********************************************************************************
 * Function Name: gfn_Replace()
 * Description  : 입력된 문자열의 일부분을 다른 문자열로 치환하는 함수
 * Arguments    : strString 원본 문자열.
 *               strOld    원본 문자열에서 찾을 문자열.
 *               strNew    새로 바꿀 문자열.
 * return       : 대체된 문자열
 **********************************************************************************/
gfn_Replace : function (Val, strOld, strNew)
{
   //trace("=== gfn_Replace ===");
	Val = lib_Form.gfn_ToString(Val);
	Val = Val.split(eval("/" + strOld + "/g")).join(strNew);
	// Val = Val.split(strOld).join(strNew);
	return Val;
},

/********************************************************************************
 * Function Name: gfn_IndexOf
 * Description  : 전체 문자열 중 특정 문자열이 포함된 위치를 반납
 *				  ex) gfn_IndexOf("abc", "b")
 * Arguments	: Val(원본 문자열)
 *				  strOld(검사할 문자열)
 *				  index(시작순서)
 * Return 		: 문자열이 포함된 위치의 index값
 ********************************************************************************/
gfn_IndexOf : function (Val, strOld, index)
{
	if (lib_Form.gfn_isNull(index)) 
	{
		index = 0;
	}
	return lib_Form.gfn_ToString(Val).indexOf(strOld, index);
},

/******************************************************************************
 * Function Name: gfn_NumFormat(dNumber);
 * Description  : 입력된 실수를 문자열 표현법으로 표현하는 함수
 * Arguments    : dNumber    문자열로 출력할 실수
 *                nDetail    출력시 소숫점 이하의 자릿수(Default : 0)
 * return       : 문자열로 바뀐 실수
 *                출력되는 실수는 정수부분에 3자리마다 ',' 가 삽입됩니다.
 * gfn_NumFormat(12345.66)
 ******************************************************************************/
gfn_NumFormat : function (dNumber, nDetail)
{
	var strVal = "" + dNumber;
	var rtnStr;
	var arrStr;

	if (lib_Form.gfn_isNull(nDetail) == false) 
	{
		strVal = nexacro.toNumber(dNumber).round(nDetail);
	}
	return lib_Form.gfn_SetComma(strVal);
},

/******************************************************************************
 * Function Name: gfn_getFormat
 * Description  : 문자 포맷 형식 변환 ( 해당 문자는 포맷에서 @ 사용)
 * Arguments    : Val: 문자열,
 *                strMask: 문자열 포맷, (@:문자, 포맷스트링("-", ",", ".")등
 * return       : 포맷된 문자
 ******************************************************************************/
gfn_getFormat : function (Val, strMask)
{
	var strRetVal = "";
	var sUnit;

	if (lib_Form.gfn_isNull(Val)) 
	{
		return "";
	}

	Val = lib_Form.gfn_ToString(Val);

	for (var i = 0; i < strMask.length; i++) 
	{
		sUnit = strMask.substr(i, 1);

		if (sUnit == "@") 
		{
			strRetVal += Val.substr(0, 1);
			Val = Val.substr(1);
		}
		else 
		{
			strRetVal += sUnit;
		}
	}
	return strRetVal;
},

/**********************************************************************************
 * Function Name: gfn_SetComma
 * Description  : 숫자에 ","를 집어넣기
 * Arguments    : sNum ( 문자열 )
 * return       : 포맷된 문자
 **********************************************************************************/
gfn_SetComma : function (sNum)
{
	sNum = lib_Form.gfn_Replace(sNum, ",", "");

	var ppos,sDigit,nEnd,nStart = 0,sRet = "";

	if (sNum.charAt(0) == "+" || sNum.charAt(0) == "-") 
	{
		sRet += sNum.charAt(0);
		nStart = 1;
	}

	ppos = sNum.indexOf(".", nStart);
	if (ppos < 0) 
	{
		nEnd = sNum.length;
	}
	else 
	{
		nEnd = ppos;
	}

	sDigit = sNum.substr(nStart, nEnd - nStart);
	for (this.lookupSetter("pos", "set_pos").set(0); this.lookup("pos") < sDigit.length; this.lookupSetter("pos", "set_pos").postInc()) 
	{
		if (this.lookup("pos") != 0 && (sDigit.length - this.lookup("pos")) % 3 == 0) 
		{
			sRet += ",";
		}
		sRet += sDigit.charAt(this.lookup("pos"));
	}
	sRet += sNum.substr(nEnd);

	return sRet;
},

/******************************************************************************
 * Function Name: gfn_Split2
 * Description  : 입력된 문자열을 strDelimiter1과 strDelimiter2로 2 번 Parsing 한 2차원 배열을 Return
 * argument     : Val     : Parsing 할 원본 문자열,
 strDelimiter1 : 첫번째로 잘라낼 구분 문자열,
 strDelimiter2 : 두번째로 잘라낼 구분 문자열
 * return       : 2 번 Parsing 된 2 차원 배열
 ******************************************************************************/
gfn_Split2 : function (Val, strDelimiter1, strDelimiter2)
{
	var split2Arr = new Array();

	Val = lib_Form.gfn_ToString(Val);

	var splitArr = Val.split(strDelimiter1);
	for (var i = 0; i < splitArr.length; i++) 
	{
		split2Arr.getSetter(i).set(splitArr[i].split(strDelimiter2));
	}
	return split2Arr;
},

/******************************************************************************
 * Function Name: gfn_findArray
 * Description  : 1차원 배열에서 입력된 문자열이 있는 index를 반환
 * argument     : ArrObj        : 1차원 배열
 strKey        : 검색할 문자열
 * return       : 찾은 배열 index
 ******************************************************************************/
gfn_findArray : function (ArrObj, strKey)
{
	for (var i = 0; i = ArrObj.length; i++) 
	{
		if (strKey == ArrObj[i]) 
		{
			return i;
		}
	}
	return -1;
},

/******************************************************************************
 * Function Name: gfn_findArray2
 * Description  : 2차원 배열에서 입력된 문자열이 있는 index를 반환
 * argument     : Arr2Obj       : 2차원 배열
 strKey        : 검색할 문자열
 index         : 검색할 차원
 * return       : 찾은 배열 index
 ******************************************************************************/
gfn_findArray2 : function (Arr2Obj, strKey, index)
{
	for (var i = 0; i < Arr2Obj.length; i++) 
	{
		if (strKey == Arr2Obj[i][index]) 
		{
			return i;
		}
	}
	return -1;
},

/*
===============================================================================
 == 서비스 호출관련 공통함수들은 여기에 작성한다.
 ===============================================================================
 ● gfn_Transaction         :  공통 트랜잭션 함수
 ● gfn_TransactionCallBack :  공통 Callback 함수
 */    

/******************************************************************************
 * Function Name: gfn_Transaction
 * Description  : 공통 트랜잭션 함수
 * Arguments    : svcID         Transaction 서비스ID(사용자지정)
 *                URL           Transaction 요청 경로
 *                inDatasets    송신 Dataset(복수일 경우 " "으로 구분)
 *                outDatasets   수신 Dataset(복수일 경우 " "으로 구분)
 *                argument      Dataset 외의 Transaction을 위한 인자값
 *                            a=b의 형태로 입력하고, 빈칸으로 구분
 *                callbackFunc  Callback 함수명
 *                showProgress  ProgressBar 표시여부(default:true)
 *                bAsync        비동기 여부를 지정합니다.(Default : true)
 *                bBinary       Binary 형태로 전송할 지 여부를 지정합니다.(Default : false)
 * Return       :
 ******************************************************************************/
gfn_Transaction : function (svcID, URL, inDatasets, outDatasets, argument, callbackFunc, showProgress, bAsync, bBinary, objForm )
{
	var pThis = objForm;
  var objApp = nexacro.getApplication() ; 
  var objEnv = nexacro.getEnvironment();	
	if (lib_Form.gfn_isEmpty(showProgress) || showProgress == true) 
	{
		objEnv.set_usewaitcursor(true);		 
	} else {
		objEnv.set_usewaitcursor(false);		
	}
	if (lib_Form.gfn_isEmpty(bAsync)) 
	{
		bAsync = true;
	}
	if (lib_Form.gfn_isEmpty(bBinary)) 
	{
		bBinary = false;
	}
	if (lib_Form.gfn_isEmpty(argument)) 
	{
		argument = "";
	}

	var strChk = new String(showProgress);
	if (strChk != 'true' && strChk != 'false') 
	{
		trace("    form id = " + this.name + " svcId = " + svcID + " value = " + strChk);
	}
	objEnv.set_usewaitcursor(false);
	// Async가 true면 커서를 지정한다.
	//objEnv.set_usewaitcursor(true);

	pThis.setWaitCursor(true); //커서 활성화.

	var strSvcID = svcID + ":" + callbackFunc;
	var strURL = URL;
	var strInDatasets = inDatasets;
	var strOutDatasets = outDatasets;
	var strArgument = argument;
	var strCallbackFunc = "gfn_TransactionCallBack";
	
	var m_output = outDatasets;
	// trace("strSvcID===================================" + strSvcID + " : " + jv_objDsResultOption);
	var service = objEnv.services["svcurl"];
	// http://localhost:8080/myapp/ ,/

	pThis.transaction(strSvcID, strURL, strInDatasets, strOutDatasets, strArgument, strCallbackFunc, bAsync, bBinary);
},

/******************************************************************************
 * Function Name: gfn_TransactionCallBack
 * Description  : 공통 Callback 함수
 *                이 함수가 먼저 수행되고 사용자지정Callback함수가 수행된다
 * Arguments    : svcID         Transaction 서비스ID + : + Callback 함수명
 *                errorCode     에러코드
 *                errorMsg      에러 메시지
 * Return     :
 ******************************************************************************/
gfn_TransactionCallBack : function (svcID, errorCode, errorMsg)
{
	var objApp = nexacro.getApplication() ; 
  var objEnv = nexacro.getEnvironment();
	objEnv.set_usewaitcursor(true);
	this.setWaitCursor(false); //커서 비활성화.

	var arrSvcID = svcID.split(":");

	// 세션 만료 체크
	if (errorCode == -99999) 
	{
		// userNotify(-666666666,  "goLoginPage(true)");
		this.lookupFunc("gfn_Alert").call("domain.session.timeout");
		objApp.gfn_Exit();
		return;
	}

	/*
	 if (errorCode != 0) {
	 if (arrSvcID.length > 3 && !gfn_isEmpty(arrSvcID[3])) {
	 gfn_Alert(arrSvcID[3]);
	 } else {
	 gfn_Alert(errorMsg);
	 }
	 } else {
	 if (arrSvcID.length > 2 && !gfn_isEmpty(arrSvcID[2])) {
	 gfn_Alert(arrSvcID[2]);
	 }
	 }
	 */

	if (arrSvcID.length > 1 && !this.lookupFunc("gfn_isNull").call(arrSvcID[1])) 
	{
		var strExpr = arrSvcID[1] + "('" + arrSvcID[0] + "', " + errorCode + ", '" + errorMsg + "')";
		//trace("strExpr>>> " + strExpr);
		eval(strExpr);
	}
}

}