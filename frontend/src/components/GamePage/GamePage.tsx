import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Canvas } from '../Canvas/Canvas';
import { ChatBox, IMessage } from '../ChatBox/ChatBox';
import { PlayersBox } from '../PlayersBox/PlayersBox';
import { ColorCode, IPlayer } from '../util';
import { Toolbar } from '../Toolbar/Toolbar';
import { Timer } from '../Timer/Timer';
import { NewRoundModal } from '../NewRoundModal/NewRoundModal';

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
	const [gameChannel, setGameChannel] = useState<any>();
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [rankPlayers, setRankPlayers] = useState<IPlayer[]>([]);
	const [round, setRound] = useState(1);
	const [maxRound, setMaxRound] = useState<number>(5);
	const [timePerTurn, setTimePerTurn] = useState<number | undefined>(undefined);
	const [word, setWord] = useState<string>('');
	const [showNewRound, setShowNewRound] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(true);

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
		setGameChannel(
			consumer.subscriptions.create(
				{
					channel: 'GameChannel',
					username,
					room,
				},
				{
					received: (data: IMessage) => handleGameChannelReceived(data),
					// connected: () => console.log('connected'),
					// disconnected: () => console.log('disconnected'),
				}
			)
		);

		if (showNewRound) {
			setTimeout(() => {
				setShowNewRound(false);
			}, 5000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [room, username, showNewRound]);

	const handleGameChannelReceived = (data: any) => {
		if (data.type === 'game-start') {
			console.log('game start');
			setIsLoading(false);
		} else if (data.type === 'random-word') {
			console.log(data);
			setWord(data.content);
			setRound(data.round);
			setReset(true);
			setShowNewRound(true);
		} else if (data.type === 'receive-result') {
			console.log(data.content);
		} else if (data.type === 'get-room-data') {
			const { maxRound, timePerTurn } = data;
			setMaxRound(maxRound);
			setTimePerTurn(timePerTurn);
		}
	};

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

	const onSendImage = (img: any) => {
		gameChannel.send({ type: 'send-image', content: img });
	};

	const onTimeOut = () => {
		console.log('timeout');
		gameChannel.send({ type: 'end-round' });
	};

	const onSubmitChat = (chatMessage: string) => {
		messageChannel.send({ type: 'send-message', content: chatMessage });
	};

	const [color, setColor] = useState<ColorCode>('#000000');
	const [reset, setReset] = useState<boolean>(false);

	if (!timePerTurn || isLoading) {
		return <div>loading</div>;
	}

	return (
		<div>
			<NewRoundModal
				round={round}
				maxRound={maxRound}
				word={word}
				show={showNewRound}
			/>
			<div className={styles.background}>
				<div className={styles.header}>
					<div className={styles.round}>
						Round {round}/{maxRound}
					</div>
					<div className={styles.word}>Word: {word}</div>
					<div className={styles.time}>
						Time: <Timer newTime={timePerTurn} onTimeOut={onTimeOut} />
					</div>
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
						onSendImage={onSendImage}
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
				<button
					onClick={() => {
						console.log('click');
						setShowNewRound(!showNewRound);
					}}
				>
					test
				</button>
			</div>
		</div>
	);
};

export const GamePage = withRouter(GamePageComponent);
