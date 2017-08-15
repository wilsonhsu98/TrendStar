var path = require('path')
var webpack = require('webpack')

var config = {
  entry: [
    'webpack/hot/dev-server',
    path.join(__dirname, 'src', 'main')
  ],
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
      }
    ]
  },
  resolve: {
    /**
     * Vue v2.x 之後 NPM Package 預設只會匯出 runtime-only 版本
     */
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: ['.js', '.vue']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config