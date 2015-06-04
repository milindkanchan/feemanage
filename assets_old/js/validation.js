jQuery.support.cors = true;

function validateSettings()
{
  var burl  = $("#baseUrl").val();
  var uname = $("#username").val();  
  var cpass = $("#password").val();
  if (burl === ""){
     $("#lblError").html("Please enter bae url for cms");
     return;
  }
  if (uname === ""){
     $("#lblError").html("Please enter user name");
     return;
  }
  if (cpass === ""){
     $("#lblError").html("Please enter password");
     return;
  }  

  localStorage.setItem("currentUserPwd", cpass)
  localStorage.setItem("currentUserName", uname)
  localStorage.setItem("currentBaseUrl", burl)
  window.location.href = "home.html";
}

function cancelSettings(){
  window.location.href = "home.html"
}
