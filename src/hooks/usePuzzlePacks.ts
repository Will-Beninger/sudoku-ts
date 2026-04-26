import { useState, useEffect } from 'react';
import type { PuzzlePack, Puzzle } from '../models/puzzle';
import { loadAllPacks, getPuzzleById as getPuzzleByIdFromPacks } from '../services/puzzleService';
import { StorageService } from '../services/db';

interface PuzzlePacksState {
  packs: PuzzlePack[];
  isLoading: boolean;
  error: string | null;
  savedPuzzleId: string | null;
  completedPuzzleIds: Set<string>;
}

export function usePuzzlePacks() {
  const [state, setState] = useState<PuzzlePacksState>({
    packs: [],
    isLoading: true,
    error: null,
    savedPuzzleId: null,
    completedPuzzleIds: new Set(),
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [packs, savedPuzzleId] = await Promise.all([
          loadAllPacks(),
          StorageService.getSavedPuzzleId(),
        ]);

        // Gather completed puzzle IDs
        const completedIds = new Set<string>();
        for (const pack of packs) {
          for (const puzzle of pack.puzzles) {
            const completed = await StorageService.isLevelCompleted(puzzle.id);
            if (completed) completedIds.add(puzzle.id);
          }
        }

        if (!cancelled) {
          setState({
            packs,
            isLoading: false,
            error: null,
            savedPuzzleId: savedPuzzleId ?? null,
            completedPuzzleIds: completedIds,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to load puzzles',
          }));
        }
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  const getPuzzleById = (id: string): Puzzle | undefined => {
    return getPuzzleByIdFromPacks(state.packs, id);
  };

  return {
    ...state,
    getPuzzleById,
  };
}
