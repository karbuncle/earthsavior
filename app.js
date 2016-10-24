var hbs = require('hbs');
var express = require('express');
var handlebars = require('handlebars');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/wireframe', express.static(__dirname + '/wireframe'));
app.use(express.static(__dirname + '/includes'));

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
