import { useState, useCallback, useEffect, useRef } from "react";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { RotateCcw, Pause, Play, Trophy, Save } from "lucide-react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: "bg-cyan-500" },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-500",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "bg-purple-500",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "bg-green-500",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "bg-red-500",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "bg-blue-500",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "bg-orange-500",
  },
};

type TetrominoType = keyof typeof TETROMINOS;
type Board = number[][];

interface Piece {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
}

export default function Tetris() {
  const [board, setBoard] = useState<Board>(() =>
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);
  const [heldPiece, setHeldPiece] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("tetris-high-score") || "0");
  });
  const [linesCleared, setLinesCleared] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomTetromino = useCallback((): TetrominoType => {
    const types = Object.keys(TETROMINOS) as TetrominoType[];
    return types[Math.floor(Math.random() * types.length)];
  }, []);

  const createPiece = useCallback((type: TetrominoType): Piece => {
    return {
      type,
      shape: TETROMINOS[type].shape,
      x:
        Math.floor(BOARD_WIDTH / 2) -
        Math.floor(TETROMINOS[type].shape[0].length / 2),
      y: 0,
    };
  }, []);

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map((row) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const isValidPosition = useCallback(
    (piece: Piece, board: Board, dx = 0, dy = 0): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x] !== 0) {
            const newX = piece.x + x + dx;
            const newY = piece.y + y + dy;

            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
              return false;
            }
            if (newY >= 0 && board[newY][newX] !== EMPTY_CELL) {
              return false;
            }
          }
        }
      }
      return true;
    },
    []
  );

  const getWallKickOffset = useCallback(
    (piece: Piece, board: Board): { dx: number; dy: number } => {
      const rotated = rotatePiece(piece);
      if (isValidPosition(rotated, board)) {
        return { dx: 0, dy: 0 };
      }

      // Try wall kicks
      const kicks = [
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: -1, dy: -1 },
        { dx: 1, dy: -1 },
        { dx: -2, dy: 0 },
        { dx: 2, dy: 0 },
      ];

      for (const kick of kicks) {
        if (isValidPosition(rotated, board, kick.dx, kick.dy)) {
          return kick;
        }
      }

      return { dx: 0, dy: 0 };
    },
    [rotatePiece, isValidPosition]
  );

  const getGhostPiece = useCallback(
    (piece: Piece, board: Board): Piece => {
      let ghostY = piece.y;
      while (isValidPosition({ ...piece, y: ghostY + 1 }, board)) {
        ghostY++;
      }
      return { ...piece, y: ghostY };
    },
    [isValidPosition]
  );

  const placePiece = useCallback((piece: Piece, board: Board): Board => {
    const newBoard = board.map((row) => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] =
              Object.keys(TETROMINOS).indexOf(piece.type) + 1;
          }
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback(
    (
      board: Board
    ): { newBoard: Board; linesCleared: number; clearedRows: number[] } => {
      const clearedRows: number[] = [];
      const newBoard = board.filter((row, index) => {
        if (row.every((cell) => cell !== EMPTY_CELL)) {
          clearedRows.push(index);
          return false;
        }
        return true;
      });

      const linesCleared = clearedRows.length;

      while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
      }

      return { newBoard, linesCleared, clearedRows };
    },
    []
  );

  const spawnNewPiece = useCallback(() => {
    const type = nextPiece || getRandomTetromino();
    const piece = createPiece(type);
    setNextPiece(getRandomTetromino());
    setCanHold(true);

    if (!isValidPosition(piece, board)) {
      setGameOver(true);
      const newHighScore = Math.max(highScore, score);
      setHighScore(newHighScore);
      localStorage.setItem("tetris-high-score", newHighScore.toString());
      return null;
    }

    return piece;
  }, [
    nextPiece,
    getRandomTetromino,
    createPiece,
    isValidPosition,
    board,
    score,
    highScore,
  ]);

  const holdPiece = useCallback(() => {
    if (!currentPiece || !canHold || gameOver || paused) return;

    const newHeldPiece = heldPiece;
    setHeldPiece(currentPiece.type);

    if (newHeldPiece) {
      setCurrentPiece(createPiece(newHeldPiece));
    } else {
      const newPiece = spawnNewPiece();
      setCurrentPiece(newPiece);
    }

    setCanHold(false);
  }, [
    currentPiece,
    canHold,
    gameOver,
    paused,
    heldPiece,
    createPiece,
    spawnNewPiece,
  ]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || paused) return;

    if (isValidPosition(currentPiece, board, 0, 1)) {
      setCurrentPiece((prev) => (prev ? { ...prev, y: prev.y + 1 } : null));
    } else {
      const newBoard = placePiece(currentPiece, board);
      const {
        newBoard: clearedBoard,
        linesCleared: cleared,
        clearedRows,
      } = clearLines(newBoard);

      setBoard(clearedBoard);
      setLines((prev) => prev + cleared);
      setLinesCleared(cleared);

      // Fix level calculation - level should increase every 10 lines
      const newLines = lines + cleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      setLevel(newLevel);

      // Scoring system: 100 per line, bonus for multiple lines
      const lineScores = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 lines
      const lineBonus = lineScores[cleared] || 0;
      setScore((prev) => prev + lineBonus * newLevel + 10);

      const newPiece = spawnNewPiece();
      setCurrentPiece(newPiece);
    }
  }, [
    currentPiece,
    board,
    gameOver,
    paused,
    isValidPosition,
    placePiece,
    clearLines,
    lines,
    spawnNewPiece,
  ]);

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (!currentPiece || gameOver || paused) return;

      if (isValidPosition(currentPiece, board, dx, dy)) {
        setCurrentPiece((prev) =>
          prev ? { ...prev, x: prev.x + dx, y: prev.y + dy } : null
        );
      }
    },
    [currentPiece, board, gameOver, paused, isValidPosition]
  );

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || gameOver || paused) return;

    const rotated = rotatePiece(currentPiece);
    const kick = getWallKickOffset(currentPiece, board);

    if (isValidPosition(rotated, board, kick.dx, kick.dy)) {
      setCurrentPiece({
        ...rotated,
        x: rotated.x + kick.dx,
        y: rotated.y + kick.dy,
      });
    }
  }, [
    currentPiece,
    board,
    gameOver,
    paused,
    rotatePiece,
    getWallKickOffset,
    isValidPosition,
  ]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || paused) return;

    const ghostPiece = getGhostPiece(currentPiece, board);
    const dropDistance = ghostPiece.y - currentPiece.y;
    setCurrentPiece(null);
    setNextPiece(null);
    setHeldPiece(null);
    setCanHold(true);
    setScore(0);
    setLevel(1);
    setLines(0);
    setLinesCleared(0);
    setGameOver(false);
    setPaused(false);

    const firstPiece = getRandomTetromino();
    setNextPiece(getRandomTetromino());
    setCurrentPiece(createPiece(firstPiece));
  }, [getRandomTetromino, createPiece]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          movePiece(1, 0);
          break;
        case "ArrowDown":
          e.preventDefault();
          movePiece(0, 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          rotatePieceHandler();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "c":
        case "C":
          e.preventDefault();
          holdPiece();
          break;
        case "p":
        case "P":
          setPaused((prev) => !prev);
          break;
      }
    },
    [gameOver, movePiece, rotatePieceHandler, hardDrop, holdPiece]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameOver && !paused) {
      const speed = Math.max(50, 1000 - (level - 1) * 100);
      intervalRef.current = setInterval(dropPiece, speed);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [dropPiece, level, gameOver, paused]);

  useEffect(() => {
    resetGame();
  }, []);

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    if (currentPiece) {
      // Draw ghost piece
      const ghostPiece = getGhostPiece(currentPiece, board);
      for (let y = 0; y < ghostPiece.shape.length; y++) {
        for (let x = 0; x < ghostPiece.shape[y].length; x++) {
          if (ghostPiece.shape[y][x] !== 0) {
            const boardY = ghostPiece.y + y;
            const boardX = ghostPiece.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = -1; // Ghost piece indicator
            }
          }
        }
      }

      // Draw current piece
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] =
                Object.keys(TETROMINOS).indexOf(currentPiece.type) + 1;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  const getCellColor = (value: number) => {
    if (value === -1) return "bg-gray-600 border-gray-500 opacity-50"; // Ghost piece
    if (value === 0) return "bg-gray-900 border-gray-700";
    const colors = [
      "",
      "bg-cyan-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-red-500",
      "bg-blue-500",
      "bg-orange-500",
    ];
    return colors[value] || "bg-gray-500";
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;
    const shape = TETROMINOS[nextPiece].shape;
    const color = TETROMINOS[nextPiece].color;

    return (
      <div className="space-y-1">
        {shape.map((row, y) => (
          <div key={y} className="flex gap-1">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-4 h-4 border ${
                  cell ? color : "bg-gray-800 border-gray-700"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderHeldPiece = () => {
    if (!heldPiece)
      return (
        <div className="space-y-1">
          {Array(2)
            .fill(null)
            .map((_, y) => (
              <div key={y} className="flex gap-1">
                {Array(4)
                  .fill(null)
                  .map((_, x) => (
                    <div
                      key={x}
                      className="w-4 h-4 border bg-gray-800 border-gray-700"
                    />
                  ))}
              </div>
            ))}
        </div>
      );

    const shape = TETROMINOS[heldPiece].shape;
    const color = TETROMINOS[heldPiece].color;

    return (
      <div className="space-y-1">
        {shape.map((row, y) => (
          <div key={y} className="flex gap-1">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-4 h-4 border ${
                  cell ? color : "bg-gray-800 border-gray-700"
                } ${!canHold ? "opacity-50" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Tetris</h3>
        <p className="text-muted-foreground">
          Clear lines by filling rows completely!
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Game Board */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gray-800 p-2 rounded-lg">
            <div className="grid grid-cols-10 gap-px">
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <motion.div
                    key={`${y}-${x}`}
                    className={`w-6 h-6 border ${getCellColor(cell)}`}
                    initial={cell !== 0 && cell !== -1 ? { scale: 0 } : {}}
                    animate={cell !== 0 && cell !== -1 ? { scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Game Status */}
          {gameOver ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center space-y-2"
            >
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Game Over!
              </Badge>
              <p className="text-sm text-muted-foreground">
                Final Score: {score}
              </p>
            </motion.div>
          ) : paused ? (
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Paused
            </Badge>
          ) : null}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-2 w-full justify-between"
              >
                <span>Score</span>
                <span className="font-mono">{score.toLocaleString()}</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 w-full justify-between"
              >
                <span>Level</span>
                <span>{level}</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 w-full justify-between"
              >
                <span>Lines</span>
                <span>{lines}</span>
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-2 w-full justify-between"
              >
                <Trophy className="h-3 w-3" />
                <span>High</span>
                <span className="font-mono">{highScore.toLocaleString()}</span>
              </Badge>
            </div>
          </div>

          {/* Held Piece */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Hold (C)</h4>
            <div className="bg-gray-800 p-3 rounded-lg">
              {renderHeldPiece()}
            </div>
          </div>

          {/* Next Piece */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Next Piece</h4>
            <div className="bg-gray-800 p-3 rounded-lg">
              {renderNextPiece()}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Controls</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>← → Move</div>
              <div>↓ Soft Drop</div>
              <div>↑ Rotate</div>
              <div>Space Hard Drop</div>
              <div>C Hold Piece</div>
              <div>P Pause</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <Button
          onClick={() => setPaused(!paused)}
          disabled={gameOver}
          variant="outline"
          className="flex items-center gap-2"
        >
          {paused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button
          onClick={resetGame}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </div>
    </div>
  );
}
