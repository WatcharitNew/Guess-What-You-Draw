import React, { useEffect, useState } from 'react';

interface ITimer {
	newTime?: number;
	onTimeOut: () => void;
}

export const Timer: React.FC<ITimer> = (props) => {
	const { newTime, onTimeOut } = props;
	const [time, setTime] = useState<number>(0);

	useEffect(() => {
		if (newTime === undefined) {
			setTimeout(() => {
				console.log('timeout: ', newTime);
				newTime && setTime(newTime);
			}, 4000);
		}
		if (time === 0) {
			onTimeOut();

			setTimeout(() => {
				console.log('timeout: ', newTime);
				newTime && setTime(newTime);
			}, 4000);
		}

		const intervalId = setInterval(() => {
			time > 0 && setTime(time - 1);
		}, 1000);
		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time, newTime]);

	return <div>{time}</div>;
};
