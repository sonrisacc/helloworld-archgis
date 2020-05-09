const path = require('path');
const babelrc = require('./package.json').babel;
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelrc,
          },
        ],
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  devtool: 'inline-source-map',
  mode: 'none',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),
  ],
};