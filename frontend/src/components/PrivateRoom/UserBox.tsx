import React from 'react';
import styles from './PrivateRoom.module.scss';
import classNames from 'classnames';

interface IUserBox {
    name: string,
    isLeader: boolean,
    isUser: boolean,
}

export const UserBox: React.FC<IUserBox> = (props: IUserBox) => {
    const { name, isLeader, isUser } = props;
    const userStyle = isUser ? styles.user
        : styles.otherUser;
    return (
        <div className={classNames(styles.userBox, userStyle)}>
            {isLeader ? '☆        ' : null}
            {name}
        </div>
    );
}