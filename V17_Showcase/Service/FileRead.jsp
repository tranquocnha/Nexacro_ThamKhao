<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="com.nexacro.xapi.tx.*" %>
<%@ page import="com.nexacro.xapi.data.*" %>
<%@ page import="com.nexacro.xapi.data.datatype.*" %>
<%@ page language="java"%>
<%@ page import="java.io.*" %>
<%@ page import = "java.net.URL" %>
<%@ page import="java.util.Enumeration" %>
<%@ page import="java.sql.*" %>
<%
PlatformData o_xpData = new PlatformData();
HttpPlatformRequest platformRequest = new HttpPlatformRequest(request);

platformRequest.receiveData();

PlatformData pData = platformRequest.getData(); 

Debugger debugger = new Debugger();
//System.out.println("====================== " + debugger.detail(pData));	

DataSetList  in_dl = new DataSetList();     //input dataset list
DataSetList  inDataSetList   = pData.getDataSetList();
VariableList inVariableList  = pData.getVariableList();

in_dl = pData.getDataSetList();  // dataset list	
DataSet in_ds = in_dl.get("input"); //Dataset

String strFolderPath = inVariableList.getString("FilePath");
System.out.println("strFolderPath ====================== " + strFolderPath);
String strFilePath = inVariableList.getString("FileNm");
System.out.println("strFilePath ====================== " + strFilePath);

int nErrorCode = 0;
String strErrorMsg = "START";
String Contents = "";

String resourcePath = "http://support.tobesoft.co.kr:8080/Next_JSP/nexacro_source" + strFolderPath + strFilePath ;
 


try
{
/*
	File file  = new File("C:\\Program Files\\Apache Software Foundation\\Tomcat 7.0\\webapps\\v13\\Test\\nexacro_source"+strFolderPath+"\\"+strFilePath);
	FileReader fr = null;
	BufferedReader br = null;

	String read = null;

	fr = new FileReader(file);
	br = new BufferedReader(fr);
	while((read=br.readLine())!=null){
	    //System.out.println(read);
	    Contents += read;
	}
*/
BufferedReader br = null;
char[] buff = new char[512];
int len = -1;

	 URL url = new URL(resourcePath);
 
  br = new BufferedReader(
   new InputStreamReader(
    url.openStream(), "utf-8" ));  //url.openStream()은 new InputStreamReader()랑 같은 기능을 함. 바이트->문자
  while ( (len = br.read(buff)) != -1) {
   Contents += new String(buff, 0, len);
  }

	
	DataSet ds = new DataSet("output");
	
	ds.addColumn("contents",DataTypes.STRING, 5000);

	int row = ds.newRow();
	ds.set(row, "contents", Contents);
	
	o_xpData.addDataSet(ds);

	nErrorCode = 0;
	strErrorMsg = "SUCC";
	
	if(br!=null) br.close();	
} 
catch (Exception e) {
	nErrorCode = -1;
	strErrorMsg = e.getMessage();
}

VariableList varList = o_xpData.getVariableList();

varList.add("ErrorCode", 0);
varList.add("ErrorMsg", strErrorMsg);

HttpPlatformRequest pReq = new HttpPlatformRequest(request);
HttpPlatformResponse pRes = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_XML, "UTF-8");	
//HttpPlatformResponse pRes = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_BINARY, "UTF-8");
pRes.setData(o_xpData);

out.clear();
pRes.sendData();
%>