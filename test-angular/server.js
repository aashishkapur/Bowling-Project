var express = require('express');
var app = express();

// // respond with "hello world" when a GET request is made to the homepage
// app.get('/', function(req, res) {
//   res.send('hello world');
// });

// app.get('*', function(req, res) {
// 	res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
// });
app.use(express.static(__dirname + ''));


var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});