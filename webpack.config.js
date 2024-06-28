const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (env, options) => {
  const fileName = options.mode === 'production' ? 'browser-extension' : 'browser-extension-dev'
  return [
    {
      context: __dirname,
      target: 'web',
      devtool: "source-map",
      entry: {
        // temp: path.resolve(__dirname, 'src/pages/temp/main.tsx'),
        popup: path.resolve(__dirname, 'src/pages/popup/main.tsx'),
      },
      output: {
        path: path.resolve(__dirname, fileName),
        filename: 'html/[name].js',
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      plugins: [
        new NodePolyfillPlugin(),
        new MiniCssExtractPlugin({
          filename: 'html/[name].css',
        }),
        new HtmlWebpackPlugin({
          template: './src/html/popup.html',
          filename: 'html/popup.html',
        }),
        // new HtmlWebpackPlugin({
        //   template: './src/html/temp.html',
        //   filename: 'html/temp.html',
        // }),
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
        'content-script': path.resolve(__dirname, 'src/content-script/index.ts'),
      },
      output: {
        path: path.resolve(__dirname, fileName),
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
                  '**/inject-script.ts',
                  '**/type.ts',
                  '**/utils.ts',
                  '**/index.d.ts',
                  '**/css/**'
                ],
              },
            },
          ],
        }),
      ],
    },
  ];
}
