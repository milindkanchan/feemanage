function saveDocumentToLocal(cat_ids, cat_urls){
    // Get a reference to the image element
    var storageFiles = ''
    var img_id, storageFilesDate, date, todaysDate, cat_id;
    var obj = [];

    storageFiles = JSON.parse(localStorage.getItem("storageFiles")) || {}
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
                    var test = $.parseJSON(localStorage.getItem("storageFiles"));
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

function downloadFile(baseUrl, pdf_id){
    var fileURL = fileSystem.root.toNativeURL();
    var tmp_url = baseurl + "/app/alfrscosvg/auth/PDFStreamServlet?id=" + pdf_id;
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(tmp_url);
    fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
            console.log("download complete: " + entry.toURL());
        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
        },
        false
    );
}

function fileExist(pdf_id)
{
    var fileURL = fileSystem.root.toNativeURL();
    var retVal = window.resolveLocalFileSystemURL(fileURL + pdf_id + ".pdf", fileExisted, fileDidNotExist);
    return retVal;
}
