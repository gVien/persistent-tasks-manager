(function() {
  'use strict';

  angular.module("persistentToDoApp")
      .controller("PersistentToDoListCtrl", ["$scope", function($scope) {
        // console.log("test");
        $scope.test ="TEST";

        var toDoList = this;  // controller

        toDoList.lists = [];

        toDoList.addList = function() {
          var listObj = { description: toDoList.addText,
                          time: moment().format('llll'),
                          complete: false
                          };
          toDoList.lists.push(listObj);
          toDoList.addText = "";
        };

      }]);
}());