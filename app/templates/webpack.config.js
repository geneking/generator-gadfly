var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var merge = require('webpack-merge');
var webpack = require('webpack');
var WebpackMd5Hash = require('webpack-md5-hash');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var MODULE_PATH = path.resolve(ROOT_PATH, 'app/module');
var os = require('os');
var UglifyJsParallelPlugin = require('webpack-uglify-parallel');
var Visualizer = require('webpack-visualizer-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('css/[name]-[chunkhash:10].css');

var data = JSON.parse(fs.readFileSync('app.json', 'utf-8'));
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
                filename: 'html/' + getDist(item.src) + '.html',
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
        rules: [{
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
            exclude: /node_modules/,
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
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
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

//删除build目录
exec('rm -rf build', function(err, out) {
    console.log(out);
    err && console.log(err);
});
//删除image目录
exec('rm -rf images', function(err, out) {
    console.log(out);
    err && console.log(err);
});

module.exports = merge(commonConfig, {
    output: {
        publicPath: '//s3.meituan.net/v1/mss_c4375b35f5cb4e678b5b55a48c40cf9d/' + data.cdn.bucketName,
        path: BUILD_PATH,
        filename: "js/[name]-[chunkhash:10].js"
    },
    plugins: [
        extractCSS,
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': 'production'
            }
        }),
        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            output: {
                ascii_only: true,
            },
            compress: {
                warnings: false,
            },
            sourceMap: false
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh-cn/),
        new WebpackMd5Hash(),
        new Visualizer()
    ]
});
