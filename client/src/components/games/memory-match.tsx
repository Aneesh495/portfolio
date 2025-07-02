import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Clock, Trophy, RotateCcw, Brain } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard" | "expert";

const DIFFICULTIES = {
  easy: { pairs: 10, gridCols: 5 },
  medium: { pairs: 15, gridCols: 6 },
  hard: { pairs: 20, gridCols: 8 },
  expert: { pairs: 25, gridCols: 10 },
};

const EMOJIS = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
  "🦋",
  "🐛",
  "🐌",
  "🐞",
  "🐜",
  "🦗",
  "🕷️",
  "🕸️",
  "🦂",
  "🐢",
  "🐍",
  "🦎",
  "🦖",
  "🦕",
  "🐙",
  "🦑",
  "🦐",
  "🦞",
  "🦀",
  "🐡",
  "🐠",
  "🐟",
  "🐬",
  "🐳",
];

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryMatch() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [time, setTime] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });

  const config = DIFFICULTIES[difficulty];

  const initializeGame = useCallback(() => {
    const cardCount = config.pairs;
    const selectedEmojis = EMOJIS.slice(0, cardCount);

    // Create pairs of cards
    const newCards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameOver(false);
    setStartTime(Date.now());
    setTime(0);
  }, [config.pairs]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!gameOver && startTime > 0) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameOver, startTime]);

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (
        gameOver ||
        flippedCards.length >= 2 ||
        cards[cardId].isFlipped ||
        cards[cardId].isMatched
      ) {
        return;
      }

      const newCards = [...cards];
      newCards[cardId].isFlipped = true;
      setCards(newCards);

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setMoves((prev) => prev + 1);

        const [firstId, secondId] = newFlippedCards;
        const firstCard = newCards[firstId];
        const secondCard = newCards[secondId];

        if (firstCard.emoji === secondCard.emoji) {
          // Match found
          newCards[firstId].isMatched = true;
          newCards[secondId].isMatched = true;
          setCards(newCards);
          setFlippedCards([]);
          setMatchedPairs((prev) => prev + 1);

          // Check for game completion
          if (matchedPairs + 1 === config.pairs) {
            setGameOver(true);
            setStats((prev) => ({ ...prev, wins: prev.wins + 1 }));
            if (time < highScore || highScore === 0) {
              setHighScore(time);
            }
          }
        } else {
          // No match, flip cards back after delay
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstId || card.id === secondId
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
            setFlippedCards([]);
          }, 1000);
        }
      }
    },
    [cards, flippedCards, gameOver, matchedPairs, config.pairs, time, highScore]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startNewGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const resetStats = useCallback(() => {
    setStats({ wins: 0, losses: 0 });
    setHighScore(0);
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Memory Match
        </h3>
        <p className="text-muted-foreground">Find matching pairs of cards!</p>
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
            <option value="easy">Easy (10 pairs)</option>
            <option value="medium">Medium (15 pairs)</option>
            <option value="hard">Hard (20 pairs)</option>
            <option value="expert">Expert (25 pairs)</option>
          </select>
        </div>

        <Badge
          variant="outline"
          className="flex items-center gap-2 bg-blue-100 border-blue-300 text-blue-800"
        >
          <Clock className="h-4 w-4" />
          {formatTime(time)}
        </Badge>

        <Badge
          variant="secondary"
          className="flex items-center gap-2 bg-green-600 text-white"
        >
          <Brain className="h-4 w-4" />
          Moves: {moves}
        </Badge>

        <Badge
          variant="outline"
          className="flex items-center gap-2 bg-yellow-100 border-yellow-300 text-yellow-800"
        >
          <Trophy className="h-4 w-4" />
          High: {formatTime(highScore)}
        </Badge>
      </div>

      {/* Game Board */}
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg border-2 border-purple-300">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${config.gridCols}, minmax(0, 1fr))`,
            }}
          >
            {cards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={gameOver || card.isMatched}
                className={`w-16 h-16 text-2xl rounded-lg border-2 transition-all duration-200 shadow-sm ${
                  card.isMatched
                    ? "bg-green-500 text-white border-green-600"
                    : card.isFlipped
                    ? "bg-white text-gray-800 border-purple-400"
                    : "bg-purple-400 text-white border-purple-500 hover:bg-purple-500"
                }`}
                whileHover={!gameOver && !card.isMatched ? { scale: 1.05 } : {}}
                whileTap={!gameOver && !card.isMatched ? { scale: 0.95 } : {}}
                initial={card.isFlipped ? { rotateY: 0 } : { rotateY: 180 }}
                animate={card.isFlipped ? { rotateY: 0 } : { rotateY: 180 }}
                transition={{ duration: 0.3 }}
              >
                {card.isFlipped || card.isMatched ? card.emoji : "❓"}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="text-center">
          <Badge
            variant="outline"
            className="text-lg px-4 py-2 bg-green-100 border-green-300 text-green-800"
          >
            Matched: {matchedPairs} / {config.pairs}
          </Badge>
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
                🎉 You Won!
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Panel */}
      <div className="space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        {/* Stats */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-purple-800">Statistics</h4>
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-purple-300 text-purple-800"
            >
              <span>Games Won</span>
              <span>{stats.wins}</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-purple-300 text-purple-800"
            >
              <span>Games Lost</span>
              <span>{stats.losses}</span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 w-full justify-between bg-white border-purple-300 text-purple-800"
            >
              <span>Win Rate</span>
              <span>
                {Math.round(
                  (stats.wins / Math.max(stats.wins + stats.losses, 1)) * 100
                )}
                %
              </span>
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-purple-800">Controls</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Click cards to flip them</div>
            <div>Find matching pairs</div>
            <div>Complete all pairs to win</div>
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
          <Trophy className="h-4 w-4" />
          Reset Stats
        </Button>
      </div>
    </div>
  );
}
