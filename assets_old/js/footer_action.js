function readLater(content_type){
    var id= '';

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

	var burl = generateUrl(content_type, id, iname);

    var test = $.parseJSON(localStorage.getItem("readLater"));
    var obj = [];
    if(typeof test !== 'undefined' && test !== null){
        obj = test;       
    }

    obj.push({"id" : id, "type":  content_type, "url": burl, "name": iname});
    localStorage.setItem("readLater", JSON.stringify(obj));
    displayError("Link added to readers list", '');
}

function favourites(content_type){
    var id = '';
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

	var burl = generateUrl(content_type, id, iname);

    var test = $.parseJSON(localStorage.getItem("readFav"));
    var obj = [];

    if(typeof test !== 'undefined' && test !== null){
        obj = test;       
    }

    obj.push({"id": id, "type":  content_type, "url": burl, "name": iname});
    localStorage.setItem("readFav", JSON.stringify(obj));
    displayError("Link added to favourite list", '');
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
        return "'image_flip.html?id=" + parent_id + "&name=" + name + "&sid=" + id + "'";
    }else if(content_type === 'PDF'){
        return "pdf_flip.html?id=" + id + "&name=" + name + "'";
    }else{
        return "listing.html?id=" + id + "&name=" + name + "'";
    }

}