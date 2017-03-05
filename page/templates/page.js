/**
 * @author      [<%= pageAuthor %>]
 * @date        [<%= createTime %>]
 * @description [<%= pageDescription %>]
 */

 import './index.scss';
 import React from 'react';
 import ReactDOM from 'react-dom';

 class <%= pageName %> extends React.Component {

     static propTypes = {
     }

     static defaultProps = {
     }

     constructor(props) {
         super(props);
         this.state = {
         };
     }

     componentDidMount() {
     }

     render() {
         return(<div></div>);
     }
 }

 ReactDOM.render(<<%= pageName %> />, document.getElementById("page-content"));
