import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const CARD_VALUES = ['🎯', '🎮', '🚀', '⭐', '🎨', '🎪', '🎭', '🎸', '🎵', '🎨', '🎲', '🎊', '🎈', '🎁', '🎤', '🎧', '🎷', '🎺'];

const DIFFICULTY_MODES = {
  easy: { size: 4, pairs: 8, label: '4x4 (Easy)' },
  medium: { size: 5, pairs: 12, label: '5x5 (Medium)' },
  hard: { size: 6, pairs: 18, label: '6x6 (Hard)' },
  expert: { size: 7, pairs: 24, label: '7x7 (Expert)' },
};

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY_MODES>('easy');

  const initializeGame = () => {
    const currentMode = DIFFICULTY_MODES[difficulty];
    const selectedValues = CARD_VALUES.slice(0, currentMode.pairs);
    const shuffledCards = [...selectedValues, ...selectedValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const currentMode = DIFFICULTY_MODES[difficulty];
    if (matches === currentMode.pairs) {
      setGameComplete(true);
    }
  }, [matches, difficulty]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards(prev => [...prev, cardId]);
  };

  const currentMode = DIFFICULTY_MODES[difficulty];

  return (
    <div className="text-center">
      {/* Difficulty Selection */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Difficulty:</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {Object.entries(DIFFICULTY_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => {
                setDifficulty(key as keyof typeof DIFFICULTY_MODES);
                setTimeout(initializeGame, 0);
              }}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                difficulty === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg">
          Moves: <span className="font-bold text-primary">{moves}</span> | 
          Matches: <span className="font-bold text-primary">{matches}/{currentMode.pairs}</span>
        </p>
      </div>
      
      {gameComplete && (
        <div className="mb-4">
          <p className="text-lg font-bold text-primary">
            🎉 Congratulations! You won in {moves} moves!
          </p>
        </div>
      )}
      
      <div 
        className={`grid gap-2 mx-auto mb-4 ${
          currentMode.size === 4 ? 'grid-cols-4 max-w-sm' :
          currentMode.size === 5 ? 'grid-cols-5 max-w-md' :
          currentMode.size === 6 ? 'grid-cols-6 max-w-lg' :
          'grid-cols-7 max-w-xl'
        }`}
      >
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className={`${
              currentMode.size === 7 ? 'w-12 h-12 text-lg' : 'w-16 h-16 text-xl'
            } rounded-lg font-bold transition-colors ${
              card.isFlipped || card.isMatched
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-accent'
            }`}
            disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
          >
            {card.isFlipped || card.isMatched ? card.value : '?'}
          </motion.button>
        ))}
      </div>
      
      <Button onClick={initializeGame} variant="outline">
        New Game
      </Button>
    </div>
  );
}
