require('useful-date');
require('useful-date/locale/en-US.js');

var files = [
	{ value: "INBOX", label: 'Inbox' },
	{ value: "ARCHIVE", label: "Archive" },
	{ value: "SENT_EMAIL", label: "Sent" },
	{ value: "SPAM", label: "Spam" }
];

var contacts = [ "Sangoku", "Chichi", "Bulma", "Krilin", "Tenchinan", "Yamcha", "Master Roshi", "Master Kaio", "Picollo", "Sangohan", "Vegeta", "Freezer", "Dende", "Trunks", "C-16", "C-17", "C-18", "Cell", "Sangoten", "Videl", "Kaio Shin", "Boo" ];
var object1 = [ "Hi", "Bonjour", "What's up", "How are you", "Yo", "How are you doing", "All is good", "Give me news", "Hello", "What do you want" ];
var object2 = [ "my dear", "darling", "my friend", "man", "guys", "my nate", "bro", "old friend", "jerk", "chicky", "loser" ];
var contentEmail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consectetur elementum leo. Curabitur luctus, magna a tempor sodales, orci velit dictum magna, nec pharetra turpis ante vehicula ante. Sed sed libero suscipit, rutrum ligula vel, tempor lorem. Phasellus pulvinar dolor ac velit porttitor pulvinar. Mauris felis quam, consequat at <b>mauris</b>.";

var nextEmailId = 1;
var emailsByFile = null;

var rand = function(max) {
	return Math.floor(Math.random() * max);
}

var randInArray = function(arr) {
	return arr[rand(arr.length)];
}

// Random date
var randDateInLastMonth = function() {
	var date = new Date();
	date.setDate(date.getDate() - rand(30));
	date.setHours(rand(24) - 1);
	date.setMinutes(rand(60) - 1);
	return date;
}

// Generate random emails
exports.createEmail = function() {
	emailsByFile = {};

	for (var i in files) {

	    var valFile = files[i].value;
		emailsByFile[valFile] = [];

		var nbEmails = rand(10); // Between 1 and 10 mails
		for (var j = 0; j < nbEmails; j++) {

			var email = {
				id: nextEmailId,
				from: valFile == "SENT_EMAIL" ? "Alex" : randInArray(contacts),
				to: valFile == "SENT_EMAIL" ? randInArray(contacts) : "Alex",
				subject: randInArray(object1) + " " + randInArray(object2),
				date: randDateInLastMonth(),
				content: contentEmail
			};

			emailsByFile[valFile].push(email);

			nextEmailId++;
		}
	}
};

exports.getFiles = function(req, res) {
	res.send(files);
};

exports.getFileById = function(req, res) {
	var file = emailsByFile[req.params.fileId]; // List of email(s) in a file
	res.send(file);
}

exports.getMail = function(req, res) {
    var dossier = emailsByFile[req.params.fileId];
    var email = null;
    for (var i in dossier) {
        var itemMail = dossier[i];
        if (itemMail.id == req.params.emailId) {
            email = itemMail;
        }
    }
    res.send(email);
}

exports.sendEmail = function(req, res) {
	var file = emailsByFile["SENT_EMAIL"];
	var email = req.body;

	// Create email
	email.id = nextEmailId;
	email.from = "Alex";
	email.to = "William Wallace";
	email.subject = "FREEEDDDOOOMMMMM!!!";
	email.date = randDateInLastMonth();
	email.content = "whisky ?!!!!";

    file.push(email);

	nextEmailId++;
	res.send({ succes: true, email: req.body });
}