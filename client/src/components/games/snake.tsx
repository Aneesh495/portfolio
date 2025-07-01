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
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake-high-score') || '0');
  });
  const [gameSpeed, setGameSpeed] = useState(150);
  const [powerUp, setPowerUp] = useState<Position | null>(null);

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
    setGameSpeed(150);
    setPowerUp(null);
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
        const newScore = score + 10;
        setScore(newScore);
        
        // Update high score
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snake-high-score', newScore.toString());
        }
        
        // Increase speed every 50 points
        if (newScore % 50 === 0 && gameSpeed > 80) {
          setGameSpeed(prev => prev - 10);
        }
        
        // Generate power-up occasionally
        if (Math.random() < 0.2) {
          const powerUpPos = {
            x: Math.floor(Math.random() * GAME_UNITS) * UNIT,
            y: Math.floor(Math.random() * GAME_UNITS) * UNIT,
          };
          setPowerUp(powerUpPos);
          // Remove power-up after 5 seconds
          setTimeout(() => setPowerUp(null), 5000);
        }
        
        generateFood();
      } else {
        newSnake.pop();
      }

      // Check if power-up is eaten
      if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
        setScore(prev => prev + 25);
        setPowerUp(null);
        // Don't pop tail for power-up (extra growth)
        newSnake.push(newSnake[newSnake.length - 1]);
      }

      // Check collision
      if (checkCollision(head, newSnake.slice(1))) {
        setGameOver(true);
        setGameRunning(false);
      }

      return newSnake;
    });
  }, [direction, food, powerUp, score, highScore, gameSpeed, gameRunning, gameOver, generateFood, checkCollision]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    gradient.addColorStop(0, 'rgb(15, 23, 42)'); // slate-900
    gradient.addColorStop(1, 'rgb(30, 41, 59)'); // slate-800
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'; // slate-400 with opacity
    ctx.lineWidth = 1;
    for (let i = 0; i < GAME_UNITS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * UNIT, 0);
      ctx.lineTo(i * UNIT, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * UNIT);
      ctx.lineTo(CANVAS_SIZE, i * UNIT);
      ctx.stroke();
    }

    // Draw food with glow effect
    ctx.shadowColor = 'rgb(239, 68, 68)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgb(239, 68, 68)'; // red-500
    ctx.fillRect(food.x + 2, food.y + 2, UNIT - 4, UNIT - 4);
    ctx.shadowBlur = 0;

    // Draw power-up if available
    if (powerUp) {
      ctx.shadowColor = 'rgb(255, 215, 0)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = 'rgb(255, 215, 0)'; // gold
      ctx.fillRect(powerUp.x + 2, powerUp.y + 2, UNIT - 4, UNIT - 4);
      ctx.shadowBlur = 0;
    }

    // Draw snake with enhanced visuals
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Snake head with glow
        ctx.shadowColor = 'rgb(34, 197, 94)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = 'rgb(34, 197, 94)'; // green-500
      } else {
        // Snake body
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgb(74, 222, 128)`; // green-400
      }
      
      ctx.fillRect(segment.x + 1, segment.y + 1, UNIT - 2, UNIT - 2);
      
      // Add subtle border
      ctx.strokeStyle = 'rgb(21, 128, 61)'; // green-700
      ctx.lineWidth = 1;
      ctx.strokeRect(segment.x + 1, segment.y + 1, UNIT - 2, UNIT - 2);
    });
    
    ctx.shadowBlur = 0;
  }, [snake, food, powerUp]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      moveSnake();
    }, gameSpeed);

    return () => clearInterval(gameInterval);
  }, [moveSnake, gameSpeed]);

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
      <div className="mb-4 space-y-2">
        <div className="flex justify-center space-x-6 text-lg">
          <p>Score: <span className="font-bold text-primary">{score}</span></p>
          <p>High Score: <span className="font-bold text-yellow-600 dark:text-yellow-400">{highScore}</span></p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Speed Level: {Math.floor((150 - gameSpeed) / 10) + 1}</p>
          {powerUp && <p className="text-yellow-600 dark:text-yellow-400 font-medium">⭐ Power-up available! +25 points</p>}
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border-2 border-slate-600 dark:border-slate-400 rounded-lg mx-auto block shadow-lg"
      />
      
      <div className="mt-4">
        {gameOver && (
          <div className="mb-4">
            <p className="text-lg font-bold text-destructive mb-2">Game Over! 🐍</p>
            {score === highScore && score > 0 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">🎉 New High Score!</p>
            )}
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          Use arrow keys to control the snake<br/>
          <span className="text-xs">Red squares = Food (+10), Gold squares = Power-ups (+25)</span>
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
