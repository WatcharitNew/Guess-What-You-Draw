import React from 'react';
import consumer from '../cable';

export default class ChatBox extends React.Component {
    componentDidMount() {
        consumer.subscriptions.create({
            channel: 'ChatChannel',
            }, {
            received: (data: any) => console.log(data),
            connected: () => console.log('aaconnected'),
            disconnected: () => console.log('bbdisconnected'),
        }
        )
    };
    
    handleSubmit = () => {  
    fetch('http://localhost:3000/messages', {
        method: 'POST',
        body: JSON.stringify({
            content: 'Hi!',
            username: 'cool_kid_20'
          })
    })
    }

    render() {
        return <button value="hey" onClick={this.handleSubmit}>hey</button>;
    }
};