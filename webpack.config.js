const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "[name].css",
  }),
];

if (!isProduction) {
  plugins.push(
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: {
        baseDir: ['public'],
      },
    }),
  );
}

module.exports = {
  mode: isProduction ? 'production' : 'development',

  entry: {
    'bundle': './index.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve('./dist/'),
  },

  resolve: {
    extensions: ['.js', '.css', '.scss'],
    alias: {
      '@js': path.resolve('./js'),
      '@scss': path.resolve('./scss'),
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },

      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer({}),
              ],
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  plugins,

  devtool: isProduction ? false : 'source-map',
};
