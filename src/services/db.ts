import Dexie, { Table } from 'dexie';
import { GameState } from '../models/gameState';
import { LevelProgress, AppStats } from '../models/levelProgress';

export class SudokuDatabase extends Dexie {
  savedGames!: Table<GameState, number>;
  levelProgress!: Table<LevelProgress, string>;
  stats!: Table<AppStats, number>;

  constructor() {
    super('SudokuDatabase');
    this.version(1).stores({
      savedGames: '++id, lastPlayed', // id is auto-incremented primary key
      levelProgress: 'puzzleId, completed', // puzzleId is primary key
      stats: 'id', // id is primary key
    });
  }
}

export const db = new SudokuDatabase();

export const StorageService = {
  async saveGame(state: Omit<GameState, 'id'> | GameState): Promise<number> {
    // We only keep the latest saved game in this PoC to mimic Dart behavior,
    // so we can clear and add, or always use id=1. Let's use id=1.
    const stateToSave = { ...state, id: 1 };
    await db.savedGames.put(stateToSave);
    return 1;
  },

  async loadGame(): Promise<GameState | undefined> {
    return await db.savedGames.get(1);
  },

  async deleteSavedGame(): Promise<void> {
    await db.savedGames.delete(1);
  },

  async getSavedPuzzleId(): Promise<string | undefined> {
    const game = await this.loadGame();
    return game?.puzzle.id;
  },

  async isLevelCompleted(puzzleId: string): Promise<boolean> {
    const progress = await db.levelProgress.get(puzzleId);
    return progress?.completed ?? false;
  },

  async getBestTime(puzzleId: string): Promise<number | null> {
    const progress = await db.levelProgress.get(puzzleId);
    return progress?.bestTimeMs ?? null;
  },

  async completeLevel(puzzleId: string, timeTakenMs: number): Promise<void> {
    const progress = await db.levelProgress.get(puzzleId);
    const currentBest = progress?.bestTimeMs;

    const newBest = (currentBest === null || currentBest === undefined || timeTakenMs < currentBest)
      ? timeTakenMs
      : currentBest;

    await db.levelProgress.put({
      puzzleId,
      completed: true,
      bestTimeMs: newBest,
    });

    // Update global stats
    const stats = await db.stats.get(1) ?? { id: 1, gamesWon: 0 };
    stats.gamesWon += 1;
    await db.stats.put(stats);
  },

  async getStats(): Promise<{ gamesWon: number; completedCount: number }> {
    const stats = await db.stats.get(1);
    const completedCount = await db.levelProgress.where('completed').equals('true').count() || 
                           await db.levelProgress.filter(p => p.completed).count();
    return {
      gamesWon: stats?.gamesWon ?? 0,
      completedCount,
    };
  }
};
