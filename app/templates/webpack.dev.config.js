var path = require('path');
var fs = require('fs');
var merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var MODULE_PATH = path.resolve(ROOT_PATH, 'app/module');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('css/[name].css');

/**
 * [getDist 获取app.json中js分发路径]
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
var getDist = function(src) {
    var s1 = src.split("./app/page/")[1];
    var s2 = s1.substr(0, s1.lastIndexOf("/"));
    return s2;
};

/**
 * [getHtmlPluginArr 页面映射文件]
 * @return {[type]} [description]
 */
var getHtmlPluginArr = function() {
    var data = JSON.parse(fs.readFileSync('app.json', 'utf-8'));
    var pageList = data.pageList;
    var resultObj = {
        "pluginArr": [],
        "entryObj": {
            "Common/common": MODULE_PATH + "/Common/common.js"
        }
    };

    pageList.map(function(item, index) {
        resultObj.entryObj[getDist(item.src)] = item.src;
        resultObj.pluginArr.push(
            new HtmlwebpackPlugin({
                chunks: ["Common/common", getDist(item.src)], //当前页面js
                title: item.title,
                template: "app/" + "template.ejs",
                filename: getDist(item.src) + '.html',
                chunksSortMode: "dependency"
            })
        );
    });
    return resultObj;
};

var appJsonObj = getHtmlPluginArr();
var commonConfig = {
    entry: appJsonObj.entryObj,
    module: {
        loaders: [{
            test: /\.html$/,
            loader: "html-loader?minimize=false"
        }, {
            test: /\.json$/,
            loader: "json-loader"
        }, {
            test: /\.scss|\.css$/,
            loader: extractCSS.extract(['css-loader', 'sass-loader'])
        }, {
            test: /\.(?:jpg|gif|png)$/,
            loader: 'url-loader?limit=10240&name=../images/[name]-[hash:10].[ext]'
        }, {
            test: /\.js$|\.jsx$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react'],
                plugins: ['transform-class-properties']
            }
        }, ]
    },
    output: {
        path: BUILD_PATH,
        filename: "js/[name].js"
    },
    externals: {},
    resolve: {
        alias: {
            module: path.resolve(APP_PATH, 'module'),
            component: path.resolve(APP_PATH, "component"),
            page: path.resolve(APP_PATH, "page"),
            node_modules: path.resolve(ROOT_PATH, 'node_modules')
        },
        extensions: ['.js', '.jsx', '.json', '.scss']
    },
    plugins: appJsonObj.pluginArr,
    devtool: "source-map",
    cache: true
};

module.exports = merge(commonConfig, {
    devServer: {
        hot: true,
        inline: true,
        progress: true,
        host: process.env.HOST,
        port: "8808",
        proxy: {
            '/sifttag/**': {
                //target: 'http://10.20.60.234:8686/', //dev
                target: 'http://10.20.93.199:8686/', //qa
                secure: false
            },
            '/iframe_poi_archives/*': {
                target: 'http://data.waimai.sankuai.com',
                secure: false
            }
        }
    },
    plugins: [
        extractCSS,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh-cn/),
        new OpenBrowserPlugin({
            url: 'http://127.0.0.1:8808/PageList/PageList.html'
        })
    ]
});
