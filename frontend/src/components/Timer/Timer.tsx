import React, { useEffect, useState } from 'react';
import { NewRoundModal } from '../NiceModal/NewRoundModal';
import { useTimer } from 'react-timer-hook';

interface ITimer {
	time: number;
	onTimeOut: () => void;
	round: number;
	maxRound: number;
	word: string;
}

export const Timer: React.FC<ITimer> = (props) => {
	const { time, onTimeOut, round, maxRound, word } = props;
	const [show, setShowNewRound] = useState<boolean>(true);

	const expiryTimestamp = Date.now() + time*1000 + 7000;

	const _onTimeOut = () => {
		setShowNewRound(false);
		const newTime = Date.now() + time*1000 + 4000;
		restart(newTime)
	}

	const {
		seconds,
		restart
	} = useTimer({ expiryTimestamp, onExpire: _onTimeOut });

	useEffect(() => {
		// once at first render
		if(seconds === time+7 && word === '') { 
			onTimeOut();
		}
		// once at 3 seconds after first render
		if(seconds === time+4 && show) {
			setShowNewRound(false);
		}
		// every end of round
		if(seconds === 4 && !show) {
			setShowNewRound(true);
			onTimeOut();
		}
	}, [onTimeOut, seconds, show, time, word]);
	return <div>
		{seconds > 4 ? seconds-4 : seconds}
		<NewRoundModal
			round={round}
			maxRound={maxRound}
			word={word}
			show={show}
		/>
		</div>;
};
