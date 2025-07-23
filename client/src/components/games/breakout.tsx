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
  Target,
  Star,
} from "lucide-react";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 8;
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_ROWS = 8;
const BRICK_COLS = 10;
const POWERUP_SIZE = 20;

// Set more moderate ball speeds

// Track game start for analytics
useEffect(() => {
  logEvent({
    action: "start_game",
    category: "Game",
    label: "Breakout"
  });
}, []);
const INITIAL_BALL_SPEED = 4;
const MIN_BALL_SPEED = 4;
const MAX_BALL_SPEED = 10;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  color: string;
  powerup?: PowerupType;
}

interface Powerup {
  x: number;
  y: number;
  type: PowerupType;
  active: boolean;
}

type PowerupType = "widen" | "narrow" | "speed" | "slow" | "multi" | "life";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const BRICK_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
];

const POWERUP_COLORS = {
  widen: "bg-blue-500",
  narrow: "bg-red-500",
  speed: "bg-yellow-500",
  slow: "bg-green-500",
  multi: "bg-purple-500",
  life: "bg-pink-500",
};

export default function Breakout() {
  const [ball, setBall] = useState<Ball>({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - 50,
    vx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    vy: -INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED,
  });
  const [paddle, setPaddle] = useState<Paddle>({
    x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: GAME_HEIGHT - 30,
    width: PADDLE_WIDTH,
  });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [powerups, setPowerups] = useState<Powerup[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("breakout-high-score") || "0");
  });
  const [combo, setCombo] = useState(0);
  const [powerMode, setPowerMode] = useState(false);
  const animationRef = useRef<number>();
  const mouseXRef = useRef<number>(0);
  const [paddleDir, setPaddleDir] = useState(0); // -1 for left, 1 for right, 0 for none

  const createParticle = useCallback((x: number, y: number, color: string) => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
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
          vy: particle.vy + 0.2,
          life: particle.life - 0.02,
        }))
        .filter((particle) => particle.life > 0)
    );
  }, []);

  const generateBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const x = col * BRICK_WIDTH;
        const y = row * BRICK_HEIGHT + 50;
        const health = Math.floor(Math.random() * 3) + 1;
        const powerup =
          Math.random() < 0.1
            ? (
                [
                  "widen",
                  "narrow",
                  "speed",
                  "slow",
                  "multi",
                  "life",
                ] as PowerupType[]
              )[Math.floor(Math.random() * 6)]
            : undefined;

        newBricks.push({
          x,
          y,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          health,
          maxHealth: health,
          color: BRICK_COLORS[row % BRICK_COLORS.length],
          powerup,
        });
      }
    }
    return newBricks;
  }, []);

  const resetGame = useCallback(() => {
    setBall({
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 50,
      vx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      vy: -INITIAL_BALL_SPEED,
      speed: INITIAL_BALL_SPEED,
    });
    setPaddle({
      x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: GAME_HEIGHT - 30,
      width: PADDLE_WIDTH,
    });
    setBricks(generateBricks());
    setPowerups([]);
    setParticles([]);
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setPowerMode(false);
    setGameOver(false);
    setGameStarted(false);
    setPaused(false);
  }, [generateBricks]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setBricks(generateBricks());
  }, [generateBricks]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!gameStarted || gameOver) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      mouseXRef.current = mouseX;

      setPaddle((prev) => ({
        ...prev,
        x: Math.max(
          0,
          Math.min(GAME_WIDTH - prev.width, mouseX - prev.width / 2)
        ),
      }));
    },
    [gameStarted, gameOver]
  );

  const activatePowerup = useCallback((type: PowerupType) => {
    switch (type) {
      case "widen":
        setPaddle((prev) => ({
          ...prev,
          width: Math.min(prev.width + 30, 200),
        }));
        break;
      case "narrow":
        setPaddle((prev) => ({
          ...prev,
          width: Math.max(prev.width - 20, 60),
        }));
        break;
      case "speed":
        setBall((prev) => ({ ...prev, speed: Math.min(prev.speed + 1, 6) }));
        break;
      case "slow":
        setBall((prev) => ({ ...prev, speed: Math.max(prev.speed - 1, 2) }));
        break;
      case "multi":
        // Create multiple balls
        setPowerMode(true);
        break;
      case "life":
        setLives((prev) => prev + 1);
        break;
    }
  }, []);

  const checkCollision = useCallback(
    (ball: Ball, paddle: Paddle, bricks: Brick[]) => {
      // Paddle collision
      if (
        ball.y + BALL_SIZE >= paddle.y &&
        ball.y <= paddle.y + PADDLE_HEIGHT &&
        ball.x + BALL_SIZE >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        const hitPos = (ball.x - paddle.x) / paddle.width;
        const angle = (hitPos - 0.5) * Math.PI * 0.75;
        return {
          type: "paddle",
          newVx: Math.sin(angle) * ball.speed,
          newVy: -Math.cos(angle) * ball.speed,
        };
      }

      // Brick collision
      for (let i = bricks.length - 1; i >= 0; i--) {
        const brick = bricks[i];
        if (
          ball.x + BALL_SIZE >= brick.x &&
          ball.x <= brick.x + brick.width &&
          ball.y + BALL_SIZE >= brick.y &&
          ball.y <= brick.y + brick.height
        ) {
          return {
            type: "brick",
            brickIndex: i,
            brick: brick,
          };
        }
      }

      return null;
    },
    []
  );

  const gameLoop = useCallback(
    (currentTime: number) => {
      if (paused || !gameStarted || gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      setBall((prev) => {
        const newX = prev.x + prev.vx;
        const newY = prev.y + prev.vy;

        // Wall collision
        let newVx = prev.vx;
        let newVy = prev.vy;

        if (newX <= 0 || newX + BALL_SIZE >= GAME_WIDTH) {
          newVx = -newVx;
        }
        if (newY <= 0) {
          newVy = -newVy;
        }

        // Bottom wall (lose life)
        if (newY + BALL_SIZE >= GAME_HEIGHT) {
          setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("breakout-high-score", score.toString());
              }
            }
            return newLives;
          });

          // Reset ball
          return {
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT - 50,
            vx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
            vy: -INITIAL_BALL_SPEED,
            speed: INITIAL_BALL_SPEED,
          };
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    },
    [paused, gameStarted, gameOver, score, highScore]
  );

  // Handle collisions and game logic
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    let animId: number;
    const loop = () => {
      setBall((prev) => {
        let { x, y, vx, vy, speed } = prev;
        x += vx;
        y += vy;
        // Wall collision
        if (x <= 0 || x + BALL_SIZE >= GAME_WIDTH) vx = -vx;
        if (y <= 0) vy = -vy;
        // Bottom wall (lose life)
        if (y + BALL_SIZE >= GAME_HEIGHT) {
          setLives((l) => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameOver(true);
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("breakout-high-score", score.toString());
              }
            }
            return newLives;
          });
          return {
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT - 50,
            vx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
            vy: -INITIAL_BALL_SPEED,
            speed: INITIAL_BALL_SPEED,
          };
        }
        // Paddle collision
        if (
          y + BALL_SIZE >= paddle.y &&
          y <= paddle.y + PADDLE_HEIGHT &&
          x + BALL_SIZE >= paddle.x &&
          x <= paddle.x + paddle.width
        ) {
          // Calculate bounce angle
          const hitPos = (x - paddle.x) / paddle.width;
          const angle = (hitPos - 0.5) * Math.PI * 0.75;
          vx = Math.sin(angle) * speed;
          vy = -Math.abs(Math.cos(angle) * speed);
          addParticles(x, y, 8, "#3b82f6");
        }
        // Brick collision
        let brickHit = false;
        for (let i = 0; i < bricks.length; i++) {
          const brick = bricks[i];
          if (
            x + BALL_SIZE >= brick.x &&
            x <= brick.x + brick.width &&
            y + BALL_SIZE >= brick.y &&
            y <= brick.y + brick.height
          ) {
            brickHit = true;
            const brickCenterX = brick.x + brick.width / 2;
            const brickCenterY = brick.y + brick.height / 2;
            addParticles(
              brickCenterX,
              brickCenterY,
              15,
              brick.color.replace("bg-", "#")
            );
            // Update brick health
            setBricks((prev) => {
              const newBricks = [...prev];
              newBricks[i] = {
                ...newBricks[i],
                health: newBricks[i].health - 1,
              };
              if (newBricks[i].health <= 0) {
                const destroyedBrick = newBricks[i];
                setScore((s) => s + destroyedBrick.maxHealth * 10);
                setCombo((c) => c + 1);
                if (destroyedBrick.powerup) {
                  setPowerups((prev) => [
                    ...prev,
                    {
                      x: brickCenterX,
                      y: brickCenterY,
                      type: destroyedBrick.powerup!,
                      active: true,
                    },
                  ]);
                }
                newBricks.splice(i, 1);
              }
              return newBricks;
            });
            // Bounce ball (simple: reverse y)
            vy = -vy;
            break;
          }
        }
        // Normalize speed after collision
        const norm = Math.sqrt(vx * vx + vy * vy);
        if (norm !== 0) {
          vx = (vx / norm) * speed;
          vy = (vy / norm) * speed;
        }
        // Clamp speed
        speed = Math.max(MIN_BALL_SPEED, Math.min(MAX_BALL_SPEED, speed));
        return { x, y, vx, vy, speed };
      });
      // Powerups
      setPowerups((prev) =>
        prev
          .map((powerup) => ({ ...powerup, y: powerup.y + 2 }))
          .filter((powerup) => {
            if (
              powerup.y + POWERUP_SIZE >= paddle.y &&
              powerup.y <= paddle.y + PADDLE_HEIGHT &&
              powerup.x + POWERUP_SIZE >= paddle.x &&
              powerup.x <= paddle.x + paddle.width
            ) {
              activatePowerup(powerup.type);
              addParticles(
                powerup.x,
                powerup.y,
                12,
                POWERUP_COLORS[powerup.type].replace("bg-", "#")
              );
              return false;
            }
            return powerup.y < GAME_HEIGHT;
          })
      );
      // Level completion
      if (bricks.length === 0) {
        setLevel((l) => l + 1);
        setBricks(generateBricks());
        setBall({
          x: GAME_WIDTH / 2,
          y: GAME_HEIGHT - 50,
          vx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
          vy: -INITIAL_BALL_SPEED,
          speed: INITIAL_BALL_SPEED,
        });
      }
      updateParticles();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    gameStarted,
    gameOver,
    paddle,
    bricks,
    score,
    highScore,
    addParticles,
    activatePowerup,
    updateParticles,
    generateBricks,
  ]);

  // Handle keyboard controls
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        setPaddleDir(-1);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        setPaddleDir(1);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "a" ||
        e.key === "A" ||
        e.key === "ArrowRight" ||
        e.key === "d" ||
        e.key === "D"
      )
        setPaddleDir(0);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  // Move paddle smoothly on every animation frame
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    let animId: number;
    const move = () => {
      setPaddle((prev) => {
        if (paddleDir === 0) return prev;
        const moveSpeed = 16;
        let newX = prev.x + paddleDir * moveSpeed;
        newX = Math.max(0, Math.min(GAME_WIDTH - prev.width, newX));
        return { ...prev, x: newX };
      });
      animId = requestAnimationFrame(move);
    };
    animId = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animId);
  }, [gameStarted, gameOver, paddleDir]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  const renderBall = () => (
    <motion.div
      className="absolute bg-white rounded-full shadow-lg"
      style={{
        left: ball.x,
        top: ball.y,
        width: BALL_SIZE,
        height: BALL_SIZE,
      }}
      animate={{
        scale: powerMode ? [1, 1.2, 1] : 1,
      }}
      transition={{
        duration: 0.3,
        repeat: powerMode ? Infinity : 0,
      }}
    >
      {powerMode && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-yellow-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );

  const renderPaddle = () => (
    <motion.div
      className="absolute bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg"
      style={{
        left: paddle.x,
        top: paddle.y,
        width: paddle.width,
        height: PADDLE_HEIGHT,
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

  const renderBricks = () => (
    <>
      {bricks.map((brick, index) => (
        <motion.div
          key={index}
          className={`absolute rounded ${brick.color} shadow-md`}
          style={{
            left: brick.x,
            top: brick.y,
            width: brick.width,
            height: brick.height,
            opacity: brick.health / brick.maxHealth,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.01 }}
        >
          {brick.powerup && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="h-3 w-3 text-white" />
            </div>
          )}
        </motion.div>
      ))}
    </>
  );

  const renderPowerups = () => (
    <>
      {powerups.map((powerup, index) => (
        <motion.div
          key={index}
          className={`absolute rounded ${
            POWERUP_COLORS[powerup.type]
          } shadow-lg`}
          style={{
            left: powerup.x,
            top: powerup.y,
            width: POWERUP_SIZE,
            height: POWERUP_SIZE,
          }}
          animate={{
            y: [0, -5, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 1, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
            {powerup.type.charAt(0).toUpperCase()}
          </div>
        </motion.div>
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
            Score: {score}
          </Badge>
          <Badge variant="outline" className="text-lg">
            Level: {level}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="text-lg">
            Lives: {lives}
          </Badge>
          {powerMode && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5 text-yellow-400" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl">
        <div
          className="relative cursor-none"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          onMouseMove={handleMouseMove}
        >
          {/* Background stars */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: Math.random() * GAME_WIDTH,
                top: Math.random() * GAME_HEIGHT,
              }}
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Game elements */}
          {renderBricks()}
          {renderPowerups()}
          {renderParticles()}
          {renderPaddle()}
          {renderBall()}

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
                  <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                  <p className="text-lg mb-4">Score: {score}</p>
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
                    <Target className="h-8 w-8 text-blue-500 mr-2" />
                    <h3 className="text-2xl font-bold">Breakout</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Move mouse to control paddle and break all bricks!
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

        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        <p>• Move mouse to control paddle</p>
        <p>• Break all bricks to advance</p>
        <p>• Collect power-ups for bonuses!</p>
      </div>
    </div>
  );
}
