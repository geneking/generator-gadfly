var Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');

module.exports = class extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('pageName', {
            type: String,
            desc: "页面名称"
        });
        this.pageName = this.args[0];
        this.conflicter.force = true;//避免检查冲突
        this.createTime = moment().format('YYYY-MM-DD HH:MM');
    }

    /**
     * [prompting 页面信息配置]
     */
    prompting() {
        return this.prompt([{
            type    : 'input',
            name    : 'pageTitle',
            message : '[页面标题]',
            default : ''
        },{
            type    : 'input',
            name    : 'pageDescription',
            message : '[页面描述]',
            default : ''
        },{
            type    : 'input',
            name    : 'pageAuthor',
            message : '[页面创建者]',
            default : ''
        }]).then((answers) => {
            this.pageInfo = answers;
        });
    }

    /**
     * [writing 生成页面]
     */
    writing() {
        const sourceRoot = this.templatePath();
        const destinationRoot = this.destinationRoot(`app/page/${this.pageName}`);
        this.fs.copyTpl(
            path.join(sourceRoot, 'page.js'),
            path.join(destinationRoot, `${this.pageName}.js`),
            Object.assign(this.pageInfo, {
                pageName: this.pageName,
                createTime: this.createTime
            })
        );
    }
};
