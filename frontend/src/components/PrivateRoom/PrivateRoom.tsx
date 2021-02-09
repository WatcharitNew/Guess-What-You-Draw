import { Button, Slider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { ChatBox, IMessage } from '../ChatBox/ChatBox';
import styles from './PrivateRoom.module.scss';
import consumer from '../cable';
import { IPlayer } from '../util';
import { PlayersBox } from '../PlayersBox/PlayersBox';

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
	const [messageChannel, setMessageChannel] = useState<any>();
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [players, setPlayers] = useState<IPlayer[]>([]);

	const history = useHistory();
	const handleStart = () => {
		history.push(`/game/${room}`);
		history.go(0);
	};

	const inviteLink = window.location.href;
	const copyToClipboard = () => {
		navigator.clipboard.writeText(inviteLink);
	};

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
			setMessages((messages: IMessage[]) => [
				...messages,
				{ sender: data.sender, content: data.content },
			]);
		} else if (data.type === 'getUsers') {
			const usernames = data.usernames;
			// assume that first member will be leader? not sure if this work
			const newPlayers: IPlayer[] = usernames.map(
				(username: string, idx: number) => ({
					name: username,
					isLeader: idx === 0,
				})
			);
			setPlayers(newPlayers);
		}
	};

	const onSubmitChat = (chatMessage: string) => {
		messageChannel.send({ type: 'send-message', content: chatMessage });
	};

	return (
		<div className={styles.background}>
			<div className={styles.inviteLinkSection} onClick={copyToClipboard}>
				<span className={styles.inviteText}>
					Invite your friends by this link
				</span>
				<div className={styles.inviteLinkAndCopyButton}>
					<div className={styles.inviteLink}>{inviteLink}</div>
					<div className={styles.copyButton}>copy</div>
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
							defaultValue={5}
							min={1}
							max={10}
							marks={roundsSliderMarks}
						/>
					</div>
					<div className={styles.setting}>
						<span className={styles.settingText}>Draws time (s)</span>
						<Slider
							className={styles.slider}
							valueLabelDisplay='auto'
							aria-label='pretto slider'
							defaultValue={30}
							min={10}
							max={60}
							marks={drawTimeSliderMarks}
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
			>
				Start game
			</Button>
		</div>
	);
};
