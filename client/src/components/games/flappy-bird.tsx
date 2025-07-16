import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Play, Pause, Trophy, Zap, Feather } from "lucide-react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const PIPE_SPEED = 2;

interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export default function FlappyBird() {
  const [bird, setBird] = useState<Bird>({
    x: 80,
    y: GAME_HEIGHT / 2,
    velocity: 0,
    rotation: 0,
  });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("flappy-bird-high-score") || "0");
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [combo, setCombo] = useState(0);
  const [powerMode, setPowerMode] = useState(false);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // --- State for animation frame ---
  const [frame, setFrame] = useState(0);

  const createParticle = useCallback((x: number, y: number, color: string) => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
      maxLife: 1,
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

  const generatePipe = useCallback((): Pipe => {
    const minHeight = 50;
    const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    return {
      x: GAME_WIDTH,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false,
    };
  }, []);

  const resetGame = useCallback(() => {
    setBird({
      x: 80,
      y: GAME_HEIGHT / 2,
      velocity: 0,
      rotation: 0,
    });
    setPipes([]);
    setScore(0);
    setCombo(0);
    setPowerMode(false);
    setGameOver(false);
    setGameStarted(false);
    setPaused(false);
    setParticles([]);
  }, []);

  const jump = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setBird((prev) => ({
      ...prev,
      velocity: JUMP_FORCE,
    }));

    addParticles(bird.x + BIRD_SIZE / 2, bird.y + BIRD_SIZE / 2, 8, "#3b82f6");

    if (powerMode) {
      setCombo((prev) => prev + 1);
    }
  }, [gameOver, gameStarted, bird.x, bird.y, addParticles, powerMode]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setPipes([generatePipe()]);
  }, [generatePipe]);

  const checkCollision = useCallback((bird: Bird, pipes: Pipe[]): boolean => {
    // Check wall collision
    if (bird.y <= 0 || bird.y + BIRD_SIZE >= GAME_HEIGHT) {
      return true;
    }

    // Check pipe collision
    for (const pipe of pipes) {
      if (
        bird.x + BIRD_SIZE > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH &&
        (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY)
      ) {
        return true;
      }
    }

    return false;
  }, []);

  // --- Main game loop using requestAnimationFrame ---
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;
    let animationId: number;
    const loop = () => {
      setFrame((f) => f + 1);
      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, gameOver, paused]);

  // --- Update bird and pipes on every frame ---
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    setBird((prev) => {
      const newVelocity = prev.velocity + GRAVITY;
      const newY = prev.y + newVelocity;
      const newRotation = Math.min(Math.max(newVelocity * 2, -30), 90);
      return { ...prev, y: newY, velocity: newVelocity, rotation: newRotation };
    });

    setPipes((prev) => {
      let updated = prev.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
      updated = updated.filter((pipe) => pipe.x + PIPE_WIDTH > 0);
      if (
        updated.length === 0 ||
        updated[updated.length - 1].x < GAME_WIDTH - 200
      ) {
        updated.push(generatePipe());
      }
      return updated;
    });

    updateParticles();
  }, [frame, gameStarted, gameOver, paused, updateParticles, generatePipe]);

  // --- Collision and scoring logic ---
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    // Wall collision
    if (bird.y <= 0 || bird.y + BIRD_SIZE >= GAME_HEIGHT) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("flappy-bird-high-score", score.toString());
      }
      addParticles(
        bird.x + BIRD_SIZE / 2,
        bird.y + BIRD_SIZE / 2,
        30,
        "#ef4444"
      );
      return;
    }
    // Pipe collision
    for (const pipe of pipes) {
      if (
        bird.x + BIRD_SIZE > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH &&
        (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY)
      ) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("flappy-bird-high-score", score.toString());
        }
        addParticles(
          bird.x + BIRD_SIZE / 2,
          bird.y + BIRD_SIZE / 2,
          30,
          "#ef4444"
        );
        return;
      }
    }
    // Scoring
    pipes.forEach((pipe) => {
      if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
        pipe.passed = true;
        setScore((s) => s + 1);
        setCombo((c) => c + 1);
        addParticles(bird.x, bird.y + BIRD_SIZE / 2, 12, "#10b981");
        if (combo >= 5 && !powerMode) {
          setPowerMode(true);
          addParticles(bird.x, bird.y, 20, "#f59e0b");
        }
      }
    });
  }, [
    frame,
    gameStarted,
    gameOver,
    bird,
    pipes,
    score,
    highScore,
    combo,
    powerMode,
    addParticles,
  ]);

  // --- Mouse/tap support for flapping ---
  useEffect(() => {
    const handleFlap = (e: Event) => {
      e.preventDefault();
      if (!gameStarted) {
        startGame();
      } else if (!gameOver) {
        jump();
      }
    };
    window.addEventListener("mousedown", handleFlap);
    window.addEventListener("touchstart", handleFlap);
    return () => {
      window.removeEventListener("mousedown", handleFlap);
      window.removeEventListener("touchstart", handleFlap);
    };
  }, [gameStarted, gameOver, jump, startGame]);

  const renderBird = () => (
    <motion.div
      className="absolute"
      style={{
        left: bird.x,
        top: bird.y,
        width: BIRD_SIZE,
        height: BIRD_SIZE,
      }}
      animate={{
        rotate: bird.rotation,
        y: [0, -5, 0],
      }}
      transition={{
        y: {
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <div className="relative w-full h-full">
        {/* Bird body */}
        <motion.div
          className={`w-full h-full rounded-full ${
            powerMode
              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
              : "bg-gradient-to-r from-blue-400 to-blue-600"
          } shadow-lg`}
          animate={{
            scale: powerMode ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            repeat: powerMode ? Infinity : 0,
          }}
        />

        {/* Bird eye */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full">
          <div className="w-1.5 h-1.5 bg-black rounded-full ml-0.5 mt-0.5" />
        </div>

        {/* Bird wing */}
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-blue-300 rounded-full"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Power mode aura */}
        {powerMode && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-yellow-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </motion.div>
  );

  const renderPipes = () => (
    <>
      {pipes.map((pipe, index) => (
        <div key={index} className="absolute">
          {/* Top pipe */}
          <motion.div
            className="bg-gradient-to-b from-green-500 to-green-700"
            style={{
              left: pipe.x,
              top: 0,
              width: PIPE_WIDTH,
              height: pipe.topHeight,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-600 rounded-t-lg" />
          </motion.div>

          {/* Bottom pipe */}
          <motion.div
            className="bg-gradient-to-t from-green-500 to-green-700"
            style={{
              left: pipe.x,
              top: pipe.bottomY,
              width: PIPE_WIDTH,
              height: GAME_HEIGHT - pipe.bottomY,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-green-600 rounded-b-lg" />
          </motion.div>
        </div>
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
            High: {highScore}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {powerMode && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5 text-yellow-400" />
            </motion.div>
          )}
          <Badge variant={powerMode ? "default" : "secondary"}>
            Combo: {combo}
          </Badge>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative bg-gradient-to-b from-sky-400 to-blue-600 rounded-lg overflow-hidden shadow-2xl">
        <div
          className="relative"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Background clouds */}
          <motion.div
            className="absolute top-10 left-20 w-16 h-8 bg-white/30 rounded-full"
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-20 right-10 w-12 h-6 bg-white/30 rounded-full"
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />

          {/* Game elements */}
          {renderPipes()}
          {renderParticles()}
          {renderBird()}

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
                    <Feather className="h-8 w-8 text-blue-500 mr-2" />
                    <h3 className="text-2xl font-bold">Flappy Bird</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Press SPACE to flap and avoid the pipes!
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
          onClick={jump}
          disabled={!gameStarted || gameOver}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Feather className="mr-2 h-4 w-4" />
          Flap
        </Button>

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
        <p>• Press SPACE to flap</p>
        <p>• Avoid pipes and walls</p>
        <p>• Build combos for power mode!</p>
      </div>
    </div>
  );
}
