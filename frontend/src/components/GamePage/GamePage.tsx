import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Canvas } from '../Canvas/Canvas';
import { ColorCode } from '../util';
import { ChatBox } from '../ChatBox/ChatBox';
import { RankBox } from '../RankBox/RankBox';
import { Toolbar } from '../Toolbar/Toolbar';
import styles from './GamePage.module.scss';

interface RouteParams {
	room: string;
}

interface IGamePage extends RouteComponentProps<RouteParams> {}

const GamePageComponent: React.FC<IGamePage> = (props) => {
	const room = props.match.params.room;
	const userName = sessionStorage.getItem('userName') || '';

	const [color, setColor] = useState<ColorCode>('#000000');
	const [reset, setReset] = useState<boolean>(false);
	console.log(`Room ${room} UserName ${userName}`);

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
				<ChatBox className={styles.chatBox} room={room} userName={userName} />
			</div>
			<div className={styles.bottom}>
				<Toolbar setColor={setColor} setReset={setReset} />
			</div>
		</div>
	);
};

export const GamePage = withRouter(GamePageComponent);
