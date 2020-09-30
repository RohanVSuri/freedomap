window.onload = initall();
function initall(){
    $(".additional_tags").hide();
}
function showTags(){
    if($(".additional_tags").is(":hidden"))
    {
        $(".additional_tags").fadeIn(100, 'linear');
    }
    else if($(".additional_tags").is(":visible"))
    {
        $(".additional_tags").fadeOut(100, 'linear');
    }
}