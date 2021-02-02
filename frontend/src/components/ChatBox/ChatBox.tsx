import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import consumer from '../cable';
import styles from './ChatBox.module.scss';
import classnames from 'classnames'

interface IMessage {
    sender: string,
    content: string,
}

interface IChatBox {
    room: string,
    userName: string,
    className?: string,
}

export const ChatBox: React.FC<IChatBox> = (props) => {
    const {room, userName, className} = props;
    const [messageChannel, setMessageChannel] = useState<any>();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [chatMessage, setChatMessage] = useState<string>('');
    useEffect( () => {
        setMessageChannel(
            consumer.subscriptions.create(
                {
                    channel: 'ChatChannel',
                    userName,
                    room,
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

    const handleKeyPress = (ev: any) => {
		if (ev.key === 'Enter') {
			handleSubmit();
			ev.preventDefault();
		}
	}

    return (
        <div className={classnames(styles.background, className)}>
            <div className={styles.chatMessages}>
                {messages.map((message: IMessage, idx: number) => 
                    <ChatMessage
                        message={message}
                        userName={userName}
                    />
                )}
            </div>
            <form noValidate autoComplete="off">
                <TextField id="standard-basic" placeholder="Type something..." onChange={handleChange} value={chatMessage} onKeyPress={handleKeyPress}/>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Send</Button>
            </form>
        </div>
    );
};

interface IChatMessage {
    message: IMessage,
    userName: string, // current user *not* the message's sender
}

export const ChatMessage: React.FC<IChatMessage> = (props) => {
    const { message, userName} = props
    const { sender, content } = message;

    console.log(message);
    const isUserSent = sender === userName;
    const chatContentStyle = !sender ? styles.chatSystemContent
        : isUserSent ? classnames(styles.chatContent, styles.chatUserContent)
        : classnames(styles.chatContent, styles.chatOtherContent);
    return (
        <div className={styles.chatMessage}>
            <span className={styles.chatOtherUserName}>{isUserSent ? '' : sender}</span>
            <div className={chatContentStyle}>{content}</div>
        </div>
    );
}