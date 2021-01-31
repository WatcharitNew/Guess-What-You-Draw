import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage/HomePage';
import { GamePage } from './components/GamePage/GamePage';
import './App.css';

interface IApp {}

const App: React.FC<IApp> = () => {
	return (
		<main>
			<Switch>
				<Route exact path='/' component={HomePage} />
				<Route path='/:roomId' component={GamePage} />
			</Switch>
		</main>
	);
};

export default App;
