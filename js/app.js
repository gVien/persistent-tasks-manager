$(document).ready(function() {
  var lists = $(".lists"),
      btn = $(".btn-submit"),
      emptySpan = $(".input-cannot-be-empty");


  var arr;

  if ($.jStorage.get("lists")) {
    arr = $.jStorage.get("lists");
    populateList(lists, arr);
    markItemDone(arr, $(".checkbox"));
    checkIfItemsDone($(".list"));
    enableDeleteList(arr);
  } else {
    arr = [];
  }

  btn.on("click", function() {

    var inputVal = $(".to-do-field").val();
    var listObj = { itemNum: $(".list").length + 1,
                    description: inputVal,
                    complete: false
                    };

    if (inputVal) {
      arr.push(listObj);
      $(".to-do-field").val("");
      addAdditionalList(lists, listObj);
      updateLocalStorage(arr).updateList() // update localStorage
      enableDeleteList(arr);
      emptySpan.removeClass("active");
    } else {
      emptySpan.addClass("active");
    }
  });

  function populateList(lists, arr) {
    var template = $("#to-do-template").html();
    var compiledTemplate = Handlebars.compile(template);
    lists.append(compiledTemplate(arr)).hide().fadeIn({duration: 1250});
  }

  function addAdditionalList(lists, listObj) {
    var template = $("#additional-list").html();
    var compiledTemplate = Handlebars.compile(template);
    lists.append(compiledTemplate(listObj));
    lists.find("li").last().slideDown("slow");

    var checkbox = lists.find(".checkbox").last();
    markItemDone(arr, checkbox);
  }

  function updateLocalStorage(arr) {
    return {
      updateList: function() {
        $.jStorage.set("lists", arr);
      },
      updateComplete: function(index, attr) {
        arr[index].complete = attr;
        this.updateList();
      },
      deleteList: function(index) {
        arr.splice(index, 1);
        this.updateList();
      }
    }
  }

  function enableDeleteList(arr) {
    var allList = $(".list");
    var deleteBtn = allList.find(".btn-delete");

    // weird behavior that clicks twice without unbinding it
    deleteBtn.unbind('click').on("click", function() {
      var list = $(this).closest(".list");
      var listIndex = allList.index(list);

      list.fadeOut("slow", function() {
        // $(this).remove();
        $(this).css({"visibility":"hidden",display:'block'}).slideUp(function() {
            $(this).remove();
        });
      });

      updateLocalStorage(arr).deleteList(listIndex);
    })
  }

  function markItemDone(arr, checkbox) {

    checkbox.on("click", function() {
      var allList = $(".list"),
          listDescription = $(this).next(),
          list = $(this).closest(".list"),
          listIndex = allList.index(list);

      if ($(this).is(":checked")) {
        listDescription.addClass("done");
        updateLocalStorage(arr).updateComplete(listIndex, true);
        list.attr("data-complete", true);
      } else {
        listDescription.removeClass("done");
        updateLocalStorage(arr).updateComplete(listIndex, false);
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

  $(".to-do-field").keypress(function (e) {
    if (e.which == 13) {
      $("input[type=button]").click();
      return false;
    }
  });
});