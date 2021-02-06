import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Canvas } from '../Canvas/Canvas';
import { ChatBox, IMessage } from '../ChatBox/ChatBox';
import styles from './GamePage.module.scss';
import consumer from '../cable';

interface RouteParams {
	room: string,
}

interface IGamePage extends RouteComponentProps<RouteParams> {}

const GamePageComponent: React.FC<IGamePage> = (props) => {
	const room = props.match.params.room;
	const username = sessionStorage.getItem("username") || '';
	console.log(`Room ${room} UserName ${username}`);
	const [messageChannel, setMessageChannel] = useState<any>();
    const [messages, setMessages] = useState<IMessage[]>([]);

	useEffect( () => {
        setMessageChannel(
            consumer.subscriptions.create(
                {
                    channel: 'ChatChannel',
                    username,
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
    , [room, username]);

    const handleReceived = (data: IMessage) => {
        console.log(data);
        if(data.type === 'message') {
            setMessages((messages: IMessage[]) => ([...messages, data]));
        }
    }
    
    const onSubmitChat = (chatMessage: string) => {
        messageChannel.send({content: chatMessage});
    }

	return (
		<div className={styles.background}>
			Gamepage
			<Canvas />
			<ChatBox
				className={styles.chatBox}
				username={username}
				messages={messages}
				onSubmit={onSubmitChat}
			/>
		</div>
	);
};

export const GamePage = withRouter(GamePageComponent);
