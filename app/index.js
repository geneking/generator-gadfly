/**
 * @author       [jinweigang ]
 * @date         [2017-02-23 ]
  * @description [Generator入口文件]
 */

const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = class extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('project-name', {
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
        default : this.projectName
      },{
        type    : 'input',
        name    : 'appDescription',
        message : '[项目描述]',
        default : ''
      },{
        type    : 'input',
        name    : 'authorName',
        message : '[作者姓名]',
        default : ''
      },{
        type    : 'input',
        name    : 'authorEmail',
        message : '[作者邮箱]',
        default : ''
      },{
        type    : 'input',
        name    : 'appVersion',
        message : '[版    本]',
        default : '1.0.0'
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
            path.join(sourceRoot, '_package.json'),
            path.join(destinationRoot, 'package.json'),
            this.answers
        );
        this.fs.copyTpl(
            path.join(sourceRoot, '_app.json'),
            path.join(destinationRoot, 'app.json'),
            { projectName: this.projectName.replace(/_/g, '-') }
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
        this.spawnCommand('rm', ['_app.json']);
        this.spawnCommand('rm', ['_package.json']);
        this.npmInstall();
    }

    /**
     * [end 启动应用]
     */
    end() {
        this.spawnCommand('npm', ['start']);
    }
};
