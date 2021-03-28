import React from 'react';
import { NiceModal } from './NiceModal';
import styles from './CorrectPredictionModal.module.scss';

interface ICorrectPredictionModal {
	show: boolean;
}

export const CorrectPredictionModal: React.FC<ICorrectPredictionModal> = (
	props
) => {
	const { show } = props;

	return (
		<NiceModal show={show}>
			<div className={styles.background}>
				<div className={styles.label}>You made it!</div>
				<div className={styles.description}>
					Please wait for other players...
				</div>
			</div>
		</NiceModal>
	);
};
