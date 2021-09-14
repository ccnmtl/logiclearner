const path = require('path');
const webpack = require('webpack');

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
            use: ['style-loader', 'css-loader'],
            include: path.resolve(__dirname, './src')
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
    ],
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
