import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import TicTacToe from "@/components/games/tic-tac-toe";
import Game2048 from "@/components/games/game-2048";
import Snake from "@/components/games/snake";
import MemoryMatch from "@/components/games/memory-match";
import Minesweeper from "@/components/games/minesweeper";
import RockPaperScissors from "@/components/games/rock-paper-scissors";
import ConnectFour from "@/components/games/connect-four";
import WordGuess from "@/components/games/word-guess";
import Tetris from "@/components/games/tetris";

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic 3x3 grid game",
    icon: "🎯",
    color: "from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    component: TicTacToe,
  },
  {
    id: "2048",
    title: "2048",
    description: "Sliding puzzle game",
    icon: "🔢",
    color: "from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
    component: Game2048,
  },
  {
    id: "snake",
    title: "Snake",
    description: "Classic snake game",
    icon: "🐍",
    color: "from-green-50 to-green-100 dark:from-green-900 dark:to-green-800",
    buttonColor: "bg-green-600 hover:bg-green-700",
    component: Snake,
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Card matching game",
    icon: "🧠",
    color: "from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    component: MemoryMatch,
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    description: "Mine detection puzzle",
    icon: "💣",
    color: "from-red-50 to-red-100 dark:from-red-900 dark:to-red-800",
    buttonColor: "bg-red-600 hover:bg-red-700",
    component: Minesweeper,
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Classic hand game vs AI",
    icon: "✂️",
    color: "from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    component: RockPaperScissors,
  },
  {
    id: "connect-four",
    title: "Connect Four",
    description: "Strategic 4-in-a-row game with AI",
    icon: "🔴",
    color: "from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    component: ConnectFour,
  },
  {
    id: "word-guess",
    title: "Word Guess",
    description: "Programming word guessing game",
    icon: "🔤",
    color: "from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800",
    buttonColor: "bg-pink-600 hover:bg-pink-700",
    component: WordGuess,
  },
  {
    id: "tetris",
    title: "Tetris",
    description: "Classic falling blocks puzzle",
    icon: "🧩",
    color: "from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
    component: Tetris,
  },
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const currentGame = games.find(game => game.id === selectedGame);

  return (
    <section id="games" className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="inline-block"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Interactive Game Arcade 🎮
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A collection of engaging games featuring AI opponents, smooth animations, 
            and competitive gameplay built with React and TypeScript
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="game-card cursor-pointer"
              onClick={() => setSelectedGame(game.id)}
            >
              <Card className={`bg-gradient-to-br ${game.color} shadow-lg`}>
                <CardContent className="p-6 text-center">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-4">{game.icon}</div>
                    <h3 className="text-xl font-semibold">{game.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {game.description}
                    </p>
                  </div>
                  <Button
                    className={`${game.buttonColor} text-white transition-colors`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGame(game.id);
                    }}
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {currentGame?.title}
            </DialogTitle>
            <DialogDescription>
              {currentGame?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {currentGame && <currentGame.component />}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
