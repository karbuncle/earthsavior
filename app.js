var express = require('express');
var routes = require('./routes/routes.js');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/wireframe', express.static(__dirname + '/wireframe'));
app.use(express.static(__dirname + '/includes'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(routes);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
