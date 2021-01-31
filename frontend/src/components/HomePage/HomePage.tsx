import React from 'react';
import styles from './HomePage.module.scss';
import classNames from 'classnames';
import { Button, Input } from '@material-ui/core';

interface IHomePage {}

export const HomePage: React.FC<IHomePage> = (props) => {
	return <div className={styles.background}>
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
			<Input className={styles.inputName} placeholder="Input your name" inputProps={{ 'aria-label': 'description' }} />
		</form>
		</div>
		<Button className={styles.playButton} variant="contained" color="primary">
			Play
		</Button>
	</div>;
};
