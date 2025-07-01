import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const checkWinner = (newBoard: Player[]): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return null;
  };

  const findBestMove = (board: Player[]): number => {
    // Check for winning move first
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = 'O';
        if (checkWinner(testBoard) === 'O') {
          return i;
        }
      }
    }

    // Check for blocking move
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = 'X';
        if (checkWinner(testBoard) === 'X') {
          return i;
        }
      }
    }

    // Take center if available
    if (board[4] === null) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const availableSpaces = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    return availableSpaces.length > 0 ? availableSpaces[Math.floor(Math.random() * availableSpaces.length)]! : -1;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isAIThinking || (isAIMode && currentPlayer === 'O')) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (newBoard.every(cell => cell !== null)) {
      setIsDraw(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  // AI move effect
  useEffect(() => {
    if (isAIMode && currentPlayer === 'O' && !winner && !isDraw) {
      setIsAIThinking(true);
      setTimeout(() => {
        const aiMove = findBestMove(board);
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);

          const gameWinner = checkWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
          } else if (newBoard.every(cell => cell !== null)) {
            setIsDraw(true);
          } else {
            setCurrentPlayer('X');
          }
        }
        setIsAIThinking(false);
      }, 500);
    }
  }, [currentPlayer, isAIMode, board, winner, isDraw]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
    setIsAIThinking(false);
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="flex justify-center items-center space-x-4 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAIMode}
              onChange={(e) => {
                setIsAIMode(e.target.checked);
                resetGame();
              }}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">AI Mode</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: cell ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(index)}
            className={`w-20 h-20 bg-muted border-2 border-border rounded-lg text-2xl font-bold hover:bg-accent transition-colors disabled:cursor-not-allowed ${
              isAIThinking ? 'opacity-50' : ''
            }`}
            disabled={!!cell || !!winner || isAIThinking || (isAIMode && currentPlayer === 'O')}
          >
            {cell}
          </motion.button>
        ))}
      </div>
      
      <div className="text-center mb-4">
        {winner ? (
          <p className="text-lg font-bold text-primary">
            🎉 {isAIMode ? (winner === 'X' ? 'You win!' : 'AI wins!') : `Player ${winner} wins!`}
          </p>
        ) : isDraw ? (
          <p className="text-lg font-bold text-muted-foreground">
            It's a draw! 🤝
          </p>
        ) : isAIThinking ? (
          <p className="text-lg text-primary">
            🤖 AI is thinking...
          </p>
        ) : (
          <p className="text-lg">
            Current Player: <span className="font-bold text-primary">
              {isAIMode ? (currentPlayer === 'X' ? 'You (X)' : 'AI (O)') : currentPlayer}
            </span>
          </p>
        )}
      </div>
      
      <Button onClick={resetGame} variant="outline">
        Reset Game
      </Button>
    </div>
  );
}
