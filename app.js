
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(allowCrossDomain);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var quotes = [
  { 
    id: '145345',
    author : 'Audrey Hepburn', 
    text : "Nothing is impossible, the word itself says 'I'm possible'!"
  },
  { 
    id: '4356524323',
    author : 'Walt Disney', 
    text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"
  },
  { 
    id: '123145435',
    author : 'Unknown', 
    text : "Even the greatest was once a beginner. Don't be afraid to take that first step."
  },
  { 
    id: '765478654',
    author : 'Neale Donald Walsch', 
    text : "You are afraid to die, and you're afraid to live. What a way to exist."
  }
];

app.get('/', routes.index);

app.get('/quotes', function(req, res) {

  var response = {};
  response.quotes = quotes;
  res.json(response);
});

app.get('/quotes/:id', function(req, res) {

  var quoteFound = false;

  for(var i = 0; i < quotes.length; i++) {

    if(quotes[i].id == req.params.id) {
      quoteFound = true;
      res.json(quotes[i]);
    }
  }

  if(!quoteFound) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }
});

app.post('/quotes', function(req, res) {

  if(!req.body.hasOwnProperty('author') || 
     !req.body.hasOwnProperty('text')) {
    res.statusCode = 400;
    return res.send('Error 400: Put syntax incorrect.');
  }

  var newQuote = {
    id: new Date().getTime(),
    author : req.body.author,
    text : req.body.text
  };

  quotes.push(newQuote);
  res.json(true);
});

app.put('/quotes/:id', function(req, res) {

  if( !('id' in req.params) ) {
    res.statusCode = 400;
    return res.send('Error 400: You need to provide an Id.');
  }

  for(var i = 0; i < quotes.length; i++) {

    if(quotes[i].id == req.params.id) {

      if(req.body.hasOwnProperty('author')) {
        quotes[i].author = req.body.author;
      }

      if(req.body.hasOwnProperty('text')) {
        quotes[i].text = req.body.text;
      }

      break;
    }
  }

  res.json(true);
});

app.delete('/quotes/:id', function(req, res) {

  for(var i = 0; i < quotes.length; i++) {
    if(quotes[i].id == req.params.id) {
      quotes.splice(i, 1);
      break;
    }
  }
  res.json(true);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
