function formatUpdatedDate(upDate){
  var strDate = '';
  var strTime = '';
  var splitDate = upDate.split("T");
  strDate = splitDate[0];
  strTime = splitDate[1].split(".")[0];
  return [strDate, strTime];
}

function formatServerIP(sip){
  return sip[0].replace(/\, 127.0.0.1/g, '');  
}

function replaceLocalToConfigUrl(curl){
  var ip = localStorage.getItem("baseIP");	
  curl =  curl.replace(/SERVER_IP/g, ip);
  curl =  curl.replace(/ /g, '%20');
  return curl;
}

function getConfigurationDetails(data, setting, more){

	var wId = getUrlParams();
	var wType = getExtraUrlParams();
	var wCnt = getCntExtraUrlParams();
	var data_listing = '';  
	var widgetStatus = true;
	var updatedDate = data.lastModified;
	var	val_listing = '';	
	data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
	data_listing += 	"<div style='width:25%;float:left;text-align:left;'><h6>Component</h6></div>";
	data_listing += 	"<div style='width:75%;float:right;padding:2.5%;text-align:right;'>" + data.component_name + "</div>";
	data_listing += "</div>";
	var sName = setting.serverName;
	var configUrls = setting.configUrl;
	var sIP = setting.serverIP;	
	data_listing +=	"<div style='text-align:left;'>";
	data_listing +=		"<h6>Assigned Server(s)</h6>";
	if(sName.length > 0){		
		data_listing += 	"<ul>";
		for(i = 0; i < sName.length; i++){
			data_listing +=	  "<li>" + formatServerIP(sIP[i]) + " (" + sName[i] + ") </li>";
		}
		data_listing += 	"</ul>";
	}else{
		data_listing += 	"<ul>";
		data_listing +=			"<li>No server(s) assigned</li>";		
		data_listing += 	"</ul>";					
	}
	data_listing += "</div>";

	data_listing +=	"<div style='text-align:left;'>";
	data_listing +=		"<h6>Service Installed (click on service to view cofiguration)</h6>";
	if(configUrls.length > 0){		
		data_listing += 	"<ul>";
		for(i = 0; i < configUrls.length; i++){
			data_listing +=	  "<li><a href=config_xml.html?link="+replaceLocalToConfigUrl(configUrls[i][1]) + "&id=" + wId + "&type=" + wType + "&cnt=" + wCnt + ">" + configUrls[i][0] + "</a></li>";
			//data_listing +=	  "<li><a href='" + replaceLocalToConfigUrl(configUrls[i][1]) + "'>" + configUrls[i][0] + "</a></li>";
		}
		data_listing += 	"</ul>";		
		data_listing += 	"<small> Last updated : " + updatedDate + "</small>";		
	}else{
		data_listing += 	"<ul>";
		data_listing +=			"<li>No service(s) installed</li>";		
		data_listing += 	"</ul>";			
		data_listing += 	"<small> Last updated : " + updatedDate + "</small>";
	}
	data_listing += "</div>";


	return [data_listing, widgetStatus, '']
}