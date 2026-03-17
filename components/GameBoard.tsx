"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Key, Pickaxe, Footprints, FileText, Lock, ShieldAlert } from 'lucide-react';

type TileType = 'key' | 'pick' | 'foot' | 'file' | 'lock' | 'siren';

interface Tile {
  id: string;
  type: TileType;
}

const TILE_TYPES: TileType[] = ['key', 'pick', 'foot', 'file', 'lock', 'siren'];
const GRID_SIZE = 7;

const ICONS: Record<TileType, any> = {
  key: { icon: Key, color: 'text-yellow-400' },
  pick: { icon: Pickaxe, color: 'text-stone-400' },
  foot: { icon: Footprints, color: 'text-green-400' },
  file: { icon: FileText, color: 'text-blue-300' },
  lock: { icon: Lock, color: 'text-orange-500' },
  siren: { icon: ShieldAlert, color: 'text-red-500' },
};

export default function GameBoard() {
  const [board, setBoard] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(25);

  const createBoard = useCallback(() => {
    const newBoard: Tile[] = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const randomType = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
      newBoard.push({ id: Math.random().toString(36).substr(2, 9), type: randomType });
    }
    setBoard(newBoard);
  }, []);

  useEffect(() => {
    createBoard();
  }, [createBoard]);

  const checkMatches = useCallback((currentBoard: Tile[]) => {
    const toClear = new Set<number>();

    // Horizontal
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const idx = row * GRID_SIZE + col;
        if (currentBoard[idx].type === currentBoard[idx+1].type && currentBoard[idx].type === currentBoard[idx+2].type) {
          toClear.add(idx); toClear.add(idx+1); toClear.add(idx+2);
        }
      }
    }

    // Vertical
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
        const idx = row * GRID_SIZE + col;
        const idx2 = (row + 1) * GRID_SIZE + col;
        const idx3 = (row + 2) * GRID_SIZE + col;
        if (currentBoard[idx].type === currentBoard[idx2].type && currentBoard[idx].type === currentBoard[idx3].type) {
          toClear.add(idx); toClear.add(idx2); toClear.add(idx3);
        }
      }
    }

    return Array.from(toClear);
  }, []);

  const handleTileClick = (index: number) => {
    if (selected === null) {
      setSelected(index);
      return;
    }

    const isAdjacent = 
      Math.abs(selected - index) === 1 && Math.floor(selected / GRID_SIZE) === Math.floor(index / GRID_SIZE) ||
      Math.abs(selected - index) === GRID_SIZE;

    if (isAdjacent) {
      const newBoard = [...board];
      const temp = newBoard[selected];
      newBoard[selected] = newBoard[index];
      newBoard[index] = temp;

      const matches = checkMatches(newBoard);
      if (matches.length > 0) {
        processMatches(newBoard, matches);
        setMoves(m => m - 1);
      } else {
        // Shake animation or sound effect could go here
      }
    }
    setSelected(null);
  };

  const processMatches = (currentBoard: Tile[], matches: number[]) => {
    let updatedBoard = [...currentBoard];
    setScore(s => s + matches.length * 10);

    // Remove matches (set to null temporarily)
    matches.forEach(idx => {
      updatedBoard[idx] = { id: 'empty', type: 'key' }; // Placeholder
    });

    // Refill
    updatedBoard = updatedBoard.map(tile => 
      tile.id === 'empty' 
        ? { id: Math.random().toString(36).substr(2, 9), type: TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)] } 
        : tile
    );

    setBoard(updatedBoard);

    // Recursive check for cascades
    setTimeout(() => {
      const newMatches = checkMatches(updatedBoard);
      if (newMatches.length > 0) processMatches(updatedBoard, newMatches);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-10 font-mono text-xl bg-stone-900 p-4 rounded-lg border border-stone-800 shadow-xl">
        <div>SCORE: <span className="text-red-500">{score.toString().padStart(6, '0')}</span></div>
        <div>MOVES: <span className="text-yellow-500">{moves}</span></div>
      </div>

      <div 
        className="grid gap-1 p-2 bg-stone-800 rounded-md shadow-2xl"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {board.map((tile, i) => {
          const IconData = ICONS[tile.type];
          const Icon = IconData.icon;
          return (
            <motion.div
              key={tile.id}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleTileClick(i)}
              className={`
                w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer rounded
                ${selected === i ? 'ring-4 ring-red-500 bg-stone-700' : 'bg-stone-900 hover:bg-stone-800'}
                transition-colors duration-200 border border-stone-700/50
              `}
            >
              <Icon className={`${IconData.color} w-8 h-8`} strokeWidth={1.5} />
            </motion.div>
          );
        })}
      </div>

      <button 
        onClick={() => { createBoard(); setScore(0); setMoves(25); }}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 font-bold uppercase tracking-widest rounded transition-all active:scale-95"
      >
        Reset Prison Break
      </button>
    </div>
  );
}