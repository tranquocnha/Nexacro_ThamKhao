<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page language="java"%>
<%@ page import="com.nexacro.xapi.tx.*" %>
<%@ page import="com.nexacro.xapi.data.*" %>
<%@ page import="com.nexacro.xapi.data.datatype.*" %>
<%
    System.out.println("SESSION ID = " + session.getId());

    String strCharset = "euc-kr";

    /*********************************************************
     * request로 들어온 내용을 parsing하여
     * input variable list, input dataset list에 저장한다.
     * (MiPlatform 에서 보내온 데이터를 parsing한다.)
     *********************************************************/
    PlatformRequest platformRequest = new PlatformRequest(request.getInputStream(), PlatformType.CONTENT_TYPE_XML, strCharset);
    platformRequest.receiveData();
    PlatformData inPD = platformRequest.getData();

    VariableList    inVariableList  = inPD.getVariableList();
    DataSetList     inDataSetList   = inPD.getDataSetList();

    String strUserID   = inVariableList.getString("userid");
    String strUserName = inVariableList.getString("username");
    System.out.println("input userid   = " + strUserID);
    System.out.println("input username = " + strUserName);

    /*********************************************************
     * response로 보낼 내용을 생성한다.
     * output variable list, output dataset list에 저장한다.
     * (MiPlatform 이 받을 수 있는 데이터 형태로 가공)
     *********************************************************/
    PlatformResponse platformResponse = new PlatformResponse(response.getOutputStream(), PlatformType.CONTENT_TYPE_XML, strCharset);
    PlatformData outPD = platformRequest.getData();
    VariableList    outVariableList  = new VariableList();
    DataSetList     outDataSetList   = new DataSetList();

    //System.out.println("5초 대기 시작");
    //Thread.sleep(5000);
    //System.out.println("5초 대기 끝");

    try {

        // MiPlatform 으로 전송할 Output Dataset 을 생성한다.
        DataSet outDataSet = new DataSet("output");

        // Output Dataset 컬럼 정의
        outDataSet.addColumn("LOC_NAME",   DataTypes.STRING, 255);
        outDataSet.addColumn("SUB_LOC_NAME",        DataTypes.STRING, 255);
        outDataSet.addColumn("DAY",       DataTypes.STRING, 255);
        outDataSet.addColumn("TIME",   DataTypes.STRING, 255);
        outDataSet.addColumn("ITEM_NAME",     DataTypes.STRING, 255);
        outDataSet.addColumn("UNIT",     DataTypes.STRING, 255);
        outDataSet.addColumn("LIMIT",     DataTypes.STRING, 255);
        outDataSet.addColumn("VALUE",     DataTypes.STRING, 255);
        outDataSet.addColumn("STAT",     DataTypes.STRING, 255);
        outDataSet.addColumn("DLST",     DataTypes.STRING, 255);

        int nRow;

        for(int i = 0; i < 288; i++) {

            // Output Dataset 로우 추가
            nRow = outDataSet.newRow();

            // Output Dataset 에 조회 결과 값 세팅
            outDataSet.set(nRow, "LOC_NAME",      "수유역" + i);
            outDataSet.set(nRow, "SUB_LOC_NAME",      "외기" + i);
            outDataSet.set(nRow, "DAY", "2011-01-03");
            outDataSet.set(nRow, "TIME",   "19:00");
            outDataSet.set(nRow, "ITEM_NAME",   "");
            outDataSet.set(nRow, "UNIT",   "");
            outDataSet.set(nRow, "LIMIT",   "");
            outDataSet.set(nRow, "VALUE",   "");
            outDataSet.set(nRow, "STAT",   "");
            outDataSet.set(nRow, "DLST",   "");
        }


        // Output Dataset 을 Output Dataset List 에 담는다.
        outDataSetList.add(outDataSet);

        // Output Vairable 을 세팅한다.
        outVariableList.add("ErrorCode", 0);
        outVariableList.add("ErrorMsg",  "조회 성공");

        outVariableList.add("strOutputData", "※ Output Vairable을 받으려면, 화면의 전역변수로 선언하면 됩니다.");

    } catch(Exception e) {

        // Output Vairable 을 세팅한다.
        outVariableList.add("ErrorCode", -1);
        outVariableList.add("ErrorMsg",  e.toString());

    } finally {

        // 조회 결과(Output Dataset List, Output Variable List)를 MiPlatform 으로 전송
        outPD.setDataSetList(outDataSetList);
        outPD.setVariableList(outVariableList);
        platformResponse.setData(outPD);
        platformResponse.sendData();
    }
%>
