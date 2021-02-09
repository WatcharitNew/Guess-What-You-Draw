import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Canvas } from '../Canvas/Canvas';
import { ChatBox, IMessage } from '../ChatBox/ChatBox';
import { PlayersBox } from '../PlayersBox/PlayersBox';
import { ColorCode, IPlayer } from '../util';
import { Toolbar } from '../Toolbar/Toolbar';
import styles from './GamePage.module.scss';
import consumer from '../cable';

interface RouteParams {
	room: string;
}

interface IGamePage extends RouteComponentProps<RouteParams> {}

const mockPlayers = [
	{
		name: 'test',
		score: '300',
	},
	{
		name: 'test2',
		score: '100',
	},
];

const GamePageComponent: React.FC<IGamePage> = (props) => {
	const room = props.match.params.room;
	const username = sessionStorage.getItem('username') || '';
	console.log(`Room ${room} UserName ${username}`);
	const [messageChannel, setMessageChannel] = useState<any>();
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [rankPlayers, setRankPlayers] = useState<IPlayer[]>([]);
	const [round, setRound] = useState(1);

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
		if (data.type === 'recieve-message') {
			setMessages((messages: IMessage[]) => [...messages, data]);
		} else if (data.type === 'get-rank-players') {
			const usernames = data.usernames;
			// assume that first member will be leader? not sure if this work
			const newRankPlayers: IPlayer[] = usernames.map(
				(username: string, score: string, idx: number) => ({
					name: username,
					score,
				})
			);
			setRankPlayers(newRankPlayers);
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
				<div className={styles.round}>Round {round}/10</div>
				<div className={styles.word}>Word</div>
				<div className={styles.time}>Time: 240</div>
			</div>
			<div className={styles.main}>
				<PlayersBox
					title={'Ranking'}
					players={mockPlayers}
					username={username}
				/>
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
