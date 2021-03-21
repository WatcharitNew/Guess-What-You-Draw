import React from 'react';
import styles from './PlayerBox.module.scss';
import classNames from 'classnames';

interface IPlayerBox {
	name: string;
	isLeader?: boolean;
	score?: string;
	isUser: boolean;
	rank: number;
}

export const PlayerBox: React.FC<IPlayerBox> = (props: IPlayerBox) => {
	const { name, isLeader, score, isUser, rank } = props;
	const userStyle = isUser ? styles.player : styles.otherPlayer;
	let order = '';
	if (isLeader) {
		order = '☆';
	} else if (score) {
		order = score;
	}

	const rankStyles = {
		transform: `translate(0px, ${64 * rank}px)`,
	};

	return (
		<div className={styles.wrapPlayerBox}>
			<div
				className={classNames(styles.playerBox, userStyle)}
				style={rankStyles}
			>
				<div className={styles.orderSection}>{order}</div>
				<div className={styles.nameSection}>{name}</div>
			</div>
		</div>
	);
};
