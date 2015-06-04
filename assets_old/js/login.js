var baseUrl = getBaseURL();
$.cookie.json = true;
$(document).ready(function (){	
  jQuery.support.cors = true;
});

$("#btnLogin").click(function () {

  //var uname =  $("#SC_username");
  //var pass =  $("#SC_password");
  var ip = $("#SC_ip").val();
  var port = $("#SC_port").val();
  var proto = "http://"

  //var uri = "http://" + ip + ":" + port + "/mmc";

  if(port === '8443'){
    proto = "https://"
  }

  var uri =  proto + ip + ":" + port  + "/mmc";

  //console.log(uri);
  localStorage.setItem("baseUrl", JSON.stringify(uri));
  window.location.href = "listing.html";
/*
  jQuery.support.cors = true;
  console.log("Request for login to MMC.....");
  $(function (){
    $.ajax({
        url: uri,
        xhrFields: {
          'withCredentials': true
        },
        crossDomain: true,
        cache: false, 
        success: function(data, textStatus){
          window.location.href = "index.html";
        },
        error: function(data, textStatus, errorThrown){
          displayError("Due to network issue unable to login, please try again.", 'Error');
          //console.log("Ajax Request failed. " + errorThrown);
        }
    });
  })
*/

});