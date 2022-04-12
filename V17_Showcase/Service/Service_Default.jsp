<%@ page contentType="text/html; charset=euc-kr" %><%@ 
page language="java"%><%@ 
page import = "java.io.*" %><%@
page import = "java.util.*" %><%@
page import = "java.util.zip.*" %><%@ 
page import="com.nexacro.xapi.tx.*" %><%@ 
page import="com.nexacro.xapi.data.*" %><%@ 
page import="com.nexacro.xapi.data.datatype.*" %><%
	out.clear();       
    String strCharset = "euc-kr";

 	  
    PlatformRequest platformRequest = new PlatformRequest(request.getInputStream(), PlatformType.CONTENT_TYPE_XML, strCharset);
    platformRequest.receiveData();  
    PlatformData inPD = platformRequest.getData();

    VariableList    inVariableList  = inPD.getVariableList();
    DataSetList     inDataSetList   = inPD.getDataSetList();
  
    String row_cnt 	=  inVariableList.getString("row_cnt");
    String type 	=  inVariableList.getString("type");
    String compress =  inVariableList.getString("compress"); 
      
    if(row_cnt==null || row_cnt.equals(""))
    	row_cnt = "3";
            
    if(type==null || row_cnt.equals(""))
    	type = "XML";
    
    if(compress==null || compress.equals(""))
    	compress = "false";
	
    
    PlatformData outPD = platformRequest.getData();
    VariableList    outVariableList  = new VariableList();
    DataSetList     outDataSetList   = new DataSetList();
    GZIPOutputStream gzipOut = null;
   


    DataSet outDataSet = null;
    try {
        outDataSet = new DataSet("output");

        outDataSet.addColumn("SEQ",        	DataTypes.STRING, 5);
        outDataSet.addColumn("ADDRESS", 	DataTypes.STRING, 100);
        outDataSet.addColumn("NAME",        DataTypes.STRING, 100);
        outDataSet.addColumn("HOMEPAGE",    DataTypes.STRING, 100);
        outDataSet.addColumn("TECHHOMEPAGE",DataTypes.STRING, 100);

        int nRow;
        for(int i = 1; i <= Integer.parseInt(row_cnt); i++) {
            nRow = outDataSet.newRow();
            outDataSet.set(nRow, "SEQ",      i);
            outDataSet.set(nRow, "ADDRESS", "5F INTOPS Building, 108-7 Samsung-Dong, Gangnam-Gu");
            outDataSet.set(nRow, "NAME", "TOBESOFT Col,Ltd");
            outDataSet.set(nRow, "HOMEPAGE", "www.tobesoft.com");
            outDataSet.set(nRow, "TECHHOMEPAGE", "www.xplatform.com");
        }
  
        outDataSetList.add(outDataSet);

        outVariableList.add("ErrorCode", 0);
        outVariableList.add("ErrorMsg",  "SUCCESS");

        outVariableList.add("strOutputData", "※ Output Vairable을 받으려면, 화면의 전역변수로 선언하면 됩니다.");

    } catch(Exception e) {

        outVariableList.add("ErrorCode", -1);
        outVariableList.add("ErrorMsg",  e.toString());
 
    } finally {

        outPD.setDataSetList(outDataSetList);
        outPD.setVariableList(outVariableList); 

        String Contents_type;  

        if(type.equals("SSV"))
        {
        	Contents_type = PlatformType.CONTENT_TYPE_SSV;
        } else if(type.equals("XML")) {
        	Contents_type = PlatformType.CONTENT_TYPE_XML;
        } else if(type.equals("ZLIB")) {  
        	Contents_type = PlatformType.CONTENT_TYPE_BINARY;
        } else {    
			    Contents_type = PlatformType.CONTENT_TYPE_XML;
        }  
        
        if(compress.equals("true"))
        {
        	 response.setHeader("Accept-Encoding", "gzip, deflate");
       	   	 response.setHeader("X-Compression", "gzip");
       	     response.setHeader("Content-Encoding", "gzip");
      	     response.setHeader("Content-Type", "text/xml");	

        	String RS = String.valueOf((char) 0x1e); //rs(record seperator)
    			String US = String.valueOf((char) 0x1f); //us(unit seperator)
    			StringBuffer sb = new StringBuffer();
    			sb.append("SSV:").append("euc-kr").append(RS); //헤더의 처음 4바이트는 "SSV"로 시작(53 53 56)
			
        	VariableList varLstOut = new VariableList();
        	varLstOut.add("ErrorCode", 0);
    		varLstOut.add("ErrorMsg", "Success!!!!"); 
    		if(varLstOut != null) {
    			int size = varLstOut.size();
    			
    			for(int i=0; i<size; i++) {
    				//Type 생략시 STRING 으로 고정
    				Variable var = varLstOut.get(i);
    				sb.append(var.getName()).append("=").append(var.getString()); //각 Variable 은 US 로 구분
    				
    				if(i<size-1) {
    					sb.append(US);
    				}
    			}
    			sb.append(RS); 
    		}
    		
			sb.append("Dataset:").append("output").append(RS);  //데이터셋 생성
			sb.append("_RowType_"+US); 
			
			for(int i=0; i<outDataSet.getColumnCount(); i++) {
				sb.append(outDataSet.getColumn(i).getName());
				sb.append(":String(255)");
				if(i<outDataSet.getColumnCount()-1) {
					sb.append(US);
				}
			}
        	sb.append(RS);
        	
        	for(int totCnt=0; totCnt<outDataSet.getRowCount(); totCnt++) {
				sb.append("N"+US); //"N" is RowType. (N : Normal Record)
				for(int i=0; i<outDataSet.getColumnCount(); i++) {

					sb.append(outDataSet.getString(totCnt, i)); //Row Value
					if(i<outDataSet.getColumnCount()-1) {
						sb.append(US);
					}
				}
				sb.append(RS);   
			}
		
        	
        	gzipOut = getGZipOut(new BufferedOutputStream(response.getOutputStream())); 
        	
        	try{
        		flushBuffer(gzipOut, sb);
        		
	    	}
	    	catch(Exception e) { 
	    	}

       		if(gzipOut != null) {
       			try {
       				gzipOut.close();
       			} catch (IOException e) {
       				e.printStackTrace();
       			}
       		}
  

        } else {
        	HttpPlatformResponse res = new HttpPlatformResponse(response, Contents_type, "UTF-8");
        	res.setData(outPD);
	        res.sendData();     
        } 

    }
%><%!

//Respond to Client
	private void flushBuffer(GZIPOutputStream gzipOut, StringBuffer buff) {
		try {

			byte[] arrByteRslt = buff.toString().getBytes();
			gzipOut.write(arrByteRslt, 0, arrByteRslt.length);
			gzipOut.flush();
		} catch(Throwable th) {
			System.out.println("flushBuffer() Exception : "+th.getMessage());
		}
	}

	private GZIPOutputStream getGZipOut(BufferedOutputStream bous)  throws IOException {
		GZIPOutputStream gzip = new GZIPOutputStream(bous);
		return gzip;
	}

	public  PrintWriter getZipWriter(HttpServletResponse response) throws IOException{
		short TOBE_COMPRESS_MARK   = (short)0xFFAD;
		
		response.resetBuffer();
       	response.setContentType("application/octet-stream"); 
		
		DataOutputStream ostream = new DataOutputStream(response.getOutputStream());
		ostream.writeShort(TOBE_COMPRESS_MARK);
		
		DeflaterOutputStream compress = new DeflaterOutputStream(ostream);
		return new PrintWriter(compress);
	}
%>