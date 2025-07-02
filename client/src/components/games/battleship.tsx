import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bot, RotateCcw, Trophy, Settings, Ship } from "lucide-react";

type CellState = "empty" | "ship" | "hit" | "miss";
type ShipType =
  | "carrier"
  | "battleship"
  | "cruiser"
  | "submarine"
  | "destroyer";
type Orientation = "horizontal" | "vertical";
type GamePhase = "placing" | "playing" | "gameOver";

interface Ship {
  type: ShipType;
  size: number;
  positions: { row: number; col: number }[];
  hits: number;
}

interface GameState {
  board: CellState[][];
  ships: Ship[];
  shots: { row: number; col: number }[];
}

const BOARD_SIZE = 10;

const SHIPS: { type: ShipType; size: number }[] = [
  { type: "carrier", size: 5 },
  { type: "battleship", size: 4 },
  { type: "cruiser", size: 3 },
  { type: "submarine", size: 3 },
  { type: "destroyer", size: 2 },
];

export default function Battleship() {
  const [playerBoard, setPlayerBoard] = useState<GameState>({
    board: Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill("empty")),
    ships: [],
    shots: [],
  });
  const [aiBoard, setAiBoard] = useState<GameState>({
    board: Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill("empty")),
    ships: [],
    shots: [],
  });
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("placing");
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [shipOrientation, setShipOrientation] =
    useState<Orientation>("horizontal");
  const [hoverPosition, setHoverPosition] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"player" | "ai">("player");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [lastShot, setLastShot] = useState<{
    row: number;
    col: number;
    hit: boolean;
  } | null>(null);

  const initializeAiBoard = useCallback(() => {
    const newAiBoard: GameState = {
      board: Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill("empty")),
      ships: [],
      shots: [],
    };

    // Place AI ships randomly
    for (const shipConfig of SHIPS) {
      let placed = false;
      while (!placed) {
        const orientation: Orientation =
          Math.random() < 0.5 ? "horizontal" : "vertical";
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);

        if (canPlaceShip(newAiBoard, row, col, shipConfig.size, orientation)) {
          placeShip(
            newAiBoard,
            row,
            col,
            shipConfig.type,
            shipConfig.size,
            orientation
          );
          placed = true;
        }
      }
    }

    setAiBoard(newAiBoard);
  }, []);

  useEffect(() => {
    if (currentPhase === "playing") {
      initializeAiBoard();
    }
  }, [currentPhase, initializeAiBoard]);

  const canPlaceShip = useCallback(
    (
      gameState: GameState,
      row: number,
      col: number,
      size: number,
      orientation: Orientation
    ): boolean => {
      const positions: { row: number; col: number }[] = [];

      for (let i = 0; i < size; i++) {
        const newRow = orientation === "horizontal" ? row : row + i;
        const newCol = orientation === "horizontal" ? col + i : col;

        if (newRow >= BOARD_SIZE || newCol >= BOARD_SIZE) return false;
        if (gameState.board[newRow][newCol] !== "empty") return false;

        // Check adjacent cells
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const adjRow = newRow + dr;
            const adjCol = newCol + dc;
            if (
              adjRow >= 0 &&
              adjRow < BOARD_SIZE &&
              adjCol >= 0 &&
              adjCol < BOARD_SIZE
            ) {
              if (gameState.board[adjRow][adjCol] === "ship") return false;
            }
          }
        }

        positions.push({ row: newRow, col: newCol });
      }

      return true;
    },
    []
  );

  const placeShip = useCallback(
    (
      gameState: GameState,
      row: number,
      col: number,
      type: ShipType,
      size: number,
      orientation: Orientation
    ) => {
      const positions: { row: number; col: number }[] = [];

      for (let i = 0; i < size; i++) {
        const newRow = orientation === "horizontal" ? row : row + i;
        const newCol = orientation === "horizontal" ? col + i : col;

        gameState.board[newRow][newCol] = "ship";
        positions.push({ row: newRow, col: newCol });
      }

      gameState.ships.push({
        type,
        size,
        positions,
        hits: 0,
      });
    },
    []
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (currentPhase === "placing") {
        if (!selectedShip) return;

        const shipConfig = SHIPS[currentShipIndex];
        if (
          canPlaceShip(playerBoard, row, col, shipConfig.size, shipOrientation)
        ) {
          const newPlayerBoard = {
            board: playerBoard.board.map((row) => [...row]),
            ships: [...playerBoard.ships],
            shots: [...playerBoard.shots],
          };

          placeShip(
            newPlayerBoard,
            row,
            col,
            shipConfig.type,
            shipConfig.size,
            shipOrientation
          );

          setPlayerBoard(newPlayerBoard);
          setCurrentShipIndex(currentShipIndex + 1);

          if (currentShipIndex + 1 >= SHIPS.length) {
            setCurrentPhase("playing");
            setSelectedShip(null);
          }
        }
      } else if (currentPhase === "playing" && currentPlayer === "player") {
        // Player's turn to shoot at AI board
        if (
          aiBoard.shots.some((shot) => shot.row === row && shot.col === col)
        ) {
          return; // Already shot here
        }

        const newAiBoard = {
          board: aiBoard.board.map((row) => [...row]),
          ships: [...aiBoard.ships],
          shots: [...aiBoard.shots, { row, col }],
        };

        const cellState = aiBoard.board[row][col];
        let hit = false;

        if (cellState === "ship") {
          newAiBoard.board[row][col] = "hit";
          hit = true;

          // Update ship hits
          const shipIndex = newAiBoard.ships.findIndex((ship) =>
            ship.positions.some((pos) => pos.row === row && pos.col === col)
          );

          if (shipIndex !== -1) {
            newAiBoard.ships[shipIndex].hits++;
          }

          // Check if ship is sunk
          if (
            newAiBoard.ships[shipIndex].hits ===
            newAiBoard.ships[shipIndex].size
          ) {
            // Ship sunk logic
          }
        } else {
          newAiBoard.board[row][col] = "miss";
        }

        setAiBoard(newAiBoard);
        setLastShot({ row, col, hit });
        setCurrentPlayer("ai");

        // Check win condition
        if (newAiBoard.ships.every((ship) => ship.hits === ship.size)) {
          setGameOver(true);
          setWinner("player");
          setScores((prev) => ({ ...prev, player: prev.player + 1 }));
        }
      }
    },
    [
      currentPhase,
      selectedShip,
      currentShipIndex,
      shipOrientation,
      playerBoard,
      canPlaceShip,
      placeShip,
      currentPlayer,
      aiBoard,
    ]
  );

  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (currentPhase === "placing" && selectedShip) {
        setHoverPosition({ row, col });
      }
    },
    [currentPhase, selectedShip]
  );

  const handleCellLeave = useCallback(() => {
    setHoverPosition(null);
  }, []);

  // AI turn
  useEffect(() => {
    if (currentPhase === "playing" && currentPlayer === "ai" && !gameOver) {
      const timeout = setTimeout(() => {
        const aiShot = getAiShot();
        const newPlayerBoard = {
          board: playerBoard.board.map((row) => [...row]),
          ships: [...playerBoard.ships],
          shots: [...playerBoard.shots, aiShot],
        };

        const cellState = playerBoard.board[aiShot.row][aiShot.col];
        let hit = false;

        if (cellState === "ship") {
          newPlayerBoard.board[aiShot.row][aiShot.col] = "hit";
          hit = true;

          // Update ship hits
          const shipIndex = newPlayerBoard.ships.findIndex((ship) =>
            ship.positions.some(
              (pos) => pos.row === aiShot.row && pos.col === aiShot.col
            )
          );

          if (shipIndex !== -1) {
            newPlayerBoard.ships[shipIndex].hits++;
          }
        } else {
          newPlayerBoard.board[aiShot.row][aiShot.col] = "miss";
        }

        setPlayerBoard(newPlayerBoard);
        setLastShot({ row: aiShot.row, col: aiShot.col, hit });
        setCurrentPlayer("player");

        // Check win condition
        if (newPlayerBoard.ships.every((ship) => ship.hits === ship.size)) {
          setGameOver(true);
          setWinner("ai");
          setScores((prev) => ({ ...prev, ai: prev.ai + 1 }));
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [currentPhase, currentPlayer, gameOver, playerBoard]);

  const getAiShot = useCallback(() => {
    // Simple AI: random shot
    let row, col;
    do {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);
    } while (
      playerBoard.shots.some((shot) => shot.row === row && shot.col === col)
    );

    return { row, col };
  }, [playerBoard.shots]);

  const resetGame = useCallback(() => {
    setPlayerBoard({
      board: Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill("empty")),
      ships: [],
      shots: [],
    });
    setAiBoard({
      board: Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill("empty")),
      ships: [],
      shots: [],
    });
    setCurrentPhase("placing");
    setCurrentShipIndex(0);
    setSelectedShip(SHIPS[0].type);
    setShipOrientation("horizontal");
    setHoverPosition(null);
    setCurrentPlayer("player");
    setGameOver(false);
    setWinner(null);
    setLastShot(null);
  }, []);

  const resetScores = useCallback(() => {
    setScores({ player: 0, ai: 0 });
  }, []);

  const renderBoard = useCallback(
    (gameState: GameState, isPlayerBoard: boolean) => {
      return (
        <div className="grid grid-cols-10 gap-1 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border-2 border-blue-300">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                onMouseLeave={handleCellLeave}
                disabled={
                  gameOver ||
                  (currentPhase === "playing" && currentPlayer === "ai")
                }
                className={`w-10 h-10 border-2 font-bold text-lg transition-all duration-200 rounded-md shadow-sm ${
                  cell === "hit"
                    ? "bg-red-500 text-white border-red-600"
                    : cell === "miss"
                    ? "bg-gray-400 text-white border-gray-500"
                    : cell === "ship" && isPlayerBoard
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                whileHover={!gameOver ? { scale: 1.05 } : {}}
                whileTap={!gameOver ? { scale: 0.95 } : {}}
              >
                {cell === "hit" ? "💥" : cell === "miss" ? "💧" : ""}
              </motion.button>
            ))
          )}
        </div>
      );
    },
    [
      handleCellClick,
      handleCellHover,
      handleCellLeave,
      gameOver,
      currentPhase,
      currentPlayer,
    ]
  );

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Battleship
        </h3>
        <p className="text-muted-foreground">Sink all enemy ships to win!</p>
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
          <User className="h-4 w-4" />
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

      {/* Game Boards */}
      <div className="flex gap-8 items-start">
        {/* Player Board */}
        <div className="flex flex-col items-center space-y-4">
          <h4 className="text-lg font-semibold text-blue-800">Your Fleet</h4>
          {renderBoard(playerBoard, true)}
        </div>

        {/* AI Board */}
        <div className="flex flex-col items-center space-y-4">
          <h4 className="text-lg font-semibold text-purple-800">
            Enemy Waters
          </h4>
          {renderBoard(aiBoard, false)}
        </div>
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
              {winner === "player" ? "🎉 You Won!" : "🤖 AI Won!"}
            </Badge>
          </motion.div>
        )}
        {currentPhase === "placing" && (
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
              Place your ships: {SHIPS[currentShipIndex]?.type}
            </Badge>
          </motion.div>
        )}
        {currentPhase === "playing" && currentPlayer === "ai" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Badge
              variant="outline"
              className="text-lg px-4 py-2 bg-purple-100 border-purple-300 text-purple-800"
            >
              🤖 AI is thinking...
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Panel */}
      <div className="space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        {/* Controls */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-800">Controls</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Click to place ships or fire shots</div>
            <div>Sink all enemy ships to win</div>
            <div>AI difficulty: {difficulty}</div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <Button
          onClick={resetGame}
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
