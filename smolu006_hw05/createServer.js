
const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');


http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if(req.url === '/'){
    indexPage('client/index.html',req,res);
  }
  else if(req.url === '/calendar.html'){
    indexPage('client/calendar.html', req,res);
  }
  else if(req.url === '/index.html'){
    indexPage('client/index.html',req,res);
  }
  else if(req.url === '/calendar.json'){
    fs.readFile('calendar.json',function(err,data){
      if(err){
        throw err;
      }
      res.writeHead(200, {
         'Content-Type': 'application/json',
           'Cache-Control': 'no-cache',
         'Connection': 'keep-alive',
           'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': 'true'
      });
      res.write(data);
      res.end();
      res.end();
    });
  }
  else if(req.url === '/postCalendarEntry'){
    handleFormRequest(req,res);
  }
  else if(req.url === '/addCalendar.html'){
    indexPage('client/addCalendar.html', req,res);
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end("404 Not Found");
  }
}).listen(9000);

function indexPage(url,req, res) {
  fs.readFile(url, function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function handleFormRequest(req,res){
  if (req.method == 'POST') {
      var body = '';
      req.on('data', function (data) {
          body += data;
      });
      req.on('end', function () {
          var post = qs.parse(body);
          var calendarPost = {
              eventName: "",
              location: "",
              date: ""
          };
          calendarPost.eventName = post['eventName']; //add some data
          calendarPost.location = post['location'];
          calendarPost.date = post['date'];
          fs.readFile('calendar.json','utf-8',function(err,data){
            var json = JSON.parse(data);
            json.calendar.push(calendarPost);
            var sendJson = JSON.stringify(json);
            fs.writeFile('calendar.json',sendJson);
          });
      });
  }
  res.writeHead(302, {
    'Location': '/calendar.html'
  });
  res.end();
}
