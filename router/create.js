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
     * [writing 生成配置文件，copy基础模板]
     */
    writing() {
        this.log(this);
    }

    /**
     * [end 启动应用]
     */
    end() {
    }
};
