const { ProvidePlugin, WatchIgnorePlugin } = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const isProduction = process.env.NODE_ENV === 'production';

console.log(ProvidePlugin);

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "[name].css",
  }),

  new ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  })
];

if (!isProduction) {
  plugins.push(
    new BrowserSyncPlugin({
      host: 'nnaimov.int',
      proxy: 'http://nnaimov.int/starter/',
      port: 3000,
      open: 'local',
      files: [
          path.resolve('index.html'),
      ],
    }),

    new WebpackBuildNotifierPlugin({
      title: "My Project Webpack Build",
      logo: path.resolve("./src/images/favicon/favicon-32x32.png"),
      suppressSuccess: true
    })
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
      '@js': path.resolve('./src/js'),
      '@scss': path.resolve('./src/scss'),
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

      /**
       * Handle fonts.
       */
      {
        test: /fonts[\\/].*\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins,

  devtool: isProduction ? false : 'source-map',
};