$(document).ready(function() {
  var lists = $(".lists"),
      btn = $(".btn"),
      emptySpan = $(".input-cannot-be-empty");

  var arr;

  if (localStorage.hasOwnProperty("lists")) {
    arr = JSON.parse(localStorage.getItem("lists"));
    populateList(arr);
    markItemDone(arr, $(".checkbox"));
    checkIfItemsDone($(".list"));
  } else {
    arr = [];
  }

  btn.on("click", function(event) {
    event.preventDefault();

    var inputVal = $(".to-do-field").val();
    var listObj = { itemNum: arr.length + 1,
                    description: inputVal,
                    complete: false
                    };

    if (inputVal) {
      arr.push(listObj);
      addAdditionalList(listObj);
      localStorage.setItem("lists", JSON.stringify(arr)); // update localStorage
      emptySpan.removeClass("active");
    } else {
      emptySpan.addClass("active");
    }

    markItemDone(arr, $(".checkbox"));
    checkIfItemsDone($(".list"));
  });

  function populateList(arr) {
    var template = $("#to-do-template").html();
    var compiledTemplate = Handlebars.compile(template);
    lists.append(compiledTemplate(arr));
  }

  function addAdditionalList(listObj) {
    var template = $("#additional-list").html();
    var compiledTemplate = Handlebars.compile(template);
    lists.append(compiledTemplate(listObj));
  }

  function updateLocalStorage(index, arr) {
    return {
      updateComplete: function(attr) {
        arr[index].complete = attr;
        localStorage.setItem("lists", JSON.stringify(arr));
      }
    }
  }

  function markItemDone(arr, checkbox) {
    checkbox.on("click", function() {
      var listDescription = $(this).next(),
          listDescriptionIndex = listDescription.data("index") - 1,
          list = $(this).parent();

      if ($(this).is(":checked")) {
        listDescription.addClass("done");
        updateLocalStorage(listDescriptionIndex, arr).updateComplete(true);
        list.attr("data-complete", true);
      } else {
        listDescription.removeClass("done");
        updateLocalStorage(listDescriptionIndex, arr).updateComplete(false);
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