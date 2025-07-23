import { useState, useEffect, useCallback } from "react";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Clock, Trophy, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Cell = {
  isMine: boolean;
  neighborMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
};

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(10);
  const [time, setTime] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  const config = DIFFICULTIES[difficulty];

  const initializeBoard = useCallback(() => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "Minesweeper"
    });
    const newBoard: Cell[][] = [];
    for (let i = 0; i < config.rows; i++) {
      newBoard[i] = [];
      for (let j = 0; j < config.cols; j++) {
        newBoard[i][j] = {
          isMine: false,
          neighborMines: 0,
          isRevealed: false,
          isFlagged: false,
        };
      }
    }
    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setMinesLeft(config.mines);
    setTime(0);
    setGameStarted(false);
  }, [config]);

  const placeMines = useCallback(
    (firstRow: number, firstCol: number) => {
      const newBoard = [...board];
      let minesPlaced = 0;

      while (minesPlaced < config.mines) {
        const row = Math.floor(Math.random() * config.rows);
        const col = Math.floor(Math.random() * config.cols);

        // Don't place mine on first click or if already a mine
        if (
          (row === firstRow && col === firstCol) ||
          newBoard[row][col].isMine
        ) {
          continue;
        }

        newBoard[row][col].isMine = true;
        minesPlaced++;
      }

      // Calculate neighbor mines
      for (let i = 0; i < config.rows; i++) {
        for (let j = 0; j < config.cols; j++) {
          if (!newBoard[i][j].isMine) {
            let count = 0;
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                const ni = i + di;
                const nj = j + dj;
                if (
                  ni >= 0 &&
                  ni < config.rows &&
                  nj >= 0 &&
                  nj < config.cols
                ) {
                  if (newBoard[ni][nj].isMine) count++;
                }
              }
            }
            newBoard[i][j].neighborMines = count;
          }
        }
      }

      setBoard(newBoard);
    },
    [board, config]
  );

  const revealCell = useCallback(
    (row: number, col: number) => {
      if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged)
        return;

      if (!gameStarted) {
        placeMines(row, col);
        setGameStarted(true);
      }

      const newBoard = [...board];

      if (newBoard[row][col].isMine) {
        // Game over - reveal all mines
        for (let i = 0; i < config.rows; i++) {
          for (let j = 0; j < config.cols; j++) {
            if (newBoard[i][j].isMine) {
              newBoard[i][j].isRevealed = true;
            }
          }
        }
        setBoard(newBoard);
        setGameOver(true);
        setStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
        return;
      }

      // Reveal cell and neighbors if no adjacent mines
      const revealRecursive = (r: number, c: number) => {
        if (r < 0 || r >= config.rows || c < 0 || c >= config.cols) return;
        if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) return;

        newBoard[r][c].isRevealed = true;

        if (newBoard[r][c].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              revealRecursive(r + dr, c + dc);
            }
          }
        }
      };

      revealRecursive(row, col);
      setBoard(newBoard);

      // Check win condition
      const revealedCount = newBoard
        .flat()
        .filter((cell) => cell.isRevealed).length;
      const totalCells = config.rows * config.cols;
      if (revealedCount === totalCells - config.mines) {
        setGameWon(true);
        setGameOver(true);
        setStats((prev) => ({ ...prev, wins: prev.wins + 1 }));
        if (time < highScore || highScore === 0) {
          setHighScore(time);
        }
      }
    },
    [board, gameOver, gameStarted, config, time, highScore]
  );

  const toggleFlag = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (gameOver || board[row][col].isRevealed) return;

      const newBoard = [...board];
      newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
      setBoard(newBoard);
      setMinesLeft((prev) =>
        newBoard[row][col].isFlagged ? prev - 1 : prev + 1
      );
    },
    [board, gameOver]
  );

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Initialize board when difficulty changes
  useEffect(() => {
    initializeBoard();
  }, [difficulty, initializeBoard]);

  const renderBoard = useCallback(() => {
    return (
      <div
        className={`grid gap-1 p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg border-2 border-gray-300`}
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let bgColor = "bg-gray-300";
            let textColor = "text-gray-800";
            let borderColor = "border-gray-400";

            if (cell.isRevealed) {
              if (cell.isMine) {
                bgColor = "bg-red-500";
                textColor = "text-white";
                borderColor = "border-red-600";
              } else {
                bgColor = "bg-white";
                textColor = "text-gray-800";
                borderColor = "border-gray-300";
              }
            } else if (cell.isFlagged) {
              bgColor = "bg-yellow-400";
              textColor = "text-yellow-800";
              borderColor = "border-yellow-500";
            } else {
              bgColor = "bg-gray-400";
              textColor = "text-gray-700";
              borderColor = "border-gray-500";
            }

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                disabled={gameOver || cell.isRevealed}
                className={`w-8 h-8 border-2 font-bold text-xs transition-all duration-200 rounded-md shadow-sm ${bgColor} ${textColor} ${borderColor} hover:bg-opacity-80`}
                whileHover={
                  !gameOver && !cell.isRevealed ? { scale: 1.05 } : {}
                }
                whileTap={!gameOver && !cell.isRevealed ? { scale: 0.95 } : {}}
              >
                {cell.isFlagged ? (
                  "🚩"
                ) : cell.isRevealed && cell.isMine ? (
                  "💣"
                ) : cell.isRevealed && cell.neighborMines > 0 ? (
                  <span
                    className={`font-bold ${
                      cell.neighborMines === 1
                        ? "text-blue-600"
                        : cell.neighborMines === 2
                        ? "text-green-600"
                        : cell.neighborMines === 3
                        ? "text-red-600"
                        : cell.neighborMines === 4
                        ? "text-purple-600"
                        : cell.neighborMines === 5
                        ? "text-orange-600"
                        : cell.neighborMines === 6
                        ? "text-cyan-600"
                        : cell.neighborMines === 7
                        ? "text-pink-600"
                        : "text-gray-800"
                    }`}
                  >
                    {cell.neighborMines}
                  </span>
                ) : (
                  ""
                )}
              </motion.button>
            );
          })
        )}
      </div>
    );
  }, [board, gameOver, revealCell, toggleFlag, config.cols]);

  const startNewGame = () => {
    initializeBoard();
  };

  const resetStats = () => {
    setStats({ wins: 0, losses: 0 });
    setHighScore(0);
    initializeBoard();
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Minesweeper
        </h3>
        <p className="text-muted-foreground">
          Clear the board without hitting mines!
        </p>
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
            <option value="easy">Easy (9x9, 10 mines)</option>
            <option value="medium">Medium (16x16, 40 mines)</option>
            <option value="hard">Hard (16x30, 99 mines)</option>
          </select>
        </div>

        <Badge
          variant="outline"
          className="flex items-center gap-2 bg-blue-100 border-blue-300 text-blue-800"
        >
          <Clock className="h-4 w-4" />
          {formatTime(time)}
        </Badge>

        <Badge
          variant="secondary"
          className="flex items-center gap-2 bg-green-600 text-white"
        >
          Mines: {minesLeft}
        </Badge>

        <Badge
          variant="outline"
          className="flex items-center gap-2 bg-yellow-100 border-yellow-300 text-yellow-800"
        >
          <Trophy className="h-4 w-4" />
          High: {formatTime(highScore)}
        </Badge>
      </div>

      {/* Game Board */}
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border-2 border-gray-300">
          {renderBoard()}
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
                variant="default"
                className="text-lg px-6 py-3 bg-green-600 text-white"
              >
                {gameWon ? "🎉 You Won!" : "💥 Game Over!"}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panel */}
      <div className="space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
        {/* Stats */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-800">Statistics</h4>
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-gray-300 text-gray-800"
            >
              <span>Games Won</span>
              <span>{stats.wins}</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-gray-300 text-gray-800"
            >
              <span>Games Lost</span>
              <span>{stats.losses}</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-gray-300 text-gray-800"
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
          <h4 className="text-sm font-medium text-gray-800">Controls</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Left click to reveal</div>
            <div>Right click to flag</div>
            <div>Numbers show adjacent mines</div>
            <div>Clear all safe cells to win</div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <Button
          onClick={startNewGame}
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
