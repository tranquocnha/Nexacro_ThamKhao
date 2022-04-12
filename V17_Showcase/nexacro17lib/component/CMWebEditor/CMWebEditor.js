//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.0.html
//		code mirror : https://codemirror.net/
//
//==============================================================================
//==============================================================================
// Object : nexacro.CMWebEditor
// Group : Component
//==============================================================================
if (!nexacro.CMWebEditor)
{
	//*------------------------------------------------------------------------
	//* Value Change
	//*------------------------------------------------------------------------
	nexacro.EditorChangeInfo = function (obj, id, v)
    {
        this.id = this.eventid = id || "oncontentschange";
        this.fromobject = this.fromreferenceobject = obj;
        this.contents = v;
    };
    var _pEditorChangeInfo = nexacro._createPrototype(nexacro.Event,nexacro.EditorChangeInfo);
    nexacro.EditorChangeInfo.prototype = _pEditorChangeInfo;
    _pEditorChangeInfo._type_name = "EditorChangeInfo";
    delete _pEditorChangeInfo;  

	//*------------------------------------------------------------------------
	//* HOTKEY EVENT
	//*------------------------------------------------------------------------
	nexacro.EditorHotkeyInfo = function (obj, id, v)
    {
        this.id = this.eventid = id || "onhotkey";
        this.fromobject = this.fromreferenceobject = obj;
        this.hotkey = v;
    };
    
    var _pEditorHotkeyInfo = nexacro._createPrototype(nexacro.Event,nexacro.EditorHotkeyInfo);
    nexacro.EditorHotkeyInfo.prototype = _pEditorHotkeyInfo;
    _pEditorHotkeyInfo._type_name = "EditorHotkeyInfo";
    delete _pEditorHotkeyInfo;  
	
	//*------------------------------------------------------------------------
	//* mouse move
	//*------------------------------------------------------------------------
	nexacro.EditorMouseMoveInfo = function (obj, id, x, y)
    {
        this.id = this.eventid = id || "oniframemousemove";
        this.fromobject = this.fromreferenceobject = obj;
        this.pageX = x;
		this.pageY = y;
    };
    
    var _pEditorMouseMoveInfo = nexacro._createPrototype(nexacro.Event,nexacro.EditorMouseMoveInfo);
    nexacro.EditorMouseMoveInfo.prototype = _pEditorMouseMoveInfo;
    _pEditorMouseMoveInfo._type_name = "EditorMouseMoveInfo";
    delete _pEditorMouseMoveInfo;  	
	
	//*------------------------------------------------------------------------
	//* return data
	//*------------------------------------------------------------------------
	nexacro.EditorUserNotifyInfo = function (obj, id, t, v)
    {
        this.id = this.eventid = id || "onnotify";
        this.fromobject = this.fromreferenceobject = obj;
		this.type = t;
        this.userdata = v;
    };
    var _pEditorUserNotifyInfo = nexacro._createPrototype(nexacro.Event, nexacro.EditorUserNotifyInfo);
    nexacro.EditorUserNotifyInfo.prototype = _pEditorUserNotifyInfo;
    _pEditorUserNotifyInfo._type_name = "EditorUserNotifyInfo";
    delete _pEditorUserNotifyInfo;
	
    //==============================================================================
    // nexacro.CMWebEditor
    //==============================================================================
    nexacro.CMWebEditor = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.WebBrowser.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		
		this.cmurl = "/codemirror/cm.html";
		this.bFirstLoad = false;
		this.isLoad = false;
		this.web;
		this.doc;
		this.contents = null;
		this.org_contents = null;
		this.html = "";
		this.theme = "default";
		this.bCallBackLoad = false;
		this.dssource = null;
		this.returndata = "";
		
		this._load_manager = new nexacro._LoadManager(this);
		
		this._event_list = {
			"onclick" : 1, "oncontentschange":1, "onhotkey":1, "oniframemousemove":1, "onnotify" : 1,
			"ondblclick" : 1, 
			"onkeypress" : 1, 
			"onkeydown" : 1, 
			"onkeyup" : 1, 
			"onkillfocus" : 1, 
			"onsetfocus" : 1, 
			"ondrag" : 1, 
			"ondragenter" : 1, 
			"ondragleave" : 1, 
			"ondragmove" : 1, 
			"ondrop" : 1, 
			"onlbuttondown" : 1, 
			"onlbuttonup" : 1, 
			"onmouseenter" : 1, 
			"onmouseleave" : 1, 
			"onmousemove" : 1, 
			"onmove" : 1, 
			"onsize" : 1, 
			"onrbuttondown" : 1, 
			"onrbuttonup" : 1, 
			"oncontextmenu" : 1, 
			"onloadcompleted" : 1, 
			"onusernotify" : 1
		};
    };

    var _pCMWebEditor = nexacro._createPrototype(nexacro.WebBrowser, nexacro.CMWebEditor);
    nexacro.CMWebEditor.prototype = _pCMWebEditor;
    _pCMWebEditor._type_name = "CMWebEditor";

   
	
    /* internal variable */
    _pCMWebEditor._is_focus_accept = true;          //focus를 받을지 여부	
	_pCMWebEditor._is_scrollable = true;	       //scroll을 
    

    /* status */
	
    _pCMWebEditor._use_pushed_status = true;  //push status 를 지원하는지 여부
    _pCMWebEditor._use_selected_status = true;  //select status를 지원하는지 여부
	_pCMWebEditor._use_readonly_status = true;	//readonly status를 지원하는지 여부
	
    /* accessibility */
    _pCMWebEditor.accessibilityrole = "button";
   	

    //===============================================================
    // nexacro.CMWebEditor : Create & Destroy & Update
    //===============================================================
	
	/*
	 Description : createComponent 실행시 nexacro.ControlElement 를 생성 후 호출됨
	 Todo :
	 control이 있다면 create() & createComponent() 호출
	 return : 없음
    _pCMWebEditor.on_create_contents = function ()
	{
		//control create 
		//control createComponent();		
	};
	*/

	/*
    _pCMWebEditor.on_created_contents = function (win)
	{
	};
	*/
	_pCMWebEditor.loadFileText = function (url, cache, async, service) {
		if (async == null) {
			async = true;
		}
		var realurl = nexacro._getServiceLocation(url, this._refform._base_url, null, false);
		if(url.indexOf(".js") < 0) {
			realurl = realurl.replace(".js","");
		}
		
		var load_item = this._load_manager.getGlobalItem(realurl);
		if (!load_item) {
			var load_item = new nexacro._LoadItem(realurl, "text", null);
			this._load_manager.globalList.push(load_item);
			this._load_manager.globalCnt++;
			var service = nexacro._getServiceObject(realurl, true);
			load_item.handle = nexacro._loadJSText(realurl, this, this.on_load_globalmodule, service, async);
		}
	};
	
	_pCMWebEditor.on_load_globalmodule = function (url, errstatus, jstext, fireerrorcode, returncode, requesturi, locationuri, extramsg) {
		var load_Item = this._load_manager.getGlobalItem(url);
		if (load_Item) {
			load_Item.handle = null;
			if (errstatus === 0) {
				if (jstext !== "") {
					load_Item.data = jstext;
					this.on_fire_notify("READFILE",jstext);
				}
			}
			else {
				load_Item.errcode = errstatus;
				nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
				this.on_fire_notify("READFILE","");
			}
			this._load_manager.globalCnt--;
		}

	};	
	
	_pCMWebEditor.on_apply_url = function () {
		if (this._url === "http://" || this._url === "file://" || this._url === "https://" || this._url === "") {
			return;
		}

		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem) {
			this._blockLoadFlag = false;
			ifrm_elem._setUrl(this._url, this.useurlhistory);
		}
		if(!this.bFirstLoad && this._url == "about:blank") {

			if(nexacro._Browser == "Runtime") {
				try {
					//this.addEventHandler("onusernotify", this.onusernotify2, this);
				} catch(e) {
					trace(e.message);
				}
			}
			
			this.bFirstLoad = true;
			var xadl = nexacro.getApplication().xadl;
			var pos = xadl.lastIndexOf("/");
			var url = xadl.substring(0,pos) + this.cmurl;
			var pThis = this;
			if(nexacro._Browser == "Runtime") {
				if(url.indexOf("file://")>=0) {
					url = url.replace("file://","");
				}

				this._url = url;
				this.url = url;

				this.on_apply_url();
				return;
			}
			nexacro._OnceCallbackTimer.callonce(this, function() { pThis.set_url(url); } , 10);
		}
	};
	
	_pCMWebEditor.on_fire_onloadcompleted = function (obj, url) {
		if (this.onloadcompleted && this.onloadcompleted._has_handlers) {
			var evt = new nexacro.WebLoadCompEventInfo(obj, url);
			evt.eventid = "onloadcompleted";
			return this.onloadcompleted._fireEvent(this, evt);
		}
		return true;
	};

	
	_pCMWebEditor.on_fire_onusernotify = function (obj, userdata) {
		this.onusernotify2(obj, userdata);
		return true;
	};
	
	_pCMWebEditor.onusernotify2 = function (obj,e) 
	{
		if(obj.getProperty('window')) {
			var sJson = obj.getProperty('window').getProperty('TOBEHTMLDATA');

			if(sJson) {
				var oJson = JSON.parse(sJson);
				if(oJson.type == "CHANGE") {
					this.contents = oJson.data;
					this.on_fire_contentschange();
				} else if(oJson.type == "HOTKEY") {
					this.on_fire_hotkey(oJson.data);
				} else if(oJson.type == "LOAD") {
					this.isLoad = true;
					
					//if(this.bCallBackLoad == true) {
					if(this.contents != null) {
						this.set_contents(this.contents,this.dssource);
						this.bCallBackLoad == false;
					}
					this.on_fire_notify("LOAD","SUCCESS");
				} else if(oJson.type == "MOVE") {
					var p = oJson.data;
					var s = p.split(":");
					if(s && s.length == 2) {
						this.on_fire_iframemousemoce(s[0],s[1]);
					}
				
				} else if(oJson.type == "RETURNDATA") {
					this.on_fire_notify("RETURNDATA", oJson.data);
				}
			}
			try {
				sJson.destroy();
			} catch(e) {
			} finally {
				sJson = oJson = null;
			}
		}
	};	 
	 
	/*---------------------------------------------------------------------
	// return data
	/---------------------------------------------------------------------*/
   _pCMWebEditor.on_fire_notify = function (t, v)
   {
        var event = this.onnotify;
        if (event && event._has_handlers)
        {
			var evt = new nexacro.EditorUserNotifyInfo(this, "onnotify", t, v);			
            event._fireEvent(this, evt);
        }
   };
	/*---------------------------------------------------------------------
	// value change event
	/---------------------------------------------------------------------*/
   _pCMWebEditor.on_fire_contentschange = function ()
   {
        var event = this.oncontentschange;
        if (event && event._has_handlers)
        {
			var evt = new nexacro.EditorChangeInfo(this, "oncontentschange", this.contents);			
            event._fireEvent(this, evt);
        }
   };
	/*---------------------------------------------------------------------
	// hotkey event
	/---------------------------------------------------------------------*/
   _pCMWebEditor.on_fire_hotkey = function (v)
   {
        var event = this.onhotkey;
        if (event && event._has_handlers)
        {
			var evt = new nexacro.EditorHotkeyInfo(this, "onhotkey", v);			
            event._fireEvent(this, evt);
        }
   };	
	/*---------------------------------------------------------------------
	// mousemove
	/---------------------------------------------------------------------*/
   _pCMWebEditor.on_fire_iframemousemoce = function (x,y)
   {
        var event = this.oniframemousemove;
        if (event && event._has_handlers)
        {
			x = nexacro.toNumber(x);
			y = nexacro.toNumber(y);
			var evt = new nexacro.EditorMouseMoveInfo(this, "oniframemousemove", x, y);			
            event._fireEvent(this, evt);
        }
   };   
	 /*
	  Description : form load시 component를 innerhtml 형태로 string을 리턴함
	   on_created_contents 함수에서 element에서 설정한 코딩과 동일하게 작성함
	   container component가 내부 component를 일괄 생성될때 호출됨
	 Todo :
	 control 의 createCommand() 함수를 호출해 innerhtml 형태의 string을 만든다. 
	 parameter : 없음
	 return : string (control의 innerhtml형태의 string)
	 
    _pCMWebEditor.on_create_contents_command = function ()
	{
		TODO:
		return control.createCommand();
	};
	*/
	
	/*
	 Description : innerhtml 이 생성된 후에 nexacro.Element의 handle에 실제 node handle을 attach함
	 Todo :
	 control 의 attachHandle() 함수를 호출해 nexacro.Element의 handle에 실제 node handle을 attach함
	 parameter : win (component 가 속한 nexacro._Window)
	 return : 없음
	 
    _pCMWebEditor.on_attach_contents_handle = function (win)
	{
		TODO:
		control.attachHandle(win);
	};
	*/
	
    _pCMWebEditor.on_destroy_contents = function ()
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem) {
			nexacro._stopSysObserving(ifrm_elem.handle, "mouseover", "onmouseover", this._webbrowser_mouseover);

			this.window = null;
			this.document = null;
			ifrm_elem.destroy();
			this._ifrm_elem = null;
		}	
		this._load_manager.destroy();
		this._load_manager = null;
	};
    //===============================================================
    // nexacro.CMWebEditor : Override
    //===============================================================
	/* 
	Description : simple bind를 지원하기 위한 함수
	TODO :
	simple bind property를 설정함
	return : string (simple bind property)
	
    _pCMWebEditor.on_getBindableProperties = function ()
    {
        return "value";
    };
    */
	
	/*
	Description : Component의 client size가 변경되었을 때 호출되는 함수
	TODO :
	control의 size 변경
	parameter : width(client width), height (client height)
	return : 없음
	
	_pCMWebEditor.on_change_containerRect = function (width, height)
	{
		return nexacro.WebBrowser.on_change_containerRect.call(this, width, height);
	};
	*/
	
	
	/*
	Description : userstatus 가 변경될때 발생
	
	TODO :
	userstatus가 변경될때 처리할 코드를 구현함
	parameter : changestatus(변경할 userstatus), value (변경할 userstatus의 값)
	applyuserstatus(적용될 userstatus), currentstatus(현재 status), currentuserstatus(현재 userstatus)
	return : string (적용될 userstatus)
	
    _pCMWebEditor.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        return applyuserstatus;
    };
	*/
	
	/*
	Description : status 가 변경될때 발생
	
	TODO :
	status가 변경될때 처리할 코드를 구현함
	parameter : changestatus(변경할 status), value (변경할 status의 값)
	applyuserstatus(적용될 status), currentstatus(현재 status), currentuserstatus(현재 userstatus)
	return : string (적용될 status)
	
	 _pCMWebEditor.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        return applystatus;
    };
	*/
	
	/*
	Description : fittocontents property 를 제공할때 사이즈를 리턴하는 함수
	
	TODO :
	component의 contents 사이즈를 리턴함	
	return : array (0: width, 1:height)
	
	 _pCMWebEditor._on_getFitSize = function ()
    {
		//TODO
        //return [this._adjust_width, this._adjust_height];
    };
	*/
	
	/*
	Description : control로 사용될때 control의 id를 리턴함
	nexacro.Element의 idselector에 설정되는 값으로 node에 cssclass값에 적용됨
	
	TODO :
	control의 id를 리턴함
	return : string (control의 id)
	
	 _pCMWebEditor.on_getIDCSSSelector = function ()
    {
		//TODO
        //return this.name;
    };
	*/
	
	/*
	Description : component의 cssclass property 값이 변경될때 호출됨
	control이 있을 경우 control의 cssclass 변경을 처리해야 함
	
	TODO :
	control이 있을 경우 control의 cssclass 변경을 처리해야 함
	return : 없음
	
	 _pCMWebEditor.on_apply_prop_cssclass = function ()
    {
		//TODO
		//control.on_apply_cssclass();
    };
	*/
	
	/*
	Description : component의 text, expr property 값이 변경될때 호출됨
		
	TODO :
	component에서 개별 처리해야 할 내용이 있을 경우에 변경 처리해야함
	return : 없음
	
	 _pCMWebEditor.on_apply_text = function (text)
    {
		//TODO
		//
    };
	*/
	
	/*
	Description : component의 enable property 값이 변경될때 호출됨
		
	TODO :
	control이 있을 경우 control의 enable을 처리해야 함
	return : 없음
	
	 _pCMWebEditor.on_apply_prop_enable = function (v)
    {
		//TODO
		//control.on_apply_prop_enable();
    };
	*/
	
	/*
	Description : component의 accessibility label property 값이 없을 때 읽어줄값 을 정의함
		
	TODO :
	label 로 읽힐 값들을 재정의함
	
	return : 없음
	
	 _pCMWebEditor.on_get_accessibility_label = function ()
    {
		//TODO
		return nexacro.WebBrowser.on_get_accessibility_label.call(this);
    };
	*/
	
	/*
	Description : component의 accessibility description property 값이 없을 때 읽어줄값 을 정의함
		
	TODO :
	descript 로 읽힐 값들을 재정의함
	
	return : 없음
	
	 _pCMWebEditor.on_get_accessibility_description = function ()
    {
		//TODO
		return nexacro.WebBrowser.on_get_accessibility_description.call(this);
    };
	*/
	
	/*
	Description : component의 accessibility action property 값이 없을 때 읽어줄값 을 정의함
		
	TODO :
	action 로 읽힐 값들을 재정의함
	
	return : 없음
	
	 _pCMWebEditor.on_get_accessibility_action = function ()
    {
		//TODO
		return nexacro.WebBrowser.on_get_accessibility_action.call(this);
    };
	*/
	
	
	
	/*
	Description : focus를 받았을때 setfocus event 발생후 호출됨 
	
	TODO :
	 개별 처리할 부분에 대한 재정의
	parameter : evt_name(이벤트 발생시점)
	
	 _pCMWebEditor.on_apply_custom_setfocus= function (evt_name)
    {
       
    };
	*/
	
    //===============================================================
    // nexacro.CMWebEditor : Properties
    //===============================================================
	
	/*
	 property 추가 
	 
	_pCMWebEditor.userprop = true;
	_pCMWebEditor.set_userprop = function(v)
	{
	};
	
	*/
	
	
    //===============================================================
    // nexacro.CMWebEditor : Methods
    //===============================================================
    /*
	method 추가
	
	_pCMWebEditor.usermethod = function ()
    {
		TODO:        
    };
	*/
	
    //===============================================================
    // nexacro.CMWebEditor : Events
    //===============================================================
	
	/*
	event 추가
	
	_pCMWebEditor._event_list["onuserevent"] = 1;	
	nexacro.UserEventInfo = function (obj, id)
    {
        this.id = this.eventid = id || "onuserevent";
        this.fromobject = this.fromreferenceobject = obj;
    };
    var _pUserEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.UserEventInfo);
    nexacro.UserEventInfo.prototype = _pUserEventInfo;
    _pUserEventInfo._type_name = "UserEventInfo";

    delete _pUserEventInfo;
    _pUserEventInfo = null; 
	
    _pCMWebEditor.on_fire_onuserevent = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp)
    {
       if (this.onuserevent && this.onuserevent._has_handlers)
        {
            var evt = new nexacro.UserEventInfo(this, "onuserevent");
            return this.onuserevent._fireEvent(this, evt);
        }
    };
     */
   _pCMWebEditor.contents = function ()
   {
	   return this.contents;
   };	 

    _pCMWebEditor.set_contents = function(v, d)
	{
		this.contents = v;
		if(!d) {
			this.dssource = d;
		}
		if(this.isLoad == true) {
			if(this.org_contents == null) {
				this.org_contents = this.contents;
			}
			if(nexacro._Browser == "Runtime") {
				this.callMethod("cm_setvalue", v, d);
			} else {
				this._ifrm_elem._window.cm_setvalue(v, d);
			}
	   } else {
			this.bCallBackLoad = true;
	   }		
	};
	_pCMWebEditor.selectTheme = function(v)
	{
		this.theme = v;
		if(this.isLoad == true) {
			if(nexacro._Browser == "Runtime") {
				this.callMethod("cm_settheme", v);
			} else {
				this._ifrm_elem._window.cm_settheme(v);
			}
	   } else {
			this.bCallBackLoad = true;
	   }		
	};
	_pCMWebEditor.insertText = function(v)
	{
		if(this.isLoad == true) {
			if(nexacro._Browser == "Runtime") {
				this.callMethod("cm_inserttext",v);
			} else {
				this._ifrm_elem._window.cm_inserttext(v);
			}
	   }		
	};
	_pCMWebEditor.getText = function()
	{
		if(this.isLoad == true) {
			var o;
			if(nexacro._Browser == "Runtime") {
				this.callMethod("cm_getsqltext",v,true);
			} else {
				o = this._ifrm_elem._window.cm_getsqltext(v);
			}
			return o;
	   }		
	};
	delete _pCMWebEditor;
}


