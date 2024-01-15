'use strict';

/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    performance: { hints: false },

    entry: path.resolve(__dirname, 'src', 'ckeditor.ts'),

    output: {
        // The name under which the editor will be exported.
        // CKEDITOR.ClassicEditor, CKEDITOR.InlineEditor, etc.
        library: 'CKEDITOR',

        path: path.resolve(__dirname, 'build'),
        filename: 'ckeditor.js',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },

    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                sourceMap: true,
                terserOptions: {
                    output: {
                        // Preserve CKEditor 5 license comments.
                        comments: /^!/
                    }
                },
                extractComments: false
            })
        ]
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: bundler.getLicenseBanner(),
            raw: true
        })
    ],

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    module: {
        rules: [{
            test: /\.svg$/,
            use: ['raw-loader']
        }, {
            test: /\.ts$/,
            use: 'ts-loader'
        }, {
            test: /\.css$/,
            use: [{
                loader: 'style-loader',
                options: {
                    injectType: 'singletonStyleTag',
                    attributes: {
                        'data-cke': true
                    }
                }
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: styles.getPostCssConfig({
                        themeImporter: {
                            themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                        },
                        minify: true
                    })
                }
            }]
        }]
    }
};
