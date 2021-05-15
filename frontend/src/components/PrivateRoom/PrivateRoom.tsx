import { Button, Slider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { ChatBox, IMessage } from '../ChatBox/ChatBox';
import styles from './PrivateRoom.module.scss';
import consumer from '../cable';
import { IPlayer } from '../util';
import { PlayersBox } from '../PlayersBox/PlayersBox';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface RouteParams {
	room: string;
}

interface sliderMark {
	value: number;
	label: string;
}

interface IPrivateRoom extends RouteComponentProps<RouteParams> {}

export const PrivateRoom: React.FC<IPrivateRoom> = (props: IPrivateRoom) => {
	const room = props.match.params.room;
	const username = sessionStorage.getItem('username') || '';

	const [roomChannel, setRoomChannel] = useState<any>(null);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [players, setPlayers] = useState<IPlayer[]>([]);
	const [maxRound, setMaxRound] = useState<number>(5);
	const [timePerTurn, setTimePerTurn] = useState<number>(30);

	const isLeader = username === players[0]?.name;

	const history = useHistory();
	const handleStart = () => {
		roomChannel.send({ type: 'start-room' });
	};

	const inviteLink = `${window.location.host}/home/${room}`;

	const roundsSliderMarks: sliderMark[] = [
		{
			value: 1,
			label: '1',
		},
		{
			value: 5,
			label: '5',
		},
		{
			value: 10,
			label: '10',
		},
	];

	const drawTimeSliderMarks: sliderMark[] = [
		{
			value: 10,
			label: '10',
		},
		{
			value: 30,
			label: '30',
		},
		{
			value: 60,
			label: '60',
		},
	];

	useEffect(() => {
		setRoomChannel(consumer.subscriptions.create(
			{
				channel: 'RoomChannel',
				username,
				room,
			},
			{
				received: (data: IMessage) => handleReceived(data),
			}
		));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username, room]);

	const handleReceived = (data: any) => {
		if (data.type === 'recieve-message') {
			setMessages((messages: IMessage[]) => [
				...messages,
				{ sender: data.sender, content: data.content },
			]);
		} else if (data.type === 'new-room-data') {
			const { usernames, maxRound, timePerTurn } = data;
			const newPlayers: IPlayer[] = usernames.map(
				(username: string, idx: number) => ({
					name: username,
					isLeader: idx === 0,
				})
			);
			setPlayers(newPlayers);
			if (!isLeader) {
				setMaxRound(maxRound);
				setTimePerTurn(timePerTurn);
			}
		} else if (data.type === 'room-start') {
			history.push(`/game/${room}`);
		}
	};

	const onSubmitChat = (chatMessage: string) => {
		roomChannel.send({ type: 'send-message', content: chatMessage });
	};

	const handleSlideRound = (_: any, value: number | number[]) => {
		setMaxRound(value as number);
	};

	const handleSlideTime = (_: any, value: number | number[]) => {
		setTimePerTurn(value as number);
	};

	const handleSlideRoundCommitted = (_: any, value: number | number[]) => {
		setMaxRound(value as number);
		roomChannel.send({ type: 'set-round', maxRound: value });
	};

	const handleSlideTimeCommitted = (_: any, value: number | number[]) => {
		setTimePerTurn(value as number);
		roomChannel.send({ type: 'set-time', timePerTurn: value });
	};

	return (
		<div className={styles.background}>
			<div className={styles.inviteLinkSection}>
				<span className={styles.inviteText}>
					Invite your friends by this link
				</span>
				<div className={styles.inviteLinkAndCopyButton}>
					<div className={styles.inviteLink}>{inviteLink}</div>
          <CopyToClipboard text={inviteLink}>
            <div className={styles.copyButton}>
              Copy
            </div>
          </CopyToClipboard>
				</div>
			</div>
			<div className={styles.midSection}>
				<div className={styles.settings}>
					<span className={styles.midText}>Settings</span>
					<div className={styles.setting}>
						<span className={styles.settingText}>Rounds</span>
						<Slider
							className={styles.slider}
							valueLabelDisplay='auto'
							aria-label='pretto slider'
							min={1}
							max={10}
							marks={roundsSliderMarks}
							disabled={!isLeader}
							value={maxRound}
							onChange={handleSlideRound}
							onChangeCommitted={handleSlideRoundCommitted}
						/>
					</div>
					<div className={styles.setting}>
						<span className={styles.settingText}>Draws time (s)</span>
						<Slider
							className={styles.slider}
							valueLabelDisplay='auto'
							aria-label='pretto slider'
							min={10}
							max={60}
							marks={drawTimeSliderMarks}
							disabled={!isLeader}
							value={timePerTurn}
							onChange={handleSlideTime}
							onChangeCommitted={handleSlideTimeCommitted}
						/>
					</div>
				</div>
				<ChatBox
					className={styles.chatBox}
					username={username}
					messages={messages}
					onSubmit={onSubmitChat}
				/>
				<PlayersBox title={'Players'} players={players} username={username} />
			</div>
			<Button
				className={styles.startButton}
				onClick={handleStart}
				variant='contained'
				color='primary'
				disabled={!isLeader}
			>
				Start game
			</Button>
		</div>
	);
};
