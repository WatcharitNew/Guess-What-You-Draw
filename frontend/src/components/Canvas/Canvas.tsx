import classNames from 'classnames';
import React, { useRef, useEffect, useState } from 'react';
import { ColorCode } from '../util';
import styles from './Canvas.module.scss';

interface ICanvas {
	color: ColorCode;
	reset: boolean;
	setReset: (reset: boolean) => void;
	onSendImage: (test: any) => void;
	className?: string;
}

const WIDTH = 800;
const HEIGHT = 520;

export const Canvas: React.FC<ICanvas> = (props) => {
	const { color, reset, setReset, onSendImage, className } = props;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvas, setCanvas] = useState<HTMLCanvasElement>();
	const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
	const [isDrawing, setIsDrawing] = useState<boolean>(false);

	useEffect(() => {
		if (!ctx) {
			const canvasCurrent = canvasRef.current;
			canvasCurrent && setCanvas(canvasCurrent);
			const context = canvas?.getContext('2d');
			context && setCtx(context);
		}

		if (reset) {
			ctx?.clearRect(0, 0, WIDTH, HEIGHT);
			setReset(false);
		}

		const intervalId = setInterval(() => {
			onSendImage(canvas?.toDataURL());
		}, 1000);
		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canvas, reset]);

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		if (ctx && canvas) {
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.lineWidth = color === '#ffffff' ? 15 : 5;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
			setIsDrawing(true);
		}
	};

	const stopDrawing = () => {
		if (ctx) {
			ctx.closePath();
			setIsDrawing(false);
		}
	};

	const handleMouseMove = (
		e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
	) => {
		if (ctx && canvas) {
			const coords = [
				e.clientX - canvas.offsetLeft,
				e.clientY - canvas.offsetTop,
			];
			if (isDrawing) {
				ctx.lineTo(coords[0], coords[1]);
				ctx.stroke();
			}
		}
	};

	return (
		<canvas
			ref={canvasRef}
			width={WIDTH}
			height={HEIGHT}
			onMouseDown={startDrawing}
			onMouseUp={stopDrawing}
			onMouseOut={stopDrawing}
			onMouseMove={handleMouseMove}
			className={classNames(styles.canvas, className)}
		/>
	);
};
