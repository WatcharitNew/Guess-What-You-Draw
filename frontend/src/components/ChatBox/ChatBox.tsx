import { InputBase } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
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
                    // connected: () => console.log('connected'),
                    // disconnected: () => console.log('disconnected'),
                }
            )
        );
    }
    , [room, userName]);

    const handleReceived = (data: IMessage) => {
        if(data.content) {
            setMessages((messages: IMessage[]) => ([...messages, data]));
            scrollToBottom();
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
    
    const messagesEndRef:any = useRef(null);
    const chatMessages = messages.map((message: IMessage, idx: number) => 
        <ChatMessage
            message={message}
            userName={userName}
        />
    );

    const scrollToBottom = () => {
        messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className={classnames(styles.background, className)}>
            <div className={styles.chatMessages}>
                {chatMessages}
                <div ref={messagesEndRef} />
            </div>
            <div className={styles.footer}>
                <form className={styles.textFieldWrapper} noValidate autoComplete="off">
                    <InputBase 
                        className={styles.textField} 
                        placeholder="Type something..." 
                        onChange={handleChange} 
                        value={chatMessage} 
                        inputProps={{ 'aria-label': 'naked' }}
                        onKeyPress={handleKeyPress}
                    />
                </form>
            </div>
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