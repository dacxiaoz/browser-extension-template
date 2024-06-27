const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = [
  {
    context: __dirname,
    target: 'web',
    devtool: "source-map",
    entry: {
      popup: path.resolve(__dirname, 'src/pages/main.tsx'),
    },
    output: {
      path: path.resolve(__dirname, 'mn-browser-extension'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new NodePolyfillPlugin(),
      new MiniCssExtractPlugin(),
    ],
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader:'css-loader',
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                // `dart-sass` 是首选
                implementation: require('sass'),
                sassOptions: {
                  fiber: false,
                },
              },
            },
          ],
        },
      ],
    },
  },
  {
    context: __dirname,
    target: 'web',
    devtool: "source-map",
    entry: {
      'background': path.resolve(__dirname, 'src/background/index.ts'),
      'inject-script': path.resolve(__dirname, 'src/inject-script/index.ts'),
      'content-script': path.resolve(__dirname, 'src/content-script.ts'),
    },
    output: {
      path: path.resolve(__dirname, 'mn-browser-extension'),
      filename: 'extension/[name]/index.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            context: path.resolve(__dirname, 'src'),
            from: '**/*',
            globOptions: {
              ignore: [
                '**/background/**/*',
                '**/common/**/*',
                '**/content-script',
                '**/injectScript',
                '**/pages',
                '**/utils',
                '**/content-script.ts',
                '**/inject-script.ts',
                '**/type.ts',
                '**/utils.ts',
                '**/index.d.ts',
              ],
            },
          },
        ],
      }),
    ],
  },
];
