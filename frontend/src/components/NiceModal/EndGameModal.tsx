import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './EndGameModal.module.scss';
import { NiceModal } from './NiceModal';

interface IEndGameModal {
	show: boolean;
	players: any[];
	room: string;
}

export const EndGameModal: React.FC<IEndGameModal> = (props) => {
	const { show, players, room } = props;
	const label = 'Game End!!!';

	const history = useHistory();
	const goToRoom = () => {
		history.push(`/room/${room}`);
		history.go(0);
	}

	return (
		<NiceModal
			show={show}	
		>
			<div>{label}</div>
			<div>Game end</div>
			<div>{players}</div>
			<button onClick={goToRoom} >Back to room</button>
		</NiceModal>
	);
};
