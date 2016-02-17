var path = require('path');

var isDevelopment = (process.env.NODE_ENV !== 'production');
var static_path = path.join(__dirname, 'public');

if (isDevelopment) {
  var config = require('./webpack.config');
  var WebpackDevServer = require('webpack-dev-server');
  var webpack = require('webpack');

  new WebpackDevServer(webpack(config), {
    contentBase: static_path,
    hot: true
  }).listen(9000, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:9000 in DEV');
  });
} else {
  var express = require('express');
  var app = express();

  app.use(express.static(static_path))
  .get('/', function (req, res) {
    res.sendFile('index.html', {
      root: static_path
    });
  }).listen(process.env.PORT || 8080, function (err) {
    if (err) { console.log(err) };
    console.log('Listening at localhost:8080 in PROD');
  });
}