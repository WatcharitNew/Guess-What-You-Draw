import React from 'react';
import { PlayerBox } from '../PlayerBox/PlayerBox';
import { IPlayer } from '../util';
import styles from './PlayersBox.module.scss';

interface IPlayersBox {
	title: string;
	players: Array<IPlayer>;
	username: string;
}

export const PlayersBox: React.FC<IPlayersBox> = (props) => {
	const { title, players, username } = props;
	return (
		<div className={styles.players}>
			<span className={styles.midText}>{title || 'Players'}</span>
			<div className={styles.playerBoxes}>
				{players.map((player: IPlayer, idx: number) => (
					<PlayerBox
						key={idx}
						name={player.name}
						isLeader={player.isLeader}
						score={player.score}
						isUser={username === player.name}
						rank={idx}
					/>
				))}
			</div>
		</div>
	);
};
