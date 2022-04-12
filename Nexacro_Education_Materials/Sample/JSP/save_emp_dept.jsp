<%@ page import = "org.apache.commons.logging.*" %>
<%@ page import = "com.nexacro.java.xapi.data.*" %>
<%@ page import = "com.nexacro.java.xapi.tx.*" %>
<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>
<%@ page contentType = "text/xml; charset=UTF-8" %>
<%@ include file="../connection_edu.jsp" %>
<%! 

// Dataset value
public String  dsGet(DataSet ds, int rowno, String colid) throws Exception
{
    String value;
    value = ds.getString(rowno, colid);
    if( value == null )
        return "";
    else
        return value;
} 
%>

<%
    
int nErrorCode = 0;
String strErrorMsg = "START";

// HttpPlatformRequest
// Http 요청으로부터 데이터(PlatformData)를 수신받는다.
HttpPlatformRequest pReq = new HttpPlatformRequest(request);
pReq.receiveData();
PlatformData in_pData = pReq.getData();

VariableList in_varList = in_pData.getVariableList();
DataSet ds = in_pData.getDataSet("in_emp");
DataSet ds2 = in_pData.getDataSet("in_dept");

try {    
    /******* JDBC Connection *******/
    Connection conn = null;
    Statement  stmt = null;
    ResultSet  rs   = null;
    
    try {    
        conn = DriverManager.getConnection(url, id , pw);
		stmt = conn.createStatement();
    
        String SQL = "";
        int    i;        
        /******** DELETE ********/
        for( i = 0; i < ds.getRemovedRowCount(); i++ )
        {
            String sEmpID = ds.getRemovedData(i, "EMPL_ID").toString();
            SQL = "DELETE FROM TB_EMP WHERE EMPL_ID = '" + sEmpID + "'";
            stmt.executeUpdate(SQL);
        }
		
        for( i = 0; i < ds2.getRemovedRowCount(); i++ )
        {
            String sCD = ds2.getRemovedData(i, "DEPT_CD").toString();
            SQL = "DELETE FROM TB_DEPT WHERE DEPT_CD = '" + sCD + "'";
            stmt.executeUpdate(SQL);
        }		

        /******** INSERT, UPDATE ********/
        for( i = 0; i < ds.getRowCount(); i++ )
        {
            int rowType = ds.getRowType(i);
			
            if( rowType == DataSet.ROW_TYPE_INSERTED )
            {
                SQL = "INSERT INTO TB_EMP( EMPL_ID,     \n" +
                      "                    FULL_NAME,   \n" +
                      "                    DEPT_CD,     \n" +
                      "                    POS_CD,      \n" +
                      "                    GENDER,      \n" +
                      "                    HIRE_DATE,   \n" +
                      "                    MARRIED,     \n" +
                      "                    SALARY,      \n" +
                      "                    MEMO)        \n" +
                      "     VALUES('" + dsGet(ds, i, "EMPL_ID")   + "',\n" +
                      "            '" + dsGet(ds, i, "FULL_NAME") + "',\n" +
                      "            '" + dsGet(ds, i, "DEPT_CD")   + "',\n" +  
                      "            '" + dsGet(ds, i, "POS_CD")    + "',\n" +
                      "            '" + dsGet(ds, i, "GENDER")    + "',\n" +                
                      "            '" + dsGet(ds, i, "HIRE_DATE") + "',\n" +
                      "            '" + dsGet(ds, i, "MARRIED")   + "',\n" +                
                      "            '" + dsGet(ds, i, "SALARY")    + "',\n" +                
                      "            '" + dsGet(ds, i, "MEMO")      + "')  ";                            
                //System.out.println(">>> insert : "+SQL);
            }
            else if( rowType == DataSet.ROW_TYPE_UPDATED )
            {
                String sOrgEmpID = ds.getSavedData(i, "EMPL_ID").toString(); 
                SQL = "UPDATE TB_EMP     \n" +
                      "   SET EMPL_ID   = '" + dsGet(ds, i, "EMPL_ID")   + "',\n" +
                      "       FULL_NAME = '" + dsGet(ds, i, "FULL_NAME") + "',\n" +
                      "       DEPT_CD   = '" + dsGet(ds, i, "DEPT_CD")   + "',\n" +  
                      "       POS_CD    = '" + dsGet(ds, i, "POS_CD")    + "',\n" +
                      "       GENDER    = '" + dsGet(ds, i, "GENDER")    + "',\n" +
                      "       HIRE_DATE = '" + dsGet(ds, i, "HIRE_DATE") + "',\n" +
                      "       MARRIED   = '" + dsGet(ds, i, "MARRIED")   + "',\n" +
                      "       SALARY    = '" + dsGet(ds, i, "SALARY")    + "',\n" +
                      "       MEMO      = '" + dsGet(ds, i, "MEMO")      + "' \n" +
                      " WHERE EMPL_ID   = '" + sOrgEmpID + "'";
  
             // System.out.println(">>> update : "+SQL);
            }                    
            stmt.executeUpdate(SQL);
        }
		
        /******** INSERT, UPDATE ********/
        for( i = 0; i < ds2.getRowCount(); i++ )
        {
            if(ds2.getRowType(i) == DataSet.ROW_TYPE_INSERTED )
            {
                SQL = "INSERT INTO TB_DEPT(DEPT_CD,     \n" +
                      "                    DEPT_NAME)   \n" +
                      "     VALUES('" + dsGet(ds2, i, "DEPT_CD")   + "',\n" +
                      "            '" + dsGet(ds2, i, "DEPT_NAME") + "')  ";                            
                //System.out.println(">>> insert : "+SQL);
            }
            else if(ds2.getRowType(i) == DataSet.ROW_TYPE_UPDATED )
            {
                String sOrgCD = ds2.getSavedData(i, "DEPT_CD").toString(); 
                SQL = "UPDATE TB_DEPT SET DEPT_NAME = '" + dsGet(ds2, i, "DEPT_NAME") + "' WHERE DEPT_CD   = '" + sOrgCD + "'";
  
              System.out.println(">>> update : "+SQL);
            }                    
            stmt.executeUpdate(SQL);
        }
		
        //conn.commit();

    } catch (SQLException e) {
        nErrorCode  = -1;
        strErrorMsg = e.getMessage();
    }    
    
    /******** JDBC Close ********/
    if ( stmt != null ) try { stmt.close(); } catch (Exception e) {nErrorCode = -1; strErrorMsg = e.getMessage();}
    if ( conn != null ) try { conn.close(); } catch (Exception e) {nErrorCode = -1; strErrorMsg = e.getMessage();}
    
    nErrorCode  = 0;
    strErrorMsg = "SUCC";
            
} catch (Throwable th) {
    nErrorCode  = -1;
    strErrorMsg = th.getMessage();
}

// PlatformData 
PlatformData out_pData = new PlatformData();

VariableList out_varList = out_pData.getVariableList();
out_varList.add("ErrorCode", nErrorCode);
out_varList.add("ErrorMsg" , strErrorMsg);

HttpPlatformResponse pRes = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_SSV, "UTF-8");
pRes.setData(out_pData);

pRes.sendData();
%>
