/**
 * Created by Alex on 07/02/2017.
 */

// appModule.config(['$locationProvider', function($locationProvider) {
//     $locationProvider.hashPrefix('');
// }]);

angular.module("Webmail", [ "ngSanitize", "ui.tinymce" ])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .controller("WebmailCtrl", function ($scope, $location, $filter) {

        $scope.files = [
            {
                value: "INBOX", label: 'Inbox', emails: [
                {
                    id: 1,
                    from: "MrRobot",
                    to: "Alex",
                    subject: "Thanks for your help! I own you one",
                    date: new Date(2015, 1, 20, 15, 30),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                },
                {
                    id: 2,
                    from: "Superman",
                    to: "Batman",
                    subject: "Hi from Hawaii",
                    date: new Date(2017, 1, 18, 9, 30),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>."
                },
                {
                    id: 3,
                    from: "Pikachu",
                    to: "Alex",
                    subject: "Pika pika !",
                    date: new Date(2017, 1, 15, 19, 45),
                    content: "Pika pika ! Chuuuuuu. Pika pika ! Chuuuuuu. Pika pika ! Chuuuuuu. Pika pika ! Pika pika ? Piiiiika Chuuuuuu. Pika pika ! Pikachu. Pika pika pika."
                },
                {
                    id: 4,
                    from: "King Varian Wrynn",
                    to: "Alex",
                    subject: "For the Alliance!",
                    date: new Date(2017, 1, 13, 16, 12),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>."
                }
            ]
            },
            {
                value: "ARCHIVE", label: "Archive", emails: [
                {
                    id: 5,
                    from: "Sarah",
                    to: "Alex",
                    subject: "Happy Birthday!",
                    date: new Date(2017, 1, 17, 11, 17),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                },
                {
                    id: 6,
                    from: "Hiro Nakamura",
                    to: "Alex",
                    subject: "Konichiwa",
                    date: new Date(2017, 2, 18, 11, 50),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>."
                },
                {
                    id: 7,
                    from: "Sangoku",
                    to: "Alex",
                    subject: "Kamehameha!!",
                    date: new Date(2017, 1, 20, 13, 30),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                }
            ]
            },
            {
                value: "SENT_EMAIL", label: "Sent Mail", emails: [
                {
                    id: 8,
                    from: "Alex",
                    to: "Sheldon",
                    subject: "Bien la famille ?",
                    date: new Date(2017, 1, 19, 8, 5),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                },
                {
                    id: 9,
                    from: "Alex",
                    to: "Leonard",
                    subject: "Gloubiboulga Night",
                    date: new Date(2017, 1, 18, 11, 17),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>."
                }
            ]
            },
            {
                value: "SPAM", label: "Spam", emails: [
                {
                    id: 10,
                    from: "Qoicnat",
                    to: "Alex",
                    subject: "MONEY MONEY",
                    date: new Date(2017, 1, 20, 11, 11),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                },
                {
                    id: 11,
                    from: "Sofinnoga",
                    to: "Alex",
                    subject: "Life Assurance good for you!",
                    date: new Date(2017, 1, 18, 17, 16),
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>."
                }
            ]
            }
        ];

        $scope.idNextEmail = 12;

        // EMAIL TABLE -------------------------------------------------------------------------------------------------

        $scope.currentFile = null;
        $scope.emailSelected = null;

        $scope.toEmail = function (file, email) {
            $location.path("/" + file.value + "/" + email.id);
        }

        $scope.selectFile = function (file) {
            $scope.currentFile = file;
            $scope.emailSelected = null;

            if (file){
                $scope.newEmail = null;
            }
        }

        $scope.selectEmail = function (email) {
            $scope.emailSelected = email;
        };


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

        $scope.newEmail = null;
        $scope.clearEmail = function () {

            $scope.newEmail = {
                from: "Alex",
                date: new Date()
            };

            if (tinyMCE.activeEditor) {
                tinyMCE.activeEditor.setContent("");
            }
            $scope.formNewEmail.$setPristine();
        }

        $scope.sendEmail = function () {
            var regExpValidEmail = new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$", "gi");

            // Email validation
            if (!$scope.newEmail.to || !$scope.newEmail.to.match(regExpValidEmail)) {
                window.alert("Error\n\nEmail address not valid.");
                return;
            }

            // Email confirmation for no subject defined
            if (!$scope.newEmail.subject) {
                if (!window.confirm("Confirmation\n\nDo you really want to send an email with no subject?")) {
                    return;
                }
            }

            $scope.files.forEach(function (item) {
                $scope.newEmail.id = $scope.idNextEmail++;
                if (item.value == "SENT_EMAIL") {
                    item.emails.push($scope.newEmail);

                    $scope.newEmail = null;
                    $location.path("/");

                }
            })
        }


        $scope.optionsTinyMce = {
            statusbar: false,
            menubar: false
        };


        // NAVIGATION --------------------------------------------------------------------------------------------------

        $scope.$watch(function () {
            return $location.path();
        }, function (newPath) {
            var tabPath = newPath.split("/");

            if (tabPath.length > 1) {

                if (tabPath[1] == "COMPOSE") {
                    $scope.clearEmail();
                    $scope.selectFile(null);
                } else {

                    var valFile = tabPath[1];
                    $scope.files.forEach(function(item) {
                        if (item.value == valFile) {
                            $scope.selectFile(item);
                        }
                    });

                    if (tabPath.length > 2) {
                        var idMail = tabPath[2];
                        $scope.currentFile.emails.forEach(function(item) {
                            if (item.id == idMail) {
                                $scope.selectEmail(item);
                            }
                        });
                    }
                }
                
            }
        });

    })
    .filter("highlightSearch", function () { // TODO: need optimisation for a long list of emails
        return function (input, searchEmails) {
            if (searchEmails) {
                return input.replace(new RegExp("(" + searchEmails + ")", "gi"), "<span class='highlightSearch'>$1</span>");
            }
            return input;
        }
    });