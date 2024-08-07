/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const child_process = require('child_process');
function git(command) {
  try {
    return child_process
      .execSync(`git ${command}`, { encoding: 'utf8' })
      .trim();
  } catch {
    return new Date().toISOString();
  }
}

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|woff2?|ttf)$/,
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.md$/,
        use: {
          loader: 'raw-loader',
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      GIT_VERSION: process.env.LAMA_REVISION || git('rev-parse --short=7 HEAD'),
      GIT_AUTHOR_DATE: process.env.LAMA_DATE || git('log -1 -i --format=%aI'),
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.html'),
      publicPath: process.env.LAMA_PATH_PREFIX || 'auto',
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
};
