/**
 * Created by Alex on 08/02/2017.
 */
angular.module("AppFilters", [])
    .filter("highlightSearch", function () {
        return function (input, search) {
            if (search) {
                return input.replace(new RegExp("(" + search + ")", "gi"), "<span class='highlightSearch'>$1</span>");
            }
            return input;
        }
    });