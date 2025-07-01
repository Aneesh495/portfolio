import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Board = number[][];

const BOARD_SIZE = 4;

export default function Game2048() {
  const [board, setBoard] = useState<Board>(() => 
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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
    let newBoard: Board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, [addRandomTile]);

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
    }
  }, [board, score, gameOver, addRandomTile]);

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
      0: 'bg-muted',
      2: 'bg-slate-100 text-slate-800',
      4: 'bg-slate-200 text-slate-800',
      8: 'bg-orange-200 text-orange-800',
      16: 'bg-orange-300 text-orange-800',
      32: 'bg-orange-400 text-white',
      64: 'bg-red-400 text-white',
      128: 'bg-red-500 text-white',
      256: 'bg-red-600 text-white',
      512: 'bg-yellow-400 text-white',
      1024: 'bg-yellow-500 text-white',
      2048: 'bg-yellow-600 text-white',
    };
    return colors[value] || 'bg-purple-500 text-white';
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-lg">Score: <span className="font-bold text-primary">{score}</span></p>
      </div>
      
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4 p-2 bg-muted rounded-lg">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <motion.div
              key={`${i}-${j}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold ${getTileColor(cell)}`}
            >
              {cell !== 0 ? cell : ''}
            </motion.div>
          ))
        )}
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground mb-4">Use arrow keys to play</p>
        <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto mb-4">
          <div></div>
          <Button variant="outline" size="sm" onClick={() => move('up')}>↑</Button>
          <div></div>
          <Button variant="outline" size="sm" onClick={() => move('left')}>←</Button>
          <div></div>
          <Button variant="outline" size="sm" onClick={() => move('right')}>→</Button>
          <div></div>
          <Button variant="outline" size="sm" onClick={() => move('down')}>↓</Button>
          <div></div>
        </div>
        <Button onClick={initializeGame} variant="outline">
          New Game
        </Button>
      </div>
    </div>
  );
}
