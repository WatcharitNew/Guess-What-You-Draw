import React from 'react';
import styles from './NewRoundModal.module.scss';
import { NiceModal } from './NiceModal';

interface INewRoundModal {
	round: number;
	maxRound: number;
	word: string;
	show: boolean;
}

export const NewRoundModal: React.FC<INewRoundModal> = (props) => {
	const { round, maxRound, word, show } = props;
	const label = round === 1 ? 'Start Game!!!' : 'End Round!!!';
	return (
		<NiceModal
			show={show}
		>
			<div className={styles.label}>{label}</div>
			<div className={styles.body}>
				<div className={styles.nextRoundLabel}>
					Round {round}/{maxRound}
				</div>
				<div className={styles.wordLabel}>Word: {word}</div>
			</div>
		</NiceModal>
	);
};
