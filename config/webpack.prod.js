const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.base.js');

module.exports = merge(commonConfig, {
    mode: "production",
    plugins: []
});