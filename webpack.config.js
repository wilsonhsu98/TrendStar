var path = require('path')
var webpack = require('webpack')

// ENV
const __PROD__ = process.env.NODE_ENV === 'production';
const __DEV__ = process.env.NODE_ENV === 'development';

let config = {
  output: {
    publicPath: '/dist/',
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue']
  }
};

// Plugins for different environment
if (__PROD__) {
  config.entry = path.join(__dirname, 'src', 'main');
  config.plugins = [
    // short-circuits all Vue.js warning code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // minify with dead-code elimination
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ];
  config.resolve.alias = {
    vue: 'vue/dist/vue.common.js'
  };
} else {
  config.entry = [
    'webpack/hot/dev-server',
    path.join(__dirname, 'src', 'main')
  ];
  config.plugins = [
    new webpack.HotModuleReplacementPlugin()
  ];
  /**
   * Vue v2.x 之後 NPM Package 預設只會匯出 runtime-only 版本
   */
  config.resolve.alias = {
    vue: 'vue/dist/vue.js'
  };
}

module.exports = config