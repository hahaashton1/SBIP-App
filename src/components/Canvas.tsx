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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width * 2;
      canvas.height = height * 2; 
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        contextRef.current = context;
      }
    }
  }, [width, height]);


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
    <Box width={width} height={height} boxShadow={2} borderRadius={2}>
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
