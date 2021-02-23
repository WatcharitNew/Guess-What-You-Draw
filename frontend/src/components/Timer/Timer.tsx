import React, { useEffect, useState } from 'react';
import { NewRoundModal } from '../NewRoundModal/NewRoundModal';

interface ITimer {
	newTime?: number;
	onTimeOut: () => void;
	round: number;
	maxRound: number;
	word: string;
}

export const Timer: React.FC<ITimer> = (props) => {
	const { newTime, onTimeOut, round, maxRound, word } = props;
	const [time, setTime] = useState<number>(0);
	const [show, setShowNewRound] = useState<boolean>(true);

	useEffect(() => {
		if (newTime === undefined) {
			setTimeout(() => {
				console.log('timeout: ', newTime);
				newTime && setTime(newTime);
			}, 4000);
		}
		if (time === 0) {
			setShowNewRound(true);
			onTimeOut();

			setTimeout(() => {
				console.log('timeout: ', newTime);
				newTime && setTime(newTime);
			}, 4000);
			setTimeout(() => {
				setShowNewRound(false);
			}, 4500);
		}

		const intervalId = setInterval(() => {
			time > 0 && setTime(time - 1);
		}, 1000);
		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time, newTime]);

	return <div>
		{time}
		<NewRoundModal
			round={round}
			maxRound={maxRound}
			word={word}
			show={show}
		/>
		</div>;
};
