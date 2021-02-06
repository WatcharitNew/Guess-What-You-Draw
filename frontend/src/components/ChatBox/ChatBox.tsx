import { InputBase } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import styles from './ChatBox.module.scss';
import classnames from 'classnames'

export interface IMessage {
    type: string,
    sender: string,
    content: string,
}

interface IChatBox {
    className?: string,
    username: string,
    messages: IMessage[],
    onSubmit: (chatMessage: string) => void,
}

export const ChatBox: React.FC<IChatBox> = (props) => {
    const {username, className, messages, onSubmit} = props;
    const [chatMessage, setChatMessage] = useState<string>('');

    useEffect( () => {
        scrollToBottom();
    }
    , [messages]);

    const handleChange = (e:any) => {
        setChatMessage(e.target.value)
    }

    const handleKeyPress = (ev: any) => {
		if (ev.key === 'Enter') {
			handleSubmit();
			ev.preventDefault();
		}
    }

    const handleSubmit = () => {
        if(chatMessage === '') return;
        onSubmit(chatMessage);
        setChatMessage('');
    }
    
    const messagesEndRef:any = useRef(null);
    const chatMessages = messages.map((message: IMessage, idx: number) => 
        <ChatMessage
            key={idx}
            message={message}
            username={username}
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
    username: string, // current user *not* the message's sender
}

export const ChatMessage: React.FC<IChatMessage> = (props) => {
    const { message, username} = props
    const { sender, content } = message;

    const isUserSent = sender === username;
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