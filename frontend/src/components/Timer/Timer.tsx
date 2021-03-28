import React, { useEffect, useState } from 'react';
import { NewRoundModal } from '../NiceModal/NewRoundModal';
import { useTimer } from 'react-timer-hook';

interface ITimer {
	time: number;
	onTimeOut: () => void;
	round: number;
	maxRound: number;
	word: string;
	onPredictImageTime: (seconds: number) => void;
	showCorrect: boolean;
}

export const Timer: React.FC<ITimer> = (props) => {
	const {
		time,
		onTimeOut,
		round,
		maxRound,
		word,
		onPredictImageTime,
		showCorrect,
	} = props;
	const [show, setShowNewRound] = useState<boolean>(true);

	const expiryTimestamp = Date.now() + time * 1000 + 7000;

	const _onTimeOut = () => {
		setShowNewRound(false);
		const newTime = Date.now() + time * 1000 + 4000;
		restart(newTime);
	};

	const { seconds, restart, pause } = useTimer({
		expiryTimestamp,
		onExpire: _onTimeOut,
	});

	useEffect(() => {
		if (round > maxRound) {
			restart(Date.now());
			pause();
			return;
		}

		// once at 3 seconds after first render
		if (seconds === time + 4 && show) {
			setShowNewRound(false);
		}
		// every end of round
		else if (seconds === 4 && !show) {
			setShowNewRound(true);
			onTimeOut();
		} else if (!show && !showCorrect) {
			console.log('seconds: ', seconds - 4);
			onPredictImageTime(seconds - 4);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seconds, show, time]);
	return (
		<div>
			{seconds > 4 ? seconds - 4 : seconds}
			<NewRoundModal
				round={round}
				maxRound={maxRound}
				word={word}
				show={show}
			/>
		</div>
	);
};
