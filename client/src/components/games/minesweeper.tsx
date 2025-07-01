import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

const BOARD_SIZE = 8;
const MINE_COUNT = 10;

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(MINE_COUNT);

  const initializeBoard = () => {
    // Create empty board
    const newBoard: Cell[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() =>
        Array(BOARD_SIZE).fill(null).map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }))
      );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 &&
                newRow < BOARD_SIZE &&
                newCol >= 0 &&
                newCol < BOARD_SIZE &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setMinesLeft(MINE_COUNT);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const revealCell = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    const newBoard = [...board];
    
    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (newBoard[i][j].isMine) {
            newBoard[i][j].isRevealed = true;
          }
        }
      }
      setGameOver(true);
    } else {
      // Reveal cell and adjacent empty cells
      const reveal = (r: number, c: number) => {
        if (
          r < 0 ||
          r >= BOARD_SIZE ||
          c < 0 ||
          c >= BOARD_SIZE ||
          newBoard[r][c].isRevealed ||
          newBoard[r][c].isFlagged
        ) {
          return;
        }

        newBoard[r][c].isRevealed = true;

        if (newBoard[r][c].neighborMines === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              reveal(r + i, c + j);
            }
          }
        }
      };

      reveal(row, col);
    }

    setBoard(newBoard);

    // Check for win condition
    const revealedCount = newBoard
      .flat()
      .filter(cell => cell.isRevealed && !cell.isMine).length;
    
    if (revealedCount === BOARD_SIZE * BOARD_SIZE - MINE_COUNT) {
      setGameWon(true);
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (gameOver || gameWon || board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    
    setBoard(newBoard);
    setMinesLeft(prev => 
      newBoard[row][col].isFlagged ? prev - 1 : prev + 1
    );
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines.toString();
  };

  const getCellStyle = (cell: Cell) => {
    if (cell.isFlagged) return 'bg-yellow-200 dark:bg-yellow-800';
    if (!cell.isRevealed) return 'bg-muted hover:bg-accent';
    if (cell.isMine) return 'bg-red-500 text-white';
    return 'bg-card';
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-lg">
          Mines Left: <span className="font-bold text-primary">{minesLeft}</span>
        </p>
      </div>
      
      {gameOver && (
        <div className="mb-4">
          <p className="text-lg font-bold text-destructive">💥 Game Over!</p>
        </div>
      )}
      
      {gameWon && (
        <div className="mb-4">
          <p className="text-lg font-bold text-primary">🎉 You Won!</p>
        </div>
      )}
      
      <div className="grid grid-cols-8 gap-1 max-w-sm mx-auto mb-4 p-2 bg-muted rounded-lg">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <motion.button
              key={`${i}-${j}`}
              whileHover={{ scale: cell.isRevealed ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => revealCell(i, j)}
              onContextMenu={(e) => toggleFlag(e, i, j)}
              className={`w-6 h-6 border border-border text-xs font-bold transition-colors ${getCellStyle(cell)}`}
              disabled={gameOver && !cell.isMine}
            >
              {getCellContent(cell)}
            </motion.button>
          ))
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Left click to reveal, right click to flag
        </p>
        <Button onClick={initializeBoard} variant="outline">
          New Game
        </Button>
      </div>
    </div>
  );
}
