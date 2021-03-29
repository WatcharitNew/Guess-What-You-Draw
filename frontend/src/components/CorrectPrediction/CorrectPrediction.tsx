import React from 'react';
import styles from './CorrectPrediction.module.scss';

interface ICorrectPrediction {
}

export const CorrectPrediction: React.FC<ICorrectPrediction> = (
	props
) => {
	return (
		<div className={styles.background}>
			<div className={styles.label}>You made it!</div>
			<div className={styles.description}>
				Please wait for other players...
			</div>
		</div>
	);
};
