import React, { useState } from 'react';
import classNames from 'classnames';
import { ColorCode } from '../util';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import styles from './Toolbar.module.scss';

interface IToolbar {
	setColor: (color: ColorCode) => void;
	setReset: (reset: boolean) => void;
}

export const Toolbar: React.FC<IToolbar> = (props) => {
	const { setColor, setReset } = props;
	const [usePencil, setUsePencil] = useState<boolean>(true);

	return (
		<div className={styles.background}>
			<div
				className={classNames(styles.pencil, {
					[styles.selectedTool]: usePencil,
				})}
				onClick={() => {
					setColor('#000000');
					setUsePencil(true);
				}}
			/>
			<div
				className={classNames(styles.eraser, {
					[styles.selectedTool]: !usePencil,
				})}
				onClick={() => {
					setColor('#ffffff');
					setUsePencil(false);
				}}
			/>
			<RotateLeftIcon className={styles.reset} onClick={() => setReset(true)} />
		</div>
	);
};
