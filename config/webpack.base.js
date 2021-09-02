const path = require("path");
// const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 用于将 CSS 从主应用程序中分离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 用于 CSS 的压缩
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// const {NODE_ENV} = process.env;

const ROOT_PATH = path.resolve(__dirname, "..");
// const SOURCE_PATH = path.resolve(ROOT_PATH, "src");
const PUBLIC_PATH = path.resolve(ROOT_PATH, "public");
const OUTPUT_PATH = path.resolve(ROOT_PATH, "dist");

module.exports = {
  entry: "./src/index.js",
  // 上面的等同于下面的写法，上面的是它的语法糖 （下方为默认值）
  //   entry: {
  //       main: "./src/index.js"
  //   },
  output: {
    path: path.resolve(OUTPUT_PATH), // 输出路径
    filename: "[name].[contenthash].js", // 入口代码块文件名的生成规则
    chunkFilename: "[name].js", // 非入口模块的生成规则
    assetModuleFilename: "images/[hash][ext][query]", // 在这里自定义配置输出文件名
    clean: true, // 自动清理dist目录
  },
  cache: {
    type: "filesystem", // 'memory' || 'filesystem'
    // filesystem 默认的缓存路径就是如下路径
    cacheDirectory: path.resolve(ROOT_PATH, "node_modules/.cache/webpack"),
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      //   {
      //     test: /\.css$/,
      //     use: ["style-laoder", "css-loader"],
      //   },
      {
        test: /\.css$/,
        // use: ['style-loader', 'css-loader']
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      //   {
      //     test: /\.png$/,
      //     type: "asset/resource",
      //   },
      //   {
      //     test: /\.ico$/,
      //     type: "asset/inline",
      //   },
      //   {
      //     test: /\.txt$/,
      //     type: "asset/source",
      //   },
      //   {
      //     test: /\.jpg$/,
      //     type: "asset",
      //     parser: {
      //       dataUrlCondition: {
      //         maxSize: 4 * 1024, // 4kb
      //       },
      //     },
      //   },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      //   chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      `...`,
      new CssMinimizerPlugin(), // 仅在生产环境开启 CSS 优化 如果还想在开发环境下启用 CSS 优化，请将 optimization.minimize 设置为 true
    ],
    usedExports: true, // 标注使用到的导出
    // webpack5默认使用此配置（默认3位数，打包出来非入口模块超过999个文件可能出现问题）
    // moduleIds: "deterministic", // 模块名称的生成规则
    // chunkIds: "deterministic", // 代码块名称的生成规则
  },
  plugins: [
    new MiniCssExtractPlugin({
      // CSS 拆分
      filename: "[name]-[hash:8].css.css",
      // ignoreOrder: true
    }),
    new HtmlWebpackPlugin({
      title: "WebpackInitTemplate",
      filename: "index.html",
      inject: true,
      template: path.resolve(PUBLIC_PATH, "index.html"),
    }),
  ],
};
