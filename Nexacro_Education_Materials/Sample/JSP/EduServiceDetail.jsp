<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page language="java"%>
<%@ page import="java.sql.*" %>
<%@ page import = "com.nexacro.java.xapi.data.*" %>
<%@ page import = "com.nexacro.java.xapi.tx.*" %>
<%   
    //System.out.println("SESSION ID = " + session.getId());

    String strDomain = request.getParameter("domain");
    String strModel  = request.getParameter("model");
    //System.out.println("strDomain = "+strDomain);
    //System.out.println("strModel  = "+strModel);

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

    try {
    	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    } catch(ClassNotFoundException e) {
        e.printStackTrace();
        System.out.println("JDBC ����̹��� ã�� �� �����ϴ�." + e.toString());
    }

    try {     
   	  
		conn = DriverManager.getConnection("jdbc:sqlserver://172.27.0.91:1433;DatabaseName=EDU","edu","+4t9b/JU5I0o");
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
        DataSet inDataset = new DataSet("input");
        inDataset.addColumn("NAME",         DataTypes.STRING,255);
        inDataset.addColumn("TYPE",         DataTypes.STRING,255);
        inDataset.addColumn("SIZE",         DataTypes.STRING,255);
        inDataset.addColumn("ALIAS",        DataTypes.STRING,255);
        inDataset.addColumn("DESCRIPTION",  DataTypes.STRING,255);
        inDataset.addColumn("DEFAULT",      DataTypes.STRING,255);

        nRow = inDataset.newRow();
        inDataset.set(nRow,"NAME","ds_input");
        inDataset.set(nRow,"TYPE","DataSet");

        DataSet ds_input = new DataSet("ds_input");
        ds_input.addColumn("col01",DataTypes.STRING,100);
        ds_input.addColumn("col02",DataTypes.STRING,100);
        ds_input.addColumn("col03",DataTypes.STRING,100);

        // XPlatform ���� ������ Output Dataset �� �����Ѵ�.
        DataSet outDataset = new DataSet("output");
        outDataset.addColumn("NAME",        DataTypes.STRING,255);
        outDataset.addColumn("TYPE",        DataTypes.STRING,255);
        outDataset.addColumn("SIZE",        DataTypes.STRING,255);
        outDataset.addColumn("ALIAS",       DataTypes.STRING,255);
        outDataset.addColumn("DESCRIPTION", DataTypes.STRING,255);
        outDataset.addColumn("DEFAULT",     DataTypes.STRING,255);

        PreparedStatement pstmtTables   = null;
        PreparedStatement pstmtColumns = null;
        ResultSet rsTables = null;
        ResultSet rsColumns = null;

        // Output Dataset �� Input/Output Dataset List �� ��´�.
        outDatasetList.add(inDataset);
        outDatasetList.add(ds_input);
        outDatasetList.add(outDataset);

        try {
 
            String selectTableListQuery = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES	WHERE TABLE_CATALOG = 'EDU'	AND TABLE_NAME like 'TB_%'  order by TABLE_NAME";
            //System.out.println("selectTableListQuery = "+selectTableListQuery);
            pstmtTables = conn.prepareStatement(selectTableListQuery);
            rsTables    = pstmtTables.executeQuery();

            while(rsTables.next()) {
  
                nRow = outDataset.newRow();
                outDataset.set(nRow,"NAME",rsTables.getString("TABLE_NAME"));
                outDataset.set(nRow,"TYPE","DataSet");
 
                String selectTableDetailQuery = "SELECT TABLE_NAME,Upper(COLUMN_NAME) COLUMN_NAME, Upper(DATA_TYPE) DATA_TYPE, CHARACTER_MAXIMUM_LENGTH DATA_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '"+rsTables.getString("TABLE_NAME")+"'";
                System.out.println("selectTableDetailQuery = "+selectTableDetailQuery);

                pstmtColumns = conn.prepareStatement(selectTableDetailQuery);
                rsColumns    = pstmtColumns.executeQuery();

                DataSet ds_output = new DataSet(rsTables.getString("TABLE_NAME"));

                while(rsColumns.next()) {

                    if(rsColumns.getString("DATA_TYPE").equals("INT")) {
//                        ds_output.addColumn(rsColumns.getString("COLUMN_NAME"),DataTypes.BIG_DECIMAL,rsColumns.getInt("DATA_LENGTH"));
                        ds_output.addColumn(rsColumns.getString("COLUMN_NAME"),DataTypes.INT,rsColumns.getInt("DATA_LENGTH"));
                    } else if(rsColumns.getString("DATA_TYPE").equals("DATE") || rsColumns.getString("DATA_TYPE").equals("DATETIME")){
                        ds_output.addColumn(rsColumns.getString("COLUMN_NAME"),DataTypes.DATE,rsColumns.getInt("DATA_LENGTH"));
                    } else {  //���ܴ� ��� sringó���ؼ� ����())
                        ds_output.addColumn(rsColumns.getString("COLUMN_NAME"),DataTypes.STRING,rsColumns.getInt("DATA_LENGTH"));                    	
                    }
                }
/* layout �� ���� */
/*
                if(rsTables.getString("TABLE_NAME").equals("TB_EMP"))
				{
					int nRow1;
					nRow1 = ds_output.newRow();
					ds_output.set(nRow1,"EMPL_ID", "AA001");
					ds_output.set(nRow1,"FULL_NAME","KJB");
					  
					nRow1 = ds_output.newRow();
					ds_output.set(nRow1,"EMPL_ID", "AA002");
					ds_output.set(nRow1,"FULL_NAME","KJB2");
				}	
*/
                outDatasetList.add(ds_output);
            }

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
