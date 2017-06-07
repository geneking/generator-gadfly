/**
 * @description [ PageList ]
 * @author      [ jinweigang@meituan.com ]
 * @date        [ 2017-02-24 ]
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './Index.scss';
import json from '../../../../app.json';

class Hello extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return(
            <div>
                <h3>目录</h3>
                <ul>
                {
                    json.pageList.map((item) => {
                        const s1 = item.src.split("./app/page/")[1];
                        const s2 = s1.substr(0, s1.lastIndexOf("/"));
                        if (item.title == '目录') return null;
                        return (
                          <li className="fa fa-file-o"><a href={`/${s2}.html`}>{item.title}</a></li>
                        );
                    })
                }
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<Hello />, document.getElementById("page-content"));
