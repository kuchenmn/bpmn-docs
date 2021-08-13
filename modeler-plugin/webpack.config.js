const path = require('path');
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    entry: './client/client.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'client-bundle.js'
    },
    resolve: {
        fallback: {
            os: require.resolve("os-browserify/browser")
        }
    },
    devtool: 'cheap-module-source-map'
}
