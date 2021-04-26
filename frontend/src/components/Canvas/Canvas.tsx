import classNames from 'classnames';
import React, { useRef, useEffect, useState } from 'react';
import { ColorCode } from '../util';
import styles from './Canvas.module.scss';

interface ICanvas {
	color: ColorCode;
	reset: boolean;
	setReset: (reset: boolean) => void;
	onPredictImage: (image: number[][]) => void;
	className?: string;
	getImageData: boolean;
}

const WIDTH = 672;
const HEIGHT = 448;

export const Canvas: React.FC<ICanvas> = (props) => {
	const {
		color,
		reset,
		setReset,
		className,
		getImageData,
		onPredictImage,
	} = props;
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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canvas, reset, getImageData]);

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		if (ctx && canvas) {
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.lineWidth = color === '#ffffff' ? 20 : 10;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
			setIsDrawing(true);
		}
	};

	const stopDrawing = async () => {
		if (ctx) {
			ctx.closePath();
			setIsDrawing(false);
			if (getImageData) {
				const imageArray = ctx?.getImageData(0, 0, WIDTH, HEIGHT).data;
				const lightLayer =
					imageArray && imageArray.filter((image, idx) => (idx - 3) % 4 === 0);
				const lightLayer2d: number[][] = [];
				if (lightLayer) {
					for (let i = 0; i < lightLayer.length; i += WIDTH) {
						lightLayer2d.push(Array.from(lightLayer.slice(i, i + WIDTH)));
					}
				}
	
				new Promise((resolve, reject) => {
					resolve(onPredictImage(lightLayer2d));
				});
			}
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
