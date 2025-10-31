## 依赖安装
1. React 和 TypeScript 依赖
```shell
# React 核心
npm install react@18 react-dom@18

# TypeScript 类型定义
npm install --save-dev @types/react@18 @types/react-dom@18

# TypeScript
npm install --save-dev typescript @types/node
```

2. Webpack 相关依赖
```shell
# Webpack 核心
npm install --save-dev webpack webpack-cli webpack-dev-server

# Webpack 加载器
npm install --save-dev ts-loader html-webpack-plugin css-loader style-loader

# Babel（用于 JSX 和现代 JavaScript）
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader
```

3. TailwindCSS 相关依赖
```shell
# TailwindCSS 核心
npm install --save-dev tailwindcss@3 postcss autoprefixer

# PostCSS 加载器
npm install --save-dev postcss-loader
```
注意：这里为了防止版本冲突，使用tailwindcss@3
这里可运行的版本推荐：tailwindcss: "^3.4.18"   postcss: "^8.5.6"    postcss-loader": "^8.2.0"   autoprefixer: "^10.4.21"


## 配置文件
1. package.json
```json
{
    "name": "frontend",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "description": "",
    "dependencies": {
    "@types/echarts": "^4.9.22",
    "echarts": "^5.6.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
    },
    "devDependencies": {
    "@babel/core": "^7.28.5",
    "@babel/preset-env": "^7.28.5",
    "@babel/preset-react": "^7.28.5",
    "@babel/preset-typescript": "^7.28.5",
    "@types/node": "^24.9.2",
    "@types/react": "^18.3.26",
    "@types/react-dom": "^18.3.7",
    "autoprefixer": "^10.4.21",
    "babel-loader": "^10.0.0",
    "css-loader": "^7.1.2",
    "html-webpack-plugin": "^5.6.4",
    "postcss": "^8.5.6",
    "postcss-loader": "^8.2.0",
    "style-loader": "^4.0.0",
    "tailwindcss": "^3.4.18",
    "ts-loader": "^9.5.4",
    "typescript": "^5.9.3",
    "webpack": "^5.102.1",
    "webpack-cli": "^6.0.1",
    "webpack-dev-server": "^5.2.2"
    }
}
```

2. tsconfig.json
```json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": [
            "DOM",
            "DOM.Iterable",
            "ES6"
        ],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "ESNext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": false,
        "jsx": "react-jsx",
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "include": [
        "src"
    ]
}
```

3. babel.config.js
```js
module.exports = {
    presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
    ],
};
```

4. postcss.config.js
```js
module.exports = {
    plugins: {
    tailwindcss: {},
    autoprefixer: {},
    },
}
```

5. tailwind.config.js
```js
// tailwind.config.js
// 下面已经有了 JSDoc 注释，会有自动提示了

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
    extend: {
        padding: {},
        margin: {},
        width: {},
        height: {},
    },
    },
    plugins: [],
}
```

6. index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 全局基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 推荐加上这句，避免布局计算问题 */
}

/* 确保页面根节点撑满整个视口 */
html,
body,
#root {
  width: 100%;
  height: 100%;
}

/*滚动条  定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #EDEFF3;
}

/*滑块  */
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #C0C0C0;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

/*滚槽   轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    width: 6px;
    background-color: #F5F5F5;
}
```

7. webpack.config.js
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    module: {
    rules: [
        {
        test: /\.tsx?$/,
        use: [
            {
            loader: 'babel-loader',
            options: {
                presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
                ],
            },
            },
            'ts-loader'
        ],
        exclude: /node_modules/,
        },
        {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
        ],
        },
        {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        },
    ],
    },
    resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
        '@': path.resolve(__dirname, 'src'),
    },
    },
    output: {
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
    },
    plugins: [
    new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
    }),
    ],
    devServer: {
    static: './dist',
    hot: true,
    port: 3000,
    historyApiFallback: true,
    open: true,
    },
    optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
        chunks: 'all',
        cacheGroups: {

        // React 相关库
        react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
        },

        // Ant Design
        antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            name: 'antd',
            chunks: 'all',
            priority: 15,
        },

        // ECharts
        echarts: {
            test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
            name: 'echarts',
            chunks: 'all',
            priority: 15,
        },
        
        // 工具库
        utils: {
            test: /[\\/]node_modules[\\/](lodash|moment|dayjs|axios)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 10,
        },

        // 其他 node_modules
        vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 5,
        },
        },
    },
    },
};
```