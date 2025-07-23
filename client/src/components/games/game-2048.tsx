import { useState, useEffect, useCallback } from "react";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";

type Board = number[][];

const BOARD_SIZE = 4;

export default function Game2048() {
  const [board, setBoard] = useState<Board>(() => 
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  const addRandomTile = useCallback((currentBoard: Board) => {
    const emptyTiles: [number, number][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j] === 0) {
          emptyTiles.push([i, j]);
        }
      }
    }
    
    if (emptyTiles.length > 0) {
      const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      const newBoard = currentBoard.map(row => [...row]);
      newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
      return newBoard;
    }
    return currentBoard;
  }, []);

  const initializeGame = useCallback(() => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "2048"
    });
    let newBoard: Board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setShowGameOverDialog(false);
  }, [addRandomTile]);

  const checkGameOver = useCallback((currentBoard: Board) => {
    // Check for empty cells
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j] === 0) return false;
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const current = currentBoard[i][j];
        // Check right
        if (j < BOARD_SIZE - 1 && current === currentBoard[i][j + 1]) return false;
        // Check down
        if (i < BOARD_SIZE - 1 && current === currentBoard[i + 1][j]) return false;
      }
    }
    
    return true;
  }, []);

  const checkWin = useCallback((currentBoard: Board) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j] === 2048) return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    const newBoard = board.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const moveLeft = (row: number[]) => {
      const filtered = row.filter(val => val !== 0);
      const missing = BOARD_SIZE - filtered.length;
      const zeros = Array(missing).fill(0);
      return filtered.concat(zeros);
    };

    const combineLeft = (row: number[]) => {
      for (let i = 0; i < BOARD_SIZE - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          row[i + 1] = 0;
          newScore += row[i];
        }
      }
      return row;
    };

    if (direction === 'left') {
      for (let i = 0; i < BOARD_SIZE; i++) {
        const original = [...newBoard[i]];
        newBoard[i] = moveLeft(combineLeft(moveLeft(newBoard[i])));
        if (JSON.stringify(original) !== JSON.stringify(newBoard[i])) {
          moved = true;
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < BOARD_SIZE; i++) {
        const original = [...newBoard[i]];
        newBoard[i] = moveLeft(combineLeft(moveLeft(newBoard[i].reverse()))).reverse();
        if (JSON.stringify(original) !== JSON.stringify(newBoard[i])) {
          moved = true;
        }
      }
    } else if (direction === 'up') {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const column = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
          column.push(newBoard[i][j]);
        }
        const original = [...column];
        const newColumn = moveLeft(combineLeft(moveLeft(column)));
        for (let i = 0; i < BOARD_SIZE; i++) {
          newBoard[i][j] = newColumn[i];
        }
        if (JSON.stringify(original) !== JSON.stringify(newColumn)) {
          moved = true;
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const column = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
          column.push(newBoard[i][j]);
        }
        const original = [...column];
        const newColumn = moveLeft(combineLeft(moveLeft(column.reverse()))).reverse();
        for (let i = 0; i < BOARD_SIZE; i++) {
          newBoard[i][j] = newColumn[i];
        }
        if (JSON.stringify(original) !== JSON.stringify(newColumn)) {
          moved = true;
        }
      }
    }

    if (moved) {
      const boardWithNewTile = addRandomTile(newBoard);
      setBoard(boardWithNewTile);
      setScore(newScore);
      
      // Check for win condition
      if (!gameWon && checkWin(boardWithNewTile)) {
        setGameWon(true);
      }
      
      // Check for game over
      if (checkGameOver(boardWithNewTile)) {
        setGameOver(true);
        setShowGameOverDialog(true);
      }
    }
  }, [board, score, gameOver, gameWon, addRandomTile, checkGameOver, checkWin]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move]);

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      0: 'bg-gray-200 dark:bg-gray-700',
      2: 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100',
      4: 'bg-gray-200 dark:bg-gray-500 text-gray-900 dark:text-gray-100',
      8: 'bg-orange-300 dark:bg-orange-600 text-gray-900 dark:text-white',
      16: 'bg-orange-400 dark:bg-orange-700 text-white',
      32: 'bg-orange-500 dark:bg-orange-800 text-white',
      64: 'bg-red-400 dark:bg-red-600 text-white',
      128: 'bg-red-500 dark:bg-red-700 text-white font-bold',
      256: 'bg-red-600 dark:bg-red-800 text-white font-bold',
      512: 'bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-white font-bold',
      1024: 'bg-yellow-500 dark:bg-yellow-700 text-white font-bold text-sm',
      2048: 'bg-green-500 dark:bg-green-700 text-white font-bold',
    };
    return colors[value] || 'bg-purple-500 text-white font-bold';
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-lg">Score: <span className="font-bold text-primary">{score}</span></p>
        {gameWon && (
          <motion.p 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-lg font-bold text-green-600 dark:text-green-400"
          >
            🎉 You Won! You reached 2048!
          </motion.p>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-4 p-4 bg-gray-300 dark:bg-gray-800 rounded-xl shadow-lg">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <motion.div
              key={`${i}-${j}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className={`w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold shadow-md ${getTileColor(cell)}`}
            >
              {cell !== 0 ? cell : ''}
            </motion.div>
          ))
        )}
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground mb-4">Use arrow keys or buttons to play</p>
        <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto mb-4">
          <div></div>
          <Button variant="outline" size="sm" onClick={() => move('up')} disabled={gameOver}>↑</Button>
          <div></div>
          <Button variant="outline" size="sm" onClick={() => move('left')} disabled={gameOver}>←</Button>
          <div></div>
          <Button variant="outline" size="sm" onClick={() => move('right')} disabled={gameOver}>→</Button>
          <div></div>
          <Button variant="outline" size="sm" onClick={() => move('down')} disabled={gameOver}>↓</Button>
          <div></div>
        </div>
        <Button onClick={initializeGame} variant="outline">
          New Game
        </Button>
      </div>

      {/* Game Over Dialog */}
      <Dialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Game Over! 😢</DialogTitle>
            <DialogDescription className="text-center">
              <div className="space-y-2">
                <p>No more moves available!</p>
                <p className="text-lg">Final Score: <span className="font-bold text-primary">{score}</span></p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-3 mt-4">
            <Button onClick={() => {
              initializeGame();
              setShowGameOverDialog(false);
            }}>
              Play Again
            </Button>
            <Button variant="outline" onClick={() => setShowGameOverDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
