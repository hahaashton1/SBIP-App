import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface CanvasProps {
    width: number;
    height: number;
  }

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.offsetWidth * 2; // scaling for high-DPI devices
      canvas.height = canvas.parentElement.offsetHeight * 2; // scaling for high-DPI devices
      canvas.style.width = `${canvas.parentElement.offsetWidth}px`;
      canvas.style.height = `${canvas.parentElement.offsetHeight}px`;

      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        contextRef.current = context;
      }
    }
  }

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    }
  }, []);


  const startDrawing = (event: React.MouseEvent): void => {
    const nativeEvent = event.nativeEvent;
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    if (context) {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = (): void => {
    const context = contextRef.current;
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  const draw = (event: React.MouseEvent): void => {
    if (!isDrawing) {
      return;
    }
    const nativeEvent = event.nativeEvent;
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    if (context) {
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }
  };

  return (
    <Box boxShadow={2} borderRadius={2} style={{ width: '100%', height: '40vh' }}>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </Box>
  );
};

export default Canvas;
