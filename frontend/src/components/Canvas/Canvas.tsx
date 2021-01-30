import React, { useRef, useEffect, useState } from 'react';

interface ICanvas {}

export const Canvas: React.FC<ICanvas> = (props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvas, setCanvas] = useState<HTMLCanvasElement>();
	const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
	const [isDrawing, setIsDrawing] = useState<boolean>(false);

	useEffect(() => {
		const canvasCurrent = canvasRef.current;
		canvasCurrent && setCanvas(canvasCurrent);
		const context = canvas?.getContext('2d');
		context && setCtx(context);
	}, [canvas]);

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		if (ctx && canvas) {
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#000000';
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
			width={500}
			height={500}
			onMouseDown={startDrawing}
			onMouseUp={stopDrawing}
			onMouseOut={stopDrawing}
			onMouseMove={handleMouseMove}
		/>
	);
};
