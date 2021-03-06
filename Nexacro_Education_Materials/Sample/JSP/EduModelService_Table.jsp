<%@ page contentType="text/xml; charset=utf-8" %>
<%@ page language="java"%>
<%@ page import="java.sql.*" %>
<%@ page import = "com.nexacro.java.xapi.data.*" %>
<%@ page import = "com.nexacro.java.xapi.tx.*" %>
<%@ include file="../connection_edu.jsp" %>
<%   
    String str_group = request.getParameter("group")==null?"":request.getParameter("group");
    String str_id = request.getParameter("id")==null?"":request.getParameter("id");

    String strCharset = "utf-8";
    /*********************************************************
     * db select
     *********************************************************/
    // Connection
    Connection conn     = null;

    try {     

		conn = DriverManager.getConnection(url, id , pw);
   	  
    } catch(Exception e) {
        System.out.println("DB에 연결할 수 없습니다." + e.toString());
        conn = null;
    }

    if(conn == null) {

//        outVariableList.add("ErrorCode", -100);
//        outVariableList.add("ErrorMsg",  "DB에 연결할 수 없습니다.");

    } else {

        int nRow;
        PreparedStatement pstmtTables   = null;
        PreparedStatement pstmtColumns = null;
        ResultSet rsTables = null;
        ResultSet rsColumns = null;

        try {
 
            String selectTableListQuery = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES	WHERE TABLE_CATALOG = 'EDU'	AND TABLE_NAME like 'TB_%'  order by TABLE_NAME";
            //System.out.println("selectTableListQuery = "+selectTableListQuery);
            pstmtTables = conn.prepareStatement(selectTableListQuery);
            rsTables    = pstmtTables.executeQuery();
			


						if(str_id.equals("")) 
	    			{  
	        		if(str_group.equals("/"))
	        		{
%> 
<Root>
    <ErrorCode>0</ErrorCode>
    <ErrorMsg>Success</ErrorMsg>

<% 	        		
	     				
								while(rsTables.next()) {
			  
			
			%>
    <ModelGroup id="<%=rsTables.getString("TABLE_NAME")%>" type="service"/>
    	<%			
			          }
%>
</Root>
<%			        
	        		}
	        	} else {
%>
<%	        		
%>
<Root>
  <ErrorCode>0</ErrorCode>
  <ErrorMsg>Success</ErrorMsg>

	<ModelInfo version="1.2">
	<Models>
	<%   	        	

            while(rsTables.next()) {
            	String strTableNm = rsTables.getString("TABLE_NAME");
  					 	if(str_id.equals(strTableNm)){
  
                
								String selectTableDetailQuery =  "select 						";
											 selectTableDetailQuery += "    UPPER(colinfo.column_name)			  as  COL_NAME	 															";
											 selectTableDetailQuery += "    , isnull(colcmmt.value,colinfo.column_name)        as COL_DESC													";
											 selectTableDetailQuery += "    , UPPER(colinfo.data_type)               as COL_TYPE													";
											 selectTableDetailQuery += "    , case when isnull(colinfo.character_octet_length,256) > 256 then 256 else  isnull(colinfo.character_octet_length,256) end  as COL_LEN";
											 selectTableDetailQuery += "    from sysobjects tbl with (nolock) 																		";
											 selectTableDetailQuery += "    inner join sysusers usr with (nolock)   on tbl.uid = usr.uid 					";
											 selectTableDetailQuery += "    inner join syscolumns syscol with (nolock) on syscol.id = tbl.id 			";
											 selectTableDetailQuery += "    inner join information_schema.columns colinfo with (nolock) 					";
											 selectTableDetailQuery += "        on  tbl.name = colinfo.table_name																	";	
											 selectTableDetailQuery += "    	and syscol.name = colinfo.column_name																";
											 selectTableDetailQuery += "    left outer join sys.extended_properties tblcmmt with (nolock) 				";	
											 selectTableDetailQuery += "        on  tblcmmt.major_id = tbl.id																			";
											 selectTableDetailQuery += "    	and tblcmmt.minor_id = 0																						";	
											 selectTableDetailQuery += "    	and tblcmmt.name = 'MS_Description' 																";		
											 selectTableDetailQuery += "    left outer join sys.extended_properties colcmmt with (nolock) 				";
											 selectTableDetailQuery += "        on  colcmmt.major_id = syscol.id																	";		
											 selectTableDetailQuery += "    	and colcmmt.minor_id = syscol.colid																	";			
											 selectTableDetailQuery += "    	and colcmmt.name = 'MS_Description' 																";			
											 selectTableDetailQuery += "    where 1=1																															";
											 selectTableDetailQuery += "    	and tbl.type = 'U'																									";
											 selectTableDetailQuery += "    	and tbl.name = '"+rsTables.getString("TABLE_NAME")+"'";
											 selectTableDetailQuery += "    order by colinfo.ordinal_position ";
 
                pstmtColumns = conn.prepareStatement(selectTableDetailQuery);
                rsColumns    = pstmtColumns.executeQuery();

								String sType = "STRING";
								String sLen = "80";  
%>								
						<Model id="<%=rsTables.getString("TABLE_NAME")%>" 			name="<%=rsTables.getString("TABLE_NAME")%>" iotype="output">								
<%							
                while(rsColumns.next()) {
  
                	if(rsColumns.getString("COL_TYPE").equals("INT")) {
													sType = "INT";
			
                  } else if(rsColumns.getString("COL_TYPE").equals("DATE") || rsColumns.getString("COL_TYPE").equals("DATETIME")){
													sType = "DATE";	
													  
                  } else {  //예외는 모드 sring처리해서 보냄())
													sType = "STRING";	
                  }  
%>
            <Field id="<%=rsColumns.getString("COL_NAME")%>" 		datatype="<%=sType%>" 	datasize="<%=rsColumns.getInt("COL_LEN")%>"  label="<%=rsColumns.getString("COL_DESC")%>"  				fieldtype="FreeText"  description=""  required="" />
<%                    
                }
%>
        </Model> 
<%		
								} 
							}
%>
    </Models>      
</ModelInfo>      
</Root>
<%							
            }

            // Output Vairable 을 세팅한다.
            //outVariableList.add("ErrorCode", 0);
            //outVariableList.add("ErrorMsg",  "조회 성공");

        } catch(SQLException se) {

            // Output Vairable 을 세팅한다.
            //outVariableList.add("ErrorCode", -1);
            //outVariableList.add("ErrorMsg",  se.toString());

        } catch(Exception e) {

            // Output Vairable 을 세팅한다.
            //outVariableList.add("ErrorCode", -1);
            //outVariableList.add("ErrorMsg",  e.toString());

        } finally {

            if(rsTables     != null) try { rsTables.close();     } catch(Exception e) {}
            if(rsColumns    != null) try { rsColumns.close();    } catch(Exception e) {}
            if(pstmtTables  != null) try { pstmtTables.close();  } catch(Exception e) {}
            if(pstmtColumns != null) try { pstmtColumns.close(); } catch(Exception e) {}
        }
    }
%>
