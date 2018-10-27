const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'react-hookstore.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'hookStore',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
    ]
  },
}
