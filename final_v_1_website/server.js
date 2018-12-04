// Require HTTPS & file system
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('/root/itp_io_cert/my-key.pem'),
  cert: fs.readFileSync('/root/itp_io_cert/my-cert.pem')
};

var httpServer = https.createServer(options, requestHandler);
var url = require('url');
httpServer.listen(8080);

function requestHandler(req, res) {
  var parsedUrl = url.parse(req.url);
  console.log("The Request is: " + parsedUrl.pathname);
  fs.readFile(__dirname + parsedUrl.pathname,
    // Callback function for reading
    function(err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedUrl.pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(data);
    }
  );
}
