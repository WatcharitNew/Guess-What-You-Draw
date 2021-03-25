import classNames from 'classnames';
import React from 'react';
import styles from './NiceModal.module.scss';

interface INiceModal {
	show: boolean;
    children?: any;
}

export const NiceModal: React.FC<INiceModal> = (props) => {
	const { show, children } = props;
	return (
		<div className={classNames(styles.background, { [styles.notShow]: !show })}>
			{children}
		</div>
	);
};
