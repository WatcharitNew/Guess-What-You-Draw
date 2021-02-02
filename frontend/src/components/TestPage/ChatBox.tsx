import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import consumer from '../cable';

interface IMessage {
    content: string
}

export const ChatBox: React.FC<any> = () => {
    const [messageChannel, setMessageChannel] = useState<any>();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [chatMessage, setChatMessage] = useState<string>('');
    const [room, setRoom] = useState<string>('123');
    useEffect( () => {
        setMessageChannel(
            consumer.subscriptions.create(
                {
                    channel: 'ChatChannel',
                    user: 'User1',
                    room: room ? room : null,
                }, 
                {
                    received: (data: IMessage) => handleReceived(data),
                    connected: () => console.log('connected'),
                    disconnected: () => console.log('disconnected'),
                }
            )
        );
    }
    , [room]);

    const handleReceived = (data: IMessage) => {
        if(data.content) {
            setMessages((messages: IMessage[]) => ([...messages, data]));
        }
    }
    
    const handleSubmit = () => {
        if(chatMessage === '') return;
        messageChannel.send({content: chatMessage});
        setChatMessage('');
    }

    const handleChange = (e:any) => {
        setChatMessage(e.target.value)
    }

    const changeRoom = () => {
        messageChannel.unsubscribe();
        if(room === '123') setRoom('456');
        else if(room === '456') setRoom('');
        else setRoom('123');
    }

    const handleKeyPress = (ev: any) => {
		if (ev.key === 'Enter') {
			handleSubmit();
			ev.preventDefault();
		}
	}

    return (
        <div>
            <div>{room ? `Room ${room}` : 'Public chat'}</div>
            {messages.map((message: IMessage, idx: number) => 
                <div key={idx}>
                    {message.content}
                </div>
            )}
            <form noValidate autoComplete="off">
                <TextField id="standard-basic" label="Standard" onChange={handleChange} value={chatMessage} onKeyPress={handleKeyPress}/>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Send</Button>
                <Button variant="contained" color="primary" onClick={changeRoom}>Change Room</Button>
            </form>
        </div>
    );
};