const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

// .[chunkhash:8]
module.exports = {
    entry: { app: `${__dirname}/src/index.js` },
    output: {
        filename: "js/[name].[chunkhash:8].js",
        path: `${__dirname}/client`
    },
    plugins: [
        new HtmlWebpackPlugin({ template: "src/base.html" }),
        new CopyPlugin({patterns:[{ from: "src/static/", to: "" }]}),
        new WebpackBuildNotifierPlugin({
            title: "AR",
            suppressWarning: true,
            suppressCompileStart: false
        })
    ],
    module: {
        rules: [
            {
                test: /\.(png|gif|jpe?g|svg)$/g,
                use: ["raw-loader", "image-webpack-loader"]
            }
        ]
    },
    watch: true,
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ]
    }
};
