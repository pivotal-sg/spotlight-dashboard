var path = require('path');
var forceSSL = require('express-force-ssl');
var isDevelopment = (process.env.NODE_ENV !== 'production');
var static_path = path.join(__dirname, 'public');

process.on( 'SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit( );
})

if (isDevelopment) {
  var config = require('./webpack.config');
  var WebpackDevServer = require('webpack-dev-server');
  var webpack = require('webpack');
  var port = process.env.SPOTLIGHT_DASHBOARD_PORT ? process.env.SPOTLIGHT_DASHBOARD_PORT : 9000;

  new WebpackDevServer(webpack(config), {
    contentBase: static_path,
    hot: true
  }).listen(port, '0.0.0.0', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:' + port + ' in DEV');
  });
} else {
  var express = require('express');
  var app = express();

  if(process.env.FORCE_SSL != 'false'){
    app.set('forceSSLOptions', {
      trustXFPHeader: true,
    });
    app.use(forceSSL);
  }

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
