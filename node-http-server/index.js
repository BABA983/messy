var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// With body-parser configured, now create our route. We can grab POST
// parameters using req.body.variable_name

// POST http://localhost:8080/api/books
// parameters sent with
app.post('/api-dev-proxy/api/v1/doc', function (req, res) {
  console.log(req.body);
  res.send(req.body);
});

app.get('/', function(req,res) {
  console.log(req.headers);
  res.end('hello');
})

app.post('/', function(req,res) {
  console.log(req.headers)
  res.writeHead(200, {
    "Set-Cookie": `mycookie=test`,
  })
  // res.send('11')
  res.end('11')
})

app.listen(8080)
