$(document).ready(function() {
  var lists = $(".lists");
  var btn = $(".btn");

  var arr = [];
  // localStorage.setItem("lists", JSON.stringify(arr));



  btn.on("click", function() {
    var inputVal = $(".to-do-field").val();
    arr.push(inputVal);
    $(".lists").html(""); //clear form
    var template = $("#to-do-template").html();
    var compliedTemplate = Handlebars.compile(template);
    lists.append(compliedTemplate(arr));

    var item = $(".list");
    console.log(item);
  });
});