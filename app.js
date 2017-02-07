/**
 * Created by Alex on 07/02/2017.
 */

// appModule.config(['$locationProvider', function($locationProvider) {
//     $locationProvider.hashPrefix('');
// }]);

angular.module("Webmail", ["ngSanitize"])
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .controller("WebmailCtrl", function ($scope, $location) {

        $scope.files = [
            {
                value: "INBOX", label: 'Inbox', emails: [
                {
                    id: 1,
                    from: "MrRobot",
                    to: "Alex",
                    subject: "Thanks for your help! I own you one",
                    date: "20/02/2017",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                },
                {
                    id: 2,
                    from: "Superman",
                    to: "Batman",
                    subject: "Hi from Hawaii",
                    date: "18/02/2017",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>."
                },
                {
                    id: 3,
                    from: "Pikachu",
                    to: "Alex",
                    subject: "Pika pika !",
                    date: "15/02/2017",
                    content: "Pika pika ! Chuuuuuu. Pika pika ! Chuuuuuu. Pika pika ! Chuuuuuu. Pika pika ! Pika pika ? Piiiiika Chuuuuuu. Pika pika ! Pikachu. Pika pika pika."
                },
                {
                    id: 4,
                    from: "King Varian Wrynn",
                    to: "Alex",
                    subject: "For the Alliance!",
                    date: "13/02/2017",
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
                    date: "17/02/2017",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                },
                {
                    id: 6,
                    from: "Hiro Nakamura",
                    to: "Alex",
                    subject: "Konichiwa",
                    date: "18/03/2017",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>."
                },
                {
                    id: 7,
                    from: "Sangoku",
                    to: "Alex",
                    subject: "Kamehameha!!",
                    date: "20/02/2017",
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
                    date: "20/02/2017",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                },
                {
                    id: 9,
                    from: "Alex",
                    to: "Leonard",
                    subject: "Gloubiboulga Night",
                    date: "18/02/2017",
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
                    date: "20/02/2017",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id ligula ac sem fringilla mattis. Nullam sodales mi vel semper volutpat. Phasellus lorem leo, luctus a lectus id, posuere aliquet orci. Praesent sit amet ipsum porttitor, tempus odio vel, bibendum mauris. Etiam magna lorem, rhoncus eget euismod ac, lobortis quis."
                },
                {
                    id: 11,
                    from: "Sofinnoga",
                    to: "Alex",
                    subject: "Life Assurance good for you!",
                    date: "18/02/2017",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>."
                }
            ]
            }
        ];

        $scope.currentFile = null;
        $scope.emailSelected = null;

        $scope.toEmail = function (file, email) {
            $location.path("/" + file.value + "/" + email.id);
        }

        $scope.selectFile = function (file) {
            $scope.currentFile = file;
            $scope.emailSelected = null;
        }

        $scope.selectEmail = function (email) {
            $scope.emailSelected = email;
        };

        $scope.$watch(function () {
            return $location.path();
        }, function (newPath) {
            var tabPath = newPath.split("/");

            if (tabPath.length > 1) {

                var valFile = tabPath[1];

                $scope.files.forEach(function (item) {
                    if (item.value == valFile) {
                        $scope.selectFile(item);
                    }
                });

                if (tabPath.length > 2) {

                    var idMail = tabPath[2];

                    $scope.currentFile.emails.forEach(function (item) {
                        if (item.id == idMail) {
                            $scope.selectEmail(item);
                        }
                    });
                }
            }
        });


    });