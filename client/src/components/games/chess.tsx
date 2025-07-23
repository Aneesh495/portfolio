import { useState, useCallback, useEffect } from "react";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bot, RotateCcw, Trophy, Settings, Crown } from "lucide-react";

type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type Color = "white" | "black";
type Position = { row: number; col: number };

interface Piece {
  type: PieceType;
  color: Color;
  hasMoved?: boolean;
}

type Board = (Piece | null)[][];

const BOARD_SIZE = 8;

const PIECE_SYMBOLS = {
  white: {
    pawn: "♙",
    rook: "♖",
    knight: "♘",
    bishop: "♗",
    queen: "♕",
    king: "♔",
  },
  black: {
    pawn: "♟",
    rook: "♜",
    knight: "♞",
    bishop: "♝",
    queen: "♛",
    king: "♚",
  },
};

export default function Chess() {
  const [board, setBoard] = useState<Board>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Color>("white");
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Color | null>(null);
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [isStalemate, setIsStalemate] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [scores, setScores] = useState({ white: 0, black: 0, draws: 0 });
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  const initializeBoard = useCallback((): Board => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "Chess"
    });
    const board: Board = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));

    // Set up pawns
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[1][col] = { type: "pawn", color: "black", hasMoved: false };
      board[6][col] = { type: "pawn", color: "white", hasMoved: false };
    }

    // Set up other pieces
    const backRow: PieceType[] = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[0][col] = { type: backRow[col], color: "black", hasMoved: false };
      board[7][col] = { type: backRow[col], color: "white", hasMoved: false };
    }

    return board;
  }, []);

  useEffect(() => {
    setBoard(initializeBoard());
  }, [initializeBoard]);

  const getValidMoves = useCallback(
    (piece: Piece, position: Position, board: Board): Position[] => {
      const { row, col } = position;
      const moves: Position[] = [];

      const isInBounds = (r: number, c: number) =>
        r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
      const isEnemy = (r: number, c: number) =>
        board[r][c] && board[r][c]!.color !== piece.color;
      const isEmpty = (r: number, c: number) => !board[r][c];

      switch (piece.type) {
        case "pawn":
          const direction = piece.color === "white" ? -1 : 1;
          const startRow = piece.color === "white" ? 6 : 1;

          // Forward move
          if (
            isInBounds(row + direction, col) &&
            isEmpty(row + direction, col)
          ) {
            moves.push({ row: row + direction, col });
            // Double move from starting position
            if (row === startRow && isEmpty(row + 2 * direction, col)) {
              moves.push({ row: row + 2 * direction, col });
            }
          }

          // Diagonal captures
          for (const dCol of [-1, 1]) {
            if (
              isInBounds(row + direction, col + dCol) &&
              isEnemy(row + direction, col + dCol)
            ) {
              moves.push({ row: row + direction, col: col + dCol });
            }
          }
          break;

        case "rook":
          for (const [dRow, dCol] of [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ]) {
            for (let i = 1; i < BOARD_SIZE; i++) {
              const newRow = row + dRow * i;
              const newCol = col + dCol * i;
              if (!isInBounds(newRow, newCol)) break;
              if (isEmpty(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
              } else {
                if (isEnemy(newRow, newCol))
                  moves.push({ row: newRow, col: newCol });
                break;
              }
            }
          }
          break;

        case "knight":
          for (const [dRow, dCol] of [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1],
          ]) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (
              isInBounds(newRow, newCol) &&
              (isEmpty(newRow, newCol) || isEnemy(newRow, newCol))
            ) {
              moves.push({ row: newRow, col: newCol });
            }
          }
          break;

        case "bishop":
          for (const [dRow, dCol] of [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]) {
            for (let i = 1; i < BOARD_SIZE; i++) {
              const newRow = row + dRow * i;
              const newCol = col + dCol * i;
              if (!isInBounds(newRow, newCol)) break;
              if (isEmpty(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
              } else {
                if (isEnemy(newRow, newCol))
                  moves.push({ row: newRow, col: newCol });
                break;
              }
            }
          }
          break;

        case "queen":
          // Combine rook and bishop moves
          for (const [dRow, dCol] of [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]) {
            for (let i = 1; i < BOARD_SIZE; i++) {
              const newRow = row + dRow * i;
              const newCol = col + dCol * i;
              if (!isInBounds(newRow, newCol)) break;
              if (isEmpty(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
              } else {
                if (isEnemy(newRow, newCol))
                  moves.push({ row: newRow, col: newCol });
                break;
              }
            }
          }
          break;

        case "king":
          for (const [dRow, dCol] of [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ]) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (
              isInBounds(newRow, newCol) &&
              (isEmpty(newRow, newCol) || isEnemy(newRow, newCol))
            ) {
              moves.push({ row: newRow, col: newCol });
            }
          }
          break;
      }

      return moves;
    },
    []
  );

  const isKingInCheck = useCallback(
    (board: Board, color: Color): boolean => {
      // Find king position
      let kingPos: Position | null = null;
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const piece = board[row][col];
          if (piece && piece.type === "king" && piece.color === color) {
            kingPos = { row, col };
            break;
          }
        }
        if (kingPos) break;
      }

      if (!kingPos) return false;

      // Check if any enemy piece can attack the king
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const piece = board[row][col];
          if (piece && piece.color !== color) {
            const moves = getValidMoves(piece, { row, col }, board);
            if (
              moves.some(
                (move) => move.row === kingPos!.row && move.col === kingPos!.col
              )
            ) {
              return true;
            }
          }
        }
      }

      return false;
    },
    [getValidMoves]
  );

  const makeMove = useCallback(
    (from: Position, to: Position, board: Board): Board => {
      const newBoard = board.map((row) =>
        row.map((piece) => (piece ? { ...piece } : null))
      );
      const piece = newBoard[from.row][from.col];

      if (!piece) return board;

      // Handle pawn promotion
      if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
        piece.type = "queen";
      }

      // Move piece
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;
      piece.hasMoved = true;

      return newBoard;
    },
    []
  );

  const getValidMovesForPiece = useCallback(
    (position: Position, board: Board): Position[] => {
      const piece = board[position.row][position.col];
      if (!piece || piece.color !== currentPlayer) return [];

      const moves = getValidMoves(piece, position, board);

      // Filter out moves that would put own king in check
      return moves.filter((move) => {
        const newBoard = makeMove(position, move, board);
        return !isKingInCheck(newBoard, currentPlayer);
      });
    },
    [currentPlayer, getValidMoves, makeMove, isKingInCheck]
  );

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (gameOver || isAiThinking) return;

      const piece = board[row][col];
      const position = { row, col };

      // If a piece is selected and clicking on a valid move
      if (
        selectedPiece &&
        validMoves.some((move) => move.row === row && move.col === col)
      ) {
        const newBoard = makeMove(selectedPiece, position, board);
        setBoard(newBoard);
        setSelectedPiece(null);
        setValidMoves([]);

        // Check for game over conditions
        const nextPlayer = currentPlayer === "white" ? "black" : "white";
        const isNextPlayerInCheck = isKingInCheck(newBoard, nextPlayer);

        if (isNextPlayerInCheck) {
          // Check if it's checkmate
          const hasValidMoves = hasAnyValidMoves(newBoard, nextPlayer);
          if (!hasValidMoves) {
            setGameOver(true);
            setWinner(currentPlayer);
            setIsCheckmate(true);
            setScores((prev) => ({
              ...prev,
              [currentPlayer]: prev[currentPlayer] + 1,
            }));
          } else {
            setIsCheck(true);
          }
        } else {
          // Check for stalemate
          const hasValidMoves = hasAnyValidMoves(newBoard, nextPlayer);
          if (!hasValidMoves) {
            setGameOver(true);
            setIsStalemate(true);
            setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
          }
        }

        setCurrentPlayer(nextPlayer);
        return;
      }

      // Select a piece
      if (piece && piece.color === currentPlayer) {
        const moves = getValidMovesForPiece(position, board);
        setSelectedPiece(position);
        setValidMoves(moves);
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    },
    [
      board,
      selectedPiece,
      validMoves,
      currentPlayer,
      gameOver,
      isAiThinking,
      makeMove,
      isKingInCheck,
      getValidMovesForPiece,
    ]
  );

  const hasAnyValidMoves = useCallback(
    (board: Board, color: Color): boolean => {
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const piece = board[row][col];
          if (piece && piece.color === color) {
            const moves = getValidMoves(piece, { row, col }, board);
            const validMoves = moves.filter((move) => {
              const newBoard = makeMove({ row, col }, move, board);
              return !isKingInCheck(newBoard, color);
            });
            if (validMoves.length > 0) return true;
          }
        }
      }
      return false;
    },
    [getValidMoves, makeMove, isKingInCheck]
  );

  // AI Logic
  const evaluateBoard = useCallback(
    (board: Board): number => {
      const pieceValues = {
        pawn: 1,
        knight: 3,
        bishop: 3,
        rook: 5,
        queen: 9,
        king: 1000,
      };
      let score = 0;

      // Material evaluation
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const piece = board[row][col];
          if (piece) {
            const value = pieceValues[piece.type];
            score += piece.color === "white" ? value : -value;
          }
        }
      }

      // Simple position evaluation for medium+ difficulty
      if (difficulty !== "easy") {
        // Center control bonus
        for (let row = 3; row <= 4; row++) {
          for (let col = 3; col <= 4; col++) {
            const piece = board[row][col];
            if (piece) {
              const bonus = piece.color === "white" ? 0.1 : -0.1;
              score += bonus;
            }
          }
        }
      }

      return score;
    },
    [difficulty]
  );

  const getSearchDepth = useCallback((): number => {
    switch (difficulty) {
      case "easy":
        return 2;
      case "medium":
        return 3;
      case "hard":
        return 3;
      default:
        return 3;
    }
  }, [difficulty]);

  const minimax = useCallback(
    (
      board: Board,
      depth: number,
      alpha: number,
      beta: number,
      maximizing: boolean
    ): number => {
      if (depth === 0) return evaluateBoard(board);

      const allMoves: { from: Position; to: Position }[] = [];
      const currentColor = maximizing ? "white" : "black";

      // Generate all possible moves
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const piece = board[row][col];
          if (piece && piece.color === currentColor) {
            const moves = getValidMoves(piece, { row, col }, board);
            for (const move of moves) {
              const newBoard = makeMove({ row, col }, move, board);
              if (!isKingInCheck(newBoard, currentColor)) {
                allMoves.push({ from: { row, col }, to: move });
              }
            }
          }
        }
      }

      if (maximizing) {
        let maxEval = -Infinity;
        for (const move of allMoves) {
          const newBoard = makeMove(move.from, move.to, board);
          const eval_ = minimax(newBoard, depth - 1, alpha, beta, false);
          maxEval = Math.max(maxEval, eval_);
          alpha = Math.max(alpha, eval_);
          if (beta <= alpha) break;
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (const move of allMoves) {
          const newBoard = makeMove(move.from, move.to, board);
          const eval_ = minimax(newBoard, depth - 1, alpha, beta, true);
          minEval = Math.min(minEval, eval_);
          beta = Math.min(beta, eval_);
          if (beta <= alpha) break;
        }
        return minEval;
      }
    },
    [evaluateBoard, getValidMoves, makeMove, isKingInCheck]
  );

  const getBestMove = useCallback(
    (board: Board): { from: Position; to: Position } | null => {
      const allMoves: { from: Position; to: Position }[] = [];

      // Generate all possible moves for black (AI)
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const piece = board[row][col];
          if (piece && piece.color === "black") {
            const moves = getValidMoves(piece, { row, col }, board);
            for (const move of moves) {
              const newBoard = makeMove({ row, col }, move, board);
              if (!isKingInCheck(newBoard, "black")) {
                allMoves.push({ from: { row, col }, to: move });
              }
            }
          }
        }
      }

      if (allMoves.length === 0) return null;

      // For easy difficulty, add randomness
      if (difficulty === "easy" && Math.random() < 0.3) {
        return allMoves[Math.floor(Math.random() * allMoves.length)];
      }

      // For medium difficulty, sometimes make suboptimal moves
      if (difficulty === "medium" && Math.random() < 0.2) {
        const randomMove =
          allMoves[Math.floor(Math.random() * allMoves.length)];
        const newBoard = makeMove(randomMove.from, randomMove.to, board);
        const randomScore = evaluateBoard(newBoard);
        if (randomScore > -5) {
          // Only if the move isn't too bad
          return randomMove;
        }
      }

      let bestScore = -Infinity;
      let bestMove = allMoves[0];

      for (const move of allMoves) {
        const newBoard = makeMove(move.from, move.to, board);
        const score = minimax(
          newBoard,
          getSearchDepth(),
          -Infinity,
          Infinity,
          true
        );
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      return bestMove;
    },
    [
      getValidMoves,
      makeMove,
      isKingInCheck,
      minimax,
      getSearchDepth,
      difficulty,
      evaluateBoard,
    ]
  );

  // AI Move Effect
  useEffect(() => {
    if (currentPlayer === "black" && !gameOver) {
      setIsAiThinking(true);
      const timeout = setTimeout(() => {
        const bestMove = getBestMove(board);
        if (bestMove) {
          const newBoard = makeMove(bestMove.from, bestMove.to, board);
          setBoard(newBoard);

          // Check for game over conditions
          const isWhiteInCheck = isKingInCheck(newBoard, "white");
          if (isWhiteInCheck) {
            const hasValidMoves = hasAnyValidMoves(newBoard, "white");
            if (!hasValidMoves) {
              setGameOver(true);
              setWinner("black");
              setIsCheckmate(true);
              setScores((prev) => ({ ...prev, black: prev.black + 1 }));
            } else {
              setIsCheck(true);
            }
          } else {
            const hasValidMoves = hasAnyValidMoves(newBoard, "white");
            if (!hasValidMoves) {
              setGameOver(true);
              setIsStalemate(true);
              setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
            }
          }

          setCurrentPlayer("white");
        }
        setIsAiThinking(false);
      }, 500 + Math.random() * 1000);

      return () => clearTimeout(timeout);
    }
  }, [
    currentPlayer,
    gameOver,
    board,
    getBestMove,
    makeMove,
    isKingInCheck,
    hasAnyValidMoves,
  ]);

  const resetGame = () => {
    setBoard(initializeBoard());
    setCurrentPlayer("white");
    setSelectedPiece(null);
    setValidMoves([]);
    setGameOver(false);
    setWinner(null);
    setIsCheck(false);
    setIsCheckmate(false);
    setIsStalemate(false);
    setMoveHistory([]);
  };

  const resetScores = () => {
    setScores({ white: 0, black: 0, draws: 0 });
  };

  const isSelected = (row: number, col: number) => {
    return (
      selectedPiece && selectedPiece.row === row && selectedPiece.col === col
    );
  };

  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col);
  };

  const getPieceSymbol = (piece: Piece) => {
    return PIECE_SYMBOLS[piece.color][piece.type];
  };

  const renderBoard = useCallback(() => {
    return (
      <div className="grid grid-cols-8 gap-0 border-4 border-amber-800 rounded-lg overflow-hidden shadow-lg">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLightSquare = (rowIndex + colIndex) % 2 === 0;
            const isSelectedSquare = isSelected(rowIndex, colIndex);
            const isValidMoveSquare = isValidMove(rowIndex, colIndex);

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                disabled={gameOver || isAiThinking}
                className={`w-16 h-16 flex items-center justify-center text-3xl font-bold transition-all duration-200 relative ${
                  isLightSquare ? "bg-amber-100" : "bg-amber-800"
                } ${
                  isSelectedSquare
                    ? "ring-4 ring-blue-500 ring-opacity-75"
                    : isValidMoveSquare
                    ? "ring-2 ring-green-500 ring-opacity-75"
                    : ""
                } hover:bg-opacity-80`}
                whileHover={!gameOver && !isAiThinking ? { scale: 1.05 } : {}}
                whileTap={!gameOver && !isAiThinking ? { scale: 0.95 } : {}}
              >
                {piece && (
                  <div
                    className={`text-4xl ${
                      piece.color === "white"
                        ? "text-white drop-shadow-lg bg-gray-800 rounded-full p-1"
                        : "text-gray-900 drop-shadow-lg"
                    }`}
                  >
                    {getPieceSymbol(piece)}
                  </div>
                )}
                {isValidMoveSquare && !piece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full opacity-75"></div>
                  </div>
                )}
              </motion.button>
            );
          })
        )}
      </div>
    );
  }, [
    board,
    isSelected,
    isValidMove,
    gameOver,
    isAiThinking,
    handleSquareClick,
  ]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Chess</h3>
        <p className="text-muted-foreground">
          Strategic board game with AI opponent
        </p>
      </div>

      {/* Settings */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as "easy" | "medium" | "hard")
            }
            className="px-2 py-1 text-sm border rounded bg-background"
            aria-label="AI difficulty level"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Game Board */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-amber-800 p-6 rounded-lg shadow-lg">
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
                  variant={isStalemate ? "secondary" : "default"}
                  className="text-lg px-4 py-2"
                >
                  {isCheckmate
                    ? `${winner?.toUpperCase()} Wins!`
                    : "Stalemate!"}
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
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Bot className="h-4 w-4 mr-2 animate-spin" />
                  AI is thinking...
                </Badge>
              </motion.div>
            )}
            {isCheck && !gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  <Crown className="h-4 w-4 mr-2" />
                  Check!
                </Badge>
              </motion.div>
            )}
            {!gameOver && !isAiThinking && !isCheck && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Current Player:{" "}
                  {currentPlayer === "white" ? "White" : "Black"}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats and Controls - Moved below board */}
        <div className="flex gap-8 items-start">
          {/* Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Score</h4>
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="flex items-center gap-2 w-full justify-between"
              >
                <span>White</span>
                <span>{scores.white}</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 w-full justify-between"
              >
                <span>Black</span>
                <span>{scores.black}</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 w-full justify-between"
              >
                <span>Draws</span>
                <span>{scores.draws}</span>
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Controls</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Click piece to select</div>
              <div>Click highlighted square to move</div>
              <div>AI difficulty: {difficulty}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <Button
          onClick={resetGame}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
        <Button
          onClick={resetScores}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Trophy className="h-4 w-4" />
          Reset Scores
        </Button>
      </div>
    </div>
  );
}
