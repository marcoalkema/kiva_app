var path = require('path')
var webpack = require('webpack')

var contentBase = path.join(__dirname, 'build')

module.exports = {
  entry: {
    'main': './js/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    // publicPath: path.resolve(__dirname, 'assets'),
    filename: 'main.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'css-loader'
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: {
    contentBase: contentBase,
    compress: true,
    port: 8080,
    hot: true,
    inline: true
  }
};
