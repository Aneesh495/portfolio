import { useState, useCallback, useEffect } from "react";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Trophy,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Trash2,
} from "lucide-react";

const WORDS = [
  "APPLE",
  "BRAIN",
  "CHAIR",
  "DREAM",
  "EARTH",
  "FAITH",
  "GRAPE",
  "HEART",
  "INDEX",
  "JOKER",
  "KNIFE",
  "LEMON",
  "MOUSE",
  "NURSE",
  "OCEAN",
  "PIZZA",
  "QUEEN",
  "ROBOT",
  "SHEEP",
  "TIGER",
  "ULTRA",
  "VIRUS",
  "WATER",
  "XENON",
  "YOUTH",
  "ZEBRA",
  "FABLE",
  "FACED",
  "ABOVE",
  "ANGEL",
  "BLAZE",
  "BLEND",
  "BLAST",
  "BREAD",
  "CLOUD",
  "COVER",
  "CRANE",
  "CROWN",
  "DANCE",
  "DELTA",
  "DRIVE",
  "EAGLE",
  "ENJOY",
  "EVENT",
  "FANCY",
  "FORCE",
  "FRUIT",
  "GHOST",
  "GIANT",
  "GLASS",
  "GLOVE",
  "GRASS",
  "HONEY",
  "HUMOR",
  "ICING",
  "IDEAL",
  "IMAGE",
  "JUICE",
  "KARMA",
  "LASER",
  "LIGHT",
  "MAGIC",
  "METAL",
  "MOVIE",
  "MUSIC",
  "NIGHT",
  "NOVEL",
  "OPERA",
  "PAINT",
  "PEARL",
  "PLANT",
  "PLANE",
  "POWER",
  "QUILT",
  "RADIO",
  "RIVER",
  "ROCKY",
  "SALAD",
  "SHINE",
  "SHOCK",
  "SMILE",
  "SOLAR",
  "SPACE",
  "STAGE",
  "STORM",
  "STYLE",
  "SUGAR",
  "SWEET",
  "SWIFT",
  "TABLE",
  "THEME",
  "THINK",
  "THREE",
  "TRAIL",
  "TRAIN",
  "TREND",
  "UNITY",
  "VENOM",
  "VOICE",
  "WAVES",
  "WHEEL",
  "WINDY",
  "WORLD",
  "YACHT",
  "YEAST",
  "ZONED",
  "TREES",
  "CATCH",
  "LEARN",
  "GUESS",
  "SCORE",
  "SHARE",
  "CRAFT",
  "QUICK",
  "AGILE",
  "CHESS",
  "CRISP",
  "CRUSH",
  "BLANK",
  "DIZZY",
  "FLAME",
  "GRILL",
  "HATCH",
  "MAJOR",
  "MINOR",
  "NOISE",
  "PATCH",
  "RANCH",
  "SCARY",
  "SHARP",
  "SLEEP",
  "SPARK",
  "THORN",
  "TWIST",
  "VAULT",
  "WORST",
  "YUMMY",
  "ZAPPY",
];


const VALID_WORDS = WORDS;

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES = {
  easy: { label: "Easy", maxGuesses: 8 },
  medium: { label: "Medium", maxGuesses: 6 },
  hard: { label: "Hard", maxGuesses: 5 },
};

export default function WordGuess() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentWord, setCurrentWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>(["", "", "", "", "", ""]);
  const [feedbacks, setFeedbacks] = useState<
    Array<Array<"correct" | "present" | "absent">>
  >([]);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [targetWord, setTargetWord] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    currentStreak: 0,
    maxStreak: 0,
    gamesPlayed: 0,
    guessDistribution: {} as Record<number, number>,
  });
  const [keyboardColors, setKeyboardColors] = useState<Record<string, string>>(
    {}
  );

  const getRandomWord = useCallback(() => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }, []);

  const getFeedback = useCallback((guess: string, target: string) => {
    const feedback: Array<"correct" | "present" | "absent"> = [];
    const targetLetters = target.split("");
    const guessLetters = guess.split("");

    // First pass: mark correct letters
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        feedback[i] = "correct";
        targetLetters[i] = ""; // Mark as used
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
      if (feedback[i] !== "correct") {
        const targetIndex = targetLetters.indexOf(guessLetters[i]);
        if (targetIndex !== -1) {
          feedback[i] = "present";
          targetLetters[targetIndex] = ""; // Mark as used
        } else {
          feedback[i] = "absent";
        }
      }
    }

    return feedback;
  }, []);

  const initializeGame = useCallback(() => {
    const word = getRandomWord();
    setCurrentWord(word);
    setTargetWord(word);
    setGuesses(["", "", "", "", "", ""]);
    setFeedbacks([]);
    setGameState("playing");
    setCurrentRow(0);
    setError("");
    setKeyboardColors({});
  }, [getRandomWord]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleInput = useCallback(
    (letter: string) => {
      if (currentRow >= 6) return;
      setGuesses((prev) => {
        const newGuesses = [...prev];
        if (newGuesses[currentRow].length < 5) {
          newGuesses[currentRow] += letter;
        }
        return newGuesses;
      });
    },
    [currentRow]
  );

  const handleDelete = useCallback(() => {
    setGuesses((prev) => {
      const newGuesses = [...prev];
      if (newGuesses[currentRow].length > 0) {
        newGuesses[currentRow] = newGuesses[currentRow].slice(0, -1);
      }
      return newGuesses;
    });
  }, [currentRow]);

  const handleSubmit = useCallback(() => {
    if (guesses[currentRow].length !== 5) return;
    const guess = guesses[currentRow].toUpperCase();

    // Allow all 5-letter guesses, don't validate against word list
    const feedback = getFeedback(guess, targetWord);
    setFeedbacks((prev) => [...prev, feedback]);

    const newKeyboardColors = { ...keyboardColors };
    guess.split("").forEach((letter, index) => {
      const color = feedback[index];
      const key = letter.toUpperCase();
      if (color === "correct") {
        newKeyboardColors[key] = "correct";
      } else if (color === "present" && newKeyboardColors[key] !== "correct") {
        newKeyboardColors[key] = "present";
      } else if (
        color === "absent" &&
        newKeyboardColors[key] !== "correct" &&
        newKeyboardColors[key] !== "present"
      ) {
        newKeyboardColors[key] = "absent";
      }
    });
    setKeyboardColors(newKeyboardColors);

    if (guess === targetWord) {
      setGameState("won");
      setStats((prev) => ({
        ...prev,
        wins: prev.wins + 1,
        currentStreak: prev.currentStreak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.currentStreak + 1),
        gamesPlayed: prev.gamesPlayed + 1,
        guessDistribution: {
          ...prev.guessDistribution,
          [currentRow + 1]: (prev.guessDistribution[currentRow + 1] || 0) + 1,
        },
      }));
    } else if (currentRow === 5) {
      setGameState("lost");
      setStats((prev) => ({
        ...prev,
        losses: prev.losses + 1,
        currentStreak: 0,
        gamesPlayed: prev.gamesPlayed + 1,
      }));
    } else {
      setCurrentRow((prev) => prev + 1);
    }
  }, [guesses, currentRow, targetWord, keyboardColors, getFeedback]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;
      if (key === "ENTER") {
        handleSubmit();
      } else if (key === "BACKSPACE") {
        handleDelete();
      } else if (key.length === 1 && key.match(/[A-Z]/)) {
        handleInput(key);
      }
    },
    [gameState, handleSubmit, handleDelete, handleInput]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event.key.toUpperCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const getKeyColor = (key: string) => {
    const color = keyboardColors[key];
    switch (color) {
      case "correct":
        return "bg-green-500 text-white border-green-600";
      case "present":
        return "bg-yellow-500 text-white border-yellow-600";
      case "absent":
        return "bg-gray-500 text-white border-gray-600";
      default:
        return "bg-white text-gray-800 border-gray-300 hover:bg-gray-50";
    }
  };

  const startNewGame = useCallback(() => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "Word Guess"
    });
    initializeGame();
  }, [initializeGame]);

  const resetStats = useCallback(() => {
    logEvent({
      action: "reset_stats",
      category: "Game",
      label: "Word Guess"
    });
    setStats({
      wins: 0,
      losses: 0,
      currentStreak: 0,
      maxStreak: 0,
      gamesPlayed: 0,
      guessDistribution: {},
    });
  }, []);

  const resetGame = useCallback(() => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "Word Guess"
    });
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Word Guess
        </h3>
        <p className="text-muted-foreground">
          Guess the 5-letter word in 6 tries!
        </p>
      </div>

      {/* Game Grid */}
      <div className="space-y-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {Array.from({ length: 5 }, (_, colIndex) => {
              const letter = guess[colIndex] || "";
              const feedback = feedbacks[rowIndex]?.[colIndex];

              let bgColor = "bg-white";
              let textColor = "text-gray-800";
              let borderColor = "border-gray-300";

              if (feedback) {
                switch (feedback) {
                  case "correct":
                    bgColor = "bg-green-500";
                    textColor = "text-white";
                    borderColor = "border-green-600";
                    break;
                  case "present":
                    bgColor = "bg-yellow-500";
                    textColor = "text-white";
                    borderColor = "border-yellow-600";
                    break;
                  case "absent":
                    bgColor = "bg-gray-500";
                    textColor = "text-white";
                    borderColor = "border-gray-600";
                    break;
                }
              }

              return (
                <motion.div
                  key={colIndex}
                  className={`w-12 h-12 border-2 flex items-center justify-center text-2xl font-bold ${bgColor} ${textColor} ${borderColor} rounded-md shadow-sm`}
                  initial={feedback ? { scale: 0 } : false}
                  animate={feedback ? { scale: 1 } : false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: colIndex * 0.1,
                  }}
                >
                  {letter.toUpperCase()}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm font-medium"
        >
          {error}
        </motion.div>
      )}

      {/* Game Status */}
      <AnimatePresence>
        {gameState === "won" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-center space-y-2"
          >
            <Badge
              variant="default"
              className="text-lg px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white"
            >
              🎉 You Won!
            </Badge>
          </motion.div>
        )}
        {gameState === "lost" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-center space-y-2"
          >
            <Badge variant="destructive" className="text-lg px-6 py-3">
              💀 Game Over! The word was: {targetWord.toUpperCase()}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard */}
      <div className="space-y-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => (
              <motion.button
                key={key}
                onClick={() => handleKeyPress(key)}
                disabled={gameState !== "playing"}
                className={`px-3 py-4 text-sm font-bold border-2 rounded-md transition-all duration-200 shadow-sm ${getKeyColor(
                  key
                )}`}
                whileHover={gameState === "playing" ? { scale: 1.05 } : {}}
                whileTap={gameState === "playing" ? { scale: 0.95 } : {}}
              >
                {key}
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800">Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.gamesPlayed}
            </div>
            <div className="text-muted-foreground">Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats.wins / Math.max(stats.gamesPlayed, 1)) * 100)}%
            </div>
            <div className="text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.currentStreak}
            </div>
            <div className="text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.maxStreak}
            </div>
            <div className="text-muted-foreground">Max Streak</div>
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
          onClick={resetStats}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
        >
          <Trash2 className="h-4 w-4" />
          Reset Stats
        </Button>
      </div>
    </div>
  );
}
