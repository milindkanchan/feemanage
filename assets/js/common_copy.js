var baseUrl = '';
$(document).ready(function (){
  baseurl = getBaseURL();
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

function trimDocumentname(docName)
{
  //alert(docName);
  if (docName.length > 15){
    var name = docName.replace(/%20/g, ' ');
    var nname = name.substr(0, 15);
    return nname + "..."
  }else{
    return docName.replace(/%20/g, ' ');
  }

}

/* ------ Category List realted functions -------- */

function callCategoryList(cached){
  if (networkStatus() === 1){
    console.log("callCategoryList()....");
    jQuery.support.cors = true;
      $(function (){
        $.ajax({
          url: baseurl + "/app/alfrscosvg/auth2/services/rest/category/list/",
          dataType: "json",
          xhrFields: {
              'withCredentials': true
          },
          crossDomain: true,
          cache: true,
          success: function(data, textStatus) {
            //$.cookie('authenticated', false);
            localStorage.cachedCategoryList =  JSON.stringify(data);
            //call the below function for the first time whenlocalStorage is null
            if (cached === false){
              setSystemCategoryImage($.parseJSON(localStorage.getItem("cachedCategoryList")));
              setCategoryList($.parseJSON(localStorage.getItem("cachedCategoryList")), false);              
            }  
          },
          error: function (responseData, textStatus, errorThrown) {
              displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
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
          localStorage.setItem("SystemId", category.id);
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
                url: baseurl + "/app/alfrscosvg/auth2/services/rest/category/list/?id=" + id,
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
                  localStorage.setItem("cacheCategoryImage", JSON.stringify(data));
                  setCategoryImageThumbnail(data)
                },
                error: function (responseData, textStatus, errorThrown) {
                  displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
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
        localStorage.setItem(catName, JSON.stringify(category));
      })    
    }
}

function getCategoryList(){
  if (localStorage.cachedCategoryList){
    console.log("getCategoryList() from cache...");
    var cachedCatList = $.parseJSON(localStorage.cachedCategoryList);
    setSystemCategoryImage(cachedCatList, true);
    setCategoryList(cachedCatList);
    callCategoryList(true);
    getCategoryImageThumbnail(localStorage.SystemId);
  }
  else{
    console.log("getCategoryList() from server...");
    callCategoryList(false);
  }    
}

function setCategoryList(responseData){
  if (responseData !== null){
    console.log("setCategoryList(responseData).....");
    var value = responseData;
    var child = value.children;
    var listItems = "";
    var cat_listing = "";
    var cnt = 1
    var news_id;
    var catThumb;
    if (child !== null){ 
      $.each(child, function(index, category){
        if (category.name !== 'Systems'){

          catThumb = getThumbnailFromSystem(category.name);

          listItems   +=  "<option value='listing.html?id=" + category.id + "'>" + category.name + "</option>";     
          cat_listing +=  "<div class='col-md-4 col-sm-6 col-xs-6 card_container home_card_container'>"
          cat_listing +=  "<a class='home_card' href='listing.html?id=" + category.id + "'>";

          if (catThumb === null){
            cat_listing +=  "<img src='assets/img/th" + cnt + ".jpg' class='card_image'>"
          }else{
            cat_listing +=  "<img src='" + baseurl + catThumb + "' class='card_image'>"
          }

          cat_listing +=  "<div class='card_title'>" + (category.title == null ? category.name : category.title) + "</div></a></a></div>"
          if (cnt == 3) {
            cnt = 0;
          }
          cnt += 1;
          if (category.name == "News"){
            var cat_id = category.id;
            localStorage.setItem("newsID", cat_id);
            news_id = category.id;
          }
        }else{
          localStorage.setItem("cacheSystemCategory", JSON.stringify(category));
        }  
      })
      localStorage.setItem("cacheSelectCategory", listItems);
      if (news_id != null){
        getNewsDetails(news_id);
      }
      $("#selectCategoryList").append(listItems);
      $("#divCategory").html(cat_listing);     
    }  
  }else{
    displayError("Unable to fetch data,  please try logging out and logging back in.", 'Error');
    //window.location.href = "index.html";
  }
}

/* ------ News List realted functions -------- */

function getNewsList(id, cached){
  if (networkStatus() === 1){
    jQuery.support.cors = true;
      $(function (){      
        $.ajax({
                url: baseurl + "/app/alfrscosvg/auth2/services/rest/category/list/?id=" + id,
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
                  localStorage.setItem("cacheNewsDtl", JSON.stringify(data));
                  if (cached === false){
                    showHomeNews($.parseJSON(localStorage.getItem("cacheNewsDtl")));
                  }                
                },
                error: function (responseData, textStatus, errorThrown) {
                  displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
                //console.log('Ajax Request failed. ' + errorThrown);
                }
      });
    });
  }
}

function showNews(){
  var news_id = localStorage.getItem("newsID");
  if(news_id === null){
    $("#linkNews").hide();
  }else{
    $("#linkNews").show();    
  } 
}

function getNewsDetails(){
  var newsDtl = localStorage.getItem("newsID");
  if (newsDtl !== null){
    var cacheNewsDtl = $.parseJSON(localStorage.getItem("cacheNewsDtl"));
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
    if (child !== null){
      $.each(child, function(index, category){
        console.log(category)
        if(category.mime.indexOf("pdf") > 0){
          tnail = "assets/img/home_img_" + cnt + ".jpg";
          news_listing += "<div>";
          news_listing +=  "<img href='assets/js/pdf_js/web/viewer.html?id=" + category.id + "&name=" + category.name + "' src='" + tnail + "' max-height='600px' max-width='1014px'>";
          //}          
          news_listing +=     "<div class='slider_content'>";
          news_listing +=       "<h1>News</h1>";
          news_listing +=       "<h2>" + category.headline + "</h2>";
          //if (deviceStatus === 1){
          //  news_listing +=       "<a href='android_pdf_flip.html?id=" + category.id + "&name=" + category.name + "' class='btn jlt_btn read_more_btn'>Read More</a>";
          //}else{
            news_listing +=       "<a href='assets/js/pdf_js/web/viewer.html?id=" + category.id + "&name=" + category.name + "' class='btn jlt_btn read_more_btn'>Read More</a>";            
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
      var cachedCatDtl = $.parseJSON(localStorage.getItem(id));
      if (cachedCatDtl == undefined || cachedCatDtl == null){
        getList(id);
      }
      else{
        console.log("getCategoryDetails() cache......");
        if(window.location.href.indexOf("android") > 0){  
          showAdndroidCategoryDetailsWithFlip(cachedCatDtl);          
        }else if(window.location.href.indexOf("image_flip.html?id=") > 0){
          showCategoryDetailswithFlip(cachedCatDtl);
        }else{
          showCategoryDetails(cachedCatDtl);          
        }   
        $("#selectCategoryList").append(localStorage.getItem("cacheSelectCategory"));
        if (networkStatus() === 1){
          jQuery.support.cors = true;
          $(function (){
            console.log("getCategoryDetails() server......");
            $.ajax({
                url: baseurl + "/app/alfrscosvg/auth2/services/rest/category/list/?id=" + id,
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
                  localStorage.setItem(id, JSON.stringify(data));
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
          url: baseurl + "/app/alfrscosvg/auth2/services/rest/category/list/?id=" + id,
          dataType: "json",
          xhrFields: {
              'withCredentials': true
          },
          crossDomain: true,
          cache: true,
          success: function(data, textStatus) {
            localStorage.setItem(id, JSON.stringify(data));
            if(window.location.href.indexOf("android") > 0){
              showAdndroidCategoryDetailsWithFlip(data);  
            }else if(window.location.href.indexOf("image_flip.html?id=") > 0){
              showCategoryDetailswithFlip(data);
            }else{
              showCategoryDetails(data);
            }                
            $("#selectCategoryList").append(localStorage.getItem("cacheSelectCategory"));
          },
          error: function (responseData, textStatus, errorThrown) {
              console.log('Ajax Request failed. ' + errorThrown);
              displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
              //window.location.href = "home.html";
          }
      });
    });
  }
}

function isOdd(num) { return num % 2;}

function showCategoryDetails(data){
  if (data !== null){
    var id = getUrlParams();
    var img_name = getUrlNameParams();
    var child = data.children;
    var pdf_listing = "";
    var div_listing = "";
    var cnt = 1;
    var tmp_cnt = 1;
    var itm_cnt = 0;
    var cat_ids = [];
    var cat_urls = [];
    var catThumb = '';
    if (child == null){
      pdf_listing = "";
    }else{
      var clength = child.length;
      $.each(child, function(index, category){        
        if(category.mime === null){

          catThumb = getThumbnailFromSystem(category.name);
          
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='listing.html?id=" + category.id + "&name=" + category.name + "'>";
          if (catThumb == null){
            pdf_listing +=  "<img id='defaultImg" + tmp_cnt  + "' src='assets/img/th" + tmp_cnt + ".jpg' title='" +  category.name + "' class='card_image'>";
          }else{
            pdf_listing +=  "<img id='defaultImg" + tmp_cnt  + "' src=' " + baseurl + catThumb + "' title='" +  category.name + "' class='card_image'>";
            //pdf_listing +=  "<img id='defaultImg" + tmp_cnt  + "' src=' " + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
          }
          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"

        }else if(category.mime.indexOf("pdf") >= 0){

          fileExists(baseurl + "/app/alfrscosvg/auth2/PDFDownload?id=", category.id, ".pdf");
          catThumb = getThumbnailFromSystem(category.id);
          //catThumb = $.parseJSON(localStorage.getItem(category.id));

          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='pdf_flip.html?id=" + category.id + "&name=" + category.name + "'>";
          if (catThumb == null){
            pdf_listing +=  "<img id='" + category.id  + "' src='assets/img/th" + tmp_cnt + ".jpg' title='" +  category.name + "' class='card_image'>";
          }else{
            pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + catThumb + "' title='" +  category.name + "' class='card_image'>";
            //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";            
          }
          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + " (" +  bytesToSize(category.size) + ")" + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"

        }else if(category.mime.indexOf("image") >= 0){

          // Check for files existence 
          fileExists(baseurl + "app/alfrscosvg/auth2/ItemStream/id/", category.id, ".jpeg");
          catThumb = getThumbnailFromSystem(category.id);

          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='image_flip.html?id=" + id + "&name=" + img_name + "&sid=" + category.id + "'>";
          
          if (catThumb == null){
            pdf_listing +=  "<img id='" + category.id  + "' src='assets/img/th" + tmp_cnt + ".jpg' title='" +  category.name + "' class='card_image'>";
          }else{
            pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + catThumb + "' title='" +  category.name + "' class='card_image'>";
            //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
          }

          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + " (" +  bytesToSize(category.size) + ")" + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"

        }
        itm_cnt += 1;
        tmp_cnt += 1;
        if (tmp_cnt == 3){
          tmp_cnt = 1;
        }
        if (cnt == 8) {
          if(itm_cnt < 10){
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
        if (itm_cnt === clength && cnt < 8){
          if(clength < 8){
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
    }
    $(".carousel-inner").html(div_listing);
    if (clength < 9){
      $("#leftSlide").hide();
      $("#rightSlide").hide();
    }
  }else{
    div_listing += "<div class='item'>"
    div_listing +=  "<div id='row'>"      
    div_listing +=  "<div class='contaniner listing_container row' id='row_listing'></div>"
    div_listing += "</div></div>"
    $(".carousel-inner").html(div_listing);    
    $("#leftSlide").hide();
    $("#rightSlide").hide();
    displayError("Unable to fetch data, please try logging out and logging back in.", 'Error');
    //window.location.href = "home.html";    
  }  
}


/* ------ Search  realted functions -------- */

function showCategorySearchDetails(data){
  if (data !== null){
    var child = $.parseJSON(data);
    var pdf_listing = "";
    var div_listing = "";
    var cnt = 1;
    var tmp_cnt = 1;
    var itm_cnt = 0;
    var catThumb = '';
    if (child == null){
      pdf_listing = "";
    }else{
      var clength = child.length;
      console.log("showCategorySearchDetails(data).....");
      $.each(child, function(index, category){
        if(category.mime === null){
          catThumb = getThumbnailFromSystem(category.name);
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='listing.html?id=" + category.id + "&name=" + category.name + "'>";
          
          if (catThumb == null){
            pdf_listing +=  "<img id='defaultImg" + tmp_cnt  + "' src='assets/img/th" + tmp_cnt + ".jpg' title='" +  category.name + "' class='card_image'>";
          }else{
            pdf_listing +=  "<img id='defaultImg" + tmp_cnt  + "' src=' " + baseurl + catThumb + "' title='" +  category.name + "' class='card_image'>";
            //pdf_listing +=  "<img id='defaultImg" + tmp_cnt  + "' src=' " + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
          }

          pdf_listing +=  "<div class='card_title'_list>" + trimDocumentname(category.title == null ? category.name : category.title) + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"
        }else if(category.mime.indexOf("pdf") >= 0){ 
          catThumb = getThumbnailFromSystem(category.id);
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='pdf_flip.html?id=" + category.id + "&name=" + category.name + "'>";

          if (catThumb == null){
            pdf_listing +=  "<img id='" + category.id  + "' src='assets/img/th" + tmp_cnt + ".jpg' title='" +  category.name + "' class='card_image'>";
          }else{
            pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + catThumb + "' title='" +  category.name + "' class='card_image'>";
            //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
          }

          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + " (" +  bytesToSize(category.size) + ")" + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"
        }else if(category.mime.indexOf("image") >= 0){
          catThumb = getThumbnailFromSystem(category.id);
          pdf_listing += "<div class='card_container'>"
          pdf_listing += "<a href='image_flip.html?id=" + id + "&name=" + img_name + "&sid=" + category.id + "'>";
          
          if (catThumb == null){
            pdf_listing +=  "<img id='" + category.id  + "' src='assets/img/th" + tmp_cnt + ".jpg' title='" +  category.name + "' class='card_image'>";
          }else{
            pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + catThumb + "' title='" +  category.name + "' class='card_image'>";
            //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
          }
          
          pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + " (" +  bytesToSize(category.size) + ")" + "</div>";
          pdf_listing += "</a>"
          pdf_listing += "</div>"
        }
        itm_cnt += 1;
        tmp_cnt += 1;
        if (tmp_cnt == 3){
          tmp_cnt = 1;
        }
        if (cnt == 8) {
          if(itm_cnt < 10){
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
        if (itm_cnt === clength && cnt < 8){
          if(clength < 8){
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
    }
    $(".carousel-inner").html(div_listing);
    if (clength < 9){
      $("#leftSlide").hide();
      $("#rightSlide").hide();
    }
  }else{
    div_listing += "<div class='item'>"
    div_listing +=  "<div id='row'>"      
    div_listing +=  "<div class='contaniner listing_container row' id='row_listing'></div>"
    div_listing += "</div></div>"
    $(".carousel-inner").html(div_listing);    
    $("#leftSlide").hide();
    $("#rightSlide").hide();
    displayError("No search result found.", '');
    //window.location.href = "index.html";    
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
        //if (itm_cnt === 1){
        //  pdf_listing += "<div class='item active'>";
        //}else{
        //  pdf_listing += "<div class='item'>";
        //}
        pdf_listing += "<div>"
        //pdf_listing += "<a href='image_flip.html?id=" + category.id + "&name=" + category.name + "'>";
        //pdf_listing += "<a href='#'>";
        //pdf_listing += "<div class='fill' style='background-image:url(" + baseurl + category.thumbnailUrl + ");'></div>";
        pdf_listing += "<img src=" + baseurl + category.thumbnailUrl + ">"
        //pdf_listing += "</a>";
        //pdf_listing += "<div class='carousel-caption'><h2>" + category.name + "</h2></div>";
        pdf_listing += "<div class='slider_content'>"
        pdf_listing += "<h2>" + category.name + "</h2>"
        pdf_listing += "</div>";
        pdf_listing += "</div>";
      }
      //if (itm_cnt === 1){
      //  pdf_indicator += "<li data-target='#myCarousel' data-slide-to='" + itm_cnt + "' class='active'></li>";
      //}else{
      //  pdf_indicator += "<li data-target='#myCarousel' data-slide-to='" + itm_cnt + "'></li>";
      //}     
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
  //$(".carousel-indicators").html(pdf_indicator)
  //$(".carousel-inner").html(pdf_listing)
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
        if (category.id === img_id){
          $('#blockPosition').val(cnt);
        }
        pdf_listing += "<div class='bb-item'>";        
        pdf_listing += "<a href='#' data='" + category.id + "' alt='" + (category.title == null ? category.name : category.title) + "' ><img src='" + baseurl + category.thumbnailUrl + "' alt='" + category.name + "'/></a>"
        pdf_listing += "</div>"
        cnt += 1;
      }  
    })
  }
  $("#bb-bookblock").html(pdf_listing)
}

// Function to get user details
function getUserDetail(){
  var user = $.parseJSON(localStorage.getItem("currentUser"));
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
    $("#password").val(pwd)
  }  
}


// Function to show the favourites and readlater list
function showFavourites(){
  var id = getUrlParams();
  var data = $.parseJSON(localStorage.getItem(id));
  $("#selectCategoryList").append(localStorage.getItem("cacheSelectCategory"));
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
          catThumb = $.parseJSON(localStorage.getItem(category.name));
          if (category.type === 'PDF'){
            pdf_listing += "<div class='card_container'>"
            pdf_listing += "<a href=" + category.url + ">";

            if (catThumb == null){
              pdf_listing +=  "<img src='" + baseurl + "/app/alfrscosvg/auth2/Thumbnail?id=" + category.id + "' title ='" + category.name + "' class='card_image'>";              
            }else{
              //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + (typeof catThumb.thumbnailUrl === 'undefined' ? category.thumbnailUrl : catThumb.thumbnailUrl) + "' title='" +  category.name + "' class='card_image'>";
              pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
            }        
            
            pdf_listing +=  "<div class='card_title_list'>" + trimDocumentname(category.title == null ? category.name : category.title) + " (" +  bytesToSize(category.size) + ")" + "</div>";
            pdf_listing += "</a>"
            pdf_listing += "</div>"
          }else if(category.type === 'IMG'){
            pdf_listing += "<div class='card_container'>"
            pdf_listing += "<a href=" + category.url + ">";

            if (catThumb == null){
              pdf_listing +=  "<img src='" + baseurl + "/app/alfrscosvg/auth2/Thumbnail?id=" + category.id + "' title ='" + category.name + "' class='card_image'>";              
            }else{
              //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + (typeof catThumb.thumbnailUrl === 'undefined' ? category.thumbnailUrl : catThumb.thumbnailUrl) + "' title='" +  category.name + "' class='card_image'>";
              pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
            }

            //pdf_listing +=  "<img src='" + baseurl + "/app/alfrscosvg/auth/Thumbnail?id=" + category.id + "' title ='" + category.name + "' class='card_image'>";
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
              //pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + (typeof catThumb.thumbnailUrl === 'undefined' ? category.thumbnailUrl : catThumb.thumbnailUrl) + "' title='" +  category.name + "' class='card_image'>";
              pdf_listing +=  "<img id='" + category.id  + "' src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
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
          if (cnt == 8) {
            if(itm_cnt < 10){
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
          if (itm_cnt === clength && cnt < 8){
            if(clength < 8){
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
    if (clength < 9){
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

function imageRender()
{
  var baseurl = getBaseURL();   
  var pdf_id = getUrlParams(); 
  var isurl = baseurl + "/app/alfrscosvg/auth2/ItemStream?id=" + pdf_id;
  jQuery.support.cors = true;
  $.ajax({
    url: isurl,
    dataType: "json",
    xhrFields: {
      'withCredentials': true
    },
    crossDomain: true,
    cache: true,
    success: function(data, textStatus){
      //getImageUi(data, baseurl);
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log('Ajax Request failed. ' + errorThrown);
    }
  });
}

function showCategoryDetails_orig(data){
  var id = getUrlParams();
  var child = data.children;
  var pdf_listing = "";
  var cnt = 1;

  if (child == null){
    pdf_listing = "";
  }else{
    $.each(child, function(index, category){
      if(category.mime === null){
        pdf_listing += "div class='col-md-4 col-sm-6 col-xs-6 card_container home_card_container'>"
        pdf_listing += "<a class='home_card' href='listing.html?id=" + category.id + "'>";
        pdf_listing +=  "<img src='assets/img/th" + cnt + ".jpg' title='" +  category.name + "' class='card_image'>";
        pdf_listing +=  "<div class='card_title'>" + category.name + "</div>";
        pdf_listing += "</a>"
        pdf_listing += "</div>"
      }else if(category.mime.indexOf("pdf") >= 0){
        pdf_listing += "div class='col-md-4 col-sm-6 col-xs-6 card_container home_card_container'>"
        pdf_listing += "<a class='home_card' href='pdf_flip.html?id=" + category.id + "'>";
        pdf_listing +=  "<img src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
        pdf_listing +=  "<div class='card_title'>" + category.name + "</div>";
        pdf_listing += "</a>"
        pdf_listing += "</div>"
      }else if(category.mime.indexOf("image") >= 0){
        pdf_listing += "div class='col-md-4 col-sm-6 col-xs-6 card_container home_card_container'>"
        pdf_listing += "<a class='home_card' href='image_flip.html?id=" + category.id + "'>";
        pdf_listing +=  "<img src='" + baseurl + category.thumbnailUrl + "' title='" +  category.name + "' class='card_image'>";
        pdf_listing +=  "<div class='card_title'>" + category.name + "</div>";
        pdf_listing += "</a>"
        pdf_listing += "</div>"
      }
      if (cnt == 3) {
        pdf_listing += "<div>" + pdf_listing + "</div>"
        cnt = 0;
      }
      cnt += 1;
    })
  }
  $("#row_listing").html(pdf_listing)
}
