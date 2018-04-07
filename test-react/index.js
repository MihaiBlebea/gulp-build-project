import React from 'react';
import ReactDOM from 'react-dom';

class HelloMessage extends React.Component {
    render() {
        return React.createElement(
            'div',
            null,
            'Hello ',
            this.props.name
        );
    }
}

ReactDOM.render(React.createElement(HelloMessage, { name: 'John' }), document.getElementById('app'));