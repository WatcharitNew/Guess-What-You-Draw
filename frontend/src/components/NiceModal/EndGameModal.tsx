import React from 'react';
import { useHistory } from 'react-router-dom';
import { PlayerBox } from '../PlayerBox/PlayerBox';
import { IPlayer } from '../util';
import styles from './EndGameModal.module.scss';
import { NiceModal } from './NiceModal';
import { Button } from '@material-ui/core';

interface IEndGameModal {
	show: boolean;
	room: string;

	// all players with score
	players: any[];
	username: string;
}

export const EndGameModal: React.FC<IEndGameModal> = (props) => {
	const { show, room, players, username } = props;

	const history = useHistory();
	const goToRoom = () => {
		history.push(`/room/${room}`);
		history.go(0);
	}

	return (
		<NiceModal
			show={show}	
		>
			<div className={styles.background}>
				<div className={styles.label}>Game End!!!</div>
				<div className={styles.players}>
					{players.map((player: IPlayer, idx: number) => (
						<PlayerBox
							key={idx}
							name={player.name}
							isLeader={false}
							score={player.score}
							isUser={username === player.name}
							rank={idx}
						/>
					))}
				</div>
				<Button className={styles.backToRoomButton} variant="contained" color="primary" onClick={goToRoom}>
					Back to room
				</Button>
			</div>
		</NiceModal>
	);
};
