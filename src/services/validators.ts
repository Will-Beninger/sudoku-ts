import type { GameState } from '../models/gameState';
import type { Puzzle } from '../models/puzzle';
import type { SudokuGrid } from '../models/grid';
import type { SudokuCell } from '../models/cell';

const VALID_DIFFICULTIES = new Set(['beginner', 'easy', 'medium', 'hard', 'expert']);
const BOARD_LENGTH = 81;
const GRID_SIZE = 9;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isValidBoardString(value: unknown): value is string {
  return isString(value) && value.length === BOARD_LENGTH && /^[0-9]+$/.test(value);
}

export function validatePuzzle(data: unknown): Puzzle | null {
  if (!isRecord(data)) return null;
  if (!isString(data.id) || data.id.length === 0) return null;
  if (!isString(data.difficulty) || !VALID_DIFFICULTIES.has(data.difficulty)) return null;
  if (!isValidBoardString(data.initialBoard)) return null;
  if (!isValidBoardString(data.solutionBoard)) return null;

  return {
    id: data.id,
    difficulty: data.difficulty as Puzzle['difficulty'],
    initialBoard: data.initialBoard,
    solutionBoard: data.solutionBoard,
  };
}

function isValidCell(value: unknown): value is SudokuCell {
  if (!isRecord(value)) return false;
  if (value.value !== null && !isNumber(value.value)) return false;
  if (typeof value.isFixed !== 'boolean') return false;
  if (typeof value.isValid !== 'boolean') return false;
  if (!(value.notes instanceof Set)) return false;
  return true;
}

function isValidGrid(value: unknown): value is SudokuGrid {
  if (!isRecord(value)) return false;
  if (!Array.isArray(value.rows)) return false;
  if (value.rows.length !== GRID_SIZE) return false;

  for (const row of value.rows) {
    if (!Array.isArray(row) || row.length !== GRID_SIZE) return false;
    for (const cell of row) {
      if (!isValidCell(cell)) return false;
    }
  }
  return true;
}

export function validateGameState(data: unknown): GameState | null {
  if (!isRecord(data)) return null;

  const puzzle = validatePuzzle(data.puzzle);
  if (!puzzle) return null;

  if (!isValidGrid(data.grid)) return null;
  if (!isNumber(data.elapsedTimeSeconds) || data.elapsedTimeSeconds < 0) return null;
  if (!isString(data.lastPlayed)) return null;

  const result: GameState = {
    puzzle,
    grid: data.grid,
    elapsedTimeSeconds: data.elapsedTimeSeconds,
    lastPlayed: data.lastPlayed,
  };

  if (data.id !== undefined) {
    if (!isNumber(data.id)) return null;
    result.id = data.id;
  }

  return result;
}
