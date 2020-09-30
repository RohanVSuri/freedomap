// window.onload = initall();
// function initall(){
//     $(".additional_tags").hide();
// }
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
function updateTextInput(val) {
    if(val == 5){document.getElementById("p1").innerHTML = "Very Large"}
    if(val == 4){document.getElementById("p1").innerHTML = "Large"}
    if(val == 3){ document.getElementById("p1").innerHTML = "Average"}
    if(val == 2){ document.getElementById("p1").innerHTML = "Small"}
    if(val == 1) {document.getElementById("p1").innerHTML = "Very Small"}
  }


