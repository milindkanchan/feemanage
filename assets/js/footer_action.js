function readLater(content_type){
    var id= '';
    var catDtl = '';
    var iname = getUrlNameParams();
    if (iname !== null){
        iname.replace(/%20/g, ' ');
    }    

    var image_attr = getImageCategoryId();
    if (image_attr[0] !== ''){        
        id = image_attr[0];
        iname = image_attr[1];
    }else{
        id = getUrlParams();
    }

    //if(content_type==="PDF"){
    //    catDtl = $.parseJSON(getLocalStorage("PDF_" + id));
    //}else if(content_type=== "IMG"){
    catDtl = $.parseJSON(getLocalStorage(id));
    //}

    if(catDtl !== null){
        iname = (catDtl.headline === null) ? catDtl.name : catDtl.headline
        size =  bytesToSize(catDtl.size)
    }


    var test = $.parseJSON(getLocalStorage("readLater"));

    // Check for the toggle
    var retVal = false;
    if (document.location.href.indexOf("image_flip?id=") > 0){        
        retVal = toggleReadLater(test, $("#currentPosition").val());
    }else{
        retVal = toggleReadLater(test, id);    
    }
    
    if(retVal === true){
        return false;
    }

	var burl = generateUrl(content_type, id, iname);
    
    var obj = [];
    var dup = false;
    if(typeof test !== 'undefined' && test !== null){        
        obj = test;       
    }
    if(dup === false){
        $("#iReadLater").css("color", 'red')
        obj.push({"id" : id, "type":  content_type, "url": burl, "name": iname, "size": size});
        setLocalStorage("readLater", JSON.stringify(obj));
        //displayError("Link added to readers list", '');
    }
}

function favourites(content_type){
    var id = '';
    var size = 0;
    var iname = getUrlNameParams();

    if (iname !== null){
        iname.replace(/%20/g, ' ');
    }

    var image_attr = getImageCategoryId();
    if (image_attr[0] !== ''){
        id = image_attr[0];
        iname = image_attr[1];
    }else{        
        id = getUrlParams();    
    }

    //if(content_type==="PDF"){
    //    catDtl = $.parseJSON(getLocalStorage(id));
    //}else if(content_type=== "IMG"){
    catDtl = $.parseJSON(getLocalStorage(id));
    //}

    if(catDtl !== null){
        iname = (catDtl.headline === null) ? catDtl.name : catDtl.headline
        size =  bytesToSize(catDtl.size)
    }

    var test = $.parseJSON(getLocalStorage("readFav"));

    // Check for the toggle
    var retVal = false;
    if (document.location.href.indexOf("image_flip?id=") > 0){        
        retVal = toggleFavourite(test, $("#currentPosition").val());
    }else{
        retVal = toggleFavourite(test, id);    
    }

    if(retVal === true){
        return false;
    }    

	var burl = generateUrl(content_type, id, iname);

    var obj = [];
    var dup = false;
    if(typeof test !== 'undefined' && test !== null){        
        obj = test;       
    }
    if(dup === false){
        $("#iFavourite").css("color", 'red')
        obj.push({"id": id, "type":  content_type, "url": burl, "name": iname, "size": size});
        setLocalStorage("readFav", JSON.stringify(obj));
        //displayError("Link added to favourite list", '');
    }
}

function getImageCategoryId(){
    var retVal = '';
    var retName = ''
    if(window.location.href.indexOf("image_flip.html?id=") > 0){ 
        $(".bb-item").each(function (){
            if ($(this).css('display') === "block"){
                retVal = $(this).children().attr('data');
                retName = $(this).children().attr('alt');
                return false;
            }
        });
    }
    return [retVal, retName];
}

function generateUrl(content_type, id, name){
    var baseurl = getBaseURL();
    var parent_id = getUrlParams()
    if(content_type == 'IMG'){
        return "image_flip.html?id=" + parent_id + "&name=" + name.replace(/ /g, "_") + "&sid=" + id + "";
    }else if(content_type === 'PDF'){
        return "pdf_flip.html?id=" + id + "&name=" + name + "'";
    }else{
        return "listing.html?id=" + id + "&name=" + name + "'";
    }

}

function changeFavReadClass(){

    var read = $.parseJSON(getLocalStorage("readLater"));
    var fav = $.parseJSON(getLocalStorage("readFav"));
    var id = getUrlParams();
    if(read !== null){
        $.each(read, function(index, category){    
            if (category.id === id){
                $("#iReadLater").css("color", '#FF0000');
                return false;
            }
        });
    }
    if (fav !== null){
        $.each(fav, function(index, category){    
            if (category.id === id){
                $("#iFavourite").css("color", '#FF0000');
                return false;
            }
        });
    }

}

function toggleReadLater(read, id){
    var retVal = false;
    if ($("#iReadLater").css("color") === "rgb(255, 0, 0)"){
        $.each(read, function(index, category){
            if (category.id === id){
                $("#iReadLater").css("color", '');
                read.splice(index, 1);
                setLocalStorage("readLater", JSON.stringify(read));
                retVal = true;
                return;
            }
        });
    }
    return retVal;
}

function toggleFavourite(fav, id){
    var retVal = false;
    if ($("#iFavourite").css("color") === "rgb(255, 0, 0)"){
        $.each(fav, function(index, category){    
            if (category.id === id){
                $("#iFavourite").css("color", '');
                fav.splice(index, 1);
                setLocalStorage("readFav", JSON.stringify(fav));
                retVal = true;
                return false;
            }
        });
    }
    return retVal;
}

function changeImageFavReadClass(){

    var img_id = ''
    $(".bb-item").each(function (){
        if ($(this).css("display") === "block"){
            var aTag = $(this).children().first();
            img_id = aTag.attr('data');
            $("#currentPosition").val(img_id);
            return;
        }
    })    
    var read = $.parseJSON(getLocalStorage("readLater"));
    var fav = $.parseJSON(getLocalStorage("readFav"));
    var id = getUrlParams();
    if(read !== null){
        $.each(read, function(index, category){    
            if (category.id === img_id){
                $("#iReadLater").css("color", '#FF0000');
                return false;
            }else{
                $("#iReadLater").css("color", '');
            }
        });
    }
    if (fav !== null){
        $.each(fav, function(index, category){    
            if (category.id === img_id){
                $("#iFavourite").css("color", '#FF0000');
                return false;
            }else{
                $("#iFavourite").css("color", '');
            }
        });
    }

}