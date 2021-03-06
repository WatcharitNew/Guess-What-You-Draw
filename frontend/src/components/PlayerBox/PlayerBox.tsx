import React from 'react';
import styles from './PlayerBox.module.scss';
import classNames from 'classnames';

interface IPlayerBox {
	name: string;
	isLeader?: boolean;
	score?: string;
	isUser: boolean;
}

export const PlayerBox: React.FC<IPlayerBox> = (props: IPlayerBox) => {
	const { name, isLeader, score, isUser } = props;
	const userStyle = isUser ? styles.player : styles.otherPlayer;
	let order = '';
	if (isLeader) {
		order = '☆';
	} else if (score) {
		order = score;
	}
	return (
		<div className={classNames(styles.playerBox, userStyle)}>
			<div className={styles.orderSection}>{order}</div>
			<div className={styles.nameSection}>{name}</div>
		</div>
	);
};
