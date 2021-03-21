import classNames from 'classnames';
import React from 'react';
import styles from './NewRoundModal.module.scss';

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
		<div className={classNames(styles.background, { [styles.notShow]: !show })}>
			<div className={styles.endRoundLabel}>{label}</div>
			<div className={styles.newRound}>
				<div className={styles.nextRoundLabel}>
					Round {round}/{maxRound}
				</div>
				<div className={styles.wordLabel}>Word: {word}</div>
			</div>
		</div>
	);
};
