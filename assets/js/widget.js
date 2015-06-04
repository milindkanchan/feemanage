function formatUpdatedDate(upDate){
  var strDate = '';
  var strTime = '';
  var splitDate = upDate.split("T");
  strDate = splitDate[0];
  strTime = splitDate[1].split(".")[0];
  return [strDate, strTime];
}

function widgetAlert(data, setting, more){

	var data_listing = '';  
	var widgetStatus = true;
	var updatedDate = formatUpdatedDate(data.lastModified)
	if(data.error === ""){
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>High severity</h6></div>";
		data_listing += 	"<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + data.highSeverity + "</div>";
		data_listing += "</div>";

		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Medium severity</h6></div>";
		data_listing += 	"<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + data.mediumSeverity + "</div>";
		data_listing += "</div>";

		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Low severity</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + data.lowSeverity + "</div>";
		data_listing += "</div>";


	  	data_listing +=	"<div style='text-align:left;'>";
		data_listing +=		"<h6>Recent alerts</h6>";
		if(data.recentAlerts.length > 0){
		data_listing += 	"<ul>";
		$.each(data.recentAlerts, function(index, alert){
			data_listing +=			"<li>" + alert.alertName + ". (" + alert.count + ") </li>";
		});	
		data_listing += 	"</ul>";
		}else{
		data_listing += 	"<ul>";
		data_listing +=			"<li>No data available</li>";		
		data_listing += 	"</ul>";			
		}
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=     "<div style='width:100%;float:right;padding:2.5%;text-align:left;'>" + data.error + "</div>";
		data_listing += "</div>";
	  	data_listing +=	"<div>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}	
	return [data_listing, widgetStatus, '']

}

function widgetAssets(data, setting, more){
	
	var data_listing = '';
	var val_listing = '';
	var more_listing = '';
	var title = '';
	var widgetStatus = true;
	var updatedDate = formatUpdatedDate(data.lastModified)
	if(data.error === null){
		var thresh = setting.productization_latency;
		if(typeof(thresh) == "undefined"){
			thresh = 0;
		}
		var title = data.currentNoOfTitles;
		$.each(title, function(idx, cat){
			if(idx !== "error"){
				for(i=0; i < cat.length; i++){			
					val_listing += "<p>" + cat[i].value + " in " + cat[i].type + "</p>";;
				}
			}
		});

		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Current No Of Titles</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + val_listing + "</div>";
		data_listing += "</div>";

		val_listing = '';
		title = data.currentNoOfProducts;
		$.each(title, function(idx, cat){		
			if(idx !== "error"){			
				for(i=0; i < cat.length; i++){
					val_listing += "<p>" + cat[i].value + " in " + cat[i].type + "</p>";
				}
			}
		});

		data_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Current No Of Products</h6></div>";
		data_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + val_listing + "</div>";
		data_listing +=      "</div>";

		val_listing = '';
		title = data.currentNoOfDeliverables;
		$.each(title, function(idx, cat){		
			if(idx !== "error"){			
				for(i=0; i < cat.length; i++){							
					val_listing += "<p>" + cat[i].value + " in " + cat[i].type + "</p>";
				}
			}
		});
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Current No. Of Deliverables</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + val_listing + "</div>";
		data_listing += "</div>";

		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>No. Of Successful Ingests</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + data.noOfSuccessfulIngests.ingest + " " + data.noOfSuccessfulIngests.unit + "</div>";
		data_listing += "</div>";

		data_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>No. Of failed Ingests</h6></div>";
		data_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + data.noOfFailedIngests.ingest + " " + data.noOfFailedIngests.unit +"</div>";
		data_listing +=      "</div>";

		if((thresh > data.pendingProductizationItemCount) || (thresh == 0 && data.pendingProductizationItemCount == 0)){		
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}	
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Current number of pending productization items</h6></div>";
		data_listing += 	"<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + data.pendingProductizationItemCount + "</div>";
		data_listing += "</div>";

		if (more == 1){
		  	more_listing +=	"<div>";
			more_listing +=		"<h6><b>Threshold Setting</b></h6>";
			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Pending productization items greater than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + thresh + "</div>";
			more_listing +=      "</div>";
			more_listing += "</div>";
	  		more_listing +=	"<div style='text-align:left;'>";
			more_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
			more_listing += "</div>";
			
		}

		data_listing += "<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=     "<div style='width:100%;float:right;padding:2.5%;text-align:left;'>" + data.error + "</div>";
		data_listing += "</div>";
	  	data_listing +=	"<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}	
	return [data_listing, widgetStatus, more_listing]
}

function widgetBGW(data, setting, more){

	var data_listing = '';
	var res_icoms = '';
	var more_listing = '';
	var widgetStatus = true;
	var updatedDate = formatUpdatedDate(data.lastModified)
	if(data.error === null){
		var rep_icoms = (data.reportedBillingIcomsRecords < 0) ? 0 : data.reportedBillingIcomsRecords;
	    var unrep_icoms = (data.unreportedBillingIcomsRecords < 0) ? 0 : data.unreportedBillingIcomsRecords;
	    if (rep_icoms == null && unrep_icoms == null){
	    	res_icoms = 0
	    }else {
	    	res_icoms = rep_icoms > 0 ? (rep_icoms / (rep_icoms + unrep_icoms)) * 100 : 0;
	    }

		if((parseInt(setting.tvod_record_count_threshold) < data.unreportedBillingRecords) || (parseInt(setting.tvod_record_count_threshold) == 0 && data.unreportedBillingRecords == 0) ){
		widgetStatus = false;	
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		}
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Unreported TVOD Records</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + data.unreportedBillingRecords + "</div>";
		data_listing += "</div>";

		if((parseInt(setting.posting_success_rate_threshold) > data.reportedBillingIcomsRecords) || (parseInt(setting.posting_success_rate_threshold) == 0 && data.reportedBillingIcomsRecords == 0)){
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		}
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Posting Success Rate</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + rep_icoms + "</div>";
		data_listing += "</div>";

		var calcET = (data.elapsedTimeFromLastSuccessfulIngest == "-1") ? 0 : data.elapsedTimeFromLastSuccessfulIngest
		var cal_elap = data.elapsedTimeFromLastSuccessfulIngest.split(":");
		var cal_elap_time = (cal_elap[0] + cal_elap[1])/60;
		if((parseInt(setting.vod_usage_ingest_threshold) < cal_elap_time) || (parseInt(setting.vod_usage_ingest_threshold) == 0 && cal_elap_time == 0)){
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		}
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Elapsed Time From Last Successful Ingest</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + calcET  + "</div>";
		data_listing += "</div>";

		data_listing += "<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";

		if (more == 1){
		  	more_listing +=	"<div>";
			more_listing +=		"<h6><b>Threshold Setting</b></h6>";
			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Unreported TVOD record count is greater than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.tvod_record_count_threshold + " records</div>";
			more_listing +=      "</div>";

			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Posting success rate is less than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.posting_success_rate_threshold + " %</div>";
			more_listing +=      "</div>";

			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Duration from last VOD usage Ingest is greater than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.vod_usage_ingest_threshold + " %</div>";
			more_listing +=      "</div>";
			more_listing += "</div>";
	  		more_listing +=	"<div style='text-align:left;'>";
			more_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
			more_listing += "</div>";			
		}

	}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=     "<div style='width:100%;float:right;padding:2.5%;text-align:left;'>" + data.error + "</div>";
		data_listing += "</div>";
	  	data_listing +=	"<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";		
	}	
	return [data_listing, widgetStatus, more_listing]
}

function widgetCD(data, setting, more){
	
	var data_listing = '';
	var val_listing = '';
	var widgetStatus = true;
	var updatedDate = formatUpdatedDate(data.lastModified)
	val_listing = '';
	if(data.error === null){
		title = data.currentNoOfDeliverables;
		$.each(title, function(idx, cat){
			if(idx !== "error"){			
				for(i=0; i < cat.length; i++){											
					val_listing += "<p>" + cat[i].value + " in " + cat[i].type + "</p>";
				}
			}
		});
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:50%;float:left;text-align:left;'><h6>Current No Of Deliverables</h6></div>";
		data_listing +=     "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + val_listing + "</div>";
		data_listing += "</div>";

		val_listing = '';
		title = data.failedServiceRequests;
		$.each(title, function(idx, cat){		
			if(idx !== "error"){
				val_listing += "<p>" + cat + " failure " + idx + "</p>";
			}
		});	

		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:65%;float:left;text-align:left;'><h6>Failed Service Requests</h6></div>";
		data_listing +=     "<div style='width:35%;float:right;padding:2.5%;text-align:left;'>" + val_listing + "</div>";
		data_listing += "</div>";

		val_listing = '';
		title = data.averageServiceRequestDuration;
		$.each(title, function(idx, cat){	
			if(idx !== "error"){			
				val_listing += "<p>" + cat + " per " + idx + "</p>";
			}
		});	

		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:65%;float:left;text-align:left;'><h6>Average Service Request Duration</h6></div>";
		data_listing +=     "<div style='width:35%;float:right;padding:2.5%;text-align:left;'>" + val_listing + "</div>";
		data_listing += "</div>";

		data_listing += "<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=     "<div style='width:100%;float:right;padding:2.5%;text-align:left;'>" + data.error + "</div>";
		data_listing += "</div>";
	  	data_listing +=	"<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}	
	return [data_listing, widgetStatus, '']
}

function widgetPGW(data, setting, more){

	var transaction_success_rate = '';
	var data_listing = '';
	var more_listing = ''
	var widgetStatus = true;
	var updatedDate = formatUpdatedDate(data.lastModified)
	if(data.error === null){
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Transaction Count</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + data.transactionSuccessCount + "</div>";
		data_listing += "</div>";

		if (data.transactionSuccessCount === null && data.transactionFailedCount == null){
			transaction_success_rate = 0;
		}else{
			if (data.transactionSuccessCount > 0){
				transaction_success_rate = ((data.transactionSuccessCount - data.transactionFailedCount) / data.transactionSuccessCount) * 100;
			}else{
				transaction_success_rate = 100;
			}
		}
		if((parseInt(setting.transaction_success_rate_threshold) > transaction_success_rate) || (parseInt(setting.transaction_success_rate_threshold) == 0 && transaction_success_rate == 0)){
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		}
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Transaction success rate</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + transaction_success_rate + "</div>";
		data_listing += "</div>";

		var elap_time = (data.elapsedTimeFromLastTransaction == "-1") ? 0 : data.elapsedTimeFromLastTransaction
		var cal_elap = data.elapsedTimeFromLastTransaction.split(":");
		var cTime = (cal_elap[0] + cal_elap[1])/60;

		if((parseInt(setting.last_transaction_threshold) < cTime) || (parseInt(setting.last_transaction_threshold) == 0  && cTime == 0)){
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		}
		data_listing += 	"<div style='width:75%;float:left;text-align:left;'><h6>Elapsed Time from last transaction</h6></div>";
		data_listing +=     "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + elap_time + "</div>";
		data_listing += "</div>";		

		data_listing += "<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";

		if (more == 1){
		  	more_listing +=	"<div>";
			more_listing +=		"<h6><b>Threshold Setting</b></h6>";
			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Transaction success rate is less than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.transaction_success_rate_threshold + " %</div>";
			more_listing +=      "</div>";

			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Duration from last transaction is greater than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.last_transaction_threshold + " hours</div>";
			more_listing +=      "</div>";
			more_listing += "</div>";
	  		more_listing +=	"<div style='text-align:left;'>";
			more_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
			more_listing += "</div>";

		}

	}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=     "<div style='width:100%;float:right;padding:2.5%;text-align:left;'>" + data.error + "</div>";
		data_listing += "</div>";
	  	data_listing +=	"<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}	
	return [data_listing, widgetStatus, more_listing]
}

function widgetPublisher(data, setting, more){

	var data_listing = '';
	var widgetStatus = true;
	var more_listing = '';
	var updatedDate = formatUpdatedDate(data.lastModified)
	if(data.error === null){
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:55%;float:left;text-align:left;'><h6>Average rate of client requests (5F) </h6></div>";
		data_listing +=     "<div style='width:45%;float:right;padding:2.5%;text-align:right;'>" + data.totalRequestRate + " request/sec </div>";
		data_listing += "</div>";

		if( (parseInt(setting.publisher_latency) > data.averageRequestDuration) ||  (parseInt(setting.publisher_latency) == 0 && data.averageRequestDuration == 0) ){
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}
		data_listing += 	"<div style='width:60%;float:left;text-align:left;'><h6>Average duration of client requests (5F) </h6></div>";
		data_listing +=     "<div style='width:40%;float:right;padding:2.5%;text-align:right;'>" + data.averageRequestDuration + " seconds</div>";
		data_listing += "</div>";	

		data_listing += "<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";

		if (more == 1){
		  	more_listing +=	"<div>";
			more_listing +=		"<h6><b>Threshold Setting</b></h6>";
			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Average request duration is greater than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.publisher_latency + " msec</div>";
			more_listing +=      "</div>";
			more_listing += "</div>";
	  		more_listing +=	"<div style='text-align:left;'>";
			more_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
			more_listing += "</div>";			
		}

	}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=     "<div style='width:100%;float:right;padding:2.5%;text-align:left;'>" + data.error + "</div>";
		data_listing += "</div>";
	  	data_listing +=	"<div>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}	
	return [data_listing, widgetStatus, more_listing]
}

function widgetStreams(data, setting, more){

	var data_listing = '';
	var widgetStatus = true;
	var more_listing = '';
	var updatedDate = formatUpdatedDate(data.lastModified)
	if(data.error === null){		
		var activeSess = ((data.totalStreams < 0 ) ? 0 : data.totalStreams) + " active session"
		if(data.totalStreams <= 0){
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}	
		data_listing += 	"<div style='width:50%;float:left;text-align:left;'><h6>Total Streams</h6></div>";
		data_listing +=     "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + activeSess + "</div>";
		data_listing += "</div>";

		var succrate = ((data.averageSessionSetupRate < 0) ? 0 : data.averageSessionSetupRate) + " setups / sec";
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:50%;float:left;text-align:left;'><h6>Average session setup rate</h6></div>";
		data_listing +=     "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + succrate + "</div>";
		data_listing += "</div>";

		var sessLat = ((data.averageSessionLatency < 0 ) ? 0 : data.averageSessionLatency) + ' milliseconds';
		if(data.averageSessionLatency > setting.avg_latency_threshold){
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";		
		}
		data_listing += 	"<div style='width:50%;float:left;text-align:left;'><h6>Average session latency</h6></div>";
		data_listing +=     "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + sessLat + "</div>";
		data_listing += "</div>";

		var succRate = ((data.shortTermSuccessRate < 0) ? 0 : data.shortTermSuccessRate) + ' %';
		if(data.shortTermSuccessRate < setting.short_term_success_rate_threshold){
		widgetStatus = false;
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		}
		data_listing += 	"<div style='width:50%;float:left;text-align:left;'><h6>Short-term success rate</h6></div>";
		data_listing +=     "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + succRate + "</div>";
		data_listing += "</div>";


		var medRate = ((data.mediumTermSuccessRate < 0) ? 0 : data.mediumTermSuccessRate) + ' %';
		if(data.mediumTermSuccessRate < setting.medium_term_success_rate_threshold){
		widgetStatus = false;	
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}	
		data_listing += 	"<div style='width:50%;float:left;text-align:left;'><h6>Medium-term success rate</h6></div>";
		data_listing +=     "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + medRate + "</div>";
		data_listing += "</div>";

		var maxPermin = ((data.maximumNoOfSessionsPerMinute < 0 ) ? 0 : data.maximumNoOfSessionsPerMinute) + ' sessions / min';
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing += 	"<div style='width:50%;float:left;text-align:left;'><h6>Maximum number of sessions</h6></div>";
		data_listing +=     "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + maxPermin + "</div>";
		data_listing += "</div>";				

		data_listing += "<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";


		if (more == 1){
		  	more_listing +=	"<div>";
			more_listing +=		"<h6><b>Threshold Setting</b></h6>";
			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Setup latency is greater than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.avg_latency_threshold + " msec</div>";
			more_listing +=      "</div>";

			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Short term success rate is less than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.short_term_success_rate_threshold + " %</div>";
			more_listing +=      "</div>";

			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Medium term success rate is less than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.medium_term_success_rate_threshold + " %</div>";
			more_listing +=      "</div>";
			more_listing += "</div>";

	  		more_listing +=	"<div style='text-align:left;'>";
			more_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
			more_listing += "</div>";			
		}

	}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=     "<div style='width:100%;float:right;padding:2.5%;text-align:left;'>" + data.error + "</div>";
		data_listing += "</div>";
	  	data_listing +=	"<div style='text-align:left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}	
	return [data_listing, widgetStatus, more_listing]
}

function widgetSystems(data, setting, more){
	var data_listing = '';
	var val_listing = '';
	var more_listing = '';
	var Vdown = 0;
	var Sdown = 0;
	var widgetStatus = true;
	var updatedDate = formatUpdatedDate(data.lastModified)
	if(data.error == ""){
		var vms = data.vmnodes;
		$.each(vms, function(idx, cat){
			if(idx === 'down'){
				Vdown = cat;
			}
			val_listing += "<p>" + cat + " " + idx + "</p>";
		});
		if(parseInt(setting.server_threshold_down) < Vdown){
		widgetStatus = false;	
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";		
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}	
		data_listing +=        "<div style='width:50%;float:left;text-align:left;'><h6>Virtual Machine (VM) nodes</h6></div>";
		data_listing +=        "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + val_listing + "</div>";
		data_listing +=      "</div>";

		var serv = data.services
		val_listing = '';
		$.each(serv, function(idx, cat){
			if(idx === 'down'){
				Sdown = cat;
			}
			val_listing += "<p>" + cat + " " + idx + "</p>";
		});
		if(parseInt(setting.service_threshold_down) < Sdown){	
		widgetStatus = false;	
		data_listing += "<div style='width:100%;background:#FAC6C8;border:#ED1C24 solid 1px;float:left; margin:0 .25% 5px 0; padding:1%'>";		
		}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";	
		}	
		data_listing +=        "<div style='width:50%;float:left;text-align:left;'><h6>Services</h6></div>";
		data_listing +=        "<div style='width:50%;float:right;padding:2.5%;text-align:right;'>" + val_listing + "</div>";
		data_listing +=      "</div>";	

		data_listing += "<div style='text-align-left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";

		if (more == 1){
		  	more_listing +=	"<div>";
			more_listing +=		"<h6><b>Threshold Setting</b></h6>";

			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Number of VMs down is greater than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.server_threshold_down + "</div>";
			more_listing +=      "</div>";

			more_listing +=      "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
			more_listing +=        "<div style='width:75%;float:left;text-align:left;'><h6>Number of services down is greater than</h6></div>";
			more_listing +=        "<div style='width:25%;float:right;padding:2.5%;text-align:right;'>" + setting.service_threshold_down + "</div>";
			more_listing +=      "</div>";
			more_listing += "</div>";			

	  		more_listing +=	"<div style='text-align-left;'>";
			more_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
			more_listing += "</div>";
		}

	}else{
		data_listing += "<div style='width:100%; background:rgba(0,0,0,.1); float:left; margin:0 .25% 5px 0; padding:1%'>";
		data_listing +=     "<div style='width:100%;float:right;padding:2.5%;text-align:left;'>" + data.error + "</div>";
		data_listing += "</div>";
	  	data_listing +=	"<div style='text-align-left;'>";
		data_listing += 	"<small> Last updated : " + updatedDate[0] + ", " + updatedDate[1] + "</small>";
		data_listing += "</div>";
	}	
	return [data_listing, widgetStatus, more_listing]
}