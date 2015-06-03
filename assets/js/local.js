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


function checkNavigatorIsDevice(){

  if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    console.log("Application running on Device....");
    setLocalStorage("appDevice", "mobile");
    return true;
  } else {
    console.log("Application running on Desktop Browser....");
    setLocalStorage("appDevice", "browser");
    return false;
  }

}

function getBaseURL()
{
  var baseurl = localStorage.getItem("currentBaseUrl");
  if(baseurl === null){
    setLocalStorage("currentBaseUrl", "http://ec2-54-69-156-225.us-west-2.compute.amazonaws.com:8080");
    //return "http://ec2-54-69-156-225.us-west-2.compute.amazonaws.com:8080";
    return getLocalStorage("currentBaseUrl");
  }
  return baseurl;
}

function userLogout()
{  
  var baseurl = getBaseURL();
  console.log("Current user logged out...");
  $(function (){
    $.ajax({
        url: baseurl + "/app/alfrscosvg/auth2/AuthLogoutServlet",
        xhrFields: {
          'withCredentials': true
        },
        crossDomain: true,
        cache: false, 
        success: function(data, textStatus){
          // Keep user details in localstorage and rest clear all
          /*var currentUsr = localStorage.getItem("currentUser");
          var cpass = localStorage.getItem("currentUserPwd");
          localStorage.clear();
          localStorage.setItem("currentUser", currentUsr);
          localStorage.setItem("currentBaseUrl", baseurl);
          localStorage.setItem("currentUserPwd", cpass);*/
          $.cookie('authenticated', 'false');
          localStorage.removeItem("authentication_valid_until");
          window.location.href = "index.html";
        },
        error: function(data, textStatus, errorThrown){
          displayError("Due to network issue unable to logout, please try again later.", 'Error');
          //console.log("Ajax Request failed. " + errorThrown);
        }
    });
  })
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

function checkLogin() {
  var baseurl = getBaseURL();
  $.ajax({
      url: baseurl + "/app/alfrscosvg/auth2/services/rest/ping?random=34",
      dataType: "json",
      xhrFields: {
          'withCredentials': true
      },
      crossDomain: true,
      cache: false,
      beforeSend: function( xhr ) {
        //$(".loading").show();
      },
      success: function(data, textStatus) {
        console.log("Auth Required = "+ data.authRequired);
        if (data.authRequired == true){
          window.location.href = "index.html"
        }
      },
      error: function (responseData, textStatus, errorThrown) {
          //displayError("Unable to ping server, you may have to login again...", 'Error');
          console.log('Ajax Request failed. ' + errorThrown);
          //window.location.href = "index.html";
      }
  });
}

function getUserLoginDetails()
{
  if (networkStatus() === 1){
    jQuery.support.cors = true;
    console.log("Get Current details...");
    var baseurl = getBaseURL();
    console.log(baseurl);
    $.ajax({
      url: baseurl + "/app/alfrscosvg/auth2/services/rest/query/currentuser/",
      dataType: "json",
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true,
      cache: false,
      beforeSend: function( xhr ) {
        //$(".loading").show();
      },
      success: function(responseData, textStatus) {     
        setLocalStorage("currentUser", JSON.stringify(responseData));
        getUserDetail();
        //$(".loading").hide();
      },
      error: function (responseData, textStatus, errorThrown) {
        console.log('Ajax Request failed. ' + errorThrown);
      }
    });
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

$('.seach_field').bind('keypress', function(e) {
  if(e.keyCode==13){
    searchText(); // Enter pressed... do anything here...
  }
});

function searchText()
{
  if (networkStatus() === 1){
    var stext = $(".seach_field").val();
    jQuery.support.cors = true;
    console.log("Sent Search Result details...");
    var baseurl = getBaseURL();
    $.ajax({
      url: baseurl + "/app/alfrscosvg/auth2/services/rest/document/search/?query=" + stext,
      dataType: "json",
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true,
      cache: false,
      beforeSend: function( xhr ) {
        $(".loading").show();
      },
      success: function(responseData, textStatus) {
        setLocalStorage("searchResult", JSON.stringify(responseData));
        $(".loading").hide();
        window.location.href = "listing.html?id=search"
      },
      error: function (responseData, textStatus, errorThrown) {
        console.log('Ajax Request failed. ' + errorThrown);
      }
    });
  }
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
  var news_id = getLocalStorage("newsID");
  window.location.href = "listing.html?id=" + news_id;
})

function bytesToSize(bytes) {
   if(bytes == 0 || bytes === null ) return '0 Byte';
   var k = 1000;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}