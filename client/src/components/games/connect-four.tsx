import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bot, RotateCcw, Trophy } from "lucide-react";

type Player = 'red' | 'yellow' | null;
type GameMode = 'human' | 'ai';

const ROWS = 6;
const COLS = 7;

export default function ConnectFour() {
  const [board, setBoard] = useState<Player[][]>(() => 
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [gameMode, setGameMode] = useState<GameMode>('human');
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [scores, setScores] = useState({ red: 0, yellow: 0, ties: 0 });

  const checkWinner = useCallback((board: Player[][], row: number, col: number): Player | null => {
    const player = board[row][col];
    if (!player) return null;

    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal
    ];

    for (const [dRow, dCol] of directions) {
      let count = 1;
      const cells: [number, number][] = [[row, col]];

      // Check positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + dRow * i;
        const newCol = col + dCol * i;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && 
            board[newRow][newCol] === player) {
          count++;
          cells.push([newRow, newCol]);
        } else break;
      }

      // Check negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - dRow * i;
        const newCol = col - dCol * i;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && 
            board[newRow][newCol] === player) {
          count++;
          cells.unshift([newRow, newCol]);
        } else break;
      }

      if (count >= 4) {
        setWinningCells(cells.slice(0, 4));
        return player;
      }
    }

    return null;
  }, []);

  const checkTie = useCallback((board: Player[][]): boolean => {
    return board[0].every(cell => cell !== null);
  }, []);

  const makeMove = useCallback((col: number, player: Player, currentBoard?: Player[][]) => {
    const boardToUpdate = currentBoard || board;
    
    for (let row = ROWS - 1; row >= 0; row--) {
      if (boardToUpdate[row][col] === null) {
        const newBoard = boardToUpdate.map(r => [...r]);
        newBoard[row][col] = player;
        
        if (!currentBoard) {
          setBoard(newBoard);
        }
        
        const gameWinner = checkWinner(newBoard, row, col);
        if (gameWinner) {
          setWinner(gameWinner);
          setScores(prev => ({
            ...prev,
            [gameWinner]: prev[gameWinner] + 1
          }));
        } else if (checkTie(newBoard)) {
          setWinner('tie');
          setScores(prev => ({
            ...prev,
            ties: prev.ties + 1
          }));
        }
        
        return { newBoard, row, gameWinner };
      }
    }
    return null;
  }, [board, checkWinner, checkTie]);

  // AI Logic - Minimax with Alpha-Beta Pruning
  const evaluateBoard = useCallback((board: Player[][], depth: number): number => {
    // Check for terminal states
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (board[row][col]) {
          const winner = checkWinner(board, row, col);
          if (winner === 'yellow') return 1000 - depth;
          if (winner === 'red') return -1000 + depth;
        }
      }
    }
    
    if (checkTie(board)) return 0;

    // Heuristic evaluation
    let score = 0;
    
    // Center column preference
    for (let row = 0; row < ROWS; row++) {
      if (board[row][3] === 'yellow') score += 3;
      if (board[row][3] === 'red') score -= 3;
    }

    return score;
  }, [checkWinner, checkTie]);

  const minimax = useCallback((board: Player[][], depth: number, alpha: number, beta: number, maximizing: boolean): number => {
    if (depth === 0) return evaluateBoard(board, depth);

    if (maximizing) {
      let maxEval = -Infinity;
      for (let col = 0; col < COLS; col++) {
        if (board[0][col] === null) {
          const result = makeMove(col, 'yellow', board);
          if (result) {
            const eval_ = minimax(result.newBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, eval_);
            alpha = Math.max(alpha, eval_);
            if (beta <= alpha) break;
          }
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let col = 0; col < COLS; col++) {
        if (board[0][col] === null) {
          const result = makeMove(col, 'red', board);
          if (result) {
            const eval_ = minimax(result.newBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, eval_);
            beta = Math.min(beta, eval_);
            if (beta <= alpha) break;
          }
        }
      }
      return minEval;
    }
  }, [makeMove, evaluateBoard]);

  const getBestMove = useCallback((board: Player[][]): number => {
    let bestScore = -Infinity;
    let bestCol = 3; // Default to center

    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) {
        const result = makeMove(col, 'yellow', board);
        if (result) {
          const score = minimax(result.newBoard, 5, -Infinity, Infinity, false);
          if (score > bestScore) {
            bestScore = score;
            bestCol = col;
          }
        }
      }
    }

    return bestCol;
  }, [makeMove, minimax]);

  const handleColumnClick = (col: number) => {
    if (winner || board[0][col] !== null) return;
    if (gameMode === 'ai' && currentPlayer === 'yellow' && isAiThinking) return;

    const result = makeMove(col, currentPlayer);
    if (result && !result.gameWinner && !checkTie(result.newBoard)) {
      setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
    }
  };

  // AI Move Effect
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'yellow' && !winner) {
      setIsAiThinking(true);
      const timeout = setTimeout(() => {
        const bestCol = getBestMove(board);
        const result = makeMove(bestCol, 'yellow');
        if (result && !result.gameWinner && !checkTie(result.newBoard)) {
          setCurrentPlayer('red');
        }
        setIsAiThinking(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, gameMode, winner, board, makeMove, getBestMove, checkTie]);

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setWinningCells([]);
    setIsAiThinking(false);
  };

  const resetScores = () => {
    setScores({ red: 0, yellow: 0, ties: 0 });
  };

  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([winRow, winCol]) => winRow === row && winCol === col);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Connect Four</h3>
        <p className="text-muted-foreground">Get 4 in a row to win!</p>
      </div>

      {/* Game Mode Selector */}
      <div className="flex gap-4">
        <Button
          variant={gameMode === 'human' ? 'default' : 'outline'}
          onClick={() => {
            setGameMode('human');
            resetGame();
          }}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          vs Human
        </Button>
        <Button
          variant={gameMode === 'ai' ? 'default' : 'outline'}
          onClick={() => {
            setGameMode('ai');
            resetGame();
          }}
          className="flex items-center gap-2"
        >
          <Bot className="h-4 w-4" />
          vs AI
        </Button>
      </div>

      {/* Scores */}
      <div className="flex gap-6 items-center">
        <Badge variant="secondary" className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          Red: {scores.red}
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          Yellow: {scores.yellow}
        </Badge>
        <Badge variant="outline">Ties: {scores.ties}</Badge>
      </div>

      {/* Game Status */}
      <div className="text-center">
        {winner ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 justify-center"
          >
            {winner === 'tie' ? (
              <Badge variant="outline" className="text-lg px-4 py-2">
                It's a Tie! 🤝
              </Badge>
            ) : (
              <Badge variant="default" className="text-lg px-4 py-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                {winner === 'red' ? 'Red' : 'Yellow'} Wins!
              </Badge>
            )}
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 justify-center">
            <div className={`w-4 h-4 rounded-full ${currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            <span className="text-lg font-medium">
              {gameMode === 'ai' && currentPlayer === 'yellow' ? (
                isAiThinking ? 'AI is thinking...' : 'AI\'s turn'
              ) : (
                `${currentPlayer === 'red' ? 'Red' : 'Yellow'}'s turn`
              )}
            </span>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="bg-blue-600 p-4 rounded-xl shadow-2xl">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: COLS }, (_, col) => (
            <motion.button
              key={col}
              onClick={() => handleColumnClick(col)}
              disabled={!!winner || board[0][col] !== null || (gameMode === 'ai' && currentPlayer === 'yellow')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-8 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
            >
              {/* Column indicator */}
              <div className={`w-2 h-2 mx-auto rounded-full ${
                !winner && board[0][col] === null && 
                !(gameMode === 'ai' && currentPlayer === 'yellow')
                  ? currentPlayer === 'red' ? 'bg-red-300' : 'bg-yellow-300'
                  : 'bg-transparent'
              }`}></div>
            </motion.button>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 mt-2">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`w-12 h-12 rounded-full border-2 border-blue-800 ${
                  cell === 'red' ? 'bg-red-500' :
                  cell === 'yellow' ? 'bg-yellow-500' : 'bg-blue-100'
                } ${isWinningCell(rowIndex, colIndex) ? 'ring-4 ring-green-400' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: cell ? 1 : 0.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <AnimatePresence>
                  {cell && (
                    <motion.div
                      initial={{ y: -100, scale: 0 }}
                      animate={{ y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-full h-full rounded-full"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button onClick={resetGame} variant="outline" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
        <Button onClick={resetScores} variant="ghost" size="sm">
          Reset Scores
        </Button>
      </div>
    </div>
  );
}