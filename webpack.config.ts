import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'


const rootPath = __dirname

const commonConfig: (mode: string) => webpack.Configuration = mode => ({
    context: rootPath,
    entry: './src/index.ts',
    output: {
        path: path.resolve(rootPath, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(rootPath, 'dist/index.html'),
            template: "src/index.html",
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin(),
        new CleanWebpackPlugin(['dist/*'], { root: rootPath })
    ],
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"],
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        } 
    },
    module: {
        rules: [
            {
                test: /\.ico$/,
                sideEffects: true,
                use: 'file-loader'
            },
            {
                test: /\.js$/,
                sideEffects: true,
                include: path.resolve('./node_modules/bootstrap')
            },
            { 
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                include: path.resolve(rootPath, 'src')
            }
        ]
    }
})

const productionConfig: webpack.Configuration = {
    devtool: 'source-map',
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
    },
    mode: 'production',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true 
            }),
            new webpack.HashedModuleIdsPlugin()
        ]
    },
    plugins: [
        new CompressionPlugin(),
        new GenerateSW()
    ]
}

const developmentConfig: webpack.Configuration = {
    output: {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js',
    },
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        stats: 'errors-only',
        overlay: true,
        historyApiFallback: true,
        contentBase: path.resolve(rootPath, 'dist'),
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
export default mode => mode === 'production' 
    ? merge(commonConfig(mode), productionConfig)
    : merge(commonConfig(mode), developmentConfig)
