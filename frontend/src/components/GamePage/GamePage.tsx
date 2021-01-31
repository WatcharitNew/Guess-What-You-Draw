import React from 'react';
import { withRouter } from 'react-router-dom';
import { Canvas } from '../Canvas/Canvas';

interface IGamePage {
	match: any;
}

const GamePageComponent: React.FC<IGamePage> = (props) => {
	const {
		match: { params },
	} = props;
	console.log('params: ', params);

	return (
		<div>
			Gamepage
			<Canvas />
		</div>
	);
};

export const GamePage = withRouter(GamePageComponent);
