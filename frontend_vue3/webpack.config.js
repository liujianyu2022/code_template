const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript'],
                        plugins: ['@vue/babel-plugin-jsx'],
                    },
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],           // 让 vue 的 ts 通过 ts-loader
                        transpileOnly: true,                    // 仅转译，不做类型检查
                    },
                },
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
        extensions: ['.vue', '.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            vue$: 'vue/dist/vue.runtime.esm-bundler.js'
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
        new VueLoaderPlugin(),
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

                // Vue 相关库
                vue: {
                    test: /[\\/]node_modules[\\/](vue|vue-router)[\\/]/,
                    name: 'vue',
                    chunks: 'all',
                    priority: 20,
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
