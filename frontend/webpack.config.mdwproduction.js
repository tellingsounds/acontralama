/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

const PREFIX = '/acontra';

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin({
      PATH_PREFIX: PREFIX,
      API_URL: PREFIX + '/api',
      APPBAR_COLOR: '#3f51b5', // acontra-lila
      // APPBAR_COLOR: '#009688', // teal zum testen
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.html'),
      publicPath: PREFIX,
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
});
