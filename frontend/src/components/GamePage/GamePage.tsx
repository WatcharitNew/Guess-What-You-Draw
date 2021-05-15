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
	const [wordID, setWordID] = useState<number>(0);
	const [showCorrectModal, setShowCorrectModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [showEndGameModal, setShowEndGameModal] = useState<boolean>(false);
	const [getImageData, setGetImageData] = useState<boolean>(false);
	const [seconds, setSeconds] = useState<number>(0);
  const [classLabel, setClassLabel] = useState<Array<string>>([]);

	useEffect(() => {
    if(classLabel.length === 0) {
      fetch('/class.txt')
        .then((r) => r.text())
        .then(text => {
          const textList = text.split('\n');
          setClassLabel(textList.slice(0, textList.length - 1));
        })  
    }

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

	const handleGameChannelReceived = (data: any) => {
		if (showEndGameModal) {
			return;
		}
		if (data.type === 'game-start') {
			console.log('game start');
			const { maxRound, timePerTurn, word_id, round, rank } = data;
			console.log('rank: ', typeof rank);
			setMaxRound(maxRound);
			setTimePerTurn(timePerTurn);
			setWordID(word_id);
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
		} else if (data.type === 'random-word') {
			const { word_id, round, rank } = data;
			console.log(data);
			setWordID(word_id);
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

	// Todo: set image id
	const onPredictImage = (image: number[][]) => {
		setGetImageData(false);

		new Promise((resolve, reject) => {
			resolve(predictImage(image));
		}).then((predictedImageID) => {
      const predictedID = predictedImageID as number;

			console.log(classLabel[predictedID]);
			if(!showCorrectModal && predictedID === wordID) {
				onDrawedLabelImage();
			}
		});
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
					<div className={styles.word}>Word: {classLabel[wordID]}</div>
					<div className={styles.time}>
						Time:{' '}
						<Timer
							time={timePerTurn || 30}
							onTimeOut={onTimeOut}
							round={round}
							maxRound={maxRound}
							word={classLabel[wordID]}
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
