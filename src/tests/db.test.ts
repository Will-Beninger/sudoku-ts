import 'fake-indexeddb/auto'; // Required to polyfill IndexedDB in node/jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { db, StorageService } from '../services/db';
import type { GameState } from '../models/gameState';

describe('StorageService', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await db.savedGames.clear();
    await db.levelProgress.clear();
    await db.stats.clear();
  });

  it('saves and loads a game state properly', async () => {
    const mockState: Omit<GameState, 'id'> = {
      puzzle: {
        id: 'test_puzzle',
        initialBoard: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
        solutionBoard: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
        difficulty: 'easy'
      },
      grid: {
        rows: Array.from({ length: 9 }, () =>
          Array.from({ length: 9 }, () => ({
            value: null,
            isFixed: false,
            isValid: true,
            notes: new Set<number>(),
          }))
        )
      },
      elapsedTimeSeconds: 120,
      lastPlayed: new Date().toISOString()
    };

    await StorageService.saveGame(mockState);
    const loaded = await StorageService.loadGame();
    
    expect(loaded).toBeDefined();
    expect(loaded?.puzzle.id).toBe('test_puzzle');
    expect(loaded?.elapsedTimeSeconds).toBe(120);
    // Sets are properly cloned by indexeddb
    expect(loaded?.grid.rows[0][0].notes).toBeInstanceOf(Set);
  });

  it('updates level progress and stats upon completion', async () => {
    await StorageService.completeLevel('puzzle_1', 5000); // 5 seconds
    
    const isCompleted = await StorageService.isLevelCompleted('puzzle_1');
    expect(isCompleted).toBe(true);

    const bestTime = await StorageService.getBestTime('puzzle_1');
    expect(bestTime).toBe(5000);

    const stats = await StorageService.getStats();
    expect(stats.gamesWon).toBe(1);
    expect(stats.completedCount).toBe(1);

    // Complete again with better time
    await StorageService.completeLevel('puzzle_1', 4000);
    const newBest = await StorageService.getBestTime('puzzle_1');
    expect(newBest).toBe(4000);
    
    // Global wins should increase
    const newStats = await StorageService.getStats();
    expect(newStats.gamesWon).toBe(2);
  });
});
