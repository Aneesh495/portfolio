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

const BOARD_SIZE = 8;

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

  // Initialize the game properly
  useEffect(() => {
    if (currentPhase === "placing" && currentShipIndex === 0) {
      setSelectedShip(SHIPS[0].type);
    }
  }, [currentPhase, currentShipIndex]);

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

  // Helper to mark all surrounding tiles as miss when a ship is sunk
  function markSurroundingMisses(board: GameState, ship: Ship) {
    for (const pos of ship.positions) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = pos.row + dr;
          const c = pos.col + dc;
          if (
            r >= 0 &&
            r < BOARD_SIZE &&
            c >= 0 &&
            c < BOARD_SIZE &&
            board.board[r][c] === "empty"
          ) {
            board.board[r][c] = "miss";
          }
        }
      }
    }
  }

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (currentPhase === "placing") {
        if (!selectedShip || currentShipIndex >= SHIPS.length) return;

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
          const nextShipIndex = currentShipIndex + 1;
          setCurrentShipIndex(nextShipIndex);

          if (nextShipIndex >= SHIPS.length) {
            setCurrentPhase("playing");
            setSelectedShip(null);
            // Initialize AI board when starting to play
            initializeAiBoard();
          } else {
            setSelectedShip(SHIPS[nextShipIndex].type);
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
            // If ship is sunk, mark surrounding tiles
            if (
              newAiBoard.ships[shipIndex].hits ===
              newAiBoard.ships[shipIndex].size
            ) {
              markSurroundingMisses(newAiBoard, newAiBoard.ships[shipIndex]);
            }
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
      initializeAiBoard,
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

  const getAiShot = useCallback(() => {
    // Improved AI: random shot but avoid already shot positions
    let row: number, col: number;
    let attempts = 0;
    do {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);
      attempts++;
      // Prevent infinite loop
      if (attempts > 100) break;
    } while (
      playerBoard.shots.some((shot) => shot.row === row && shot.col === col)
    );

    return { row, col };
  }, [playerBoard.shots]);

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
            // If ship is sunk, mark surrounding tiles
            if (
              newPlayerBoard.ships[shipIndex].hits ===
              newPlayerBoard.ships[shipIndex].size
            ) {
              markSurroundingMisses(
                newPlayerBoard,
                newPlayerBoard.ships[shipIndex]
              );
            }
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
  }, [currentPhase, currentPlayer, gameOver, playerBoard, getAiShot]);

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
        <div className="grid grid-cols-8 gap-2 p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl shadow-2xl border-4 border-blue-300">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              // Check if this cell is part of a ship placement preview
              let isPreview = false;
              if (
                currentPhase === "placing" &&
                isPlayerBoard &&
                hoverPosition &&
                selectedShip
              ) {
                const shipConfig = SHIPS[currentShipIndex];
                const positions = [];

                for (let i = 0; i < shipConfig.size; i++) {
                  const newRow =
                    shipOrientation === "horizontal"
                      ? hoverPosition.row
                      : hoverPosition.row + i;
                  const newCol =
                    shipOrientation === "horizontal"
                      ? hoverPosition.col + i
                      : hoverPosition.col;
                  if (
                    newRow >= 0 &&
                    newRow < BOARD_SIZE &&
                    newCol >= 0 &&
                    newCol < BOARD_SIZE
                  ) {
                    positions.push({ row: newRow, col: newCol });
                  }
                }

                isPreview = positions.some(
                  (pos) => pos.row === rowIndex && pos.col === colIndex
                );
              }

              return (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                  onMouseLeave={handleCellLeave}
                  disabled={
                    gameOver ||
                    (currentPhase === "playing" && currentPlayer === "ai") ||
                    (currentPhase === "placing" && !isPlayerBoard)
                  }
                  className={`w-12 h-12 border-2 font-bold text-lg transition-all duration-300 rounded-lg shadow-md ${
                    cell === "hit"
                      ? "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-700 shadow-lg"
                      : cell === "miss"
                      ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white border-gray-600 shadow-lg"
                      : cell === "ship" && isPlayerBoard
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-700 shadow-lg"
                      : isPreview
                      ? "bg-gradient-to-br from-green-400 to-green-500 text-white border-green-600 shadow-lg"
                      : "bg-gradient-to-br from-white to-gray-50 text-gray-700 border-gray-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400 hover:shadow-lg"
                  }`}
                  whileHover={!gameOver ? { scale: 1.1, rotate: 2 } : {}}
                  whileTap={!gameOver ? { scale: 0.95 } : {}}
                >
                  {cell === "hit" ? "💥" : cell === "miss" ? "💧" : ""}
                </motion.button>
              );
            })
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
      hoverPosition,
      selectedShip,
      currentShipIndex,
      shipOrientation,
    ]
  );

  return (
    <div className="flex flex-col items-center space-y-8 p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h3
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
        >
          ⚓ Naval Battle ⚓
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-600 font-medium"
        >
          Sink all enemy ships to claim victory!
        </motion.p>
      </div>

      {/* Settings and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex gap-6 items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20"
      >
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-blue-600" />
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as "easy" | "medium" | "hard")
            }
            className="px-4 py-2 text-sm border-2 border-blue-200 rounded-xl bg-white/90 shadow-sm focus:border-blue-400 focus:outline-none transition-all"
            aria-label="AI difficulty level"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow-md">
            <User className="h-4 w-4" />
            <span className="font-semibold">{scores.player}</span>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl shadow-md">
            <Bot className="h-4 w-4" />
            <span className="font-semibold">{scores.ai}</span>
          </div>
        </div>
      </motion.div>

      {/* Game Boards */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-6xl">
        {/* Player Board */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center space-y-6 flex-1"
        >
          <div className="text-center space-y-2">
            <h4 className="text-2xl font-bold text-blue-800">🚢 Your Fleet</h4>
            <p className="text-sm text-gray-600">
              Place your ships strategically
            </p>
          </div>
          {renderBoard(playerBoard, true)}

          {/* Ship Placement Controls */}
          {currentPhase === "placing" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-2xl border-2 border-blue-200 shadow-lg w-full max-w-md"
            >
              <h5 className="text-lg font-semibold text-blue-800 text-center">
                ⚙️ Ship Placement
              </h5>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Orientation:
                  </span>
                  <Button
                    onClick={() =>
                      setShipOrientation(
                        shipOrientation === "horizontal"
                          ? "vertical"
                          : "horizontal"
                      )
                    }
                    variant="outline"
                    size="sm"
                    className="text-sm bg-white/80 hover:bg-white transition-all border-2 border-blue-300 hover:border-blue-400"
                  >
                    {shipOrientation === "horizontal"
                      ? "↔ Horizontal"
                      : "↕ Vertical"}
                  </Button>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-blue-800">
                    {SHIPS[currentShipIndex]?.type} (
                    {SHIPS[currentShipIndex]?.size} cells)
                  </div>
                  <div className="text-sm text-gray-600">
                    Ships remaining: {SHIPS.length - currentShipIndex}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((SHIPS.length - currentShipIndex) / SHIPS.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* AI Board */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center space-y-6 flex-1"
        >
          <div className="text-center space-y-2">
            <h4 className="text-2xl font-bold text-purple-800">
              🌊 Enemy Waters
            </h4>
            <p className="text-sm text-gray-600">
              Find and destroy enemy ships
            </p>
          </div>
          {renderBoard(aiBoard, false)}
        </motion.div>
      </div>

      {/* Game Status */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center space-y-4"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl text-xl font-bold">
              {winner === "player"
                ? "🎉 Victory! You Won!"
                : "💀 Defeat! AI Won!"}
            </div>
          </motion.div>
        )}
        {currentPhase === "placing" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold">
              🚢 Place your ships: {SHIPS[currentShipIndex]?.type}
            </div>
          </motion.div>
        )}
        {currentPhase === "playing" && currentPlayer === "ai" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold">
              🤖 AI is thinking...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="flex gap-6"
      >
        <Button
          onClick={resetGame}
          variant="outline"
          className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <RotateCcw className="h-5 w-5" />
          New Game
        </Button>
        <Button
          onClick={resetScores}
          variant="outline"
          className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Trophy className="h-5 w-5" />
          Reset Scores
        </Button>
      </motion.div>
    </div>
  );
}
