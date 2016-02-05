const Webpack = require('webpack');

module.exports = {
  entry: './app/App.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.scss?$/,
        loaders: ['style', 'css', 'sass']
      },
    ]
  },
  plugins: [
    new Webpack.ProvidePlugin({
      'Promise': 'es6-promise',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  node: {
    net: 'mock',
    dns: 'mock',
    fs: 'empty'
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true
  }
};
