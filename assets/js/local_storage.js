    function saveDocumentToLocal(cat_ids, cat_urls){
    // Get a reference to the image element
    var storageFiles = ''
    var img_id, storageFilesDate, date, todaysDate, cat_id;
    var obj = [];

    storageFiles = JSON.parse(getLocalStorage("storageFiles")) || {}
    if (typeof storageFiles === "undefined" || storageFiles == null || jQuery.isEmptyObject(storageFiles)) {
        console.log("Store images in locastorage.....")
        for (var i = 0; i < cat_ids.length; i++){
            img_id = document.getElementById(cat_ids[i]);
            storageFilesDate = storageFiles.date;
            date = new Date();
            todaysDate = (date.getMonth() + 1).toString() + date.getDate().toString();

            img_id.addEventListener("load", function(){
                var imgCanvas = document.createElement("canvas"),
                imgContext = imgCanvas.getContext("2d"); 

                // Make sure canvas is as big as the picture
                imgCanvas.width = img_id.width;
                imgCanvas.height = img_id.height;

                // Draw image into canvas element
                imgContext.drawImage(img_id, 0, 0, img_id.width, img_id.height);
                
                // Get canvas contents as a data URL
                storageFiles.img_id = imgCanvas.toDataURL("assets/img/png");

                // Set date for localStorage
                storageFiles.date = todaysDate;

                // Set category_id for localStorage
                storageFiles.cat_id = this.id;

                try {
                    var test = $.parseJSON(getLocalStorage("storageFiles"));
                    if(typeof test !== 'undefined' && test !== null){
                        obj = test;       
                    }
                    console.log(storageFiles.img_id + " === " + this.id)                    
                    obj.push(storageFiles);
                    localStorage.setItem("storageFiles", JSON.stringify(obj));
                }
                catch (e) {
                    console.log("Storage failed: " + e);
                }            

            }, false);
            img_id.setAttribute("src", cat_urls[i]);
        } //For Loop end
    }else{            
        console.log("Use images from locastorage......")
        $.each(storageFiles, function(index, category){
            console.log(category);
            img_id = document.getElementById(category.cat_id);
            img_id.setAttribute("src", category.img_id);
        });
    }
}


/*function downloadFileOrig(baseUrl, thumbUrl, pdf_id, ext) {
    try{
        console.log("Initiating download process for...... " + pdf_id); 
        var key = pdf_id;
        var preTag = '';
        if(ext === ".pdf"){
            preTag = "PDF_" + key; 
        }else if(ext === ".jpg"){
            preTag = "JPG_" + key;
        }
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(baseUrl+thumbUrl);
        pdf_id = pdf_id.split(";")[0];
        var fileURL = cordova.file.dataDirectory + pdf_id + ext; 
        fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
            console.log("download complete: " + entry.toURL());
            setLocalStorage(preTag, entry.toURL().replace("file:///", ""));
        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code " + error.code);
        },false);
    }catch(e){
        console.log("Exception in downloadFile..." + e);
    }
}*/

/*function fileExistsOrig(baseUrl, thumbUrl, pdf_id, ext){
    //Added the condition incase thumbnailurl is null  
    if(thumbUrl === null){
        return "assets/img/default.jpg";
    }
    var preTag = ''
    if(ext === ".pdf"){
        preTag = "PDF_" + pdf_id; 
    }else if(ext === ".jpg"){
        preTag = "JPG_" + pdf_id;
    }    
    if (getLocalStorage(preTag) == null){
        downloadFile(baseUrl, thumbUrl, pdf_id, ext);
        return (baseUrl+thumbUrl);
    }else{
        return "file:///" + getLocalStorage(preTag);
    }    
}*/

function setLocalStorage(key, data){
    localStorage.setItem(key, data);
}

function getLocalStorage(key){
    return localStorage.getItem(key);
}

function getOldApplicationID(appStrArr){
    var app_id = '';
    for(i=0; i < appStrArr.length; i++){
        if(appStrArr[i]=="Applications"){
            app_id = appStrArr[i+1];
            break
        }
    }
    return app_id
}

function replaceNewAppIdWithOld(path, key){
    var app_id = getLocalStorage("ApplicationID");
    if (path.indexOf(app_id) < 0 ){
        var appStrArr = path.split("/");
        var oldapp_id = getOldApplicationID(appStrArr);
        var newPath = path.replace(oldapp_id, app_id)
        setLocalStorage(key, newPath);
    }
    return getLocalStorage(key);
}

function getPreTag(pdf_id, ext){
    var preTag = ''
    if(ext === ".pdf"){
        preTag = "PDF_" + pdf_id; 
    }else if(ext === ".jpg"){
        preTag = "JPG_" + pdf_id;
    }
    return preTag 
}

function fileExists(baseUrl, thumbUrl, pdf_id, ext){
    //Added the condition incase thumbnailurl is null
    if(thumbUrl === null){
        return "assets/img/default.jpg";
    }
    var preTag = getPreTag(pdf_id, ext);

    if (getLocalStorage(preTag) == null){
        downloadFile(baseUrl, thumbUrl, pdf_id, ext);
        return (baseUrl+thumbUrl);
    }else{
        var tmpFileUrl = getLocalStorage(preTag);
        var filePath = ''
        if(tmpFileUrl.indexOf("contentUrl") > 0){
            filePath =  (baseUrl+thumbUrl);
        }else{
            filePath = "file:///" + replaceNewAppIdWithOld(tmpFileUrl, preTag);
        }
        return filePath;
    }   
}

function checkForPdfExists(baseUrl, pdfUrl, pdf_id, ext){    
    var preTag = getPreTag(pdf_id, ext);
    var tmpFileUrl = getLocalStorage(preTag);
    var filePath = '';
    if(tmpFileUrl.indexOf("contentUrl") > 0 ){
        filePath = (baseUrl+pdfUrl);
    }else{
        filePath = "file:///" + replaceNewAppIdWithOld(tmpFileUrl, preTag);   
    }
    return filePath;
}

function downloadFile(baseUrl, thumbUrl, pdf_id, ext) {
    try{
        console.log("Initiating download process for...... " + pdf_id); 
        var key = pdf_id;
        var preTag = '';
        if(ext === ".pdf"){
            preTag = "PDF_" + key; 
        }else if(ext === ".jpg"){
            preTag = "JPG_" + key;
        }
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onInitFs, errorHandler);
        function onInitFs(fs){
            var uri = encodeURI(baseUrl+thumbUrl);
            pdf_id = pdf_id.split(";")[0];
            var fileTransfer = new FileTransfer();
            var fileURL = cordova.file.dataDirectory + pdf_id + ext; 
            fileTransfer.download(
                uri,
                fileURL,
                function(entry) {
                    console.log("download complete for persistent file: " + entry.toURL());
                    setLocalStorage(preTag, entry.toURL().replace("file:///", ""));
                },
                function(error) {
                    displayError("Unable to view document, please check connection or try later.", 'Error');
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("download error code " + error.code);
                },
            false);
        }
    }catch(e){
        console.log("Exception in downloadFile..." + e);
    }
}

/*
function checkIfFileExists(paramBaseUrl, paramThumbUrl, paramPDF_id, paramExt){
    var preTag = '';
    var baseUrl = paramBaseUrl;
    var thumbUrl = paramThumbUrl; 
    var pdf_id = paramPDF_id;
    var ext = paramExt;

    if(ext === ".pdf"){
        preTag = "PDF_" + pdf_id; 
    }else if(ext === ".jpg"){
        preTag = "JPG_" + pdf_id;
    } 
    var filePath = "file:///" + getLocalStorage(preTag);
    var fileError = '';
        try{
            window.resolveLocalFileSystemURL(filePath, onFileExist, onResolveFail);
            function onFail(evt){
                console.log("File system failed....");
                fileError = '';
                return '';
            }
            
            function onFileExist(fileEntry){
                console.log("Gotcha.....");
                //fileexist = true;
                fileError = filePath;
                return filePath;
            }        
            function onResolveFail(evt) {
                console.log("hell....." + evt.error)
                fileexist = false;
                downloadFile(baseUrl, thumbUrl, pdf_id, ext);
                fileError = (baseUrl+thumbUrl);
                return (baseUrl+thumbUrl);
                //return;
            }
        }catch(e){
            console.log("Error in checkIfFileExists....." + e);
            fileError = '';
            return false;
        }
    console.log(".........." + fileError);
    return fileError;
}*/

function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('Error while downloading file...: ' + msg);
}

function downloadFileAndShow(url, viewer, pdf_name) { 
    var options = {
            password: null,
            flatUI: true,
            showShadows: true,
            enableThumbs: true,
            disableRetina: false,
            enablePreview: true,
            bookmarks: true,
            landscapeDoublePage: false,
            landscapeSingleFirstPage: true,
            toolbarBackgroundColor: null,
            textColor: null,
            enableShare: true
        };
    try{
        console.log("Initiating download process for...... " + url);    
        $(".loading").show();
        var key = url.split("&")[0].split("=")[1];
        var preTag = "PDF_" + key;
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(url);
        pdf_id = key.split(";")[0];
        var fileURL = cordova.file.dataDirectory + pdf_id + ".pdf"; 
        fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
            console.log("download complete: " + entry.toURL());
            $(".loading").hide();
            setLocalStorage(preTag, entry.toURL().replace("file:///", ""));
            if (viewer == "pdfreader"){
                PDFReader.open( entry.toURL(), options, success, error);
            } else if (viewer == "viewer"){
                //window.location.href = "assets/js/pdf_js/web/viewer.html?id=" + entry.toURL();
                viewDocument(entry.toURL(), pdf_name);
            } else {
                window.location.href = "pdf_flip.html?id=" + key;
            }
        },
        function(error) {
            $(".loading").hide();
            displayError("Unable to view document, please check connection or try later.", 'Error');
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code " + error.code);
        },false);
    }catch(e){
        $(".loading").hide();
        console.log("Exception in downloadFileAndShow..." + e);
    }
}


function success(){
  //...
}

function error(){
  //...
}

 
function exec_url(url, pdf_name){
    console.log(url + " : " + pdf_name);
    var deviceType = getLocalStorage("appDevice");
    var viewType = getLocalStorage("viewer");
    console.log(viewType);
    if (viewType === null){
        viewType = "viewer";    
        setLocalStorage("viewer", "viewer");
    }
    if (navigator.userAgent.match(/Android/i) || viewType == "pdfreader"){
        viewType = "viewer";
    }
    var options = {
                password: null,
                flatUI: true,
                showShadows: true,
                enableThumbs: true,
                disableRetina: false,
                enablePreview: true,
                bookmarks: true,
                landscapeDoublePage: false,
                landscapeSingleFirstPage: true,
                toolbarBackgroundColor: null,
                textColor: null,
                enableShare: true
            };
    if(deviceType == "mobile"){        
        if (url.indexOf("///") > 0){
            if (viewType == "pdfreader"){
                PDFReader.open( url, options, success, error);
            } else if (viewType == "flip"){
                var count = url.split("/").length;
                var fileName = url.split("/")[count-1];
                window.location.href = "pdf_flip.html?id=" + fileName.split(".")[0] + ";1.0";
            } else {
                viewDocument(url, pdf_name);
            }
        }else{
           downloadFileAndShow(url, viewType, pdf_name);
        }
    }else{
        if (viewType == "pdfreader"){
            PDFReader.open( url, options, success, error);
        } else if (viewType == "flip"){
            var fileName = getExplicitUrlParams(url);
            console.log(fileName);
            window.location.href = "pdf_flip.html?id=" + fileName;
        } else {
            viewDocument(url, pdf_name);
        }
    }    
}

function viewDocument(url, pdf_name){
    console.log("View Documents as ......" + getLocalStorage("viewer"));

    var options = {
        title: pdf_name.replace(/_/g, ' '),
        documentView: {
            closeLabel : 'Close'
        },
        navigationView: {
            closeLabel : 'Close Navigation'
        },
        email : {
            enabled : true
        },
        print : {
            enabled : true
        },
        openWith : {
            enabled : true
        },
        bookmarks : {
            enabled : true
        },
        search : {
            enabled : true
        }
    }

    try{
    SitewaertsDocumentViewer.viewDocument(
    url, 'application/pdf', options, onShow, onClose, onMissingApp, onPdfError);
    }catch(e){
        console.log("Exception in viewDocuments..." + e);
    }
}


function onShow(){
  window.console.log('document shown');
  //e.g. track document usage
}

function onClose(){
  window.console.log('document closed');
  //e.g. remove temp files
}

function onMissingApp(id, installer)
{
    if(confirm("Do you want to install the free PDF Viewer App "
            + id + " for Android?"))
    {
        installer();
    }
}

function onPdfError(error){
  window.console.log(error);
  alert("Sorry! Cannot view document.");
}
