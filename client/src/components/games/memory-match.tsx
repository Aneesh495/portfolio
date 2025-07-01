import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const CARD_VALUES = ['🎯', '🎮', '🚀', '⭐', '🎨', '🎪', '🎭', '🎸'];

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...CARD_VALUES, ...CARD_VALUES]
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
    if (matches === CARD_VALUES.length) {
      setGameComplete(true);
    }
  }, [matches]);

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

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-lg">
          Moves: <span className="font-bold text-primary">{moves}</span> | 
          Matches: <span className="font-bold text-primary">{matches}/{CARD_VALUES.length}</span>
        </p>
      </div>
      
      {gameComplete && (
        <div className="mb-4">
          <p className="text-lg font-bold text-primary">
            🎉 Congratulations! You won in {moves} moves!
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mb-4">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className={`w-16 h-16 rounded-lg text-xl font-bold transition-colors ${
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
