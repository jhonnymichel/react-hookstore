const merge =  require('webpack-merge');
const UglifyJSPlugin =  require('uglifyjs-webpack-plugin');
const config =  require('./webpack.config');
const devConfig =  require('./webpack.dev.config');
const path = require('path');
const webpack = require('webpack');

const umdConfig = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  externals: ['react', 'react-dom'],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
    }),
  ],
};

const minConfig = {
  output: {
    filename: 'react-hookstore.min.js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true
      })
    ],
  },
};

const demoConfig = {
  optimization: minConfig.optimization,
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'demo.js'
  },
  externals: [],
}

module.exports = [
  merge(config, umdConfig),
  merge(umdConfig, minConfig),
  { ...devConfig, ...umdConfig, ...demoConfig }
];
