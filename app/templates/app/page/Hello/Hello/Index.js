/**
 * @description [ 示例 ]
 * @author      [ jinweigang@meituan.com ]
 * @date        [ 2017-02-24 ]
 */

import './Index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {

    static propTypes = {
    }

    static defaultProps = {
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        return(<h1>Hello World</h1>);
    }
}

ReactDOM.render(<Hello />, document.getElementById("page-content"));
