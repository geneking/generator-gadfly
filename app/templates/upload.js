var fs  = require('fs');
var MSS = require('mss-sdk');
var data = JSON.parse(fs.readFileSync('app.json', 'utf-8'));
var bucketName = data.cdn.bucketName;
var publicPath = './build/';
var s3 = new MSS.S3({
    accessKeyId: data.cdn.accessKeyId,
    secretAccessKey: data.cdn.secretAccessKey,
    endpoint: 'mss.vip.sankuai.com'
});

// 读取静态资源JS & DLL & Styles
var loopStaticPath = function() {
    var packageArray = ['js', 'css'];
    packageArray.forEach(function (item) {
        readDirFiles(publicPath + item, item);
    });
};

// 上传文件
var readAndPostFile = function(fileName, type) {
    var contentType = 'text/javascript';
    switch (type){
        case 'js':
            contentType = 'text/javascript';
            break;
        case 'css':
            contentType = 'text/css';
            break;
        default:
            contentType = 'text/javascript';
    }
    var file = fs.createReadStream(fileName);
    var key = fileName.split(publicPath)[1];

    console.log('上传文件',key, file);

    var params = {
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
        Body: file
    };

    console.log('parameters:', JSON.stringify(params));

    s3.putObject(params).on('httpHeaders', function (statusCode, headers) {
        console.log('headers:', headers);
    }).on('httpUploadProgress', function (progress) {
        console.log(progress);
    }).on('error', function (err) {
        console.log(err.red);
    }).on('success', function (req, res) {
        console.log('success');
    }).send();

    s3.listObjects(params, function (err, data) {
        if(err) {
            console.log('获取资源信息报错啦 ~ \n' + err);
            return false;
        }else{
            console.log('获取资源成功', JSON.stringify(data));
        }
    });
};

// 读取build文件夹下所有js,css文件
var readDirFiles = function(pathName, type) {
    fs.readdir(pathName, function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        files.forEach(function (fileName) {
            var wholePathName = pathName + '/' + fileName;
            fs.stat(wholePathName, function (err, stats) {
                if (err) {
                    console.log(err);
                    return false;
                }
                if (stats.isFile()) {
                    readAndPostFile(wholePathName, type);
                } else if (stats.isDirectory()) {
                    readDirFiles(wholePathName, type);
                }
            });
        })
    });
};

!(function () {
    var params = {Bucket: bucketName};
    s3.headBucket(params, function (err, data) {
        if (err) {
            console.log('寻找bucket报错啦:' + err, err.stack);
            params.ACL = 'public-read';
            s3.createBucket(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    console.log('建好bucket啦');
                    loopStaticPath();
                }
            })
        } else {
            console.log('成功找到bucket啦:' + data);
            loopStaticPath();
        }
    });
})();
