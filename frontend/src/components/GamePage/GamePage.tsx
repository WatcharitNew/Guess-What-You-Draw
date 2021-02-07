import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Canvas } from '../Canvas/Canvas';
import { ChatBox, IMessage } from '../ChatBox/ChatBox';
import { ColorCode } from '../util';
import { RankBox } from '../RankBox/RankBox';
import { Toolbar } from '../Toolbar/Toolbar';
import styles from './GamePage.module.scss';
import consumer from '../cable';

interface RouteParams {
	room: string;
}

interface IGamePage extends RouteComponentProps<RouteParams> {}

const GamePageComponent: React.FC<IGamePage> = (props) => {
	const room = props.match.params.room;
	const username = sessionStorage.getItem('username') || '';
	console.log(`Room ${room} UserName ${username}`);
	const [messageChannel, setMessageChannel] = useState<any>();
	const [messages, setMessages] = useState<IMessage[]>([]);

	useEffect(() => {
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
	}, [room, username]);

	const handleReceived = (data: any) => {
		console.log(data);
		if (data.type === 'recieve-message') {
			setMessages((messages: IMessage[]) => [...messages, data]);
		}
	};

	const onSubmitChat = (chatMessage: string) => {
		messageChannel.send({ type: 'send-message', content: chatMessage });
	};

	const [color, setColor] = useState<ColorCode>('#000000');
	const [reset, setReset] = useState<boolean>(false);

	return (
		<div className={styles.background}>
			<div className={styles.header}>
				<span>Round 1/10</span>
				<span>Word</span>
				<span>Time: 240</span>
			</div>
			<div className={styles.main}>
				<RankBox />
				<Canvas
					color={color}
					reset={reset}
					setReset={setReset}
					className={styles.canvas}
				/>
				<ChatBox
					className={styles.chatBox}
					messages={messages}
					onSubmit={onSubmitChat}
					username={username}
				/>
			</div>
			<div className={styles.bottom}>
				<Toolbar setColor={setColor} setReset={setReset} />
			</div>
		</div>
	);
};

export const GamePage = withRouter(GamePageComponent);
