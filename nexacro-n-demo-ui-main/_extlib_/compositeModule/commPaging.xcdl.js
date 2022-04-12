//==============================================================================
//	Define the Component Class of the Compostie Component.
//==============================================================================
//==============================================================================
// Object : nexacro.commPaging
// Group : Component
//==============================================================================
if (!nexacro.commPaging)
{
	//==============================================================================
	// nexacro.commPaging
	//==============================================================================
	nexacro.commPaging = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._CompositeComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
		this.addEvent("canchangepage");
		this.addEvent("onchangepage");
	};

	var _pcommPaging = nexacro._createPrototype(nexacro._CompositeComponent, nexacro.commPaging);
	nexacro.commPaging.prototype = _pcommPaging;
	_pcommPaging._type_name = "commPaging";
		
	/* accessibility */
	_pcommPaging.accessibilityrole = "form";

	//속성 기본값
	_pcommPaging._default_rowcount = 5;
	_pcommPaging._default_buttoncount = 10;
	
	//속성 초기화
	_pcommPaging.rowcount = 5;
	_pcommPaging.totalrowcount = 0;
	_pcommPaging.buttoncount = 10;
	_pcommPaging.pagecount = 0;
	_pcommPaging.btnfirstcssclass = "";
	_pcommPaging.btnprevcssclass = "";
	_pcommPaging.btnnextcssclass = "";
	_pcommPaging.btnlastcssclass = "";
	_pcommPaging.btnnumcssclass = "";
	
	//rowcount Setter 함수
	_pcommPaging.set_rowcount = function(v)
	{
		//값이 없을 경우 기본값으로 설정
		if(nexacro._isNull(v))
		{
			this.rowcount = this._default_rowcount;
		}
		//값이 있을 경우 속성에 설정
		else
		{
			this.rowcount = nexacro.toNumber(v);
		}
		
		//페이징 화면 생성 함수 호출
		this.loadPage();
	};
	
	//buttoncount Setter 함수
	_pcommPaging.set_buttoncount = function(v)
	{
		//값이 없을 경우 기본값으로 설정
		if(nexacro._isNull(v))
		{
			this.buttoncount = this._default_buttoncount;
		}
		//값이 있을 경우 속성에 설정
		else
		{
			this.buttoncount = nexacro.toNumber(v);
		}
		
		//페이징 화면 생성 함수 호출
		this.loadPage();
	};
	
	//btnfirstcssclass Setter 함수
	_pcommPaging.set_btnfirstcssclass = function(v)
	{
		//값이 없을 경우 공백으로 설정
		if(nexacro._isNull(v))
		{
			this.btnfirstcssclass = "";
		}
		//값이 있을 경우 속성에 설정
		else
		{
			this.btnfirstcssclass = v;
		}
		//페이징 화면 생성 함수 호출
		this.loadPage();
	};
	
	_pcommPaging.set_btnprevcssclass = function(v)
	{
		//값이 없을 경우 공백으로 설정
		if(nexacro._isNull(v))
		{
			this.btnprevcssclass = "";
		}else
		{
			this.btnprevcssclass = v;
		}
		//페이징 화면 생성 함수 호출
		this.loadPage();
	};
	
	_pcommPaging.set_btnnextcssclass = function(v)
	{
		//값이 없을 경우 공백으로 설정
		if(nexacro._isNull(v))
		{
			this.btnnextcssclass = "";
		}
		//값이 있을 경우 속성에 설정
		else
		{
			this.btnnextcssclass = v;
		}
		//페이징 화면 생성 함수 호출
		this.loadPage();
	};
	
	_pcommPaging.set_btnlastcssclass = function(v)
	{
		//값이 없을 경우 공백으로 설정
		if(nexacro._isNull(v))
		{
			this.btnlastcssclass = "";
		}
		//값이 있을 경우 속성에 설정
		else
		{
			this.btnlastcssclass = v;
		}
		//페이징 화면 생성 함수 호출
		this.loadPage();
	};
	
	_pcommPaging.set_btnnumcssclass = function(v)
	{
		//값이 없을 경우 공백으로 설정
		if(nexacro._isNull(v))
		{
			this.btnnumcssclass = "";
		}
		//값이 있을 경우 속성에 설정
		else
		{
			this.btnnumcssclass = v;
		}
		//페이징 화면 생성 함수 호출
		this.loadPage();
	};
	
	//loadPage Method 함수
	//페이징 화면 생성 함수
	_pcommPaging.loadPage = function(v)
	{
		//Argument값이 없고 totalrowcount 값이 없을 경우
		if(nexacro._isNull(v)&&!this.totalrowcount)
		{
			//totalrowcount 0으로 초기화
			this.totalrowcount = 0;
		}
		else
		{
			//Argument값을 totalrowcount 내부 속성에 설정
			this.totalrowcount = nexacro.toNumber(v);
		}
		
		//전체 페이지 갯수 구하기
		this.pagecount = nexacro.ceil(this.totalrowcount/this.rowcount);
		
		//페이징화면 컴포넌트 삭제 함수 호출
		this.removePage();
		
		//페이징화면 컴포넌트 생성 함수 호출
		this.createPage();
		
		//setPage함수가 호출 가능하다면
		//(개발툴에서가 아닌 실행 중 loadPage가 호출되었다면)
		//페이지 이동 함수 호출
		if(this.form.setPage)this.form.setPage("OnLoad");
	};
	
	//canchangepage 사용자 이벤트 핸들러 호출 함수
	_pcommPaging.on_fire_canchangepage = function (eventid, pretext, prevalue, posttext, postvalue) {
		var ret = true;
		var event = this.canchangepage;
		
		//이벤트 오브젝트가 존재하고 등록된 이벤트핸들러가 있을 경우
		if (event && event._has_handlers) {
			
			//ChangeEventInfo 오브젝트 생성
			var evt = new nexacro.ChangeEventInfo(this, eventid, pretext, prevalue, posttext, postvalue);
			
			//이벤트 핸들러 호출
			ret = nexacro._toBoolean(event._fireCheckEvent(this, evt));
		}
		return ret;
	};
	
	//onchangepage 사용자 이벤트 핸들러 호출 함수
	_pcommPaging.on_fire_onchangepage = function (eventid, pretext, prevalue, posttext, postvalue) {
		var event = this.onchangepage;
		
		//이벤트 오브젝트가 존재하고 등록된 이벤트핸들러가 있을 경우
		if (event && event._has_handlers) {
		
			//ChangeEventInfo 오브젝트 생성
			var evt = new nexacro.ChangeEventInfo(this, eventid, pretext, prevalue, posttext, postvalue);
			
			//이벤트 핸들러 호출
			event._fireEvent(this, evt);
		}
	};	
	
	/************************************************************************
	FUNCTION : on_created_contents
	DESCRIPTION : Called when running on_created() TFunctionItem.
	on_created() TFunctionItem creates the element of the component as a node and becomes an entity.
	Dynamically called when a component is created.
	PARAMETER : win : nexacro._Window (nexacro._Window to which Component belongs)
	RETURN : void
	************************************************************************/
	_pcommPaging.on_created_contents = function (win)
	{
		nexacro._CompositeComponent.prototype.on_created_contents.call(this, win);
				
		//페이징 화면 생성 함수 호출
		this.loadPage();
	};	
	
	//페이징화면 컴포넌트 삭제 함수
	_pcommPaging.removePage = function()
	{
		var i;
		var nCount = this.form.components.length;
		
		for(i=nCount-1;i>=0;i--)
		{
			this.form.removeChild(this.form.components[i].name);
		}
	}
	
	//페이징화면 컴포넌트 생성 함수
	_pcommPaging.createPage = function()
	{
		var i;
		var nCount;
		var objComp;
		var objPrevComp;
		
		//컴포넌트 Width %로 계산
		var nWidth = nexacro.round(100/(this.buttoncount + 4), 4);
		
		//첫페이지로 버튼 만들기
		objComp = new Button("btnFirst", 0, 0, nWidth+"%", null, null, 0);
		this.form.addChild(objComp.name, objComp);
		if(this.btnfirstcssclass=="")objComp.set_text("<<");
		objComp.set_cssclass(this.btnfirstcssclass);
		objComp.show();
		objComp.addEventHandler("onclick", this.form.Button_onclick, this.form);
		objPrevComp = objComp;
		
		//이전 버튼 만들기
		objComp = new Button("btnPrev", objPrevComp.name+":0", 0, nWidth+"%", null, null, 0);
		this.form.addChild(objComp.name, objComp);
		if(this.btnprevcssclass=="")objComp.set_text("<");
		objComp.set_cssclass(this.btnprevcssclass);
		objComp.show();
		objComp.addEventHandler("onclick", this.form.Button_onclick, this.form);
		objPrevComp = objComp;
		
		//페이지 버튼 만들기
		nCount = this.buttoncount;
		for(i=0;i<nCount;i++)
		{
			objComp = new Button("btn"+i, objPrevComp.name+":0", 0, nWidth+"%", null, null, 0);
			this.form.addChild(objComp.name, objComp);
			objComp.set_text((i+1));
			objComp.set_cssclass(this.btnnumcssclass);
			objComp.set_visible(false);
			objComp.show();
			objComp.addEventHandler("onclick", this.form.BtnNum_onclick, this.form);
			objPrevComp = objComp;
		}
		
		//다음 버튼 만들기
		objComp = new Button("btnNext", objPrevComp.name+":0", 0, nWidth+"%", null, null, 0);
		this.form.addChild(objComp.name, objComp);
		if(this.btnnextcssclass=="")objComp.set_text(">");
		objComp.set_cssclass(this.btnnextcssclass);
		objComp.show();
		objComp.addEventHandler("onclick", this.form.Button_onclick, this.form);
		objPrevComp = objComp;
		
		//마지막으로 버튼 만들기
		objComp = new Button("btnLast", objPrevComp.name+":0", 0, nWidth+"%", null, null, 0);
		this.form.addChild(objComp.name, objComp);
		if(this.btnlastcssclass=="")objComp.set_text(">>");
		objComp.set_cssclass(this.btnlastcssclass);
		objComp.show();
		objComp.addEventHandler("onclick", this.form.Button_onclick, this.form);
	}	
	
	/************************************************************************
	FUNCTION : _get_form_module
	DESCRIPTION :
	RETURN :
	************************************************************************/
	_pcommPaging._get_form_module = function ()
	{
		return function()
		{
			if (!this._is_form)
			return;
			
			var obj = null;
			
			this.on_create = function()
			{
				this.set_name("commPaging");
				this.set_titletext("commPaging");
				if (nexacro.Form == this.constructor)
				{
					this._setFormPosition(320,50);
				}
				
				// Object(Dataset, ExcelExportObject) Initialize
				
				
				// UI Components Initialize
				
				// Layout Functions
				//-- Default Layout : this
				obj = new nexacro.Layout("default","",320,50,this,function(p){});
				this.addLayout(obj.name, obj);
				
				// BindItem Information
				
			};
			
			this.loadPreloadList = function()
			{
				
			};
			
			// User Script
			this.registerScript("commPaging.xcdl", function() {
					
					//현재 Page Index
					this.fv_pageIdx;
					
					//현재 List Index
					this.fv_listIdx;
					
					//처음으로, 마지막으로, 이전, 다음 버튼 클릭시
					this.Button_onclick = function(obj,e)
					{
						//페이지이동 Type 값 만들기
						//First, Last, Prev, Next
						var sPage = obj.name.replace("btn", "");
						
						//페이지 이동 함수 호출
						this.setPage(sPage);
					};
					
					//페이지 버튼 클릭 시
					this.BtnNum_onclick = function(obj,e)
					{
						//페이지 번호 가져오기
						var sPage = obj.text;
						
						//페이지 이동 함수 호출
						this.setPage(sPage);
					};
					
					//페이지 이동 함수
					this.setPage = function(sPage)
					{
						//페이지가 없을 경우 리턴
						if(this.parent.pagecount==0)return;
						
						var bCanChangePageEvent;
						var nPageNum;
						var nPrevPageIdx = this.fv_pageIdx + 1;
						var nNextPageIdx;
						
						//처음으로, 새로고침시 Page Index를 0으로
						if(sPage=="First" || sPage=="OnLoad")
						{
							nNextPageIdx = this.fv_pageIdx = 0;
						}
						//마지막으로 시 Page Index를 페이지 갯수 -1로
						else if(sPage=="Last")
						{
							nNextPageIdx = this.parent.pagecount - 1;
						}
						//이전 시 Page Index를 현재페이지 -1로
						else if(sPage=="Prev")
						{
							nNextPageIdx = this.fv_pageIdx-1;
						}
						//다음 시 Page Index를 현재페이지 +1로
						else if(sPage=="Next")
						{
							nNextPageIdx = this.fv_pageIdx+1;
						}
						//Page번호일 경우 해당 Page Index로
						else
						{
							nNextPageIdx = nexacro.toNumber(sPage)-1;
						}
						
						//이동할 Page Index가 0보다 작을 경우 0으로
						if(nNextPageIdx<0)nNextPageIdx = 0;
						
						//이동할 Page Index가 마지막 Page Index보다 클 경우 마지막 Page Index로
						else if(nNextPageIdx>this.parent.pagecount-1)nNextPageIdx = this.parent.pagecount-1;
						
						//canchangepage 이벤트 핸들러 호출
						bCanChangePageEvent = this.parent.on_fire_canchangepage(sPage, nPrevPageIdx, nPrevPageIdx, nNextPageIdx+1, nNextPageIdx+1);
						
						//canchange이벤트 return 값이 true일 경우
						if(bCanChangePageEvent==true)
						{
							//이동할 Page Index의 리스트 Index 구하기
							this.fv_listIdx = nexacro.floor(nNextPageIdx / this.parent.buttoncount);
							
							//페이징화면 상태 변경
							for(i=0;i<this.parent.buttoncount;i++)
							{
								//페이지 번호 구하기
								nPageNum = (this.fv_listIdx * this.parent.buttoncount) + i + 1;
								
								//페이지 버튼 가져오기
								objBtnPage = this.components["btn"+i];
								
								//페이지 갯수보다 페이지 번호가 작거나 같을 경우
								//(페이지에 해당하는 정보가 존재할 경우)
								if(nPageNum<=this.parent.pagecount)
								{
									//페이지 번호 설정
									objBtnPage.set_text(nPageNum);
									
									//페이지 버튼 visible true
									objBtnPage.set_visible(true);
									
									//현재 페이지일 경우 enable false
									if(nPageNum==nNextPageIdx+1)objBtnPage.set_enable(false);
									
									//현재 페이지가 아닐 경우 enable true
									else objBtnPage.set_enable(true);
									
								}
								else
								{
									//페이지 버튼 visible false
									objBtnPage.set_visible(false);
								}
							}
							
							//현재 Page Idx 값을 전역변수에 저장
							this.fv_pageIdx = nNextPageIdx;
							
							//onchangepage 이벤트 핸들러 호출
							this.parent.on_fire_onchangepage(sPage, nPrevPageIdx, nPrevPageIdx, nNextPageIdx+1, nNextPageIdx+1);
						}
					}
				});
			
			// Regist UI Components Event
			this.on_initEvent = function()
			{
				
			};
			this.loadIncludeScript("commPaging.xcdl");
			this.loadPreloadList();
			
			// Remove Reference
			obj = null;
		};
	};
	
	delete _pcommPaging;
}


