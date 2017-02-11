/**
 * Created by Alex on 11/02/2017.
 */
angular.module("MailServiceHttp", [])
    .factory("mailService", function ($http) {

        var URL_API = "http://localhost:8080/api/";

        return {
            getFiles: function () {
                var promise = $http.get(URL_API + "files");
                var result = [];

                promise.then(function (response) { // Callback success
                    angular.extend(result, response.data);
                }, function (error) { // Callback error
                    alert("Error " + error.status + " when pulling files : " + error.data);
                });

                return result; // return array
            },
            getFile: function (valFile) {
                var promise = $http.get(URL_API + "files/" + valFile);
                var result = {};

                promise.then(function (response) {
                    angular.extend(result, response.data);
                }, function (error) {
                    alert("Error " + error.status + " when pulling file " + valFile + " : " + error.data);
                });

                return result; // return object
            },
            getMail: function (valFile, emailId) {
                var promise = $http.get(URL_API + "files/" + valFile + "/" + emailId);
                var result = {};

                promise.then(function (response) {
                    angular.extend(result, response.data);
                }, function (error) {
                    alert("Error " + error.status + " when pulling mail " + emailId + " in file " + valFile + " : " + error.data);
                });

                return result;
            },
            sendEmail: function (email) {

                var promise = $http.post(URL_API + "send", email);

                promise.then(function (response) {
                    alert("Email sent with success! ");
                }, function (error) {
                    alert("Error " + error.status + " when sending email : " + error.data);
                });
            }
        }
    })