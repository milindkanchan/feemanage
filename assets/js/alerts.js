function getComponentDetails(data, alerts, more){

	var data_listing = '';  
	var widgetStatus = true;
	var updatedDate = data.lastModified;
	var	val_listing = '';
	var child = alerts.data;

	$.each(child, function(idx, cat){
		data_listing += "<div style='width:100%; background:rgba(11, 118, 240, 0.47); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:35%;float:left;text-align:left;'><h6>Configuration Name</h6></div>";
		data_listing += 	"<div style='width:65%;float:right;padding:2.5%;text-align:right;font-weight: bold;font-size: 12px;'>" + cat.name + "</div>";
		data_listing += "</div>";

		var sName = cat.server;
		if(sName.length>0){
			$.each(sName, function(idx, cat){
				data_listing +=	"<div style='text-align:left;'>";
				data_listing +=		"<h6 style='color:rgba(255, 0, 0, 0.98);'>High Alerts on server: " + cat.serverName + " ( Location: " + cat.location_name + " ) </h6>";

				if(cat.alerts.length > 0){		
					data_listing += 	"<ul>";
					$.each(cat.alerts, function(idx, cat){					
						data_listing +=	  "<li>" + cat.name + " ( " + cat.created_at + " ) </li>";
					});
					data_listing += 	"</ul>";				
				}else{
					data_listing += 	"<ul>";
					data_listing +=			"<li>No alerts found.</li>";		
					data_listing += 	"</ul>";			
				}
				data_listing += "</div>";
			});
		}else{
			data_listing +=	"<div style='text-align:left;'>";
			data_listing +=		"<h6>No Server Assigned</h6>";
			//data_listing += 	"<ul>";
			//data_listing +=			"<li>No alerts found.</li>";		
			//data_listing += 	"</ul>";			
			data_listing += "</div>";
		}	
		data_listing += 	"<div style='text-align:left;'><small> Last updated : " + updatedDate + "</small></div>";

	});	
	return [data_listing, widgetStatus, '']
}