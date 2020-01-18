const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    entry: './src/slide-container.vue',
    mode: 'production',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'slide-container.js',
      libraryTarget: 'umd'
    },
    externals: ['vue']
});
