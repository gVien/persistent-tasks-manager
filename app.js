$(document).ready(function() {
  var lists = $(".lists");
  var btn = $(".btn");

  var arr = [{description: "WEREWREr", complete: true},
  {description: "WEREWREr wefwef", complete: false}];
  // localStorage.setItem("lists", JSON.stringify(arr));

  btn.on("click", function() {
    var inputVal = $(".to-do-field").val();
    var listObj = { itemNum: arr.length + 1,
                    description: inputVal,
                    complete: false
                    };
    arr.push(listObj);
    $(".lists").html(""); //clear form

    //
    var template = $("#to-do-template").html();
    var compliedTemplate = Handlebars.compile(template);
    lists.append(compliedTemplate(arr));

    markItemDone(arr, $(".checkbox"));
    checkIfItemsDone($(".list"));
  });

  function markItemDone(arr, checkbox) {
    checkbox.on("click", function() {
      var listDescription = $(this).next(),
          listDescriptionIndex = $(this).data("index"),
          list = $(this).parent();

      if ($(this).is(":checked")) {
        listDescription.addClass("done");
        arr[listDescriptionIndex] = true;
        list.attr("data-complete", true);
      } else {
        listDescription.removeClass("done");
        arr[listDescriptionIndex] = false;
        list.attr("data-complete", false);
      }
    })
  }

  // when load, check if items are already completed
  // if items are completed, cross out and enable checkbox
  function checkIfItemsDone(items) {

    $.each(items, function(index, item) {
      var itemCheckbox = $(this).find(".checkbox");
      var itemDescription = $(this).find(".list-description");

      if ($(this).data("complete") === true) {
        itemCheckbox.prop("checked", true);
        itemDescription.addClass("done");
      }
    })
  }
});