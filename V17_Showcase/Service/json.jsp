<%@page contentType="text/html; charset=UTF-8"%>
<%@page import="org.json.simple.JSONObject"%>
<%@page import="org.json.simple.JSONArray"%>
<%

	JSONArray users = new JSONArray();
    JSONObject obj=new JSONObject();
    obj.put("name","Ambarish");
    obj.put("surname","Aura"); 
	users.add(obj);
	obj=new JSONObject();
    obj.put("name","bmbarish");
    obj.put("surname","Bura"); 
	obj=new JSONObject();
    obj.put("name","Cmbarish");
    obj.put("surname","Cura"); 
	users.add(obj);
	response.getWriter().print(users);
  
  // response.getWriter().print("[{\"k11\":\"v11\",\"k12\":\"v12\",\"k13\":\"v13\"},{\"k22\":\"v22\",\"k21\":\"v21\",\"k23\":\"v23\"}]");
%>