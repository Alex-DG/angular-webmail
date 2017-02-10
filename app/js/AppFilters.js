angular.module("AppFilters", [])
    .filter("highlightSearch", function () {
        return function (input, search) {
            if (search) {
                return input.replace(new RegExp("(" + search + ")", "gi"), "<span class='highlightSearch'>$1</span>");
            }
            return input;
        }
    });