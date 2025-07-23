import { useState, useCallback, useEffect, useRef } from "react";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Play,
  Pause,
  Trophy,
  Zap,
  Puzzle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const TILE_SIZE = 40;
const GRAVITY = 0.5;
const MOVE_SPEED = 2;

type TileType =
  | "empty"
  | "wall"
  | "player"
  | "goal"
  | "block"
  | "ice"
  | "teleporter"
  | "switch"
  | "door";

interface Tile {
  type: TileType;
  x: number;
  y: number;
  id?: string;
  activated?: boolean;
}

interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  canMove: boolean;
}

interface Block {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  id: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const LEVELS = [
  // Level 1: Basic movement
  {
    width: 15,
    height: 10,
    tiles: [
      "WWWWWWWWWWWWWWW",
      "W             W",
      "W    P        W",
      "W             W",
      "W             W",
      "W             W",
      "W             W",
      "W             W",
      "W            GW",
      "WWWWWWWWWWWWWWW",
    ],
    blocks: [],
  },
  // Level 2: Blocks and gravity
  {
    width: 15,
    height: 10,
    tiles: [
      "WWWWWWWWWWWWWWW",
      "W             W",
      "W    P        W",
      "W             W",
      "W      B      W",
      "W             W",
      "W             W",
      "W             W",
      "W            GW",
      "WWWWWWWWWWWWWWW",
    ],
    blocks: [{ x: 7, y: 4, id: "block1" }],
  },
  // Level 3: Ice and sliding
  {
    width: 15,
    height: 10,
    tiles: [
      "WWWWWWWWWWWWWWW",
      "W             W",
      "W    P        W",
      "W             W",
      "W      III    W",
      "W             W",
      "W             W",
      "W             W",
      "W            GW",
      "WWWWWWWWWWWWWWW",
    ],
    blocks: [],
  },
  // Level 4: Switches and doors
  {
    width: 15,
    height: 10,
    tiles: [
      "WWWWWWWWWWWWWWW",
      "W             W",
      "W    P        W",
      "W             W",
      "W      S      W",
      "W             W",
      "W      D      W",
      "W             W",
      "W            GW",
      "WWWWWWWWWWWWWWW",
    ],
    blocks: [],
  },
];

export default function PuzzlePlatformer() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [tiles, setTiles] = useState<Tile[][]>([]);
  const [player, setPlayer] = useState<Player>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    onGround: false,
    canMove: true,
  });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(
      localStorage.getItem("puzzle-platformer-high-score") || "0"
    );
  });
  const [levelCompleted, setLevelCompleted] = useState(false);
  const animationRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());

  const createParticle = useCallback((x: number, y: number, color: string) => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
      color,
    };
  }, []);

  const addParticles = useCallback(
    (x: number, y: number, count: number, color: string) => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        newParticles.push(createParticle(x, y, color));
      }
      setParticles((prev) => [...prev, ...newParticles]);
    },
    [createParticle]
  );

  const updateParticles = useCallback(() => {
    setParticles((prev) =>
      prev
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1,
          life: particle.life - 0.02,
        }))
        .filter((particle) => particle.life > 0)
    );
  }, []);

  const parseLevel = useCallback((levelData: any) => {
    const newTiles: Tile[][] = [];
    const newBlocks: Block[] = [];

    for (let y = 0; y < levelData.height; y++) {
      newTiles[y] = [];
      for (let x = 0; x < levelData.width; x++) {
        const char = levelData.tiles[y][x];
        let tileType: TileType = "empty";

        switch (char) {
          case "W":
            tileType = "wall";
            break;
          case "P":
            tileType = "empty";
            setPlayer((prev) => ({
              ...prev,
              x: x * TILE_SIZE,
              y: y * TILE_SIZE,
            }));
            break;
          case "G":
            tileType = "goal";
            break;
          case "B":
            tileType = "empty";
            newBlocks.push({
              x: x * TILE_SIZE,
              y: y * TILE_SIZE,
              vx: 0,
              vy: 0,
              onGround: false,
              id: `block${newBlocks.length + 1}`,
            });
            break;
          case "I":
            tileType = "ice";
            break;
          case "S":
            tileType = "switch";
            break;
          case "D":
            tileType = "door";
            break;
          case "T":
            tileType = "teleporter";
            break;
        }

        newTiles[y][x] = {
          type: tileType,
          x: x * TILE_SIZE,
          y: y * TILE_SIZE,
        };
      }
    }

    setTiles(newTiles);
    setBlocks(newBlocks);
  }, []);

  const resetLevel = useCallback(() => {
    parseLevel(LEVELS[currentLevel]);
    setMoves(0);
    setLevelCompleted(false);
    setParticles([]);
  }, [currentLevel, parseLevel]);

  const resetGame = useCallback(() => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "Puzzle Platformer"
    });
    setCurrentLevel(0);
    setScore(0);
    setMoves(0);
    setGameOver(false);
    setGameStarted(false);
    setPaused(false);
    setLevelCompleted(false);
    setParticles([]);
    parseLevel(LEVELS[0]);
  }, [parseLevel]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    parseLevel(LEVELS[currentLevel]);
  }, [currentLevel, parseLevel]);

  const isColliding = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const tileX = Math.floor(x / TILE_SIZE);
      const tileY = Math.floor(y / TILE_SIZE);
      const endTileX = Math.floor((x + width - 1) / TILE_SIZE);
      const endTileY = Math.floor((y + height - 1) / TILE_SIZE);

      for (let ty = tileY; ty <= endTileY; ty++) {
        for (let tx = tileX; tx <= endTileX; tx++) {
          if (ty >= 0 && ty < tiles.length && tx >= 0 && tx < tiles[0].length) {
            if (
              tiles[ty][tx].type === "wall" ||
              tiles[ty][tx].type === "door"
            ) {
              return true;
            }
          }
        }
      }

      return false;
    },
    [tiles]
  );

  // Update checkGoal to check for both player and blocks
  const checkGoalReached = useCallback(() => {
    // Check if player is on goal
    const playerTileX = Math.floor(player.x / TILE_SIZE);
    const playerTileY = Math.floor(player.y / TILE_SIZE);
    if (
      playerTileY >= 0 &&
      playerTileY < tiles.length &&
      playerTileX >= 0 &&
      playerTileX < tiles[0].length &&
      tiles[playerTileY][playerTileX].type === "goal"
    ) {
      return true;
    }
    // Check if any block is on goal
    for (const block of blocks) {
      const blockTileX = Math.floor(block.x / TILE_SIZE);
      const blockTileY = Math.floor(block.y / TILE_SIZE);
      if (
        blockTileY >= 0 &&
        blockTileY < tiles.length &&
        blockTileX >= 0 &&
        blockTileX < tiles[0].length &&
        tiles[blockTileY][blockTileX].type === "goal"
      ) {
        return true;
      }
    }
    return false;
  }, [player, blocks, tiles]);

  const activateSwitch = useCallback(
    (x: number, y: number) => {
      const tileX = Math.floor(x / TILE_SIZE);
      const tileY = Math.floor(y / TILE_SIZE);

      if (
        tileY >= 0 &&
        tileY < tiles.length &&
        tileX >= 0 &&
        tileX < tiles[0].length
      ) {
        if (tiles[tileY][tileX].type === "switch") {
          setTiles((prev) => {
            const newTiles = [...prev];
            newTiles[tileY][tileX] = {
              ...newTiles[tileY][tileX],
              activated: true,
            };

            // Open all doors
            for (let y = 0; y < newTiles.length; y++) {
              for (let x = 0; x < newTiles[y].length; x++) {
                if (newTiles[y][x].type === "door") {
                  newTiles[y][x] = { ...newTiles[y][x], type: "empty" };
                }
              }
            }

            return newTiles;
          });

          addParticles(x, y, 15, "#10b981");
        }
      }
    },
    [tiles, addParticles]
  );

  const gameLoop = useCallback(
    (currentTime: number) => {
      if (paused || !gameStarted || gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      setPlayer((prev) => {
        let newVx = prev.vx;
        let newVy = prev.vy + GRAVITY;
        let newX = prev.x;
        let newY = prev.y;
        let newOnGround = false;
        let newCanMove = true;

        // Handle input
        if (keysPressed.current.has("ArrowLeft")) {
          newVx = -MOVE_SPEED;
        } else if (keysPressed.current.has("ArrowRight")) {
          newVx = MOVE_SPEED;
        } else {
          newVx *= 0.8; // Friction
        }

        // Apply velocity
        newX += newVx;
        newY += newVy;

        // Check collisions
        if (isColliding(newX, prev.y, TILE_SIZE, TILE_SIZE)) {
          newX = prev.x;
          newVx = 0;
        }

        if (isColliding(prev.x, newY, TILE_SIZE, TILE_SIZE)) {
          newY = prev.y;
          newVy = 0;
          newOnGround = true;
        }

        // Check ice sliding
        const tileX = Math.floor(prev.x / TILE_SIZE);
        const tileY = Math.floor(prev.y / TILE_SIZE);
        if (
          tileY >= 0 &&
          tileY < tiles.length &&
          tileX >= 0 &&
          tileX < tiles[0].length
        ) {
          if (tiles[tileY][tileX].type === "ice") {
            newVx *= 1.1; // Ice makes you slide
          }
        }

        // Check goal
        if (checkGoalReached()) {
          if (!levelCompleted) {
            setLevelCompleted(true);
            addParticles(
              player.x + TILE_SIZE / 2,
              player.y + TILE_SIZE / 2,
              20,
              "#f59e0b"
            );
          }
        }

        // Check switch activation
        activateSwitch(newX, newY);

        return {
          ...prev,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          onGround: newOnGround,
          canMove: newCanMove,
        };
      });

      // Update blocks
      setBlocks((prev) => {
        return prev.map((block) => {
          let newVx = block.vx;
          let newVy = block.vy + GRAVITY;
          let newX = block.x;
          let newY = block.y;
          let newOnGround = false;

          // Apply velocity
          newX += newVx;
          newY += newVy;

          // Check collisions
          if (isColliding(newX, block.y, TILE_SIZE, TILE_SIZE)) {
            newX = block.x;
            newVx = 0;
          }

          if (isColliding(block.x, newY, TILE_SIZE, TILE_SIZE)) {
            newY = block.y;
            newVy = 0;
            newOnGround = true;
          }

          return {
            ...block,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            onGround: newOnGround,
          };
        });
      });

      updateParticles();

      animationRef.current = requestAnimationFrame(gameLoop);
    },
    [
      paused,
      gameStarted,
      gameOver,
      tiles,
      isColliding,
      checkGoalReached,
      activateSwitch,
      addParticles,
      updateParticles,
      levelCompleted,
      player.x,
      player.y,
    ]
  );

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);

      if (e.code === "Space" && !gameStarted) {
        e.preventDefault();
        startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, startGame]);

  useEffect(() => {
    if (levelCompleted) {
      setTimeout(() => {
        setCurrentLevel((prev) => {
          const nextLevel = prev + 1;
          if (nextLevel < LEVELS.length) {
            setScore((s) => s + 100);
            parseLevel(LEVELS[nextLevel]);
            setLevelCompleted(false);
            return nextLevel;
          } else {
            setGameOver(true);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem(
                "puzzle-platformer-high-score",
                score.toString()
              );
            }
            return prev;
          }
        });
      }, 1000);
    }
  }, [levelCompleted, score, highScore, parseLevel]);

  const renderTile = (tile: Tile, x: number, y: number) => {
    const baseClasses = "absolute border border-gray-300";

    switch (tile.type) {
      case "wall":
        return (
          <motion.div
            key={`${x}-${y}`}
            className={`${baseClasses} bg-gray-800`}
            style={{
              left: tile.x,
              top: tile.y,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: (x + y) * 0.01 }}
          />
        );
      case "goal":
        return (
          <motion.div
            key={`${x}-${y}`}
            className={`${baseClasses} bg-gradient-to-r from-yellow-400 to-orange-500`}
            style={{
              left: tile.x,
              top: tile.y,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </motion.div>
        );
      case "ice":
        return (
          <motion.div
            key={`${x}-${y}`}
            className={`${baseClasses} bg-blue-200`}
            style={{
              left: tile.x,
              top: tile.y,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      case "switch":
        return (
          <motion.div
            key={`${x}-${y}`}
            className={`${baseClasses} ${
              tile.activated ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              left: tile.x,
              top: tile.y,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      case "door":
        return (
          <motion.div
            key={`${x}-${y}`}
            className={`${baseClasses} bg-red-700`}
            style={{
              left: tile.x,
              top: tile.y,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderPlayer = () => (
    <motion.div
      className="absolute bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg"
      style={{
        left: player.x,
        top: player.y,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
      animate={{
        y: [0, -2, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full" />
      </div>
    </motion.div>
  );

  const renderBlocks = () => (
    <>
      {blocks.map((block) => (
        <motion.div
          key={block.id}
          className="absolute bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg"
          style={{
            left: block.x,
            top: block.y,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );

  const renderParticles = () => (
    <>
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        />
      ))}
    </>
  );

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Stats */}
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-lg">
            Level: {currentLevel + 1}
          </Badge>
          <Badge variant="outline" className="text-lg">
            Score: {score}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="default" className="text-lg">
            Moves: {moves}
          </Badge>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-2xl">
        <div
          className="relative"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Background grid */}
          {Array.from({ length: Math.ceil(GAME_HEIGHT / TILE_SIZE) }).map(
            (_, y) =>
              Array.from({ length: Math.ceil(GAME_WIDTH / TILE_SIZE) }).map(
                (_, x) => (
                  <div
                    key={`grid-${x}-${y}`}
                    className="absolute border border-gray-200"
                    style={{
                      left: x * TILE_SIZE,
                      top: y * TILE_SIZE,
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                    }}
                  />
                )
              )
          )}

          {/* Game elements */}
          {tiles.map((row, y) => row.map((tile, x) => renderTile(tile, x, y)))}
          {renderBlocks()}
          {renderParticles()}
          {renderPlayer()}

          {/* Level Completed Overlay */}
          <AnimatePresence>
            {levelCompleted && (
              <motion.div
                className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-lg p-6 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <h3 className="text-2xl font-bold mb-2 text-green-600">
                    Level Complete!
                  </h3>
                  <p className="text-lg mb-4">Great job!</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-lg p-6 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <h3 className="text-2xl font-bold mb-2">Game Complete!</h3>
                  <p className="text-lg mb-4">Final Score: {score}</p>
                  <Button onClick={resetGame} className="w-full">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Start Screen */}
          <AnimatePresence>
            {!gameStarted && !gameOver && (
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-lg p-6 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <Puzzle className="h-8 w-8 text-blue-500 mr-2" />
                    <h3 className="text-2xl font-bold">Puzzle Platformer</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Use arrow keys to move and reach the goal!
                  </p>
                  <Button onClick={startGame} className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Game
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => setPaused(!paused)}
          disabled={!gameStarted || gameOver}
          variant="outline"
        >
          {paused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </Button>

        <Button onClick={resetLevel} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        <p>• Use arrow keys to move</p>
        <p>• Reach the golden trophy to complete levels</p>
        <p>• Step on switches to open doors</p>
        <p>• Ice blocks make you slide!</p>
      </div>
    </div>
  );
}
