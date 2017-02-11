/**
 * Created by Alex on 11/02/2017.
 */

angular.module("MailServiceRest", [ "ngResource" ])
.factory("mailService", function($resource) {
	
	var URL_API = "http://localhost:8080/api/";

	// var servicePullMails = $resource(URL_API + "files/:fileId/:emailId");
	// var serviceSendMail = $resource(URL_API + "sendEmail");
	var serviceRest = $resource(URL_API + "files", null,
		{ 
			"getFiles" : { method: "GET", isArray: true },
			"getFile" : { method: "GET", isArray: false, url: URL_API + "files/:fileId" },
			"getMail" : { method: "GET", isArray: false, url: URL_API + "files/:fileId/:emailId" },
			"sendEmail" : { method: "POST", url: URL_API + "send" }
		});

	// return {
	// 	getFiles: function() {
	// 		return servicePullMails.query();
	// 	},
	// 	getFile: function(valDossier) {
	// 		return servicePullMails.get({fileId: valFile});
	// 	},
	// 	getMail: function(valDossier, idMail) {
	// 		return servicePullMails.get({idDossier: valFile, emailId: emailId});
	// 	},
	// 	sendEmail: function(mail) {
	// 		serviceSendMail.save(mail, function() {
	// 			alert("Email sent with success!")
	// 		}, function(response) {
	// 			alert("Error " + response.status + " when sending mail: " + response.data);
	// 		});		
	// 	}
	// };

	return {
		getFiles: function() {
			return serviceRest.getFiles();
		},
		getFile: function(valFile) {
			return serviceRest.getFile({fileId: valFile});
		},
		getMail: function(valFile, emailId) {
			return serviceRest.getMail({fileId: valFile, emailId: emailId});
		},
		sendEmail: function(email) {
			serviceRest.sendEmail(email, function() {
				alert("Email sent with success!")
			}, function(response) {
				alert("Error " + response.status + " when sending mail : " + response.data);
			});
			
		}
	};

})