import React from 'react';
import { RouteComponentProps } from 'react-router';
import styles from './PrivateRoom.module.scss';

interface RouteParams {
	room: string,
}

interface IPrivateRoom extends RouteComponentProps<RouteParams> {}

export const PrivateRoom: React.FC<IPrivateRoom> = (props) => {
    const room = props.match.params.room;
    const userName = sessionStorage.getItem("userName");
	return <div>Room {room} Username {userName}</div>;
};
