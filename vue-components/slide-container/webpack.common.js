const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                postLoaders: {
                  html: 'babel-loader'
                }
              }
            }
          ]
        },
        {
          test: /\.(scss|css)$/,
          use: ['vue-style-loader', 'css-loader', 'sass-loader']
        },
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ],
    resolve: {
      extensions: ['.vue', '.js']
    },
};
