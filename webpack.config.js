const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.css$/,
            use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            type: 'asset/resource',
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            __BUILD__: JSON.stringify(Date.now())
        })
    ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
    devServer: {
        port: 8000,
        historyApiFallback: true,
        devMiddleware: {
            writeToDisk: true,
        },
        static: {
            directory: './'
        }
    }
};
