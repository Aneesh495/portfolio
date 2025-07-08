import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  X,
  Gamepad2,
  Sparkles,
  Zap,
  Target,
  Brain,
  Bomb,
  Scissors,
  Circle,
  Type,
  Puzzle,
  Crown,
  Ship,
  Search,
  Grid3X3,
  FileText,
  Search as SearchIcon,
  Hash,
  Move,
  HelpCircle,
} from "lucide-react";
import TicTacToe from "@/components/games/tic-tac-toe";
import Game2048 from "@/components/games/game-2048";
import Snake from "@/components/games/snake";
import MemoryMatch from "@/components/games/memory-match";
import Minesweeper from "@/components/games/minesweeper";
import RockPaperScissors from "@/components/games/rock-paper-scissors";
import ConnectFour from "@/components/games/connect-four";
import WordGuess from "@/components/games/word-guess";
import Tetris from "@/components/games/tetris";
import Chess from "@/components/games/chess";
import Battleship from "@/components/games/battleship";
import WordHunt from "@/components/games/word-hunt";

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    tagline: "Strategic Showdown",
    description: "Classic 3x3 grid game with AI opponent",
    icon: Hash,
    color: "from-blue-500 to-purple-600",
    component: TicTacToe,
  },
  {
    id: "2048",
    title: "2048",
    tagline: "Slide to Victory",
    description: "Addictive sliding puzzle game",
    icon: Target,
    color: "from-orange-500 to-red-600",
    component: Game2048,
  },
  {
    id: "snake",
    title: "Snake",
    tagline: "Slither & Survive",
    description: "Classic snake game with multiple modes",
    icon: Move,
    color: "from-green-500 to-emerald-600",
    component: Snake,
  },
  {
    id: "memory-match",
    title: "Memory Match",
    tagline: "Train Your Brain",
    description: "Card matching game to test memory",
    icon: Brain,
    color: "from-purple-500 to-violet-600",
    component: MemoryMatch,
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    tagline: "Navigate the Danger",
    description: "Mine detection puzzle game",
    icon: Bomb,
    color: "from-red-500 to-rose-600",
    component: Minesweeper,
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    tagline: "Beat the AI",
    description: "Classic hand game vs AI opponent",
    icon: Scissors,
    color: "from-indigo-500 to-blue-600",
    component: RockPaperScissors,
  },
  {
    id: "connect-four",
    title: "Connect Four",
    tagline: "Four in a Row",
    description: "Strategic 4-in-a-row game with AI",
    icon: Grid3X3,
    color: "from-yellow-500 to-amber-600",
    component: ConnectFour,
  },
  {
    id: "word-guess",
    title: "Word Guess",
    tagline: "Code Your Way",
    description: "Programming word guessing game",
    icon: HelpCircle,
    color: "from-pink-500 to-rose-600",
    component: WordGuess,
  },
  {
    id: "tetris",
    title: "Tetris",
    tagline: "Stack & Clear",
    description: "Classic falling blocks puzzle",
    icon: Puzzle,
    color: "from-teal-500 to-cyan-600",
    component: Tetris,
  },
  {
    id: "chess",
    title: "Chess",
    tagline: "Master the Board",
    description: "Strategic board game with AI",
    icon: Crown,
    color: "from-amber-500 to-yellow-600",
    component: Chess,
  },
  {
    id: "battleship",
    title: "Battleship",
    tagline: "Naval Warfare",
    description: "Naval warfare game with smart AI",
    icon: Ship,
    color: "from-cyan-500 to-blue-600",
    component: Battleship,
  },
  {
    id: "word-hunt",
    title: "Word Hunt",
    tagline: "Find the Hidden",
    description: "Find hidden words in the grid",
    icon: SearchIcon,
    color: "from-emerald-500 to-green-600",
    component: WordHunt,
  },
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const currentGame = games.find((game) => game.id === selectedGame);

  return (
    <section id="games" className="py-20 bg-muted/50">
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
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Gamepad2 className="h-8 w-8 text-primary" strokeWidth={2} />
              </motion.div>
              Interactive Games
              <motion.div
                animate={{
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="text-3xl"
              >
                🎮
              </motion.div>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A collection of engaging games featuring AI opponents, smooth
            animations, and competitive gameplay built with React and TypeScript
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="game-card"
              onClick={() => setSelectedGame(game.id)}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  {/* Game Icon */}
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${game.color} shadow-md`}
                    >
                      <game.icon
                        className="h-6 w-6 text-white"
                        strokeWidth={2}
                      />
                    </div>
                  </motion.div>

                  {/* Game Title */}
                  <motion.h3
                    className="text-xl font-semibold mb-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {game.title}
                  </motion.h3>

                  {/* Tagline */}
                  <p className="text-sm font-medium text-primary mb-2 tracking-wide">
                    {game.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Play Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`w-full bg-gradient-to-r ${game.color} text-white font-medium shadow-md hover:shadow-lg transition-all duration-300`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGame(game.id);
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="mr-2"
                      >
                        <Gamepad2 className="h-4 w-4" strokeWidth={2} />
                      </motion.div>
                      Play Now
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {currentGame?.title}
            </DialogTitle>
            <DialogDescription>{currentGame?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">{currentGame && <currentGame.component />}</div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
