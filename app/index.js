var Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');

module.exports = class extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('projectName', {
            type: String,
            desc: "你的项目名称",
            required: true
        });
        this.projectName = this.args[0];
        this.conflicter.force = true;//避免检查冲突
    }

    /**
     * [prompting 基础信息配置]
     */
    prompting() {
      return this.prompt([{
        type    : 'input',
        name    : 'appName',
        message : '[项目名称]',
        store   : true,
        default : this.projectName
      },{
        type    : 'input',
        name    : 'appDescription',
        message : '[项目描述]',
        store   : true,
        default : ''
      },{
        type    : 'input',
        name    : 'authorName',
        message : '[作者姓名]',
        store   : true,
        default : ''
      },{
        type    : 'input',
        name    : 'authorEmail',
        message : '[作者邮箱]',
        store   : true,
        default : ''
      },{
        type    : 'input',
        name    : 'appVersion',
        message : '[版    本]',
        store   : true,
        default : '0.0.1'
      }]).then((answers) => {
          this.answers = answers;
      });
    }

    /**
     * [writing 生成配置文件，copy基础模板]
     */
    writing() {
        const sourceRoot = this.templatePath();
        const destinationRoot = this.destinationRoot(this.projectName);

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            path.join(destinationRoot, 'package.json'),
            this.answers
        );
        this.fs.copyTpl(
            this.templatePath('_app.json'),
            path.join(destinationRoot, 'app.json'),
            { projectName: this.projectName }
        );
        fs.readdir(sourceRoot, (err, items) => {
            for(let item of items) {
                let fullPath = path.join(sourceRoot, item);
                let targetPath = path.join(destinationRoot, item);
                this.fs.copy(fullPath, targetPath);
            }
        });
    }

    /**
     * [install 安装依赖]
     */
    install() {
        this.spawnCommand('cd', [this.projectName]);
        this.spawnCommand('rm', ['_*.json']);
        this.npmInstall();
    }

    /**
     * [end 启动应用]
     */
    end() {
        this.spawnCommand('npm', ['start']);
    }
};
