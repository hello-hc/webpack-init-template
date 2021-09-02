 # webpack5新特性

- 启动命令
- 持久化缓存
- 资源模块
- `moduleIds` & `chunkIds`的优化
- nodejs的polyfill
- 更智能的tree shaking
- 模块联邦


## 启动命令

### 安装

````jsx
// 创建项目文件夹
mkdir panda_webpack_template

// 进入项目文件夹
cd panda_webpack_template

// 初始化package.json
npm init -y

// 安装 webpack 及其它配套模块
npm install webpack webpack-cli webpack-merge webpack-dev-server html-webpack-plugin babel-loader @babel/core @babel/preset-env @babel/preset-react style-loader css-loader --save-dev

// 安装 react 全家桶
npm install react react-dom react-router-dom redux react-redux redux-saga react-intl-hooks  --save

// 安装 eslint
npm install eslint eslint-formatter-friendly eslint-loader eslint-plugin-babel eslint-plugin-react --save-dev

// 安装其他可能需要的依赖
npm install loadsh moment antd --save

// 安装其他依赖
npm install react-beautiful-dnd --save

// 安装一些webpack优化可能需要的依赖

````

### 使用

````jsx
// 创建项目结构及文件
|__ config/ // webpack配置文件夹
|____webpack.dev.js
|____webpack.prod.js
|____webpack.base.js
|__ node_modules // 项目依赖文件夹
|__ public/ // 静态资源目录
|____ index.html
|__ src/ // 项目主体文件夹
|____ index.js
|____ app.jsx
|__ package.json
|__ package-lock.json
|__ README.md
````

````jsx
// config/
// webpack.dev.js

// webpack.prod.js

// webpack.base.js

````

````jsx
// src/
// index.js
import React from "react";
import ReactDom from "react-dom";

import App from './app.jsx';

ReactDom.render(<App />, document.getElementById('root'));

// app.jsx
import React from 'react';

const App = () => {
    return (
        <div>
            App Page
        </div>
    );
};

export default App;
````

````html
<!-- public/ -->
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
````

````jsx
// package.json
"scripts": {
  "start": "webpack server"
},
````



## 持久化缓存

- webpack会缓存生成的webpack模块和chunk，来改善构建速度
- 缓存在webpack5中默认开启，缓存默认是在内存中，但是可以对cache进行设置
- webpack追踪了每个模块的依赖，并创建了文件系统快照。此快照会与真实文件系统进行比较，当检测到差异时，将触发对应模块的重新构建

````jsx
// webpack配置中添加
cache: {
    type: 'filesystem', // 'memory' || 'filesystem'
    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack')
}

// 注意：如果type设置为filesysetem，那么请最好不要使用cnpm。不然会出现问题。
// 原因是webpack5的持久化缓存和cnpm的安装包名之间有冲突，导致webpack5假死，无法生成缓存文件
````



## 资源模块

资源模块是一种模块类型，它允许使用资源文件（字体、图标等）而无需额外配置loader

- raw-loader => asset/source 导出资源源代码
- file-loader => asset/resource 发送一个单独的文件并导出URL
- url-loader => asset/inline 导出一个资源的data URL

- asset 在导出一个data URL 和发送一个单独的文件之间自动选择。之前通过使用url-loader，并且配置资源体积限制实现
- Rule.type
- asset-modules

````js
// webpack.config.js
module.exports = {
	module: {
    rules: [
      {
        test: /\.png$/,
        type: 'asset/resource'
      },
      {
        test: /\.ico$/,
        type: 'asset/inline'
      },
      {
        test: /\.txt$/,
        type: 'asset/source'
      },
      {
        test: /\.jpg$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        }
      }
    ]
  }
}
````

````jsx
// src/app.jsx
import png from './assets/logo.png';
import ico from './assets/logo.ico';
import jpg from './assets/logo.jpg';
import txt from './assets/logo.txt';

console.log(png, ico, jpg, txt);
````



## URLs

- experiments
- Webpack 5 支持在请求中处理协议
- 支持data 支持base64 或原始编码，MimeType 可以在module.rule中被映射到加载器和模块类型

````jsx
// src/app.jsx
import data from "data:text/javascript,export default 'title'";

console.log(data, 'data');
````



## moduleIds & chunkIds 的优化

概念和选项

- module: 每一个文件其实都可以看成一个 module
- chunk: webpack打包最终生成的代码块，代码块会生成文件，一个文件对应一个chunk
- 在webpack5之前，没有从entry打包的chunk文件，都会以1、2、3...的文件命名方式输出，删除某些文件可能会导致缓存失效
- 在生产模式下，默认开启这些功能chunkIds: "deterministic", moduleIds: "deterministic",此算法采用确定性的方式将短数字ID（3或4个字符）短hash值分配给modules和chunks
- chunkId设置为deterministic，则output中chunkFilename里的[name]会被替换成确定性短数字ID
- 虽然chunkId不变（不管是deterministic ｜ natural | named）,但更改chunk内容，chunkhash还是会改变的

| 可选值        | 含义                         | 示例          |
| ------------- | ---------------------------- | ------------- |
| natural       | 按使用顺序的数字ID           | 1             |
| named         | 方便调试的高可读性ID         | Src_two_js.js |
| deterministic | 根据模块名称生成简短的hash值 | 915           |
| size          | 根据模块大小生成的数字ID     | 0             |

````jsx
// webpack.config.js
module.exports = {
  mode: 'development',
  devtool: false,
  optimization: {
    moduleIds: "deterministic", // 模块名称的生成规则
		chunkIds: "deterministic", // 代码块名称的生成规则
  }
}

// src/app.jsx
import ('./A.js');
import ('./B.js');
import ('./C.js');
````



## 移除Node.js的polyfill

- webpack 带了许多Node.js核心模块的polyfill，一旦模块中使用了任何核心模块（如crypto），这些模块就会被自动启用.
- webpack5 不再自动引入这些polyfill.

````jsx
// 安装
npm i crypto-js crypto-browserify stream-browserify buffer -D

// src/app.jsx
import CryptoJs from 'crypto-js';

console.log(CryptoJs.MD5('hello').toString()); // hash 值

// webpack配置
resolve: {
  fallback: {
    // 不需要polyfill
    "crypto": false,
    "buffer": false,
    "stream": false,
    // "crypto": require.resolve('crypto-browserify'),
    // "buffer": require.resolve('stream-browserify'),
    // "stream": require.resolve('buffer'),
  }
}
````



## 更强大的 Tree shaking

- tree-shaking 就在打包的时候剔除没有使用到的代码
- webpack4 本身的tree shaking 比较简单，主要是找一个 import 进来的变量是否在这个模块内出现过
- webpack5 可以进行根据作用域之间的关系来进行优化
- webpack-deep-scope-demo

````jsx
import {isNumber, isNull} from 'loadsh';

export function isNull(...args) {
    return isNull(...args);
}

````

**deep-scope**
````jsx
// webpack4的tree shaking无法实现像这种代码的剔除
// 1. entry 引入了 function 1
// 2. module 1: function1 function2  function2引入了function3
// 3. module 2: function3 function4

// src/app.jsx
import {function1} './module1';

console.log(function1);

// src/module1.js
export function function1 () {
    console.log('function1');
}
export function function2 () {
    console.log('function2');
}

// src/module2.js
export function function3 () {
    console.log('function3');
}
export function function4 () {
    console.log('function4');
}

// webpack 配置
module.exports = {
    mode: 'development',
    optimization: {
        usedExports: true
    }
}
````

**sideEffects**
- 函数作用域指当调用函数时，除了返回函数值之外，还产生了附加的影响，例如修改全局变量
- 严格的函数式语言要求函数必须无副作用

````jsx
// package.json
sideEffects: false // 没有任何副作用

sideEffects: ["*.css"] // 忽略css文件
````

````jsx
// src/app.jsx
import './title.js';

// src/title.js
document.title = '改标题';

export function getTitle() {
    console.log('getTitle');
}
````

## 模块联邦
动机
- Module Federation的动机是为了不同开发小组间共同开发一个或者多个应用
- 应用将被划分为更小的应用块，一个应用块，可以是比如头部导航或者侧边栏的前端组件，也可以是数据获取逻辑的逻辑组件
- 每个应用块由不同的组开发
- 应用或者应用块共享其他应用块或者库


Module Federation
- 使用 Module Federation 时，每个应用块都是一个独立的构建，这些构建都将编译为容器
- 容器可以被其他应用或者其他容器应用
- 一个被引用的容器被称为 remote ，引用者被称为 host，remote 暴露模块给 host，host则可以使用这些暴露的模块，这些模块被称为 remote 模块

````jsx
    Host    Remote     Host    Remote
  应用 -------------> 容器 -------------> 容器
  ｜                 ｜                 ｜
  ｜<------------- 独立构建 ------------>｜
````

参数配置：

| 字段     | 类型   | 含义                                                         |
| -------- | ------ | ------------------------------------------------------------ |
| name     | string | 必传值，即输出的模块名，被远程引用时路径为${name}/${expose}  |
| library  | object | 声明全局变量的方式，name为umd的name                          |
| filename | string | 构建输出的文件名                                             |
| remotes  | object | 远程引用的应用名及其别名的映射，使用时以key值作为name        |
| exposes  | object | 被远程引用时可暴露的资源路径及其别名                         |
| shared   | object | 与其他应用之间可以共享的第三方依赖，使你的代码中不用重复加载同一份依赖 |



````jsx
// remote/webpack.config.js
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        publicPath: 'http://localhost:8080/',
    },
    devServer: {
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/presets-react"]
                    },
                },
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: 'remoteEntry.js',
            name: 'remote',
            exposes: {
                './NewsList': './src/NewsList'
            }
        })
    ]
}

// remote/src/index.js
import ('./bootstrap');
````



````jsx
// host/webpack.config.js
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        publicPath: 'http://localhost:8081/',
    },
    devServer: {
        port: 8081,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/presets-react"]
                    },
                },
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: 'remoteEntry.js',
            name: 'remote',
            exposes: {
                './NewsList': './src/NewsList'
            }
        })
    ]
}

// host/src/index.js

````
