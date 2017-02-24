/**
 * @description [xxx]
 * @author      [xxx@meituan.com]
 * @date        [xxxx-xx-xx]
 */

import './index.scss';

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
