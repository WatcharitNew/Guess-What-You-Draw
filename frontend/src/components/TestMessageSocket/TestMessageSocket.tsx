import React, { useEffect, useState } from 'react';
import ActionCable, { Cable, Channel } from 'actioncable';

interface ITestMessageSocket {}

export const TestMessageSocket: React.FC<ITestMessageSocket> = (props) => {
	// const [cable, setCable] = useState<Cable>();
	const [messageChannel, setMessageChannel] = useState<Channel>();
	const [msg, setMsg] = useState('');

	useEffect(() => {
		const cable = ActionCable.createConsumer('http://127.0.0.1:10000/cable');

		setMessageChannel(
			cable.subscriptions.create(
				{ channel: 'MessageChannel' },
				{
					received: (message: any) => handleReceivedMessage(message),
					connected: () => {
						console.log('connected!');
					},
				}
			)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleReceivedMessage = (message: any) => {
		console.log('message: ', message);
		setMsg(message.class);
	};

	return (
		<div>
			Test {msg}
			<button
				onClick={() => {
					messageChannel?.send({ image: 'Hello world' });
				}}
			>
				test send
			</button>
		</div>
	);
};
