const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './media/js/src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'media/build'),
        filename: 'bundle.js',
        publicPath: '/media/build/'
    },
    resolve: {
        extensions: ['.*', '.ts', '.tsx', '.js'],
        fallback: {
            'assert': false,
            'child_process': false,
            'crypto': false,
            'dns': false,
            'fs': false,
            'net': false,
            'os': false,
            'path': false,
            'stream': false,
            'string_decoder': false,
            'tls': false,
            'url': false,
            'util': false,
            'zlib': false
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                },
            },
            {
                test: /\.(tsx|ts|js)$/,
                include: path.resolve(__dirname, 'media/js/src'),
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'autoprefixer'
                                ]
                            },
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                type: 'asset/resource',
            }]
    },

    plugins: [
        new webpack.DefinePlugin({
            __BUILD__: JSON.stringify(Date.now())
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ].concat([new MiniCssExtractPlugin()]),

    devServer: {
        port: 8000,
        historyApiFallback: true,
        devMiddleware: {
            writeToDisk: true,
        },
        publicPath: '/media/build/'
    }
};
