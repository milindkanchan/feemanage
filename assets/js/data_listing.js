function feeListing(){
    var list = '';
    var data = $.parseJSON(getLocalStorage("feeTopic"));
    $.each(data, function(index, category){
        list += "<div class='listingContent'>" + category.topicName + "</div>";
    });
    $("#topicList").html(list);
}