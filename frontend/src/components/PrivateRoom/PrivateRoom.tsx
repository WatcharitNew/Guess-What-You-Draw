import { Button, Slider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { ChatBox, IMessage } from '../ChatBox/ChatBox';
import styles from './PrivateRoom.module.scss';
import { UserBox } from './UserBox';
import consumer from '../cable';

interface RouteParams {
	room: string;
}

interface player {
    name: string;
    isLeader: boolean;
}

interface sliderMark {
    value: number;
    label: string;
}

interface IPrivateRoom extends RouteComponentProps<RouteParams> {}

export const PrivateRoom: React.FC<IPrivateRoom> = (props: IPrivateRoom) => {
    const mockData = { // todo: remove this
        players: [
            {
                name: 'Leader',
                isLeader: true,
            },
            {
                name: 'shiba',
                isLeader: false,
            },
            {
                name: 'akita',
                isLeader: false,
            },
        ],
    };

    const { players } = mockData;

    const room = props.match.params.room;
    const username = sessionStorage.getItem("username") || '';
    const [messageChannel, setMessageChannel] = useState<any>();
    const [messages, setMessages] = useState<IMessage[]>([]);

    const history = useHistory();
    const handleStart = () => {
        history.push(`/game/${room}`);
		history.go(0);
    }

    const inviteLink = window.location.href;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
    };

    const roundsSliderMarks: sliderMark[] = [
        {
          value: 1,
          label: '1',
        },
        {
          value: 5,
          label: '5',
        },
        {
          value: 10,
          label: '10',
        },
    ];

    const drawTimeSliderMarks: sliderMark[] = [
        {
          value: 10,
          label: '10',
        },
        {
          value: 30,
          label: '30',
        },
        {
          value: 60,
          label: '60',
        },
    ];

    useEffect( () => {
        setMessageChannel(
            consumer.subscriptions.create(
                {
                    channel: 'ChatChannel',
                    username,
                    room,
                }, 
                {
                    received: (data: IMessage) => handleReceived(data),
                    // connected: () => console.log('connected'),
                    // disconnected: () => console.log('disconnected'),
                }
            )
        );
    }
    , [room, username]);

    const handleReceived = (data: IMessage) => {
        console.log(data);
        if(data.type === 'message') {
            setMessages((messages: IMessage[]) => ([...messages, data]));
        }
    }
    
    const onSubmitChat = (chatMessage: string) => {
        messageChannel.send({content: chatMessage});
    }

	return (
        <div className={styles.background}>
            <div className={styles.inviteLinkSection} onClick={copyToClipboard}>
                <span className={styles.inviteText}>Invite your friends by this link</span>
                <div className={styles.inviteLinkAndCopyButton}>
                    <div className={styles.inviteLink}>{inviteLink}</div>
                    <div className={styles.copyButton}>copy</div>
                </div>
            </div>
            <div className={styles.midSection}>
                <div className={styles.settings}>
                    <span className={styles.midText}>Settings</span>
                    <div className={styles.setting}>
                        <span className={styles.settingText}>Rounds</span>
                        <Slider 
                            className={styles.slider}
                            valueLabelDisplay="auto" 
                            aria-label="pretto slider" 
                            defaultValue={5} 
                            min={1} 
                            max={10} 
                            marks={roundsSliderMarks}
                        />
                    </div>
                    <div className={styles.setting}>
                        <span className={styles.settingText}>Draws time (s)</span>
                        <Slider
                            className={styles.slider}
                            valueLabelDisplay="auto" 
                            aria-label="pretto slider" 
                            defaultValue={30} 
                            min={10} 
                            max={60} 
                            marks={drawTimeSliderMarks}
                        />
                    </div>
                </div>
                <ChatBox
                    className={styles.chatBox}
                    username={username}
                    messages={messages}
                    onSubmit={onSubmitChat}
                />
                <div className={styles.players}>
                    <span className={styles.midText}>Players</span>
                    <div className={styles.userBoxs}>
                        {players.map((player: player, idx: number) => 
                            <UserBox
                                key={idx}
                                name={player.name}
                                isLeader={player.isLeader} 
                                isUser={username === player.name}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Button className={styles.startButton} onClick={handleStart}  variant="contained" color="primary">
                Start game
            </Button>
        </div>
    );
};
