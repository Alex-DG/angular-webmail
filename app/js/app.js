/**
 * Created by Alex on 07/02/2017.
 */

// appModule.config(['$locationProvider', function($locationProvider) {
//     $locationProvider.hashPrefix('');
// }]);

angular.module("Webmail", ["ngSanitize", "ui.tinymce", "MailServiceRest", "AppFilters", "AppDirectives"])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }], function ($httpProvider) {
        $httpProvider.interceptors.push(function (q, $rootScope) {
            var countRequests = 0;
            return {
                'request': function(config) {
                    $rootScope.loadingInProgress = true;
                    countRequests++;
                    return config;
                },
                // 'requestError': function(rejection) {
                // },
                'response': function(response) {
                    if (--countRequests == 0) {
                        $rootScope.loadingInProgress = false;
                    }
                    return response;
                },
                'responseError': function(rejection) {
                    if (--countRequests == 0) {
                        $rootScope.loadingInProgress = false;
                    }
                    return $q.reject(rejection);
                }
            };
        })
    })
    .controller("WebmailCtrl", function ($rootScope, $scope, $location, $filter, mailService) {

        $rootScope.loadingInProgress = false;

        // SORT --------------------------------------------------------------------------------------------------------

        $scope.fieldToSort = null;
        $scope.sortDescending = false;

        $scope.sortEmails = function (champ) {
            if ($scope.fieldToSort == champ) {
                $scope.sortDescending = !$scope.sortDescending;
            } else {
                $scope.fieldToSort = champ;
                $scope.sortDescending = false;
            }
        }

        $scope.cssChevronIcon = function (field) {
            return {
                glyphicon: $scope.fieldToSort == field,
                'glyphicon-chevron-up': $scope.fieldToSort == field && !$scope.sortDescending,
                'glyphicon-chevron-down': $scope.fieldToSort == field && $scope.sortDescending
            };
        }

        // SEARCH ------------------------------------------------------------------------------------------------------


        $scope.searchEmails = [];

        $scope.cleanSearch = function () {
            $scope.searchEmails = null;
        }


        // COMPOSE EMAIL -----------------------------------------------------------------------------------------------

        $scope.showNewEmail = false;

        $scope.sendEmail = function (newEmail) {

            mailService.sendEmail(newEmail);
            //$location.path("/");
        }


        // NAVIGATION --------------------------------------------------------------------------------------------------

        $scope.currentView = null;
        $scope.currentFile = null;
        $scope.emailSelected = null;

        $scope.toEmail = function (file, email) {
            $location.path("/" + file.value + "/" + email.id);
        }

        $scope.selectFile = function (valFile) {
            $scope.currentView = 'viewFile';
            $scope.currentFile = mailService.getFile(valFile);
        }

        $scope.selectEmail = function (valFile, idEmail) {
            $scope.currentView = 'viewContentEmail';
            $scope.emailSelected = mailService.getMail(valFile, idEmail);
            var test = "";
        };

        $scope.$watch(function () {
            return $location.path();
        }, function (newPath) {
            var tabPath = newPath.split("/");

            if (tabPath.length > 1 && tabPath[1] != null) {

                if (tabPath[1] == "COMPOSE") {
                    $scope.currentView = 'viewNewEmail';
                    $scope.$broadcast("initFormNewEmail");
                } else {

                    var valFile = tabPath[1];
                    $scope.selectFile(valFile);
                    if (tabPath.length > 2) {
                        var idMail = tabPath[2];
                        $scope.selectEmail(valFile, idMail);
                    } else {
                        $scope.selectFile(valFile);
                    }
                }
            } else {
                $scope.currentView = null;
            }
        });

        $scope.files = mailService.getFiles();

    });