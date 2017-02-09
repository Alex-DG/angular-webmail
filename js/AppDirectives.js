angular.module("AppDirectives", [])
    .directive("contentEmail", function () {
        return {
            restrict: "E", // E for Element
            template: '<div class="spacer"> \
                <div class="well"> \
                    <h1>{{email.subject}}</h1> \
                    <p><label>From :</label> <span>{{email.from}}</span></p> \
                    <p><label>To :</label> <span>{{email.to}}</span></p> \
                    <p><label>Date :</label> <span>{{email.date | date:\'dd/MM/yyyy HH:mm\'}}</span></p> \
                </div> \
                <p ng-bind-html="email.content"></p> \
            </div>',
            scope: {
                email: "="
            }
        }
    })
    .directive("newEmailDir", function () {
        return {
            restrict: "E",
            template: '\
            <div class="spacer">\
                <form id="formNewEmail" name="formNewEmail">\
                    <div class="input-group">\
                        <span class="input-group-addon labelFieldNewEmail">To</span>\
                        <input type="text" class="form-control" ng-model="newEmail.to" />\
                    </div>\
                    <div class="spacer input-group">\
                        <span class="input-group-addon labelFieldNewEmail">Subject</span>\
                        <input type="text" class="form-control" ng-model="newEmail.subject" />\
                    </div>\
                    <div class="spacer">\
                        <textarea ui-tinymce="optionsTinyMce" class="contentNewEmail" rows="10" ng-model="newEmail.content"></textarea>\
                    </div>\
                    <div class="spacer text-center">\
                        <button ng-click="sendEmailEvent()" class="btn btn-success">Send</button>\
                        <span class="hSpacer"></span>\
                        <button ng-click="clearEmail()" ng-disabled="formNewEmail.$pristine" class="btn btn-warning">Clear</button>\
                    </div>\
                </form>\
            </div>',
            scope: {
                sendEmail: "&"
            },
            controller: function ($scope) {

                $scope.optionsTinyMce = {
                    statusbar: false,
                    menubar: false
                };

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

                $scope.sendEmailEvent = function () {
                    var regExpValidEmail = new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$", "gi");

                    if (!$scope.newEmail.to || !$scope.newEmail.to.match(regExpValidEmail)) {
                        window.alert("Erreur\n\nMerci de vérifier l'adresse e-mail saisie.");
                        return;
                    }

                    if (!$scope.newEmail.subject) {
                        if (!window.confirm("Confirmation\n\nÊtes-vous certain de vouloir envoyer un mail sans objet ?")) {
                            return;
                        }
                    }

                    $scope.sendEmail({newEmail: $scope.newEmail});
                    $scope.clearEmail(); // TODO: fix $location.path in app.js
                }

                $scope.$on("initFormNewEmail", function () {
                    $scope.clearEmail();
                })
            }
        };
    })