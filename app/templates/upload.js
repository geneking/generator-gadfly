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

// 读取静态资源JS & Images
var loopStaticPath = function() {
  var packageArray = ['js', 'images'];
  packageArray.forEach(function (item) {
    readDirFiles(publicPath + item);
  });
};

// 上传文件
var readAndPostFile = function(fileName) {
  var file = fs.createReadStream(fileName);
  var key = fileName.split(publicPath)[1];
  var params = {
    Bucket: bucketName,
    Key: key,
    ContentType: 'text/javascript',
    Body: file
  };

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
    }
  });
};

// 读取build文件夹下所有js文件
var readDirFiles = function(pathName) {
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
          readAndPostFile(wholePathName);
        } else if (stats.isDirectory()) {
          readDirFiles(wholePathName);
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
