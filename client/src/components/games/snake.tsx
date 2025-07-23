import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, RotateCcw, Trophy } from "lucide-react";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

type Position = { x: number; y: number };
type Direction = { x: number; y: number };
type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES = {
  easy: { speed: 150 },
  medium: { speed: 100 },
  hard: { speed: 70 },
};

export default function Snake() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const config = DIFFICULTIES[difficulty];

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    setFood(newFood);
  }, [snake]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    generateFood();
  }, [generateFood]);

  const startGame = useCallback(() => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "Snake"
    });
    resetGame();
    setIsPlaying(true);
  }, [resetGame]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    setStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= BOARD_SIZE ||
        newHead.y < 0 ||
        newHead.y >= BOARD_SIZE
      ) {
        endGame();
        return prevSnake;
      }

      // Check self collision
      if (
        prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        endGame();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        generateFood();
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [isPlaying, gameOver, direction, food, endGame, generateFood]);

  // Game loop
  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, config.speed);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, moveSnake, config.speed]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameOver) {
          startGame();
        } else if (!isPlaying) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
        return;
      }

      if (!isPlaying || gameOver) return;

      switch (e.code) {
        case "ArrowUp":
          e.preventDefault();
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          e.preventDefault();
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          e.preventDefault();
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, gameOver, direction, startGame]);

  // Initialize game
  useEffect(() => {
    generateFood();
  }, [generateFood]);

  const renderBoard = useCallback(() => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(
          (segment) => segment.x === x && segment.y === y
        );
        const isHead = snake[0]?.x === x && snake[0]?.y === y;
        const isFood = food.x === x && food.y === y;

        let bgColor = "bg-white";
        let borderColor = "border-green-200";

        if (isHead) {
          bgColor = "bg-green-800";
          borderColor = "border-green-900";
        } else if (isSnake) {
          bgColor = "bg-green-600";
          borderColor = "border-green-700";
        } else if (isFood) {
          bgColor = "bg-red-500";
          borderColor = "border-red-600";
        }

        board.push(
          <div
            key={`${x}-${y}`}
            className={`w-3 h-3 border ${bgColor} ${borderColor} rounded-sm`}
          />
        );
      }
    }
    return board;
  }, [snake, food]);

  const resetStats = useCallback(() => {
    setStats({ wins: 0, losses: 0 });
    setHighScore(0);
    resetGame();
  }, [resetGame]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Snake
        </h3>
        <p className="text-muted-foreground">Eat food to grow longer!</p>
      </div>

      {/* Settings and Stats */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="px-3 py-2 text-sm border rounded-lg bg-background shadow-sm"
            aria-label="Game difficulty level"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Badge
          variant="secondary"
          className="flex items-center gap-2 bg-green-600 text-white"
        >
          Score: {score}
        </Badge>

        <Badge
          variant="outline"
          className="flex items-center gap-2 bg-yellow-100 border-yellow-300 text-yellow-800"
        >
          <Trophy className="h-4 w-4" />
          High: {highScore}
        </Badge>
      </div>

      {/* Game Board */}
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border-2 border-green-300">
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {renderBoard()}
          </div>
        </div>

        {/* Game Status */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-center space-y-2"
            >
              <Badge
                variant="destructive"
                className="text-lg px-6 py-3 bg-red-600 text-white"
              >
                💀 Game Over! Score: {score}
              </Badge>
            </motion.div>
          )}
          {!isPlaying && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Badge
                variant="outline"
                className="text-lg px-4 py-2 bg-blue-100 border-blue-300 text-blue-800"
              >
                Press Space to Start
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panel */}
      <div className="space-y-6 bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        {/* Stats */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-green-800">Statistics</h4>
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-green-300 text-green-800"
            >
              <span>Games Won</span>
              <span>{stats.wins}</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-green-300 text-green-800"
            >
              <span>Games Lost</span>
              <span>{stats.losses}</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-green-300 text-green-800"
            >
              <span>Win Rate</span>
              <span>
                {Math.round(
                  (stats.wins / Math.max(stats.wins + stats.losses, 1)) * 100
                )}
                %
              </span>
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-green-800">Controls</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Arrow keys to move</div>
            <div>Space to start/pause</div>
            <div>Eat red food to grow</div>
            <div>Don't hit walls or yourself</div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <Button
          onClick={startGame}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
        <Button
          onClick={resetStats}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
        >
          <Trophy className="h-4 w-4" />
          Reset Stats
        </Button>
      </div>
    </div>
  );
}
