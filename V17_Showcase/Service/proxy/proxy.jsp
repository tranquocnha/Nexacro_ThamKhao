<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="java.io.*"%>
<%@ page import="com.nexacro.xapi.tx.*" %>
<%@ page import="com.nexacro.xapi.data.*" %>
<%@ page import="com.nexacro.xapi.data.datatype.*" %>
<%
	String url = request.getParameter("url");
	HttpPlatformRequest hpr = new HttpPlatformRequest(request);
	hpr.receiveData();
 	PlatformData pdt = hpr.getData();
 	pdt.setSaveType(DataSet.SAVE_TYPE_ALL); 
 	
System.out.println("### ProxyJSP::" + pdt.saveXml());	
	PlatformHttpClient client = new PlatformHttpClient(url, PlatformType.CONTENT_TYPE_XML);
	client.sendData(pdt);
	PlatformData resData = client.receiveData();
	client.close();
	HttpPlatformResponse hpres = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_XML, "UTF-8");
	hpres.setData(resData);
	hpres.sendData();
%>
