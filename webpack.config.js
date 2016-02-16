const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugins = [
    new Webpack.ProvidePlugin({
      'Promise': 'es6-promise',
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new ExtractTextPlugin("style.css", {
      allChunks: true
    })
  ];

if(process.env.NODE_ENV == 'production') {
  plugins.push(
    new Webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_HOST": JSON.stringify("")
    })
  );
} else {
  plugins.push(
    new Webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_HOST": JSON.stringify("http://localhost:3000")
    })
  );
}

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
      {
        test: /\.scss?$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      }
    ]
  },
  plugins: plugins,
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
