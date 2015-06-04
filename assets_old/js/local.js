jQuery.support.cors = true;

function networkStatus(){
    if (navigator.onLine) {
      onload();
      return 1;
    } else {
      onload();
      return 0;
    }  
}

function onload() {
  if (navigator.onLine) {
    $(".net_status").html("<i class='fa fa-circle fa fa-1x' style='color:green'></i>&nbsp;&nbsp;Online"); 
  } else {
    $(".net_status").html("<i class='fa fa-circle fa fa-1x' style='color:red'></i>&nbsp;&nbsp;Offline");
  }
  $(".net_status").show();
  var timer = setInterval(hideDiv, 3000);
}

function hideDiv(){
  $(".net_status").slideUp(400).fadeOut("slow");;
}


window.addEventListener("offline", function(e) {
  $(".net_status").html("<i class='fa fa-circle fa fa-1x' style='color:red'></i>&nbsp;&nbsp;Offline");
}, false);

window.addEventListener("online", function(e) {
  $(".net_status").html("<i class='fa fa-circle fa fa-1x' style='color:green'></i>&nbsp;&nbsp;Online"); 
}, false);


function getBaseURL()
{
	var baseurl = localStorage.getItem("currentBaseUrl");
	if(baseurl === null){
    localStorage.setItem("currentBaseUrl", "http://ec2-54-69-156-225.us-west-2.compute.amazonaws.com:8080");
		//return "http://ec2-54-69-156-225.us-west-2.compute.amazonaws.com:8080";
    return localStorage.getItem("currentBaseUrl");
	}
	return baseurl;
}

function userLogout()
{  
}

function getUrlNameParams(){
        var results = new RegExp('[\&]name=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return results[1] || 0;
        } 
}


function displayError(msg, type){
  var message = '';
  if (type == 'Error'){
    message = "<div>Error Message</div><div style='font-weight: normal;'>" + msg + "</div>"
  }else{
    message = "<div style='font-weight: normal;'>" + msg + "</div>"
  }
  
  jAlert(message, "BPM Project");
}


$("#linkFavourite").click(function (){
  window.location.href = "favourite.html?id=readFav";
})

$("#linkReadLater").click(function (){
  window.location.href = "favourite.html?id=readLater";
})

$("#linkSetting").click(function (){
  window.location.href = "setting.html";
})

$("#linkNews").click(function (){
  var news_id = localStorage.getItem("newsID");
  window.location.href = "listing.html?id=" + news_id;
})