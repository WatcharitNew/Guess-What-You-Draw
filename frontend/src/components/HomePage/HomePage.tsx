import React, { ChangeEvent, useState } from 'react';
import styles from './HomePage.module.scss';
import classNames from 'classnames';
import { Button, TextField } from '@material-ui/core';
import { RouteComponentProps, useHistory } from 'react-router';
import axios from 'axios'

const ENDPOINT = process.env.REACT_APP_BACKEND || "http://localhost:10000";

interface RouteParams {
	room: string,
}

interface IHomePage extends RouteComponentProps<RouteParams> {}

export const HomePage: React.FC<IHomePage> = (props) => {
	const room = props.match.params.room;
	const history = useHistory();
	const [username, setUsername] = useState<string>('');
	const [nameErrorText, setNameErrorText] = useState<string>('');

	const onSubmit = () => {
		sessionStorage.setItem("username", username);
		if(username.length <= 0) {
			setNameErrorText('Please enter your name.');
		}
		else if(room) {
			axios.post(`${ENDPOINT}/room/${room}`, {username: username})
				.then((res) => {
					console.log(res);
					if(res.status === 200) {
						history.push(`/room/${room}`);
						history.go(0);
					}
					else if(res.status === 400 && res.data.error === "Duplicate username") {
						setNameErrorText('The username is already used. Please use another username.');
					}
					else {
						setNameErrorText('Maybe server down. Please try again later.');
					}
				})
				.catch((error) => {
					if(error.response.status === 400 && error.response.data.error === "Duplicate username")
					{
						setNameErrorText('The username is already used. Please use another username.');
					}
					else {
						setNameErrorText('Maybe server down. Please try again later.');
					}
				})
		}
		else {
			axios.post(`${ENDPOINT}/room`)
				.then(res => {
					if(res.data.room) {
						history.push(`/room/${res.data.room}`);
						history.go(0);
					}
			})
		}
	}

	const handleKeyPress = (ev: any) => {
		if (ev.key === 'Enter') {
			onSubmit();
			ev.preventDefault();
		}
	}

	const handleChangeName = (newName: string) => {
		setUsername(newName.trim());
	}

	return (
		<div className={styles.background}>
			<div className={styles.titleSection}>
				<div className={classNames(styles.green, styles.titleRectangle)}>Guess What</div>
				<div className={classNames(styles.orange, styles.titleRectangle)}>You Draw</div>
			</div>
			<div className={styles.midSection}>
				<div className={styles.midRectangle}/>
				<div className={styles.midCircle}/>
				<div className={styles.midTriangle}/>
			</div>
			<div>
			<form noValidate autoComplete="off">
				<TextField 
					className={styles.inputName} 
					placeholder="Input your name" 
					onKeyPress={handleKeyPress} 
					value={username} 
					onChange={(ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleChangeName(ev.target.value)}
				/>
			</form>
			</div>
			<Button className={styles.playButton} variant="contained" color="primary" onClick={onSubmit}>
				{room? 'Join' : 'Create room'}
			</Button>
			<span className={styles.nameErrorText}>{nameErrorText}</span>
		</div>
	);
};
