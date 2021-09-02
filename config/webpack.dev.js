const {merge} = require('webpack-merge');

const commonConfig = require('./webpack.base.js');

module.exports = merge(commonConfig, {
    mode: "development",
    devServer: {
        host: '0.0.0.0',
        port: 9099,
        // open: true,
        // hot 和 hotOnly 的区别是在编译错误的时候，再次修改正确之后，hot不会刷新页面，依然显示报错；hotOnly会刷新
        hot: true,
        // hotOnly: true, // 启用热模块替换
    },
    devtool: 'eval-cheap-module-source-map'
})

