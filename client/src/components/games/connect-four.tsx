import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, RotateCcw, Trophy, Users, Bot } from "lucide-react";

const ROWS = 6;
const COLS = 7;

type Player = 1 | 2; // 1 = player (red), 2 = AI (yellow)
type GameState = "playing" | "won" | "draw";

export default function ConnectFour() {
  const [board, setBoard] = useState<number[][]>(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [winner, setWinner] = useState<Player | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  const initializeGame = useCallback(() => {
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(0))
    );
    setCurrentPlayer(1);
    setGameState("playing");
    setWinner(null);
    setIsAiThinking(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const checkWin = useCallback(
    (board: number[][], row: number, col: number, player: number): boolean => {
      const directions = [
        [0, 1], // horizontal
        [1, 0], // vertical
        [1, 1], // diagonal down-right
        [1, -1], // diagonal down-left
      ];

      for (const [dr, dc] of directions) {
        let count = 1;

        // Check in positive direction
        for (let i = 1; i < 4; i++) {
          const r = row + dr * i;
          const c = col + dc * i;
          if (
            r < 0 ||
            r >= ROWS ||
            c < 0 ||
            c >= COLS ||
            board[r][c] !== player
          )
            break;
          count++;
        }

        // Check in negative direction
        for (let i = 1; i < 4; i++) {
          const r = row - dr * i;
          const c = col - dc * i;
          if (
            r < 0 ||
            r >= ROWS ||
            c < 0 ||
            c >= COLS ||
            board[r][c] !== player
          )
            break;
          count++;
        }

        if (count >= 4) return true;
      }

      return false;
    },
    []
  );

  const isBoardFull = useCallback((board: number[][]): boolean => {
    return board[0].every((cell) => cell !== 0);
  }, []);

  const getLowestEmptyRow = useCallback(
    (board: number[][], col: number): number => {
      for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
          return row;
        }
      }
      return -1;
    },
    []
  );

  const makeMove = useCallback(
    (board: number[][], col: number, player: number): number | null => {
      const row = getLowestEmptyRow(board, col);
      if (row === -1) return null;

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = player;
      return row;
    },
    [getLowestEmptyRow]
  );

  const evaluateBoard = useCallback(
    (board: number[][], depth: number): number => {
      // Check for wins
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (board[row][col] !== 0) {
            if (checkWin(board, row, col, board[row][col])) {
              return board[row][col] === 2 ? 1000 - depth : -1000 + depth;
            }
          }
        }
      }

      // Check for draw
      if (isBoardFull(board)) return 0;

      // Simple evaluation based on potential winning positions
      let score = 0;
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (board[row][col] === 0) {
            const testBoard = board.map((r) => [...r]);
            testBoard[row][col] = 2;
            if (checkWin(testBoard, row, col, 2)) score += 10;

            testBoard[row][col] = 1;
            if (checkWin(testBoard, row, col, 1)) score -= 10;
          }
        }
      }

      return score;
    },
    [checkWin, isBoardFull]
  );

  const minimax = useCallback(
    (
      board: number[][],
      depth: number,
      alpha: number,
      beta: number,
      isMaximizing: boolean
    ): number => {
      const score = evaluateBoard(board, depth);

      if (score === 1000 || score === -1000 || score === 0 || depth === 0) {
        return score;
      }

      if (isMaximizing) {
        let maxEval = -Infinity;
        for (let col = 0; col < COLS; col++) {
          const row = makeMove(board, col, 2);
          if (row !== null) {
            const newBoard = board.map((r) => [...r]);
            newBoard[row][col] = 2;
            const evaluation = minimax(newBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
          }
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (let col = 0; col < COLS; col++) {
          const row = makeMove(board, col, 1);
          if (row !== null) {
            const newBoard = board.map((r) => [...r]);
            newBoard[row][col] = 1;
            const evaluation = minimax(newBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
          }
        }
        return minEval;
      }
    },
    [evaluateBoard, makeMove]
  );

  const getBestMove = useCallback(
    (board: number[][]): number => {
      let bestScore = -Infinity;
      let bestMove = 0;
      const maxDepth =
        difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 6;

      for (let col = 0; col < COLS; col++) {
        const row = makeMove(board, col, 2);
        if (row !== null) {
          const newBoard = board.map((r) => [...r]);
          newBoard[row][col] = 2;
          const score = minimax(newBoard, maxDepth, -Infinity, Infinity, false);
          if (score > bestScore) {
            bestScore = score;
            bestMove = col;
          }
        }
      }

      return bestMove;
    },
    [makeMove, minimax, difficulty]
  );

  const handleColumnClick = useCallback(
    (col: number) => {
      if (gameState !== "playing" || isAiThinking) return;

      const row = makeMove(board, col, 1);
      if (row === null) return; // Column is full

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = 1;
      setBoard(newBoard);

      // Check for player win
      if (checkWin(newBoard, row, col, 1)) {
        setGameState("won");
        setWinner(1);
        setScores((prev) => ({ ...prev, player: prev.player + 1 }));
        return;
      }

      // Check for draw
      if (isBoardFull(newBoard)) {
        setGameState("draw");
        return;
      }

      // AI turn
      setIsAiThinking(true);
      setTimeout(() => {
        const aiCol = getBestMove(newBoard);
        const aiRow = makeMove(newBoard, aiCol, 2);

        if (aiRow !== null) {
          newBoard[aiRow][aiCol] = 2;
          setBoard([...newBoard]);

          // Check for AI win
          if (checkWin(newBoard, aiRow, aiCol, 2)) {
            setGameState("won");
            setWinner(2);
            setScores((prev) => ({ ...prev, ai: prev.ai + 1 }));
          } else if (isBoardFull(newBoard)) {
            setGameState("draw");
          }
        }

        setIsAiThinking(false);
      }, 500);
    },
    [
      board,
      gameState,
      isAiThinking,
      makeMove,
      checkWin,
      isBoardFull,
      getBestMove,
    ]
  );

  const resetScores = useCallback(() => {
    setScores({ player: 0, ai: 0 });
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
          Connect Four
        </h3>
        <p className="text-muted-foreground">Get four in a row to win!</p>
      </div>

      {/* Settings and Stats */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as "easy" | "medium" | "hard")
            }
            className="px-3 py-2 text-sm border rounded-lg bg-background shadow-sm"
            aria-label="AI difficulty level"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Badge
          variant="secondary"
          className="flex items-center gap-2 bg-red-600 text-white"
        >
          <Users className="h-4 w-4" />
          Player: {scores.player}
        </Badge>

        <Badge
          variant="outline"
          className="flex items-center gap-2 bg-blue-100 border-blue-300 text-blue-800"
        >
          <Bot className="h-4 w-4" />
          AI: {scores.ai}
        </Badge>
      </div>

      {/* Game Board */}
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border-2 border-blue-300">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleColumnClick(colIndex)}
                  disabled={
                    gameState !== "playing" || isAiThinking || rowIndex !== 0
                  }
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 shadow-sm ${
                    cell === 1
                      ? "bg-red-500 border-red-600"
                      : cell === 2
                      ? "bg-yellow-500 border-yellow-600"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={
                    gameState === "playing" && !isAiThinking && rowIndex === 0
                      ? { scale: 1.1 }
                      : {}
                  }
                  whileTap={
                    gameState === "playing" && !isAiThinking && rowIndex === 0
                      ? { scale: 0.9 }
                      : {}
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Game Status */}
        <AnimatePresence>
          {gameState === "won" && (
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
                {winner === 1 ? "🎉 You Won!" : "🤖 AI Won!"}
              </Badge>
            </motion.div>
          )}
          {gameState === "draw" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-center space-y-2"
            >
              <Badge
                variant="secondary"
                className="text-lg px-6 py-3 bg-gray-600 text-white"
              >
                🤝 It's a Draw!
              </Badge>
            </motion.div>
          )}
          {isAiThinking && (
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
                🤖 AI is thinking...
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panel */}
      <div className="space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        {/* Controls */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-800">Controls</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Click on a column to drop your piece</div>
            <div>Get four pieces in a row to win</div>
            <div>AI difficulty: {difficulty}</div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <Button
          onClick={initializeGame}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
        <Button
          onClick={resetScores}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
        >
          <Trophy className="h-4 w-4" />
          Reset Scores
        </Button>
      </div>
    </div>
  );
}
