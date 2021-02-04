import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { HomePage } from './components/HomePage/HomePage';
import { GamePage } from './components/GamePage/GamePage';
import './App.css';
import { PrivateRoom } from './components/PrivateRoom/PrivateRoom';

interface IApp {}

const App: React.FC<IApp> = () => {
	return (
		<main>
			<Switch>
				<Route exact path='/home' component={HomePage} />
				<Route path='/home/:room' component={HomePage} />
				<Route path='/game/:room' component={GamePage} />
				<Route path='/room/:room' component={PrivateRoom} />
				<Route render={() => <Redirect to="/home" />} />
			</Switch>
		</main>
	);
};

export default App;
