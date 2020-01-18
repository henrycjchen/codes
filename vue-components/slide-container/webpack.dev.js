const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    watch: true,
    entry: './example/index.js',
    output: {
      path: path.join(__dirname, 'example'),
      filename: 'index.js',
    },
    devServer: {
      contentBase: path.join(__dirname, 'example'),
      port: 9000
    }
});
