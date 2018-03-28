## webpack VS parcel

parcel 最大的特点就是简单，内置常见依赖，默认支持模块热替换和引用 CSS 文件。

webpack 4.0 在优化构建性能的同时，也添加了许多默认配置。（重大变化：[点我）](https://zhuanlan.zhihu.com/p/34028750)

| 特性              | webpack              | parcel          |
| --------------- | -------------------- | --------------- |
| 文件名添加 hash      | 支持                   | 不支持             |
| 构建时处理 css       | 需配置                  | 易               |
| tree-shaking    | production 下支持       | 不支持             |
| 构建时预编译          | production 下支持       | 不支持             |
| 生成 html 文件并引用资源 | 需配置，且默认 CSS 在 JS 文件中 | 自动生成，CSS 是独立的文件 |
| 热模块更新（HMR）      | 需配置                  | 开发模式下默认开启       |



## 实践

### 引入文件

**webpack**

```js
const path = require('path');

module.exports = {
    mode: 'development', // development / production
    entry: './src/index.js',
    output: {
        filename: 'bundle-[hash].js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

两个模式（主要区别就是前一个开发模式不压缩，生产模式压缩）

- development：Enables `NamedModulesPlugin`
- production：Enables `UglifyJsPlugin`, `ModuleConcatenationPlugin（预编译）` and `NoEmitOnErrorsPlugin`

**parcel**

开发模式（支持热更新，并开启服务）：

```
parcel index.html --out-dir ../dist/
```

生产模式（代码压缩）：

```js
parcel build index.js --out-dir ../dist
```



### 资源管理

####webpack

webpack 只构建 JS 文件，所以 CSS 文件都会以字符串形式保存在 JS 文件中（当然必要时也可以单独配置，拆分 css 文件），并需手动引用到 index.html 文件中。

对 CSS 预处理，都需要配置 webpack.config.js 文件，添加 loader

```js
module: {
    rules: [{
        test: /\.css$/,
        use: [
      		'style-loader',
      		'css-loader'
    	]
  	}]
}
```

#### parcel

在 js 文件中引入的 CSS 会自动构建并引用到 html 里，还支持预处理器如：less sass stylus

这里举 sass 为例

1. 本地安装依赖包 `npm install node-sass`
2. 在 js 文件中引入 sass 的文件 `import './index.sass'`

执行 parcel，sass 文件将会被构建成 css 文件名引用到 index.html 中



### 资源转换

#### webpack

1. babel

   安装依赖包

   ```
   npm install babel-loader babel-core babel-preset-env webpack
   ```

   配置 `webpack.config.js` 文件

   ```js
   module: {
       rules: [{
           test: /\.js$/,
           exclude: /(node_modules|bower_components)/,
           use: {
               loader: 'babel-loader',
               options: {
                   presets: ['babel-preset-env']
               }
           }
       }]
   }
   ```

2. postcss

   安装

   ```
   npm i -D postcss-loader
   ```

   配置 `postcss.config.js` 文件

   ```js
   module.exports = {
       parser: false,
       plugins: {
           'postcss-import': {},
           'postcss-cssnext': {},
           'cssnano': {},
           'autoprefixer': true
       }
   }
   ```

3. typescript

   安装依赖包

   ```
   npm install --save-dev typescript ts-loader
   ```

   创建 `tsconfig.json` 文件

   ```json
   {
       "compileOptions": {
           "outDir": "./dist/",
           "noImplicitAny": true,
           "module": "es6",
           "target": "es5",
           "jsx": "react",
           "allowJs": true
       }
   }
   ```

   创建 `index.ts` 文件

   ```typescript
   function greeter(person: string) {
       return "Hello, " + person;
   }

   let user = "Jane User";

   document.body.innerHTML = greeter(user);
   ```

   配置 `webpack.config.js`

   ```js
   const path = require('path');

   module.exports = {
       mode: 'development',
       entry: './src/index.ts',
       module: {
           rules: [{
               test: /\.css$/,
               use: [
                   'style-loader',
                   'css-loader'
               ]
           }, {
               test: /.tsx?$/,
               use: 'ts-loader',
               exclude: /node_modules/
           }]
       },
       resolve: {
           extensions: [ '.tsx', '.ts', '.js' ]
       },
       output: {
           filename: 'bundle.js',
           path: path.resolve(__dirname, 'dist')
       },
   };
   ```

#### parcel

1. babel

   ```
   npm i babel-preset-env

   // create a .babelrc:
   {
     "presets": ["env"]
   }
   ```

2. PostCSS

   ```
   npm i postcss-modules autoprefixer

   {
     "plugins": {
       "autoprefixer": {
         "grid": true
       }
     }
   }
   ```

3. typescript

   只需安装 typescript 便能使用

   ```
   npm i typescript
   ```

   ​

### 代码拆分（分块加载）

#### webpack

有三种方法来实现

1. 在 `webpack.config.js` 中配置 `entry point`

   ```js
   const path = require('path');
   const HTMLWebpackPlugin = require('html-webpack-plugin');
   module.exports = {
       mode: 'development',//'production',
       entry: {
           index: './src/index.js',
           another: './src/util.js'
       },
       plugins: [
           new HTMLWebpackPlugin({ // 生成 html 文件，并引入入口文件
               title: 'Code Splitting'
           })
       ],
       output: {
           filename: '[name].bundle.js',
           path: path.resolve(__dirname, 'dist')
       },
   };
   ```

2. 使用 `splitChunks` 提取公共组件

   `webpack 4` 中，`CommonChunkPlugin` 将被配置项 `optimization.splitChunks`

   ```js
   const path = require('path');
   const HTMLWebpackPlugin = require('html-webpack-plugin');
   module.exports = {
       mode: 'development',
       entry: {
           index: './src/index.js',
           another: './src/another.js'
       },
       plugins: [
           new HTMLWebpackPlugin({ // 生成 html 文件，并引入入口文件
               title: 'Code Splitting'
           })
       ],
       optimization: {
           splitChunks: {
               chunks: "all",
               name: 'common',
           }
       },
       output: {
           filename: '[name].bundle.js',
           path: path.resolve(__dirname, 'dist')
       },
   };
   ```

3. 动态引用，`import` 异步加载

   异步加载文件，并返回 `promise`，如果多个异步`import` 的 `chunkname` 一致，则构建时会合并这个文件

   配置 `webpack.config.js`

   ```js
   const path = require('path');
   const HTMLWebpackPlugin = require('html-webpack-plugin');

   module.exports = {
       mode: 'development',//'production',
       entry: {
           index: './src/index.js',
           another: './src/another.js'
       },
       output: {
           filename: '[name].bundle.js',
           chunkFilename: '[name].bundle.js',
           path: path.resolve(__dirname, 'dist')
       },
   };
   ```

   引用方法

   ```js
   function getComponent() {
       return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
         // todo
       })
   }
   getComponent().then(component => {})
   ```

   `async` 写法

   ```js
   async function getComponent() {
       const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
   	// todo
   }
   getComponent().then(component => {});
   ```

#### parcel

`util.js` 文件

```js
export function a() {
    console.log('a');
}

export function b() {
    console.log('b');
}
```

`index.js` 文件

```js
import('./util').then(function (util) {
    util.a();
});
```



### 模块热更新（HMR）

#### webpack

安装依赖

```
npm install --save-dev webpack-dev-server
```

配置 `webpack.config.js`

```js
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',//'production',
    entry: {
        index: './src/index.js',
        another: './src/another.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        // new CleanWebpackPlugin(['dist']),
        new HTMLWebpackPlugin({
            title: 'Hot Module Replacement'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
};
```

配置 `package.json`

```
"scripts": {
    "start": "webpack-dev-server --open"
}
```

执行运行代码

```
npm start
```

#### parcel

开发模式下自动默认支持



## 参考资料

1. parcel 官网，https://en.parceljs.org
2. webpack 官网，https://en.parceljs.org
3. 《webpack 4.0.0-beta.0 新特性介绍》，开元，2018.02.07，http://jdc.jd.com/archives/211981