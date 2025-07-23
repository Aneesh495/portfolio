import { useState } from "react";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Choice = 'rock' | 'paper' | 'scissors';

const choices: { value: Choice; emoji: string; label: string }[] = [
  { value: 'rock', emoji: '🪨', label: 'Rock' },
  { value: 'paper', emoji: '📄', label: 'Paper' },
  { value: 'scissors', emoji: '✂️', label: 'Scissors' },
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const getWinner = (player: Choice, ai: Choice): 'player' | 'ai' | 'tie' => {
    if (player === ai) return 'tie';
    
    if (
      (player === 'rock' && ai === 'scissors') ||
      (player === 'paper' && ai === 'rock') ||
      (player === 'scissors' && ai === 'paper')
    ) {
      return 'player';
    }
    
    return 'ai';
  };

  const playGame = (choice: Choice) => {
    logEvent({
      action: "start_game",
      category: "Game",
      label: "Rock Paper Scissors"
    });
    if (isPlaying) return;
    
    setIsPlaying(true);
    setPlayerChoice(choice);
    
    // Simulate AI thinking with animation
    setTimeout(() => {
      const aiChoice = choices[Math.floor(Math.random() * choices.length)].value;
      setAiChoice(aiChoice);
      
      const winner = getWinner(choice, aiChoice);
      
      if (winner === 'player') {
        setResult(`You win! ${choice} beats ${aiChoice}`);
        setPlayerScore(prev => prev + 1);
      } else if (winner === 'ai') {
        setResult(`AI wins! ${aiChoice} beats ${choice}`);
        setAiScore(prev => prev + 1);
      } else {
        setResult(`It's a tie! Both chose ${choice}`);
      }
      
      setIsPlaying(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult('');
    setPlayerScore(0);
    setAiScore(0);
    setIsPlaying(false);
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <p className="text-lg mb-4">Choose your weapon:</p>
        <div className="flex justify-center space-x-4 mb-6">
          {choices.map((choice) => (
            <motion.button
              key={choice.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playGame(choice.value)}
              disabled={isPlaying}
              className="bg-muted hover:bg-accent p-4 rounded-lg transition-colors disabled:opacity-50"
            >
              <div className="text-3xl mb-2">{choice.emoji}</div>
              <p className="text-sm font-medium">{choice.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {(playerChoice || aiChoice) && (
        <div className="mb-6">
          <div className="flex justify-center items-center space-x-8 mb-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">You</p>
              <div className="text-4xl">
                {playerChoice ? choices.find(c => c.value === playerChoice)?.emoji : '🤔'}
              </div>
            </div>
            
            <div className="text-2xl">VS</div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">AI</p>
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                className="text-4xl"
              >
                {isPlaying ? '🤖' : aiChoice ? choices.find(c => c.value === aiChoice)?.emoji : '🤔'}
              </motion.div>
            </div>
          </div>
          
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <p className="text-lg font-bold">{result}</p>
            </motion.div>
          )}
        </div>
      )}

      <div className="mb-6">
        <p className="text-lg">
          Score - You: <span className="font-bold text-primary">{playerScore}</span> | 
          AI: <span className="font-bold text-destructive">{aiScore}</span>
        </p>
      </div>

      <Button onClick={resetGame} variant="outline">
        Reset Game
      </Button>
    </div>
  );
}
