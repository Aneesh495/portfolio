import { useState, useCallback, useEffect, useRef } from "react";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bot,
  RotateCcw,
  Trophy,
  Settings,
  Clock,
  Lightbulb,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "playing" | "paused" | "gameOver";

interface Word {
  word: string;
  positions: { row: number; col: number }[];
  found: boolean;
}

interface GameData {
  grid: string[][];
  words: Word[];
  timeLimit: number;
  minWordLength: number;
}

const EASY_WORDS = [
  "CAT",
  "DOG",
  "BIRD",
  "FISH",
  "TREE",
  "BOOK",
  "HOUSE",
  "CAR",
  "SUN",
  "MOON",
  "BALL",
  "RAIN",
  "STAR",
  "HAT",
  "SHIP",
  "CUP",
  "CAKE",
  "FOOD",
  "MILK",
  "BREAD",
  "BABY",
  "KITE",
  "DUCK",
  "FROG",
  "LION",
  "BEAR",
  "GOAT",
  "WORM",
  "ANT",
  "EGGS",
  "SOUP",
  "SNOW",
  "WIND",
  "FIRE",
  "COOK",
  "PLAY",
  "WALK",
  "JUMP",
  "READ",
  "SING",
  "SEED",
  "POND",
  "BELL",
  "FLAG",
  "SOAP",
  "TOOL",
  "HAND",
  "NOSE",
  "EYES",
  "TOES",
  "MILK",
  "DOLL",
  "TREE",
  "HILL",
  "ROCK",
  "LEAF",
  "ROAD",
  "CITY",
  "TOWN",
  "CLOUD",
];

const MEDIUM_WORDS = [
  "COMPUTER",
  "PROGRAMMING",
  "ALGORITHM",
  "DATABASE",
  "NETWORK",
  "SOFTWARE",
  "HARDWARE",
  "INTERFACE",
  "SYSTEM",
  "SECURITY",
  "LIBRARY",
  "PACKAGE",
  "STORAGE",
  "PROCESS",
  "FUNCTION",
  "VARIABLE",
  "GRAPHICS",
  "ENGINEER",
  "DEVELOPER",
  "WEBSITE",
  "KEYBOARD",
  "MONITOR",
  "VIRTUAL",
  "ACCOUNT",
  "BROWSER",
  "COMMAND",
  "MODULE",
  "ROUTINE",
  "NETWORKS",
  "PLATFORM",
  "DEBUGGER",
  "DOCUMENT",
  "RECORDS",
  "VERSION",
  "CONTROL",
  "LANGUAGE",
  "OPERATOR",
  "RESEARCH",
  "SOLUTION",
  "STRUCTURE",
  "TRANSFER",
  "UTILITY",
  "PASSWORD",
  "DOWNLOAD",
  "UPGRADE",
  "WIRELESS",
  "EMULATOR",
  "COMPILER",
  "SNIPPETS",
  "FEEDBACK",
  "BACKUP",
  "EXECUTE",
];

const HARD_WORDS = [
  "ARTIFICIAL",
  "INTELLIGENCE",
  "MACHINE",
  "LEARNING",
  "DEEP",
  "NEURAL",
  "NETWORK",
  "ALGORITHM",
  "OPTIMIZATION",
  "COMPLEXITY",
  "AUTOMATION",
  "RECURSION",
  "PARALLELISM",
  "QUANTIZATION",
  "STOCHASTIC",
  "TRANSFORMER",
  "SUPERVISED",
  "UNSUPERVISED",
  "DIMENSIONALITY",
  "HYPERPARAMETER",
  "CONVERGENCE",
  "REGULARIZATION",
  "GENERALIZATION",
  "EXPLORATION",
  "EXPLANATION",
  "AUGMENTATION",
  "REINFORCEMENT",
  "COMPUTABILITY",
  "EXPERIMENTAL",
  "COMPUTATIONAL",
  "DISCRIMINATOR",
  "GENERATOR",
  "BAYESIAN",
  "GRADIENT",
  "SYNTHESIS",
  "CLASSIFICATION",
  "PREDICTION",
  "RECOGNITION",
  "SIMULATION",
  "DECOMPOSITION",
  "DETERMINISTIC",
  "CONVOLUTION",
  "ENSEMBLING",
  "ACTIVATION",
  "PARAMETRIZATION",
  "DERIVATIVE",
  "BACKPROPAGATION",
  "ENCODING",
  "DECODING",
  "ANALYTICS",
  "REGRESSION",
];


const GRID_SIZE = 8;

export default function WordHunt() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<GameState>("playing");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [selectedCells, setSelectedCells] = useState<
    { row: number; col: number }[]
  >([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(
      localStorage.getItem(`wordhunt-high-score-${difficulty}`) || "0"
    );
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateGrid = useCallback(
    (words: string[]): GameData => {
      const grid: string[][] = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(""));
      const placedWords: Word[] = [];

      // Place words in the grid
      for (const word of words) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 100) {
          const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
          const reverse = Math.random() < 0.5;
          const wordToPlace = reverse
            ? word.split("").reverse().join("")
            : word;

          const row = Math.floor(Math.random() * GRID_SIZE);
          const col = Math.floor(
            Math.random() * (GRID_SIZE - wordToPlace.length + 1)
          );

          if (orientation === "vertical") {
            if (row + wordToPlace.length <= GRID_SIZE) {
              let canPlace = true;
              for (let i = 0; i < wordToPlace.length; i++) {
                const cell = grid[row + i][col];
                if (cell !== "" && cell !== wordToPlace[i]) {
                  canPlace = false;
                  break;
                }
              }

              if (canPlace) {
                const positions: { row: number; col: number }[] = [];
                for (let i = 0; i < wordToPlace.length; i++) {
                  grid[row + i][col] = wordToPlace[i];
                  positions.push({ row: row + i, col });
                }
                placedWords.push({
                  word: reverse ? word.split("").reverse().join("") : word,
                  positions: reverse ? positions.reverse() : positions,
                  found: false,
                });
                placed = true;
              }
            }
          } else {
            if (col + wordToPlace.length <= GRID_SIZE) {
              let canPlace = true;
              for (let i = 0; i < wordToPlace.length; i++) {
                const cell = grid[row][col + i];
                if (cell !== "" && cell !== wordToPlace[i]) {
                  canPlace = false;
                  break;
                }
              }

              if (canPlace) {
                const positions: { row: number; col: number }[] = [];
                for (let i = 0; i < wordToPlace.length; i++) {
                  grid[row][col + i] = wordToPlace[i];
                  positions.push({ row, col: col + i });
                }
                placedWords.push({
                  word: reverse ? word.split("").reverse().join("") : word,
                  positions: reverse ? positions.reverse() : positions,
                  found: false,
                });
                placed = true;
              }
            }
          }
          attempts++;
        }
      }

      // Fill remaining cells with random letters
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (grid[row][col] === "") {
            grid[row][col] =
              letters[Math.floor(Math.random() * letters.length)];
          }
        }
      }

      return {
        grid,
        words: placedWords,
        timeLimit:
          difficulty === "easy" ? 120 : difficulty === "medium" ? 90 : 60,
        minWordLength:
          difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5,
      };
    },
    [difficulty]
  );

  const resetGame = useCallback(() => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "Word Hunt"
    });
    const words =
      difficulty === "easy"
        ? EASY_WORDS
        : difficulty === "medium"
        ? MEDIUM_WORDS
        : HARD_WORDS;
    const newGameData = generateGrid(words);
    setGameData(newGameData);
    setSelectedCells([]);
    setFoundWords([]);
    setScore(0);
    setTimeLeft(newGameData.timeLimit);
    setHintsUsed(0);
    setGameState("playing");
    setShowHint(false);
  }, [difficulty, generateGrid]);

  const startNewGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("gameOver");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, timeLeft]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing" || !gameData) return;

      // Start a new selection
      setSelectedCells([{ row, col }]);
      setIsDragging(true);
    },
    [gameState, gameData]
  );

  const handleCellMouseDown = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing" || !gameData) return;

      // Start dragging
      setSelectedCells([{ row, col }]);
      setIsDragging(true);
    },
    [gameState, gameData]
  );

  const handleCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing" || !gameData || !isDragging) return;
      setSelectedCells((prev) => {
        if (prev.length === 0) return [{ row, col }];
        const firstCell = prev[0];
        // Only allow straight lines
        if (row !== firstCell.row && col !== firstCell.col) return prev;
        // Only allow contiguous selection
        const lastCell = prev[prev.length - 1];
        const rowDiff = Math.abs(row - lastCell.row);
        const colDiff = Math.abs(col - lastCell.col);
        if (
          (rowDiff === 1 && colDiff === 0) ||
          (rowDiff === 0 && colDiff === 1)
        ) {
          const isAlreadySelected = prev.some(
            (cell) => cell.row === row && cell.col === col
          );
          if (!isAlreadySelected) {
            const newSelected = [...prev, { row, col }];
            if (newSelected.length >= gameData.minWordLength) {
              const word = newSelected
                .map((cell) => gameData.grid[cell.row][cell.col])
                .join("");
              const foundWord = gameData.words.find(
                (w) => w.word === word && !w.found
              );
              if (foundWord) {
                setFoundWords((prev) => [...prev, word]);
                setScore((prev) => prev + word.length * 10);
                setGameData((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    words: prev.words.map((w) =>
                      w.word === word ? { ...w, found: true } : w
                    ),
                  };
                });
                // Optionally: show a toast or feedback
                return [];
              }
            }
            return newSelected;
          }
        }
        return prev;
      });
    },
    [gameState, gameData, isDragging]
  );

  const handleCellMouseUp = useCallback(() => {
    setIsDragging(false);
    setSelectedCells([]);
  }, []);

  // Add global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setSelectedCells([]);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const useHint = useCallback(() => {
    if (!gameData || hintsUsed >= 3) return;

    const unfoundWords = gameData.words.filter((w) => !w.found);
    if (unfoundWords.length === 0) return;

    const availableWords = gameData.words.filter((w) => !w.found);
    if (availableWords.length > 0) {
      const randomHint = availableWords[Math.floor(Math.random() * availableWords.length)];
      setHintWord(randomHint);
      setShowHint(true);
      setHintsUsed((prev) => prev + 1);
      setTimeout(() => setShowHint(false), 3000);
    }
  }, [gameData, hintsUsed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some((cell) => cell.row === row && cell.col === col);
  };

  const [hintWord, setHintWord] = useState<Word | null>(null);

  const isCellInHint = (row: number, col: number) => {
    if (!showHint || !hintWord) return false;
    return hintWord.positions.some((pos) => pos.row === row && pos.col === col);
  };

  // Helper to check if a cell is part of any found word
  const isCellInFoundWord = (row: number, col: number) => {
    if (!gameData) return false;
    return gameData.words.some(
      (w) =>
        w.found && w.positions.some((pos) => pos.row === row && pos.col === col)
    );
  };

  if (!gameData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Word Hunt
        </h3>
        <p className="text-muted-foreground">Find hidden words in the grid!</p>
      </div>

      {/* Settings and Stats */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="px-3 py-2 text-sm border rounded-lg bg-background shadow-sm"
            aria-label="Game difficulty level"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Badge
          variant="outline"
          className="flex items-center gap-2 bg-blue-100 border-blue-300 text-blue-800"
        >
          <Clock className="h-4 w-4" />
          {formatTime(timeLeft)}
        </Badge>

        <Badge
          variant="secondary"
          className="flex items-center gap-2 bg-green-600 text-white"
        >
          Score: {score}
        </Badge>

        <Badge
          variant="outline"
          className="flex items-center gap-2 bg-yellow-100 border-yellow-300 text-yellow-800"
        >
          <Trophy className="h-4 w-4" />
          High: {highScore}
        </Badge>
      </div>

      {/* Game Board */}
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border-2 border-blue-300">
          <div className="grid grid-cols-8 gap-1">
            {gameData.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleCellMouseUp}
                  disabled={gameState !== "playing"}
                  className={`w-12 h-12 border-2 font-bold text-xl transition-all duration-200 rounded-md shadow-sm ${
                    isCellSelected(rowIndex, colIndex)
                      ? "bg-blue-500 text-white border-blue-600"
                      : isCellInFoundWord(rowIndex, colIndex)
                      ? "bg-green-400 text-white border-green-600"
                      : isCellInHint(rowIndex, colIndex)
                      ? "bg-yellow-400 text-yellow-800 border-yellow-500"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={gameState === "playing" ? { scale: 1.05 } : {}}
                  whileTap={gameState === "playing" ? { scale: 0.95 } : {}}
                >
                  {cell}
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Game Status */}
        <AnimatePresence>
          {gameState === "gameOver" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-center space-y-2"
            >
              <Badge
                variant="destructive"
                className="text-lg px-6 py-3 bg-red-600 text-white"
              >
                ⏰ Time's Up! Score: {score}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panel */}
      <div className="space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        {/* Found Words */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-blue-800">Found Words</h4>
          <div className="flex flex-wrap gap-2">
            {foundWords.map((word, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-green-100 border-green-300 text-green-800"
              >
                {word}
              </Badge>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-800">Controls</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Click or drag to select letters</div>
            <div>Find words of {gameData.minWordLength}+ letters</div>
            <div>Words can be horizontal or vertical</div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex gap-4">
        <Button
          onClick={startNewGame}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
        <Button
          onClick={useHint}
          disabled={hintsUsed >= 3}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
        >
          <Lightbulb className="h-4 w-4" />
          Hint ({3 - hintsUsed} left)
        </Button>
      </div>
    </div>
  );
}
