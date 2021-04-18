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
import { CorrectPrediction } from '../CorrectPrediction/CorrectPrediction';
import { predictImage } from './Predictor';

interface RouteParams {
	room: string;
}

interface IGamePage extends RouteComponentProps<RouteParams> {}

const GamePageComponent: React.FC<IGamePage> = (props) => {
	const room = props.match.params.room;
	const username = sessionStorage.getItem('username') || '';
	const [gameChannel, setGameChannel] = useState<any>();
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [score, setScore] = useState<number>(0);
	const [rankPlayers, setRankPlayers] = useState<IPlayer[]>([]);
	const [round, setRound] = useState(1);
	const [maxRound, setMaxRound] = useState<number>(5);
	const [timePerTurn, setTimePerTurn] = useState<number>(0);
	const [word, setWord] = useState<string>('');
	const [showCorrectModal, setShowCorrectModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [showEndGameModal, setShowEndGameModal] = useState<boolean>(false);
	const [getImageData, setGetImageData] = useState<boolean>(false);
	const [seconds, setSeconds] = useState<number>(0);

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
			const { maxRound, timePerTurn, word, round, rank } = data;
			console.log('rank: ', typeof rank);
			setMaxRound(maxRound);
			setTimePerTurn(timePerTurn);
			setWord(word);
			setRound(round);
			const newRankPlayers: IPlayer[] = [];
			Object.entries(rank).forEach(([key, value]) => {
				newRankPlayers.push({
					name: key,
					score: typeof value === 'number' ? value.toString() : '0',
				});
			});
			setIsLoading(false);
			setRankPlayers(newRankPlayers);
			setMessages((messages: IMessage[]) => [
				...messages,
				{ content: `round 1 [${word}] start` },
			]);
		} else if (data.type === 'random-word') {
			const { content, round, rank } = data;
			console.log(data);
			setWord(content);
			setRound(round);
			setReset(true);
			const newRankPlayers: IPlayer[] = [];
			Object.entries(rank).forEach(([key, value]) => {
				newRankPlayers.push({
					name: key,
					score: typeof value === 'number' ? value.toString() : '0',
				});
			});
			setRankPlayers(newRankPlayers);
			setMessages((messages: IMessage[]) => [
				...messages,
				{ content: `round ${round} [${content}] start` },
			]);
		} else if (data.type === 'receive-result') {
			console.log(data.content);
		} else if (data.type === 'recieve-message') {
			setMessages((messages: IMessage[]) => [...messages, data]);
		} else if (data.type === 'recieve-drawed-label-image') {
			console.log(data);
			setMessages((messages: IMessage[]) => [
				...messages,
				{ content: data['content'] },
			]);
		}
	};

	const onPredictImageTime = (seconds: number) => {
		setSeconds(seconds);
		setGetImageData(true);
	};

	const onDrawedLabelImage = () => {
		setScore(10 * seconds);
		setShowCorrectModal(true);

		gameChannel.send({
			type: 'new-drawed-label-image',
			content: `${username} finish at ${seconds} second(s) remaining`,
		});
	};

	// Todo: change to real model, Now: Mock model
	const onPredictImage = (image: number[][]) => {
		setGetImageData(false);
		const words = ['cat', 'dog', 'goat'];
		const predictedWord = words[Math.floor(Math.random() * words.length)];
		const predictedWord1 = words[Math.floor(Math.random() * words.length)];
		const predictedWord2 = words[Math.floor(Math.random() * words.length)];
		// const predictedResult = predictedWord === word &&
		// predictedWord1 === predictedWord2 &&
		// predictedWord === predictedWord1;
		const predictedResult = predictImage(image);

		if (!showCorrectModal && false) {
			onDrawedLabelImage();
		}
	};

	const onTimeOut = () => {
		console.log('timeout');
		setShowCorrectModal(false);
		gameChannel.send({ type: 'end-round', score });
		setScore(0);
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

	const canvasComponent = (
		<Canvas
			color={color}
			reset={reset}
			setReset={setReset}
			onPredictImage={onPredictImage}
			className={styles.canvas}
			getImageData={getImageData}
		/>
	);

	const correctPredictionCompoent = <CorrectPrediction />;

	const midComponent = showCorrectModal
		? correctPredictionCompoent
		: canvasComponent;

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
							onPredictImageTime={onPredictImageTime}
							showCorrect={showCorrectModal}
						/>
					</div>
				</div>
				<div className={styles.main}>
					<PlayersBox
						title={'Ranking'}
						players={rankPlayers}
						username={username}
					/>
					{midComponent}
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
					room={room}
					username={username}
					players={rankPlayers}
				/>
			</div>
		</div>
	);
};

export const GamePage = withRouter(GamePageComponent);
