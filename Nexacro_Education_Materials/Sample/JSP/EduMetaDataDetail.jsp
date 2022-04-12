<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page language="java"%>
<%@ page import="java.sql.*" %>
<%@ page import = "com.nexacro.java.xapi.data.*" %>
<%@ page import = "com.nexacro.java.xapi.tx.*" %>
<%@ include file="../connection_edu.jsp" %>
<%   
    String strCharset = "utf-8";

    /*********************************************************
     * response�� ���� ������ �����Ѵ�.
     * output variable list, output dataset list�� �����Ѵ�.
     * (XPlatform �� ���� �� �ִ� ������ ���·� ����)
     *********************************************************/
    HttpPlatformResponse platformResponse = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_XML, strCharset);
    PlatformData pd = new PlatformData();
    VariableList outVariableList = new VariableList();
    DataSetList  outDatasetList  = new DataSetList();

    /*********************************************************
     * db select
     *********************************************************/
    // Connection
    Connection conn     = null;

    //try {
	//	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    //} catch(ClassNotFoundException e) {
    //    e.printStackTrace();
    //    System.out.println("JDBC ����̹��� ã�� �� �����ϴ�." + e.toString());
    //}

    try {     
   	  
		//conn = DriverManager.getConnection("jdbc:sqlserver://172.27.0.91:1433;DatabaseName=EDU","edu","+4t9b/JU5I0o");
        conn = DriverManager.getConnection(url, id , pw);
		//System.out.println("���Ἲ��");
    } catch(Exception e) {
        System.out.println("DB�� ������ �� �����ϴ�." + e.toString());
        conn = null;
    }

    if(conn == null) {

        outVariableList.add("ErrorCode", -100);
        outVariableList.add("ErrorMsg",  "DB�� ������ �� �����ϴ�.");

        pd.setVariableList(outVariableList);
        pd.setDataSetList(outDatasetList);
        platformResponse.setData(pd);
        platformResponse.sendData();

    } else {

        int nRow;

        // XPlatform ���� ������ Input Dataset �� �����Ѵ�.
        DataSet inDataset = new DataSet("output");
        inDataset.addColumn("NAME",         DataTypes.STRING,255);
        inDataset.addColumn("TYPE",         DataTypes.STRING,255);
        inDataset.addColumn("DESCRIPTION",  DataTypes.STRING,255);

        nRow = inDataset.newRow();
        inDataset.set(nRow,"NAME","metadata");
        inDataset.set(nRow,"TYPE","dataset");
        inDataset.set(nRow,"DESCRIPTION","DETAIL&#32;DATA");
        
   
        // XPlatform ���� ������ Output Dataset �� �����Ѵ�.
        DataSet outDataset = new DataSet("metadata");
        outDataset.addColumn("ENG_NM",       DataTypes.STRING,255);
        outDataset.addColumn("NM", DataTypes.STRING,255);
        outDataset.addColumn("COL_DESC",     DataTypes.STRING,255);

        PreparedStatement pstmtTables   = null;
        PreparedStatement pstmtColumns = null;
        ResultSet rsTables = null;
        ResultSet rsColumns = null;

        // Output Dataset �� Input/Output Dataset List �� ��´�.
        outDatasetList.add(inDataset);

            

        try {
 
            String  selectTableListQuery 	= "  SELECT	distinct Upper(clmns.name) AS ENG_NM,  "; 
            		selectTableListQuery   += "			isnull(Upper(max(CAST(p.value AS NVARCHAR(MAX)))),Upper(clmns.name)) AS NM , "; 
            		selectTableListQuery   += "			isnull(Upper(max(CAST(p.value AS NVARCHAR(MAX)))),Upper(clmns.name))  AS COL_DESC ";
            		selectTableListQuery   += "	   FROM sys.tables AS tbl "; 
            		selectTableListQuery   += "	   left JOIN sys.all_columns AS clmns ON clmns.object_id=tbl.object_id ";
            		selectTableListQuery   += "	   left JOIN sys.extended_properties AS p ON p.major_id=tbl.object_id AND p.minor_id=clmns.column_id AND p.class=1 ";
            		selectTableListQuery   += "	  WHERE tbl.name like 'TB_%' "; 
            		selectTableListQuery   += "	  group by clmns.name ";
            		selectTableListQuery   += "	  order by ENG_NM asc";
            
            pstmtTables = conn.prepareStatement(selectTableListQuery);
            rsTables    = pstmtTables.executeQuery();

            while(rsTables.next()) { 
  
                nRow = outDataset.newRow();
                outDataset.set(nRow,"ENG_NM",	rsTables.getString("ENG_NM"));
                outDataset.set(nRow,"NM",		rsTables.getString("NM"));
                outDataset.set(nRow,"COL_DESC",	rsTables.getString("COL_DESC"));
   

            }
            outDatasetList.add(outDataset);
            
            // Output Vairable �� �����Ѵ�.
            outVariableList.add("ErrorCode", 0);
            outVariableList.add("ErrorMsg",  "��ȸ ����");
 
        } catch(SQLException se) {

            // Output Vairable �� �����Ѵ�.
            outVariableList.add("ErrorCode", -1);
            outVariableList.add("ErrorMsg",  se.toString());

        } catch(Exception e) {

            // Output Vairable �� �����Ѵ�.
            outVariableList.add("ErrorCode", -1);
            outVariableList.add("ErrorMsg",  e.toString());

        } finally {

            if(rsTables     != null) try { rsTables.close();     } catch(Exception e) {}
            if(rsColumns    != null) try { rsColumns.close();    } catch(Exception e) {}
            if(pstmtTables  != null) try { pstmtTables.close();  } catch(Exception e) {}
            if(pstmtColumns != null) try { pstmtColumns.close(); } catch(Exception e) {}

            // ��ȸ ���(Output Dataset List, Output Variable List)�� XPlatform ���� ����
            pd.setVariableList(outVariableList);
            pd.setDataSetList(outDatasetList);
            platformResponse.setData(pd);
            platformResponse.sendData();
        }
    }
%>
