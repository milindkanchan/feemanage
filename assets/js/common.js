var baseUrl = '';
$(document).ready(function (){
  baseUrl = getBaseURL();
});

function getUrlParams(){
    var results = new RegExp('[\?]id=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    } 
}

function getExtraUrlParams(){
    var results = new RegExp('[\&]sid=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    } 
}

function getExplicitUrlParams(url){
    var results = new RegExp('[\?]id=([^&#]*)').exec(url);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    } 
}

function trimDocumentname(docName)
{
  if(docName !== null){
    if (docName.length > 35){
      var name = docName.replace(/%20/g, ' ');
      var nname = name.substr(0, 35);
      return nname + "..."
    }else{
      return docName.replace(/%20/g, ' ');
    }
  }
}

function imageError(){
  $('.card_container').find('.card_image').each(function(){
    $(this).error(function(){
      $(this).attr('src', 'assets/img/default.jpg');
    });
  });
}

function homeImageError(){
  cnt = 1
  $('.testClass').find('.imgTestClass').each(function(){
    //cnt = parseInt($(this).attr("id"));        
      console.log(".......<<<<<<<<<" + $(this).attr("id"));
      $(this).error(function(){
        if(typeof($(this).attr("id")) !== 'undefined' && cnt < 4){
          $(this).attr('src', "assets/img/home_img_" + cnt + ".jpg");        
          console.log("......>>>>> " + cnt);
          cnt += 1;
        }
      });      
    
  });
}

function ImageExist(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

/* ------ Category List realted functions -------- */

function callCategoryList(cached){
  if (networkStatus() === 1){
    console.log("callCategoryList()....");
    jQuery.support.cors = true;
      $(function (){
        $.ajax({
          url: baseUrl + "/app/alfrscosvg/auth2/services/rest/category/list/",
          dataType: "json",
          xhrFields: {
              'withCredentials': true
          },
          crossDomain: true,
          cache: true,
          success: function(data, textStatus) {
            //$.cookie('authenticated', false);
            setLocalStorage("cachedCategoryList", JSON.stringify(data));
            //call the below function for the first time whenlocalStorage is null
            if (cached === false){
              setCategoryList(data);
              //  setSystemCategoryImage($.parseJSON(localStorage.getItem("cachedCategoryList")), true);
            }  
          },
          error: function (responseData, textStatus, errorThrown) {
              if (networkStatus() === 1){
                displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
              }
              console.log('Ajax Request failed. ' + errorThrown);
              //window.location.href = "index.html";
          }
        });
      })
  }    
}

// Save all the category thumbmnail urls
function setSystemCategoryImage(data, cache){
  if (cache === true){
    var catChild = data.children;
    if (catChild !== null){
      $.each(catChild, function(index, category){
        if (category.name === 'Systems'){
          console.log("setSystemCategoryImage(data, cache).......")
          setLocalStorage("SystemId", category.id);
          getCategoryImageThumbnail(category.id);
          return;
        }  
      })    
    }
  }  
  return;
}

function getCategoryImageThumbnail(id){

  jQuery.support.cors = true;
          $(function (){
            console.log("getCategoryImageThumbnail(id)......");
            $.ajax({
                url: baseUrl + "/app/alfrscosvg/auth2/services/rest/category/list/?id=" + id,
                dataType: "json",
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                cache: true,
                beforeSend: function( xhr ) {
                  //$(".loading").show();
                },
                success: function(data, textStatus) {
                  setLocalStorage("cacheCategoryImage", JSON.stringify(data));
                  setCategoryImageThumbnail(data)
                  setCategoryList($.parseJSON(getLocalStorage("cachedCategoryList")), false);
                },
                error: function (responseData, textStatus, errorThrown) {
                  if (networkStatus() === 1){
                    displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
                  }
                  //console.log('Ajax Request failed. ' + errorThrown);
                }
            });
          });

}

function setCategoryImageThumbnail(data){
  console.log("setCategoryImageThumbnail().....");
  var catChild = data.children;
  var catName = '';
    if (catChild !== null){
      $.each(catChild, function(index, category){
        catName = category.name.replace(".jpg", '');
        fcatThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");
      })    
    }
}

function getCategoryList(){
  var localCastlist = getLocalStorage("cachedCategoryList");

  if (localCastlist !== null){
    console.log("getCategoryList() from cache...");
    //setSystemCategoryImage(cachedCatList, true);
    setCategoryList($.parseJSON(localCastlist));
    callCategoryList(true);
    //getCategoryImageThumbnail(localStorage.SystemId);
  }
  else{
    console.log("getCategoryList() from server...");
    callCategoryList(false);
  }    
}


function setCategoryList(responseData){
  if (responseData !== null){
    console.log("setCategoryList(responseData).....");
    var gOrient = $("#pageOrient").val();
    var value = responseData;
    var child = value.children;
    var tCount = child.length;
    var listItems = "";
    var cat_listing = "";
    var cnt = 0;
    var tmpCnt = 1;
    var news_id;
    var catThumb;
    if (child !== null){ 
      $.each(child, function(index, category){
        // Added condition to skip Thumbnail category.
        if(category.name !== 'Thumbnail'){
          catThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");

          listItems   +=  "<option value='listing.html?id=" + category.id + "'>" + category.name + "</option>"; 

          //if(cnt==0){
          //  cat_listing += "<div class='row'>"      
          //}
          cat_listing +=  "<div class='card_container home_card_container'>"
          cat_listing +=  "<a class='home_card' href='listing.html?id=" + category.id + "'>";

          cat_listing +=  "<img src='" + catThumb + "' class='card_image'>"

          //cat_listing +=  "<div class='card_title'>" + (category.headline == null ? category.name : category.headline) + "</div></a></a></div>"
          cat_listing +=  "<div class='card_title'>" + (category.headline == null ? category.name : category.headline) + "</div></a></div>"
          
          /*cnt += 1;
          if(cnt == 2 && gOrient=='vertical') {
            cat_listing += "</div>"
            cnt = 0;
          }else if(cnt == 3 && gOrient=='horizontal') {
            cat_listing += "</div>"
            cnt = 0;
          }else if(tmpCnt==tCount){
            cat_listing += "</div>"
          }
          tmpCnt += 1;*/
          
          if (category.name == "News"){
            var cat_id = category.id;
            setLocalStorage("newsID", cat_id);
            news_id = category.id;
          } 
        } 
      })
      setLocalStorage("cacheSelectCategory", listItems);
      $("#selectCategoryList").append(listItems);
      $("#divCategory").html(cat_listing); 
      if (news_id != null){
        if (typeof($(".imgTestClass").attr('class')) == 'undefined'){
          getNewsDetails(news_id);
        }
      }      
      imageError();    
    }  
  }else{
    if (networkStatus() === 1){
      displayError("Unable to fetch data,  please try logging out and logging back in.", 'Error');
    }  
  }
}

/* ------ News List realted functions -------- */

function getNewsList(id, cached){
  if (networkStatus() === 1){
    jQuery.support.cors = true;
      $(function (){      
        $.ajax({
                url: baseUrl + "/app/alfrscosvg/auth2/services/rest/category/list/?id=" + id,
                dataType: "json",
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                cache: true,
                beforeSend: function( xhr ) {
                  //$(".loading").show();
                },
                success: function(data, textStatus) {
                  console.log("Get NEWS from server and cache it....");                
                  setLocalStorage("cacheNewsDtl", JSON.stringify(data));
                  if (cached === false){
                    showHomeNews($.parseJSON(getLocalStorage("cacheNewsDtl")));
                  }                
                },
                error: function (responseData, textStatus, errorThrown) {
                  if (networkStatus() === 1){
                    displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
                  }
                //console.log('Ajax Request failed. ' + errorThrown);
                }
      });
    });
  }
}

function showNews(){
  var news_id = getLocalStorage("newsID");
  if(news_id === null){
    $("#linkNews").hide();
  }else{
    $("#linkNews").show();    
  } 
}

function getNewsDetails(){
  var newsDtl = getLocalStorage("newsID");
  if (newsDtl !== null){
    var cacheNewsDtl = $.parseJSON(getLocalStorage("cacheNewsDtl"));
    if (cacheNewsDtl !== null){
      console.log("Show News from cache...")      
      showHomeNews(cacheNewsDtl);
      getNewsList(newsDtl, true);
    }else{
      console.log("Fetching news details from server and updating cache....");
      getNewsList(newsDtl, false);
    }
  }
}

function showHomeNews(responseData){
    var value = responseData;
    var child = value.children;
    var burl = getBaseURL();
    var news_listing = "";
    var cnt = 1;  
    var tnail = '';
    var cut = false;
    var deviceStatus = 0;
    var options = {};
    var filePath = "";
    var fileext = false;
    var fName = ''
    if (child !== null){
      $.each(child, function(index, category){
        tnail = '';
        console.log(category)
        if(category.mime.indexOf("pdf") > 0){
          setLocalStorage(category.id, JSON.stringify(category))
          tnail = burl + "/app/alfrscosvg/auth2/ItemStream?path=Thumbnails/News/news" + cnt + ".jpg";
          fileext = ImageExist(tnail);
          if(!fileext){
            tnail = "assets/img/home_img_" + cnt + ".jpg";
          }

          pdfPath = "/app/alfrscosvg/auth2/PDFDownload?id=" + category.id
          if (getLocalStorage("PDF_"+category.id) == null){
            filePath = baseUrl + pdfPath;
          } else {
            //filePath = "file:///" + getLocalStorage(category.id);
            filePath = checkForPdfExists(baseUrl, pdfPath, category.id, ".pdf")
          }

          fname = (category.headline == null ? category.name : category.headline).replace(/ /g, '_');

          news_listing += "<div class='testClass'>";
          news_listing +=  "<img class='imgTestClass' id='" + cnt + "' href='#' data-url= '" + filePath + "' onclick=exec_url('" + filePath + "','" + fname + "'); src='" + tnail + "' max-height='600px' max-width='1014px'>";
          //news_listing += "<div>";
          //news_listing +=  "<img href='assets/js/pdf_js/web/viewer.html?id=" + category.id + "&name=" + category.name + "' src='" + tnail + "' max-height='600px' max-width='1014px'>";
          //}          
          news_listing +=     "<div class='slider_content'>";
          news_listing +=       "<h1>News</h1>";
          news_listing +=       "<h2>" + category.headline + "</h2>";

          //if (deviceStatus === 1){
          //  news_listing +=       "<a href='android_pdf_flip.html?id=" + category.id + "&name=" + category.name + "' class='btn jlt_btn read_more_btn'>Read More</a>";
          //}else{
            /*if (getLocalStorage(category.id) == null){
              filePath = burl + "/app/alfrscosvg/auth2/PDFDownload?id=" + category.id;
            } else {
              filePath = "file:///" + getLocalStorage(category.id);
            }
          pdfPath = "/app/alfrscosvg/auth2/PDFDownload?id=" + category.id
          if (getLocalStorage("PDF_"+category.id) == null){
            filePath = baseUrl + pdfPath;
          } else {
            filePath = checkForPdfExists(baseUrl, pdfPath, category.id, ".pdf")
          }*/

          news_listing +=       "<a href='#' data-url= '" + filePath + "' onclick=exec_url('" + filePath + "','" + fname + "'); class='btn jlt_btn read_more_btn'>Read More</a>";            
          //news_listing +=       "<a href='#' data-url= '" + filePath + "' onclick=alert('123'); class='btn jlt_btn read_more_btn'>Read More</a>";            
          //}  
          news_listing +=       "<a href='#' onclick='reloadPage();' class='fa fa-rotate-right page_refresh'></a>";
          news_listing +=       "<p class='date'><i class='fa fa-calendar'></i>" + category.creationDate + "</p>";
          news_listing +=     "</div>"
          news_listing += "</div>";        
          if (cnt == 3) {
            showNews();
            cut = true;
            return false; //Break the loop;
          }
          cnt += 1;
        }
        if (cut === true){
          return false;
        }
      })
    }else{
      news_listing += "<div><img src='assets/img/home_img_1.jpg'>";
      news_listing +=   "<div class='slider_content'>";
      news_listing +=     "<h1>News</h1>";
      news_listing +=     "<h2></h2>";
      news_listing +=     "<a href='#'' class='btn jlt_btn read_more_btn'>Read More</a>";
      news_listing +=     "<a href='#' onclick='reloadPage();' class='fa fa-rotate-right page_refresh'></a>";
      news_listing +=     "<p class='date'><i class='fa fa-calendar'></i>" + Date.now + "</p>";
      news_listing +=   "</div>"
      news_listing += "</div>";
    }
  $(".image_slider").html(news_listing);
  $('.image_slider').slick({
    dots: true,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000000,
  });  
}

/* ------ Category Details realted functions -------- */

function getCategoryDetails(){
      var id = getUrlParams();
      var cachedCatDtl = $.parseJSON(getLocalStorage(id));
      if (cachedCatDtl == undefined || cachedCatDtl == null){
        getList(id);
      }
      else{
        /*if(window.location.href.indexOf("android") > 0){
          console.log("showAdndroidCategoryDetailsWithFlip(cachedCatDtl) cache......");
          showAdndroidCategoryDetailsWithFlip(cachedCatDtl);          
        }else*/ 
        if(window.location.href.indexOf("image_flip.html?id=") > 0){
          console.log("showCategoryDetailswithFlip(cachedCatDtl) cache......");
          showCategoryDetailswithFlip(cachedCatDtl);
        }else{
          console.log("showCategoryDetails(cachedCatDtl) cache......");
          showCategoryDetails(cachedCatDtl);          
        }   
        $("#selectCategoryList").append(getLocalStorage("cacheSelectCategory"));
        if (networkStatus() === 1){
          jQuery.support.cors = true;
          $(function (){
            console.log("getCategoryDetails() server......");
            $.ajax({
                url: baseUrl + "/app/alfrscosvg/auth2/services/rest/category/list/?id=" + id,
                dataType: "json",
                xhrFields: {
                    'withCredentials': true
                },
                crossDomain: true,
                cache: true,
                beforeSend: function( xhr ) {
                  //$(".loading").show();
                },
                success: function(data, textStatus) {
                  setLocalStorage(id, JSON.stringify(data));
                },
                error: function (responseData, textStatus, errorThrown) {
                  displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
                  //console.log('Ajax Request failed. ' + errorThrown);
                }
            });
          });
        }
      }  
}

function getList(id){
  if (networkStatus() === 1){
    jQuery.support.cors = true;
    console.log("getList(id) server...");
    $(function (){
      $.ajax({
          url: baseUrl + "/app/alfrscosvg/auth2/services/rest/category/list/?id=" + id,
          dataType: "json",
          xhrFields: {
              'withCredentials': true
          },
          crossDomain: true,
          cache: true,
          success: function(data, textStatus) {
            setLocalStorage(id, JSON.stringify(data));
            //setCategoryImageThumbnail($.parseJSON(localStorage.getItem(id)));
            /*if(window.location.href.indexOf("android") > 0){
              showAdndroidCategoryDetailsWithFlip(data);  
            }else*/ 
            if(window.location.href.indexOf("image_flip.html?id=") > 0){
              showCategoryDetailswithFlip(data);
            }else{
              showCategoryDetails(data);
            }                
            $("#selectCategoryList").append(getLocalStorage("cacheSelectCategory"));
          },
          error: function (responseData, textStatus, errorThrown) {
            if (networkStatus() === 1){
              console.log('Ajax Request failed. ' + errorThrown);
              displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
            }  
              //window.location.href = "home.html";
          }
      });
    });
  }
}

function isOdd(num) { return num % 2;}

function showCategoryDetails(data){
  console.log("showCategoryDetails(data)....")
  if (data !== null){
    //var orient = 'vertical';
    var orientVal = $("#currentOrientation").val();
    var defOrient = 9;
    var id = getUrlParams();
    var img_name = getUrlNameParams();
    var child = data.children;
    var pdf_listing = "";
    var div_listing = "";
    var nav_listing = "";
    var cnt = 1;
    var tmp_cnt = 1;
    var itm_cnt = 0;
    var cat_ids = [];
    var cat_urls = [];
    var catThumb = '';
    var filePath;
    var fname = '';

    //if(orientVal !== 'undefined'){
    if(orientVal === 'horizontal'){
      defOrient = 6;
    }else if(orientVal === ""){
      orientVal = 'vertical';
    }
    //}

    if (child == null){
      pdf_listing = "";
    }else{
      var clength = child.length;
      $.each(child, function(index, category){  
        console.log(category)     
        fname = (category.headline == null ? category.name : category.headline) 
        if(category.mime === null){

          catThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");
          
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='listing.html?id=" + category.id + "&name=" + fname + "'>";
          pdf_listing +=  "<img id='" + category.id + "' src='" + catThumb + "' title='" +  category.name + "' class='card_image'>";
          
          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(fname) + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"

        }else if(category.mime.indexOf("pdf") >= 0){
          setLocalStorage(category.id, JSON.stringify(category))

          catThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");
          
          pdfPath = "/app/alfrscosvg/auth2/PDFDownload?id=" + category.id;
          if (getLocalStorage("PDF_"+category.id) === null){
            filePath = baseUrl + pdfPath;
          } else {
            //filePath = "file:///" + getLocalStorage("PDF_"+category.id);
            filePath = checkForPdfExists(baseUrl, pdfPath, category.id, ".pdf");
          }
          //alert("Thumbnai path..." +  catThumb + "\n PDF file path URL..... " + filePath);
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='#' data-url='"+ filePath +"' onclick=exec_url('" + filePath +"','" + fname.replace(/ /g, "_") + "');>";
          if (catThumb == null){
            pdf_listing +=  "<img id='" + category.id  + "' src='assets/img/default.jpg' title='" +  fname + "' class='card_image'>";
          }else{
            pdf_listing +=  "<img id='" + category.id  + "' src='" + catThumb + "' title='" +  fname + "' class='card_image'>";
          }

          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(fname) + " (" +  bytesToSize(category.size) + ")" + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"


        }else if(category.mime.indexOf("image") >= 0){
          setLocalStorage(category.id, JSON.stringify(category))
          catThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");
          //console.log("Original path......" + catThumb);

          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='image_flip.html?id=" + id + "&name=" + img_name + "&sid=" + category.id + "'>";          
          pdf_listing +=  "<img id='" + category.id  + "' src='" + catThumb + "' title='" +  fname + "' class='card_image'>";          

          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(fname) + " (" +  bytesToSize(category.size) + ")" + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"

        }
        if(tmp_cnt==1){
          nav_listing += "<span class='bb-current'></span>"; 
        }else{
          nav_listing += "<span></span>";
        }
        itm_cnt += 1;

        if (cnt == defOrient) {
          div_listing += "<div class='bb-item'>";
          div_listing +=  "<div id='row'>";      
          div_listing +=    "<div class='contaniner listing_container row' id='row_listing'>" + pdf_listing + "</div>";
          div_listing +=  "</div>";
          div_listing += "</div>";

          pdf_listing = '';
          cnt = 0;
        }
        if (itm_cnt === clength && cnt < defOrient){
          div_listing += "<div class='bb-item'>";
          div_listing +=  "<div id='row'>";      
          div_listing +=    "<div class='contaniner listing_container row' id='row_listing'>" + pdf_listing + "</div>";
          div_listing +=  "</div>";
          div_listing += "</div>"; 
        }
        cnt += 1;
      })
    }
    $("#bb-bookblock").html(div_listing)
    //$("#navbb-block").html(nav_listing);
    Page.init(orientVal);
    imageError();
  }else{
    div_listing += "<div class='bb-item'>"
    div_listing +=  "<div id='row'>"      
    div_listing +=  "<div class='contaniner listing_container row' id='row_listing'></div>"
    div_listing += "</div>"
    div_listing += "</div>"
    $("#bb-bookblock").html(div_listing)    
    $("#prev_btn").hide();
    $("#next_btn").hide();
    if (networkStatus() === 1){
      displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
    }  
  }
}


/* ------ Search  realted functions -------- */

function showCategorySearchDetails(data){
  if (data !== null){
    var orient = $("#currentOrientation").val();
    var defOrient = 9;    
    var child = $.parseJSON(data);
    var pdf_listing = "";
    var div_listing = "";
    var cnt = 1;
    var tmp_cnt = 1;
    var itm_cnt = 0;
    var catThumb = '';
    var fname='';
    if (child == null){
      pdf_listing = "";
    }else{
      var clength = child.length;
      $.each(child, function(index, category){  
        fname = (category.headline == null ? category.name : category.headline)       
        if(category.mime === null){

          catThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");
          //if (catThumb.indexOf("http://") < 0){
          //  catThumb = "file:///" + catThumb;
          //}
          
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='listing.html?id=" + category.id + "&name=" + category.name + "'>";
          pdf_listing +=  "<img id='" + category.id + "' src='" + catThumb + "' title='" +  category.name + "' class='card_image'>";
          
          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"

        }else if(category.mime.indexOf("pdf") >= 0){

          catThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");
          setLocalStorage(category.id, JSON.stringify(category))
          
          pdfPath = "/app/alfrscosvg/auth2/PDFDownload?id=" + category.id
          if (getLocalStorage("PDF_"+category.id) == null){
            filePath = baseUrl + pdfPath;
          } else {
            //filePath = "file:///" + getLocalStorage("PDF_" + category.id);
            filePath = checkForPdfExists(baseUrl, pdfPath, category.id, ".pdf")
          }
          //console.log("filepath....." + filePath);
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='#' data-url='"+ filePath +"' onclick=exec_url('" + filePath +"','" + fname.replace(/ /g, "_") + "');>";
          if (catThumb == null){
            pdf_listing +=  "<img id='" + category.id  + "' src='assets/img/default.jpg' title='" +  fname + "' class='card_image'>";
          }else{
            pdf_listing +=  "<img id='" + category.id  + "' src='" + catThumb + "' title='" +  fname + "' class='card_image'>";
          }

          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(fname) + " (" +  bytesToSize(category.size) + ")" + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"


        }else if(category.mime.indexOf("image") >= 0){

          catThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");
          setLocalStorage(category.id, JSON.stringify(category))
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='image_flip.html?id=" + id + "&name=" + img_name + "&sid=" + category.id + "'>";          
          pdf_listing +=  "<img id='" + category.id  + "' src='" + catThumb + "' title='" +  fname + "' class='card_image'>";          

          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(fname) + " (" +  bytesToSize(category.size) + ")" + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"

        }
        itm_cnt += 1;
        if (cnt == defOrient) {
          div_listing += "<div class='bb-item'>";
          div_listing +=  "<div id='row'>";      
          div_listing +=    "<div class='contaniner listing_container row' id='row_listing'>" + pdf_listing + "</div>";
          div_listing +=  "</div>";
          div_listing += "</div>";

          pdf_listing = '';
          cnt = 0;
        }
        if (itm_cnt === clength && cnt < defOrient){
          div_listing += "<div class='bb-item'>";
          div_listing +=  "<div id='row'>";      
          div_listing +=    "<div class='contaniner listing_container row' id='row_listing'>" + pdf_listing + "</div>";
          div_listing +=  "</div>";
          div_listing += "</div>"; 
        }
        cnt += 1;
      })
    }    
    $("#bb-bookblock").html(div_listing)
    Page.init(orient);
    imageError();
  }else{    
    div_listing += "<div class='bb-item'>"
    div_listing +=  "<div id='row'>"      
    div_listing +=  "<div class='contaniner listing_container row' id='row_listing'></div>"
    div_listing += "</div>"
    div_listing += "</div>"
    $("#bb-bookblock").html(div_listing)    
    $("#prev_btn").hide();
    $("#next_btn").hide();
    if (networkStatus() === 1){
      displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');    
    }  
  }  
}

function showAdndroidCategoryDetailsWithFlip(data){
  var id = getUrlParams();
  var child = data.children;
  var pdf_listing = "";
  var pdf_indicator = "";
  var cnt = 1;
  var itm_cnt = 1;
  if (child == null){
    pdf_listing = "";
    pdf_indicator = "";
  }else{
    $.each(child, function(index, category){      
      if(category.mime.indexOf("image") >= 0){
        console.log("showAdndroidCategoryDetailsWithFlip(data).....");
        pdf_listing += "<div>"
        pdf_listing += "<img src=" + baseUrl + category.thumbnailUrl + ">"
        pdf_listing += "<div class='slider_content'>"
        pdf_listing += "<h2>" + category.name + "</h2>"
        pdf_listing += "</div>";
        pdf_listing += "</div>";
      }
      itm_cnt += 1;
    })
  }
  $(".image_slider").html(pdf_listing);
  $('.image_slider').slick({
          dots: true,
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 20000000,
  });
}

function showCategoryDetailswithFlip(data){
  var id = getUrlParams();
  var img_id = getExtraUrlParams();
  var child = data.children;
  var pdf_listing = "";
  var pdf_indicator = "";
  var cnt = 1;
  var itm_cnt = 1;
  if (child == null){
    pdf_listing = "";
    pdf_indicator = "";
  }else{
    console.log("showCategoryDetailswithFlip(data).....")
    $.each(child, function(index, category){      
      if(category.mime.indexOf("image") >= 0){
        fname = (category.headline == null ? category.name : category.headline);
        catThumb = fileExists(baseUrl, category.thumbnailUrl, category.id, ".jpg");
        if (category.id === img_id){
          $('#blockPosition').val(cnt);
        }
        pdf_listing += "<div class='bb-item'>";        
        pdf_listing += "<a href='#' data='" + category.id + "' alt='" + (fname) + "' ><img src='" + catThumb + "' alt='" + fname+ "'/></a>"
        pdf_listing += "</div>"
        cnt += 1;
      }  
    })
  }
  $("#bb-bookblock").html(pdf_listing);
}

// Function to get user details
function getUserDetail(){
  var user = $.parseJSON(getLocalStorage("currentUser"));
  var fname = '';
  var lname = '';
  var burl = getBaseURL();
  if (user !== 'undefined' && user !== null){
    fname = user.firstName;
    lname = user.lastName;
    imgUrl = user.avatarURL;
    $("#divUserName").html(fname + " " + lname);
    $("#baseUrl").val(burl);
    if (imgUrl !== null){
      $("#imgProfile").prop("src", burl + imgUrl);
    } 
  }  
}

// Function to set the updated user setting to cache.
function setUsersettingDetail(){
  var user = $.parseJSON(localStorage.getItem("currentUser"));
  var pwd = localStorage.getItem("currentUserPwd");
  var fname = '';
  var lname = '';
  var burl = getBaseURL();
  if (user !== 'undefined' && user !== null){
    fname = user.firstName;
    lname = user.lastName;
    email = user.email;
    $("#divUserName").html(fname + " " + lname);
    $("#baseUrl").val(burl);
    $("#username").val(email);
    $("#password").val($.parseJSON(localStorage.currentUserDtl).pass);
    $("#selectViewer").val(localStorage.getItem("viewer"));
  }  
}

function showFavourites(){
  var orient = 'vertical';
  var orientVal = $("#currentOrientation").val();
  var defOrient = 9;
  if(orientVal !== 'undefined'){
    if(orient === 'horizontal'){
      defOrient = 6;
    }
  }    
  var id = getUrlParams();
  var data = $.parseJSON(getLocalStorage(id));
  $("#selectCategoryList").append(getLocalStorage("cacheSelectCategory"));
  if (typeof data !== 'undefined' && data !== null){
    console.log("showFavourites() cache......");    
    var clength = data.length;
    var pdf_listing = "";
    var div_listing = "";
    var cnt = 1;
    var tmp_cnt = 1;
    var itm_cnt = 0;
    var cat_name = "";
    var catThumbnail = "";
    var size = "";
    var fname = '';
      $.each(data, function(index, category){
        fname = (category.headline == null ? category.name : category.headline)   
        catThumb = $.parseJSON(getLocalStorage(category.id)); //$.parseJSON(getLocalStorage(category.name));
        if (category.size == 0){
          size = bytesToSize(catThumb.size);
        }else{
          size = category.size;
        }
        if (category.type === 'PDF'){

            catThumbnail = fileExists(baseUrl, catThumb.thumbnailUrl, category.id, ".jpg");
                     
            pdfPath = "/app/alfrscosvg/auth2/PDFDownload?id=" + category.id
            if (getLocalStorage("PDF_"+category.id) == null){
              filePath = baseUrl + pdfPath;
            } else {
              //filePath = "file:///" + getLocalStorage("PDF_" + category.id);
              filePath = checkForPdfExists(baseUrl, pdfPath, category.id, ".pdf")
            }
          
            pdf_listing += "<div class='card_container'>"
            pdf_listing += "<a href='#' data-url='"+ filePath +"' onclick=exec_url('" + filePath +"','" + fname.replace(/ /g, "_") + "');>";

            if (catThumb == null){
              pdf_listing +=  "<img src='" + baseUrl + "/app/alfrscosvg/auth2/Thumbnail?id=" + category.id + "' title ='" + fname + "' class='card_image'>";              
            }else{
              pdf_listing +=  "<img id='" + category.id  + "' src='" + catThumbnail + "' title='" +  fname + "' class='card_image'>";
            }        
            
            pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(fname) + " (" +  size + ")" + "</div>";
            pdf_listing += "</a>"
            pdf_listing += "</div>"
        }else if(category.type === 'IMG'){

            catThumbnail = fileExists(baseUrl, catThumb.thumbnailUrl, category.id, ".jpg");

            pdf_listing += "<div class='card_container'>"
            pdf_listing += "<a href=" + category.url + ">";

            if (catThumb == null){
              pdf_listing +=  "<img src='" + baseUrl + "/app/alfrscosvg/auth2/Thumbnail?id=" + category.id + "' title ='" + fname + "' class='card_image'>";              
            }else{
              pdf_listing +=  "<img id='" + category.id  + "' src='" + catThumbnail + "' title='" +  fname + "' class='card_image'>";
            }
            pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(fname) + " (" +  size + ")" + "</div>";
            pdf_listing += "</a>"
            pdf_listing += "</div>"
        }else if(category .type === 'LIST'){
            cat_name = "Gallery";

            catThumbnail = fileExists(baseUrl, catThumb.thumbnailUrl, category.id, ".jpg");
            pdf_listing += "<div class='card_container'>"
            pdf_listing += "<a href=" + category.url + ">";

            if (catThumb == null){
              pdf_listing +=  "<img src='assets/img/th" + tmp_cnt + ".jpg' class='card_image'>";
            }else{
              pdf_listing +=  "<img id='" + category.id  + "' src='" + catThumbnail + "' title='" +  trimDocumentname(category.name) + "' class='card_image'>";
            }            
            
            pdf_listing +=  "<div class='card_title_list'>Gallery</div>";
            pdf_listing += "</a>"
            pdf_listing += "</div>"
        }
        //if(tmp_cnt==1){
        //  nav_listing += "<span class='bb-current'></span>"; 
        //}else{
        //  nav_listing += "<span></span>";
        //}
        itm_cnt += 1;

        if (cnt == defOrient) {
          div_listing += "<div class='bb-item'>";
          div_listing +=  "<div id='row'>";      
          div_listing +=    "<div class='contaniner listing_container row' id='row_listing'>" + pdf_listing + "</div>";
          div_listing +=  "</div>";
          div_listing += "</div>";

          pdf_listing = '';
          cnt = 0;
        }
        if (itm_cnt === clength && cnt < defOrient){
          div_listing += "<div class='bb-item'>";
          div_listing +=  "<div id='row'>";      
          div_listing +=    "<div class='contaniner listing_container row' id='row_listing'>" + pdf_listing + "</div>";
          div_listing +=  "</div>";
          div_listing += "</div>"; 
        }
        cnt += 1;
      })
    $("#bb-bookblock").html(div_listing);
    Page.init(orient);
    //imageError();
  }else{
    div_listing += "<div class='bb-item'>";
    div_listing +=  "<div id='row'>";      
    div_listing +=  "<div class='contaniner listing_container row' id='row_listing'></div>";
    div_listing += "</div>";
    div_listing += "</div>";
    $("#bb-bookblock").html(div_listing);    
    $("#prev_btn").hide();
    $("#next_btn").hide();
    //if (networkStatus() === 1){
    //  displayError("Unable to fetch data, please try logging out and logging back in.", 'Error'); 
    //}   
  }  
}


// Function to show the favourites and readlater list
function showFavouritesOld(){
  var id = getUrlParams();
  var data = $.parseJSON(getLocalStorage(id));
  $("#selectCategoryList").append(getLocalStorage("cacheSelectCategory"));
  if (typeof data !== 'undefined' && data !== null){
    console.log("showFavourites() cache......");    
    var clength = data.length;
    var pdf_listing = "";
    var div_listing = "";
    var cnt = 1;
    var tmp_cnt = 1;
    var itm_cnt = 0;
    var cat_name = "";
      $.each(data, function(index, category){ 
          catThumb = $.parseJSON(getLocalStorage(category.name));
          if (category.type === 'PDF'){
            pdf_listing += "<div class='card_container'>"
            pdf_listing += "<a href=" + category.url + ">";

            if (catThumb == null){
              pdf_listing +=  "<img src='" + baseUrl + "/app/alfrscosvg/auth2/Thumbnail?id=" + category.id + "' title ='" + category.name + "' class='card_image'>";              
            }else{
              //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseUrl + (typeof catThumb.thumbnailUrl === 'undefined' ? category.thumbnailUrl : catThumb.thumbnailUrl) + "' title='" +  category.name + "' class='card_image'>";
              pdf_listing +=  "<img id='" + category.id  + "' src='" + baseUrl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
            }        
            
            pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + " (" +  bytesToSize(category.size) + ")" + "</div>";
            pdf_listing += "</a>"
            pdf_listing += "</div>"
          }else if(category.type === 'IMG'){
            pdf_listing += "<div class='card_container'>"
            pdf_listing += "<a href=" + category.url + ">";

            if (catThumb == null){
              pdf_listing +=  "<img src='" + baseUrl + "/app/alfrscosvg/auth2/Thumbnail?id=" + category.id + "' title ='" + category.name + "' class='card_image'>";              
            }else{
              //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseUrl + (typeof catThumb.thumbnailUrl === 'undefined' ? category.thumbnailUrl : catThumb.thumbnailUrl) + "' title='" +  category.name + "' class='card_image'>";
              pdf_listing +=  "<img id='" + category.id  + "' src='" + baseUrl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
            }

            //pdf_listing +=  "<img src='" + baseUrl + "/app/alfrscosvg/auth/Thumbnail?id=" + category.id + "' title ='" + category.name + "' class='card_image'>";
            //pdf_listing +=  "<img src='assets/img/th" + tmp_cnt + ".jpg' class='card_image'>";
            pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + " (" +  bytesToSize(category.size) + ")" + "</div>";
            pdf_listing += "</a>"
            pdf_listing += "</div>"
          }else if(category .type === 'LIST'){
            cat_name = "Gallery";
            pdf_listing += "<div class='card_container'>"
            pdf_listing += "<a href=" + category.url + ">";

            if (catThumb == null){
              pdf_listing +=  "<img src='assets/img/th" + tmp_cnt + ".jpg' class='card_image'>";
            }else{
              //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseUrl + (typeof catThumb.thumbnailUrl === 'undefined' ? category.thumbnailUrl : catThumb.thumbnailUrl) + "' title='" +  category.name + "' class='card_image'>";
              pdf_listing +=  "<img id='" + category.id  + "' src='" + baseUrl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
            }            
            
            pdf_listing +=  "<div class='card_title_list'>Gallery</div>";
            pdf_listing += "</a>"
            pdf_listing += "</div>"
          }
          itm_cnt += 1;
          tmp_cnt += 1;
          if (tmp_cnt == 3){
            tmp_cnt = 1;
          }
          if (cnt == 6) {
            if(itm_cnt < 7){
              div_listing += "<div class='item active'>"  
            }else{  
              div_listing += "<div class='item'>"
            }
            div_listing += "<div id='row'>"      
            div_listing += "<div class='contaniner listing_container row' id='row_listing'>" + pdf_listing + "</div>"
            div_listing += "</div></div>"
            pdf_listing = '';
            cnt = 0;
          }
          if (itm_cnt === clength && cnt < 6){
            if(clength < 6){
              div_listing += "<div class='item active'>"  
            }else{  
              div_listing += "<div class='item'>"
            }
            div_listing += "<div id='row'>"      
            div_listing += "<div class='contaniner listing_container row' id='row_listing'>" + pdf_listing + "</div>"
            div_listing += "</div></div>"
          }
          cnt += 1;
      })

    $(".carousel-inner").html(div_listing);
    imageError();
    if (clength < 7){
      $("#leftSlide").hide();
      $("#rightSlide").hide();
    }
  }else{
    div_listing += "<div class='item'>"
    div_listing += "<div id='row'>"      
    div_listing += "<div class='contaniner listing_container row' id='row_listing'></div>"
    div_listing += "</div></div>"
    $(".carousel-inner").html(div_listing);
    $("#leftSlide").hide();
    $("#rightSlide").hide();
    if (id === "readLater"){
      displayError("No documents found for read later.", '');
    }else if (id === "readFav"){
      displayError("No favourites list found.", '');
    }  
  }  
}



// ********************************************************************
// Below functions are not being used currently, but can be used later

function getPDFfile(){
  var pdf_id = getUrlParams(); 
      //var cachedCatDtl = localStorage.getItem(id);
      //if (typeof cachedCatDtl !== 'undefined' && cachedCatDtl !== null){
      //  alert(cachedCatDtl);
      //  showCategoryDetails(cachedCatDtl)
      //  $("#selectCategoryList").append(localStorage.getItem("cacheSelectCategory"));        
      //}
      //else{
        jQuery.support.cors = true;
         /* $(function (){
            console.log("Button clicked");
            $.ajax({
              url: "http://ec2-54-69-156-225.us-west-2.compute.amazonaws.com:8080/app/alfrscosvg/auth/PDFStreamServlet?id=" + pdf_id,
              dataType: "json",
              xhrFields: {
                  'withCredentials': true
              },
              crossDomain: true,
              cache: true,
              beforeSend: function( xhr ) {
                $(".spinner").show();
              },
              success: function(data, textStatus) {
                $("#viewer").html(data)
                $("#selectCategoryList").append(localStorage.getItem("cacheSelectCategory"));
                $(".spinner").hide();
              },
              error: function (responseData, textStatus, errorThrown) {
                  console.log('Ajax Request failed. ' + errorThrown);
              }
            });

          }
        )*/
        $("#viewer").load("http://ec2-54-69-156-225.us-west-2.compute.amazonaws.com:8080/app/alfrscosvg/auth2/PDFStreamServlet?id=" + pdf_id);
      //}  
}