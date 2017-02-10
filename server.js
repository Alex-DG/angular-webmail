// Create HTTP server
// var http = require("http");
// var PORT = 8080;
//
// http.createServer(function (req, res) {
//
//     console.log(req.url);
//     console.log(req.method);
//     console.log(req.headers);
//
//     var tabMatch = new RegExp("^/hello/(.*)/?$", "gi").exec(req.url);
//
//     res.writeHead(200, {"Content-Type": "text/html"});
//     if (tabMatch) {
//         var result = tabMatch[1];
//         res.end("<h1>Hi</h1> <h2>"+ result +"</h2>"); // server response
//     } else {
//         res.end("<h1>Hi</h1> <h2>What's up?!</h2>"); // server response
//     }
// }).listen(PORT);
//
// console.log("Server has started on PORT:" + PORT);

var http = require("http");
var fs = require("fs");
var mime = require("mime");
var express = require("express");
var serviceMails = require(__dirname + "/get-mails.js"); // define dependency to get-mail module

// middlewares
var logger = require("morgan");
var serveStatic = require("serve-static");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");

var PORT = 8080;

serviceMails.createEmail();

var app = express();

app.use(favicon(__dirname + "/app/favicon.ico"));
app.use(logger(":method :url"));
app.use(serveStatic(__dirname + "/app"));

// API
var api = express();

/* Get files list
 * GET /api/files
 */
api.get("/files", serviceMails.getFiles);

/* Get one file
 * GET /api/files/fileId
 */
api.get("/files/:fileId", serviceMails.getFileById);

// Get one mail
// GET /api/files/fileId/mailId
api.get("/files/:fileId/:emailId", serviceMails.getMail);

app.use(bodyParser.json());

// Send a mail
// POST /api/send
api.post("/send", serviceMails.sendEmail);

app.use("/api", api);

http.createServer(app).listen(PORT);

console.log("Server has started on port: " + PORT);