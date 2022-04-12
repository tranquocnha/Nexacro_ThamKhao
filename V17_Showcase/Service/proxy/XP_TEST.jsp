<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page language="java"%>
<%@ page import="com.nexacro.xapi.tx.*" %>
<%@ page import="com.nexacro.xapi.data.*" %>
<%@ page import="com.nexacro.xapi.data.datatype.*" %>
<%
    System.out.println("SESSION ID = " + session.getId());

    String strCharset = "euc-kr";

    /*********************************************************
     * request�� ���� ������ parsing�Ͽ�
     * input variable list, input dataset list�� �����Ѵ�.
     * (MiPlatform ���� ������ �����͸� parsing�Ѵ�.)
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
     * response�� ���� ������ �����Ѵ�.
     * output variable list, output dataset list�� �����Ѵ�.
     * (MiPlatform �� ���� �� �ִ� ������ ���·� ����)
     *********************************************************/
    PlatformResponse platformResponse = new PlatformResponse(response.getOutputStream(), PlatformType.CONTENT_TYPE_XML, strCharset);
    PlatformData outPD = platformRequest.getData();
    VariableList    outVariableList  = new VariableList();
    DataSetList     outDataSetList   = new DataSetList();

    //System.out.println("5�� ��� ����");
    //Thread.sleep(5000);
    //System.out.println("5�� ��� ��");

    try {

        // MiPlatform ���� ������ Output Dataset �� �����Ѵ�.
        DataSet outDataSet = new DataSet("output");

        // Output Dataset �÷� ����
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

            // Output Dataset �ο� �߰�
            nRow = outDataSet.newRow();

            // Output Dataset �� ��ȸ ��� �� ����
            outDataSet.set(nRow, "LOC_NAME",      "������" + i);
            outDataSet.set(nRow, "SUB_LOC_NAME",      "�ܱ�" + i);
            outDataSet.set(nRow, "DAY", "2011-01-03");
            outDataSet.set(nRow, "TIME",   "19:00");
            outDataSet.set(nRow, "ITEM_NAME",   "");
            outDataSet.set(nRow, "UNIT",   "");
            outDataSet.set(nRow, "LIMIT",   "");
            outDataSet.set(nRow, "VALUE",   "");
            outDataSet.set(nRow, "STAT",   "");
            outDataSet.set(nRow, "DLST",   "");
        }


        // Output Dataset �� Output Dataset List �� ��´�.
        outDataSetList.add(outDataSet);

        // Output Vairable �� �����Ѵ�.
        outVariableList.add("ErrorCode", 0);
        outVariableList.add("ErrorMsg",  "��ȸ ����");

        outVariableList.add("strOutputData", "�� Output Vairable�� ��������, ȭ���� ���������� �����ϸ� �˴ϴ�.");

    } catch(Exception e) {

        // Output Vairable �� �����Ѵ�.
        outVariableList.add("ErrorCode", -1);
        outVariableList.add("ErrorMsg",  e.toString());

    } finally {

        // ��ȸ ���(Output Dataset List, Output Variable List)�� MiPlatform ���� ����
        outPD.setDataSetList(outDataSetList);
        outPD.setVariableList(outVariableList);
        platformResponse.setData(outPD);
        platformResponse.sendData();
    }
%>