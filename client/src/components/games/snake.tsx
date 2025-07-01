import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const CANVAS_SIZE = 400;
const UNIT = 20;
const GAME_UNITS = CANVAS_SIZE / UNIT;

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 0, y: 0 }]);
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GAME_UNITS) * UNIT,
      y: Math.floor(Math.random() * GAME_UNITS) * UNIT,
    };
    setFood(newFood);
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 0, y: 0 }]);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setGameRunning(false);
    generateFood();
  }, [generateFood]);

  useEffect(() => {
    generateFood();
  }, [generateFood]);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    // Check wall collision
    if (head.x < 0 || head.x >= CANVAS_SIZE || head.y < 0 || head.y >= CANVAS_SIZE) {
      return true;
    }
    // Check self collision
    for (const segment of snakeBody) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= UNIT;
          break;
        case 'DOWN':
          head.y += UNIT;
          break;
        case 'LEFT':
          head.x -= UNIT;
          break;
        case 'RIGHT':
          head.x += UNIT;
          break;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      // Check collision
      if (checkCollision(head, newSnake.slice(1))) {
        setGameOver(true);
        setGameRunning(false);
      }

      return newSnake;
    });
  }, [direction, food, gameRunning, gameOver, generateFood, checkCollision]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgb(229, 231, 235)'; // gray-200
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw food
    ctx.fillStyle = 'rgb(239, 68, 68)'; // red-500
    ctx.fillRect(food.x, food.y, UNIT, UNIT);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? 'rgb(34, 197, 94)' : 'rgb(74, 222, 128)'; // green-500/400
      ctx.fillRect(segment.x, segment.y, UNIT, UNIT);
    });
  }, [snake, food]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      moveSnake();
    }, 100);

    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning && !gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning, gameOver]);

  const startGame = () => {
    setGameRunning(true);
    setGameOver(false);
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-lg">Score: <span className="font-bold text-primary">{score}</span></p>
      </div>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border-2 border-border rounded-lg mx-auto block bg-muted"
      />
      
      <div className="mt-4">
        {gameOver && (
          <p className="text-lg font-bold text-destructive mb-4">Game Over! 🐍</p>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          Use arrow keys to control the snake
        </p>
        <div className="space-x-2">
          {!gameRunning ? (
            <Button onClick={startGame} disabled={gameOver}>
              Start Game
            </Button>
          ) : null}
          <Button onClick={resetGame} variant="outline">
            Reset Game
          </Button>
        </div>
      </div>
    </div>
  );
}
