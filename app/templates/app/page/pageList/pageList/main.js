import './index.scss';
import json from '../../../../app.json';

const getPageList = () => {
    let html = '';
    json.pageList.map((item) => {
      const title = item.title;
      const path = item.src;
      html += (() => {
        const s1 = path.split("./app/page/")[1];
        const s2 = s1.substr(0, s1.lastIndexOf("/"));
        if (title == '目录') { return ''; }
        return '<li class="fa fa-file-o"><a href="/' + s2 + '.html">' + title + '</a></li>';
      })();
    });
    return html;
};

$(".page-content")
.append('<h3>目录</h3>')
.append(`<ul>${getPageList()}</ul>`);
