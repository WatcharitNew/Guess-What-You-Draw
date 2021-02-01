import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage/HomePage';
import { GamePage } from './components/GamePage/GamePage';
import ChatBox from './components/TestPage/ChatBox';
import './App.css';

interface IApp {}

const App: React.FC<IApp> = () => {
	return (
		<main>
			<Switch>
				<Route exact path='/' component={HomePage} />
				<Route exact path='/test' component={ChatBox} />
				<Route path='/:roomId' component={GamePage} />
			</Switch>
		</main>
	);
};

export default App;
