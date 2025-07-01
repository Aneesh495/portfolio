import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);

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

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

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

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="text-center">
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: cell ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(index)}
            className="w-20 h-20 bg-muted border-2 border-border rounded-lg text-2xl font-bold hover:bg-accent transition-colors disabled:cursor-not-allowed"
            disabled={!!cell || !!winner}
          >
            {cell}
          </motion.button>
        ))}
      </div>
      
      <div className="text-center mb-4">
        {winner ? (
          <p className="text-lg font-bold text-primary">
            🎉 Player {winner} wins!
          </p>
        ) : isDraw ? (
          <p className="text-lg font-bold text-muted-foreground">
            It's a draw! 🤝
          </p>
        ) : (
          <p className="text-lg">
            Current Player: <span className="font-bold text-primary">{currentPlayer}</span>
          </p>
        )}
      </div>
      
      <Button onClick={resetGame} variant="outline">
        Reset Game
      </Button>
    </div>
  );
}
