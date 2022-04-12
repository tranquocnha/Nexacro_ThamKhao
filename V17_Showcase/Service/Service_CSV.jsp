<%@ page contentType="text/html;charset=euc-kr" %><%@ page import="java.io.*,java.util.zip.*"%><%
%><%@ page import="java.sql.*,
                 java.util.*,
                 java.text.*"%><%@
page import="com.nexacro.xapi.tx.*" %><%@ 
page import="com.nexacro.xapi.data.*" %><%@ 
page import="com.nexacro.xapi.data.datatype.*" %><%                 

	StringBuffer mainSql   = new StringBuffer();
	StringBuffer mainSql1   = new StringBuffer();
	ResultSet    mainRs    = null;
	ResultSet    mainRs1    = null;


  String cnt = request.getParameter("row_cnt");
	Writer zipOut 	= 	response.getWriter();
	printDataset(Integer.parseInt(cnt) ,zipOut);
	zipOut.flush();
	zipOut.close();	
	  
%><%!
	protected void printDataset(int argCnt, Writer writer)
			throws IOException {
		
		int i;
		writer.write("CSV:euc-kr\n");
		writer.write("ErrorCode=0\n");
		writer.write("query_id=test,svc_status=y\n");
		writer.write("Dataset:output\n");



		int colCount = 10;
		String head = "";			
		
		head += "SEQ" + ":STRING(5),";
		head += "ADDRESS" + ":STRING(100),";			
		head += "NAME" + ":STRING(100),";			
		head += "HOMEPAGE" + ":STRING(100),";			
		head += "TECHHOMEPAGE" + ":STRING(100)";											
		head += "\n"; 
		writer.write(head);

		for(int j=0;j<argCnt;j++)		
		{
			String data = ""; 
			data += "" + j + ",";
			data += "\"" + "5F INTOPS Building, 108-7 Samsung-Dong, Gangnam-Gu"  + "\",";
			data += "\"" + "TOBESOFT Col,Ltd"  + "\",";			

			data += "www.tobesoft.com"  + ",";
			data += "www.xplatform.com" ;																				

			
			data += "\n";
			writer.write(data);
		}  

	}
	public PrintWriter getZipWriter(HttpServletResponse response) throws IOException{
		short TOBE_COMPRESS_MARK   = (short)0xFFAD;
		
		response.resetBuffer();
		
		DataOutputStream ostream = new DataOutputStream(response.getOutputStream());
		ostream.writeShort(TOBE_COMPRESS_MARK);
		
		DeflaterOutputStream compress = new DeflaterOutputStream(ostream);
		return new PrintWriter(compress);
	}
	


%>