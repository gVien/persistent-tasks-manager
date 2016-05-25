$(document).ready(function() {
  var lists = $(".lists"),
      btn = $(".btn-submit"),
      emptySpan = $(".input-cannot-be-empty"),
      emptyList = $(".no-list-to-delete");

  var arr = [];
  var storedList = $.jStorage.get("lists");

  if (storedList) {
    arr = storedList;
    populateList(lists, arr);
    markItemDone(arr, $(".checkbox"));
    checkIfItemsDone($(".list"));
    enableDeleteList(arr);
  }

  deleteAllItems(arr);

  btn.on("click", function() {

    var inputVal = $(".to-do-field").val();
    var indexOfLastItem = $(".list").last().data("index") || 0

    var listObj = { itemNum: indexOfLastItem + 1,
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
      emptyList.removeClass("active");
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
      },
      deleteAllList: function() {
        arr.splice(0);
        $.jStorage.flush();
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

  function deleteAllItems(arr) {
    var deleteWrapper = $(".delete-all-wrapper"),
        deleteAllBtn = deleteWrapper.find(".btn-delete-all"),
        deleteConfirmationBox = deleteWrapper.find("#delete-all-confirmation"),
        yesBtn = deleteWrapper.find(".btn-yes"),
        noBtn = deleteWrapper.find(".btn-no");

    deleteWrapper.on("click", deleteAllBtn, function() {
      var lists = $(".list");

      if (lists.length) {
        emptyList.removeClass("active");
        deleteConfirmationBox.collapse("show");

        yesBtn.unbind("click").on("click", function() {
          deleteConfirmationBox.collapse("hide");
          updateLocalStorage(arr).deleteAllList();

          $.each(lists, function(index, list) {
            $(this).fadeOut("slow", function() {
              $(this).remove();
            });
          });
        });

        noBtn.unbind("click").on("click", function() {
          deleteConfirmationBox.collapse("hide");
        });
      } else {
        emptyList.addClass("active");
      }


    });

  }

  $(".to-do-field").keypress(function (e) {
    if (e.which == 13) {
      $("input[type=button]").click();
      return false;
    }
  });
});