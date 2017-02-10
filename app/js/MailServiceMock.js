/**
 * Created by Alex on 08/02/2017.
 */
angular.module("MailServiceMock", [])
    .factory("mailService", function() {

        var files = [
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

        return {
            getFiles: function() {
                return files;
            },
            getFile: function(valFile) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (file.value == valFile) {
                        return file;
                    }
                }
                return null;
            },
            getMail: function(valFile, idMail) {
                var file = this.getFile(valFile);
                if (file) {
                    for (var i = 0; i < file.emails.length; i++) {
                        var email = file.emails[i];
                        if (email.id == idMail) {
                            return email;
                        }
                    }
                }
                return null;
            },
            sendEmail: function(emailSent) {
                var emailsSent = this.getFile("SENT_EMAIL");
                var lastEmailID = 0;
                emailsSent.emails.forEach(function(email) {
                    if (email.id > lastEmailID) {
                        lastEmailID = email.id;
                    }
                });
                emailSent.id = lastEmailID + 1;
                emailsSent.emails.push(emailSent);
            }
        }
    })