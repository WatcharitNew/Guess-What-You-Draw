import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Canvas } from '../Canvas/Canvas';
import { ChatBox, IMessage } from '../ChatBox/ChatBox';
import { PlayersBox } from '../PlayersBox/PlayersBox';
import { ColorCode, IPlayer } from '../util';
import { Toolbar } from '../Toolbar/Toolbar';
import { Timer } from '../Timer/Timer';

import styles from './GamePage.module.scss';
import consumer from '../cable';
import { EndGameModal } from '../NiceModal/EndGameModal';

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
	const [gameChannel, setGameChannel] = useState<any>();
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [rankPlayers, setRankPlayers] = useState<IPlayer[]>([]);
	const [round, setRound] = useState(1);
	const [maxRound, setMaxRound] = useState<number>(5);
	const [timePerTurn, setTimePerTurn] = useState<number | undefined>(undefined);
	const [word, setWord] = useState<string>('');
	const [showNewRound, setShowNewRound] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [showEndGameModal, setShowEndGameModal] = useState<boolean>(false);

	useEffect(() => {
		console.log('a');
		const channel = consumer.subscriptions.create(
			{
				channel: 'GameChannel',
				username,
				room,
			},
			{
				received: (data: IMessage) => handleGameChannelReceived(data),
			}
		);

		setGameChannel(channel);

		return () => {
			gameChannel.subscriptions.remove({
				channel: 'GameChannel',
				username,
				room,
			});
			setGameChannel(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// }, [room, username, showNewRound, gameChannel]);

	const handleGameChannelReceived = (data: any) => {
		if (showEndGameModal) {
			return;
		}
		if (data.type === 'game-start') {
			console.log('game start');
			const { maxRound, timePerTurn, word, round } = data;
			setMaxRound(maxRound);
			setTimePerTurn(timePerTurn);
			setWord(word);
			setRound(round);
			setIsLoading(false);
		} else if (data.type === 'random-word') {
			console.log(data);
			setWord(data.content);
			setRound(data.round);
			setReset(true);
		} else if (data.type === 'receive-result') {
			console.log(data.content);
		} else if (data.type === 'recieve-message') {
			setMessages((messages: IMessage[]) => [...messages, data]);
		}
	};

	const onSendImage = (img: any) => {
		// gameChannel.send({ type: 'send-image', content: img });
	};

	const onTimeOut = () => {
		console.log('timeout');
		gameChannel.send({ type: 'end-round' });
	};

	const onSubmitChat = (chatMessage: string) => {
		gameChannel.send({ type: 'send-message', content: chatMessage });
	};

	const [color, setColor] = useState<ColorCode>('#000000');
	const [reset, setReset] = useState<boolean>(false);

	if (isLoading) {
		return <div>loading</div>;
	}

	if (round > maxRound && !showEndGameModal) {
		setShowEndGameModal(true);
	}

	const mockPlayers2 = [
		['player1', 100],
		['player2', 200],
	];

	return (
		<div>
			<div className={styles.background}>
				<div className={styles.header}>
					<div className={styles.round}>
						Round {round}/{maxRound}
					</div>
					<div className={styles.word}>Word: {word}</div>
					<div className={styles.time}>
						Time:{' '}
						<Timer
							time={timePerTurn || 30}
							onTimeOut={onTimeOut}
							round={round}
							maxRound={maxRound}
							word={word}
						/>
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
				<EndGameModal
					show={showEndGameModal}
					players={mockPlayers2}
					room={room}
				/>
			</div>
		</div>
	);
};

export const GamePage = withRouter(GamePageComponent);
