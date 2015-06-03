
function validateSettings()
{
  var burl  = $("#baseUrl").val();
  var uname = $("#username").val();  
  var cpass = $("#password").val();
  var viewer = $("#selectViewer").val();
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

  setLocalStorage("currentUserPwd", cpass);
  setLocalStorage("currentUserName", uname);
  setLocalStorage("currentBaseUrl", burl);
  setLocalStorage("viewer", viewer);
  window.location.href = "home.html";
}

function cancelSettings(){
  window.location.href = "home.html"
}