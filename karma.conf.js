module.exports = function(config) {
  config.set({
    browsers: [ 'Chrome' ],
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },
    singleRun: true,
    frameworks: [ 'mocha', 'sinon-chai'],
    files: [
      'tests.webpack.js'
    ],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-sinon',
      'karma-sinon-chai'
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'dots' ],
    webpack: {
      devtool: 'inline-source-map',
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
      }
    },
    webpackServer: {
      noInfo: true
    }
  });

  if(process.env.TRAVIS){
    config.browsers = ['Chrome_travis_ci'];
  }
};
