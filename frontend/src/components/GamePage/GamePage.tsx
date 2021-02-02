import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Canvas } from '../Canvas/Canvas';
import { ChatBox } from '../ChatBox/ChatBox';
import styles from './GamePage.module.scss';

interface RouteParams {
	room: string,
}

interface IGamePage extends RouteComponentProps<RouteParams> {}

const GamePageComponent: React.FC<IGamePage> = (props) => {
	const room = props.match.params.room;
	const userName = sessionStorage.getItem("userName") || '';
	console.log(`Room ${room} UserName ${userName}`);

	return (
		<div className={styles.background}>
			Gamepage
			<Canvas />
			<ChatBox
				className={styles.chatBox}
				room={room}
				userName={userName}
			/>
		</div>
	);
};

export const GamePage = withRouter(GamePageComponent);
