import React, { ChangeEvent, useState } from 'react';
import styles from './HomePage.module.scss';
import classNames from 'classnames';
import { Button, TextField } from '@material-ui/core';
import { RouteComponentProps, useHistory } from 'react-router';

interface RouteParams {
	room: string,
}

interface IHomePage extends RouteComponentProps<RouteParams> {}

export const HomePage: React.FC<IHomePage> = (props) => {
	const room = props.match.params.room;
	const history = useHistory();
	const [userName,SetUserName] = useState<string>('');

	const onSubmit = () => {
		sessionStorage.setItem("userName", userName);
		if(room) {
			history.push(`/room/${room}`);
		}
		else {
			const newRoom = '123'; //todo
			history.push(`/room/${newRoom}`);
		}
		history.go(0);
	}

	const handleKeyPress = (ev: any) => {
		if (ev.key === 'Enter') {
			onSubmit();
			ev.preventDefault();
		}
	}

	const handleChangeName = (newName: string) => {
		SetUserName(newName);
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
					value={userName} 
					onChange={(ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleChangeName(ev.target.value)}
				/>
			</form>
			</div>
			<Button className={styles.playButton} variant="contained" color="primary" onClick={onSubmit}>
				{room? 'Join' : 'Create room'}
			</Button>
		</div>
	);
};
