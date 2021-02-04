import { Button } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { ChatBox } from '../ChatBox/ChatBox';
import styles from './PrivateRoom.module.scss';

interface RouteParams {
	room: string,
}

interface IPrivateRoom extends RouteComponentProps<RouteParams> {}

export const PrivateRoom: React.FC<IPrivateRoom> = (props) => {
    const room = props.match.params.room;
    const userName = sessionStorage.getItem("userName") || '';

    const history = useHistory();
    const handleStart = () => {
        history.push(`/game/${room}`);
		history.go(0);
    }

	return (
        <div className={styles.background}>
            <div className={styles.inviteLinkSection}>
                <span className={styles.inviteText}>Invite your friends by this link</span>
                <div className={styles.inviteLinkAndCopyButton}>
                    <div className={styles.inviteLink}>http://localhost:3000/room/{room}</div>
                    <div className={styles.copyButton}>copy</div>
                </div>
            </div>
            <div className={styles.midSection}>
                <div className={styles.settings}>
                    <span className={styles.midText}>Settings</span>
                    <div className={styles.setting}>
                        <span className={styles.settingText}>Rounds</span>
                        Slider (todo)
                    </div>
                    <div className={styles.setting}>
                        <span className={styles.settingText}>Draws time (s)</span>
                        Slider (todo)
                    </div>
                </div>
                <div className={styles.players}>
                    <span className={styles.midText}>Players</span>
                    todo
                </div>
                <ChatBox
                    room={room}
                    userName={userName}
                />
            </div>
            <Button className={styles.startButton} onClick={handleStart}  variant="contained" color="primary">
                Start game
            </Button>
        </div>
    );
};
