/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CheckerPlugin = require('fork-ts-checker-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
/* eslint-enable @typescript-eslint/no-var-requires */

const sourceRootPath = path.join(__dirname, 'src');
const distRootPath = path.join(__dirname, 'dist');
const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const webBrowser = process.env.WEB_BROWSER ? process.env.WEB_BROWSER : 'chrome';
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    background: path.join(sourceRootPath, 'ts', 'background', 'index.ts'),
    options: path.join(sourceRootPath, 'ts', 'options', 'index.tsx'),
    popup: path.join(sourceRootPath, 'ts', 'popup', 'index.tsx'),
    inpage: path.join(sourceRootPath, 'ts', 'inpage', 'index.ts'),
    actions: path.join(sourceRootPath, 'ts', 'actions', 'index.tsx'),
    'message-bus': path.join(
      sourceRootPath,
      'ts',
      'content-scripts',
      'message-bus.ts'
    ),
  },
  output: {
    path: distRootPath,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } }, // or whatever your project requires
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              // ["@babel/plugin-proposal-decorators", { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-optional-chaining',
              isDevelopment && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: './dist',
  },
  devtool: false,
  watch: false,
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(sourceRootPath, 'html', 'options.html'),
      inject: 'body',
      filename: 'index.html',
      title: 'Blockstack',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourceRootPath, 'html', 'popup.html'),
      inject: 'body',
      filename: 'popup.html',
      title: 'Blockstack',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourceRootPath, 'html', 'actions.html'),
      inject: 'body',
      filename: 'actions.html',
      title: 'Blockstack',
      chunks: ['actions'],
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(sourceRootPath, 'assets'),
        to: path.join(distRootPath, 'assets'),
        test: /\.(jpg|jpeg|png|gif|svg)?$/,
      },
      {
        from: path.join(sourceRootPath, 'manifest.json'),
        to: path.join(distRootPath, 'manifest.json'),
        toType: 'file',
      },
    ]),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(nodeEnv),
      WEB_BROWSER: JSON.stringify(webBrowser),
      EXT_ENV: JSON.stringify(process.env.EXT_ENV || 'web'),
    }),
    isDevelopment &&
      new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }),
  ].filter(Boolean),
};

if (process.env.EXT_ENV === 'watch') {
  module.exports.watch = true;
  module.exports.plugins.push(
    new ChromeExtensionReloader({
      port: 9128,
      reloadPage: true,
      entries: {
        background: 'background',
        options: 'index',
        popup: 'popup',
        contentScript: ['message-bus'],
      },
    })
  );
}

if (nodeEnv === 'production') {
  module.exports.plugins.push(
    new CleanWebpackPlugin({ verbose: true, dry: false })
  );
}