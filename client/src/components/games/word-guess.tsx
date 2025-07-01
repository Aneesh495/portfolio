import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";

const WORDS = [
  'REACT', 'TYPESCRIPT', 'JAVASCRIPT', 'PYTHON', 'COMPUTER', 'ALGORITHM', 
  'DATABASE', 'FRONTEND', 'BACKEND', 'CODING', 'DEVELOPER', 'FRAMEWORK',
  'VARIABLE', 'FUNCTION', 'OBJECT', 'ARRAY', 'STRING', 'BOOLEAN',
  'GITHUB', 'NODEJS', 'EXPRESS', 'MONGODB', 'MYSQL', 'DOCKER'
];

const DIFFICULTIES = {
  easy: { maxGuesses: 8, label: 'Easy', color: 'bg-green-500' },
  medium: { maxGuesses: 6, label: 'Medium', color: 'bg-yellow-500' },
  hard: { maxGuesses: 4, label: 'Hard', color: 'bg-red-500' },
};

type Difficulty = keyof typeof DIFFICULTIES;
type LetterState = 'correct' | 'wrong-position' | 'not-in-word' | 'unused';

export default function WordGuess() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentWord, setCurrentWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  const [showHint, setShowHint] = useState(false);
  const [scores, setScores] = useState({ wins: 0, losses: 0 });

  const getRandomWord = useCallback(() => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }, []);

  const initializeGame = useCallback(() => {
    const word = getRandomWord();
    setCurrentWord(word);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setLetterStates({});
    setShowHint(false);
  }, [getRandomWord]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame, difficulty]);

  const getLetterState = useCallback((letter: string, position: number, word: string): LetterState => {
    if (word[position] === letter) return 'correct';
    if (word.includes(letter)) return 'wrong-position';
    return 'not-in-word';
  }, []);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== currentWord.length || gameOver) return;

    const newGuesses = [...guesses, currentGuess.toUpperCase()];
    setGuesses(newGuesses);

    // Update letter states
    const newLetterStates = { ...letterStates };
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i].toUpperCase();
      const state = getLetterState(letter, i, currentWord);
      
      // Only update if we don't have a better state already
      if (!newLetterStates[letter] || 
          (newLetterStates[letter] !== 'correct' && state === 'correct') ||
          (newLetterStates[letter] === 'not-in-word' && state === 'wrong-position')) {
        newLetterStates[letter] = state;
      }
    }
    setLetterStates(newLetterStates);

    // Check win condition
    if (currentGuess.toUpperCase() === currentWord) {
      setWon(true);
      setGameOver(true);
      setScores(prev => ({ ...prev, wins: prev.wins + 1 }));
    } else if (newGuesses.length >= DIFFICULTIES[difficulty].maxGuesses) {
      setGameOver(true);
      setScores(prev => ({ ...prev, losses: prev.losses + 1 }));
    }

    setCurrentGuess('');
  }, [currentGuess, currentWord, guesses, gameOver, letterStates, getLetterState, difficulty]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (gameOver) return;
    
    if (e.key === 'Enter') {
      submitGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < currentWord.length) {
      setCurrentGuess(prev => prev + e.key.toUpperCase());
    }
  }, [submitGuess, currentGuess, currentWord.length, gameOver]);

  const getLetterClass = useCallback((letter: string, position: number, guess: string) => {
    const state = getLetterState(letter, position, currentWord);
    switch (state) {
      case 'correct': return 'bg-green-500 text-white border-green-500';
      case 'wrong-position': return 'bg-yellow-500 text-white border-yellow-500';
      case 'not-in-word': return 'bg-gray-500 text-white border-gray-500';
      default: return 'bg-white border-gray-300';
    }
  }, [getLetterState, currentWord]);

  const getKeyboardLetterClass = useCallback((letter: string) => {
    const state = letterStates[letter] || 'unused';
    switch (state) {
      case 'correct': return 'bg-green-500 text-white';
      case 'wrong-position': return 'bg-yellow-500 text-white';
      case 'not-in-word': return 'bg-gray-500 text-white';
      default: return 'bg-gray-200 hover:bg-gray-300';
    }
  }, [letterStates]);

  const getHint = useCallback(() => {
    const hints: Record<string, string> = {
      'REACT': 'Popular JavaScript library for building user interfaces',
      'TYPESCRIPT': 'Superset of JavaScript with static typing',
      'JAVASCRIPT': 'Programming language that runs in browsers',
      'PYTHON': 'High-level programming language known for simplicity',
      'COMPUTER': 'Electronic device for processing data',
      'ALGORITHM': 'Step-by-step procedure for solving problems',
      'DATABASE': 'Organized collection of structured information',
      'FRONTEND': 'User-facing part of a web application',
      'BACKEND': 'Server-side part of a web application',
      'CODING': 'Process of creating computer programs',
      'DEVELOPER': 'Person who creates software applications',
      'FRAMEWORK': 'Pre-written code structure for development'
    };
    return hints[currentWord] || 'A programming-related term';
  }, [currentWord]);

  const keyboard = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Word Guess</h3>
        <p className="text-muted-foreground">Guess the programming word!</p>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2">
        {Object.entries(DIFFICULTIES).map(([key, config]) => (
          <Button
            key={key}
            variant={difficulty === key ? 'default' : 'outline'}
            onClick={() => setDifficulty(key as Difficulty)}
            size="sm"
          >
            {config.label} ({config.maxGuesses} guesses)
          </Button>
        ))}
      </div>

      {/* Scores */}
      <div className="flex gap-4 items-center">
        <Badge variant="secondary" className="flex items-center gap-2">
          <Trophy className="h-3 w-3" />
          Wins: {scores.wins}
        </Badge>
        <Badge variant="outline">Losses: {scores.losses}</Badge>
      </div>

      {/* Game Status */}
      <div className="text-center">
        {gameOver ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="space-y-2"
          >
            <Badge variant={won ? 'default' : 'destructive'} className="text-lg px-4 py-2">
              {won ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  You Won!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Game Over
                </span>
              )}
            </Badge>
            {!won && (
              <p className="text-sm text-muted-foreground">
                The word was: <span className="font-mono font-bold">{currentWord}</span>
              </p>
            )}
          </motion.div>
        ) : (
          <div className="space-y-2">
            <p className="text-lg">
              Guesses remaining: <span className="font-bold">{DIFFICULTIES[difficulty].maxGuesses - guesses.length}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            <AnimatePresence>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-muted-foreground italic"
                >
                  💡 {getHint()}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="space-y-2">
        {/* Previous guesses */}
        {guesses.map((guess, guessIndex) => (
          <motion.div
            key={guessIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            {Array.from({ length: currentWord.length }, (_, i) => (
              <div
                key={i}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center font-bold text-lg ${
                  getLetterClass(guess[i], i, guess)
                }`}
              >
                {guess[i]}
              </div>
            ))}
          </motion.div>
        ))}

        {/* Current guess */}
        {!gameOver && (
          <div className="flex gap-2">
            {Array.from({ length: currentWord.length }, (_, i) => (
              <div
                key={i}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center font-bold text-lg bg-white"
              >
                {currentGuess[i] || ''}
              </div>
            ))}
          </div>
        )}

        {/* Remaining slots */}
        {Array.from({ length: Math.max(0, DIFFICULTIES[difficulty].maxGuesses - guesses.length - (gameOver ? 0 : 1)) }, (_, i) => (
          <div key={`empty-${i}`} className="flex gap-2">
            {Array.from({ length: currentWord.length }, (_, j) => (
              <div
                key={j}
                className="w-12 h-12 border-2 border-gray-200 rounded-lg bg-gray-50"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Input */}
      {!gameOver && (
        <div className="space-y-4">
          <Input
            value={currentGuess}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().slice(0, currentWord.length);
              if (/^[A-Z]*$/.test(value)) {
                setCurrentGuess(value);
              }
            }}
            onKeyDown={handleKeyPress}
            placeholder={`Enter ${currentWord.length}-letter word`}
            className="text-center font-mono text-lg"
            maxLength={currentWord.length}
          />
          <Button 
            onClick={submitGuess} 
            disabled={currentGuess.length !== currentWord.length}
            className="w-full"
          >
            Submit Guess
          </Button>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 justify-center max-w-md">
          {keyboard.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                if (!gameOver && currentGuess.length < currentWord.length) {
                  setCurrentGuess(prev => prev + letter);
                }
              }}
              className={`w-8 h-8 rounded text-sm font-bold transition-colors ${getKeyboardLetterClass(letter)}`}
              disabled={gameOver}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button onClick={initializeGame} variant="outline" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </div>
    </div>
  );
}