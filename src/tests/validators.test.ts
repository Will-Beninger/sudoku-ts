import { describe, it, expect } from 'vitest';
import { validatePuzzle, validateGameState } from '../services/validators';

describe('validatePuzzle', () => {
  const validPuzzle = {
    id: 'test-1',
    difficulty: 'easy',
    initialBoard: '5'.repeat(81),
    solutionBoard: '9'.repeat(81),
  };

  it('accepts a valid puzzle', () => {
    expect(validatePuzzle(validPuzzle)).toEqual(validPuzzle);
  });

  it('rejects null', () => {
    expect(validatePuzzle(null)).toBeNull();
  });

  it('rejects missing id', () => {
    expect(validatePuzzle({ ...validPuzzle, id: '' })).toBeNull();
  });

  it('rejects invalid difficulty', () => {
    expect(validatePuzzle({ ...validPuzzle, difficulty: 'impossible' })).toBeNull();
  });

  it('rejects short board string', () => {
    expect(validatePuzzle({ ...validPuzzle, initialBoard: '123' })).toBeNull();
  });

  it('rejects board with non-digit characters', () => {
    expect(validatePuzzle({ ...validPuzzle, initialBoard: 'a'.repeat(81) })).toBeNull();
  });
});

describe('validateGameState', () => {
  const validState = {
    id: 1,
    puzzle: {
      id: 'test-1',
      difficulty: 'easy',
      initialBoard: '5'.repeat(81),
      solutionBoard: '9'.repeat(81),
    },
    grid: {
      rows: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: null,
          isFixed: false,
          isValid: true,
          notes: new Set<number>(),
        }))
      ),
    },
    elapsedTimeSeconds: 42,
    lastPlayed: '2026-04-25T12:00:00Z',
  };

  it('accepts valid game state', () => {
    const result = validateGameState(validState);
    expect(result).not.toBeNull();
    expect(result?.puzzle.id).toBe('test-1');
    expect(result?.elapsedTimeSeconds).toBe(42);
  });

  it('rejects null', () => {
    expect(validateGameState(null)).toBeNull();
  });

  it('rejects state with invalid puzzle', () => {
    expect(validateGameState({ ...validState, puzzle: { id: '' } })).toBeNull();
  });

  it('rejects state with negative elapsed time', () => {
    expect(validateGameState({ ...validState, elapsedTimeSeconds: -1 })).toBeNull();
  });

  it('rejects state with wrong grid dimensions', () => {
    expect(validateGameState({ ...validState, grid: { rows: [] } })).toBeNull();
  });

  it('rejects state with missing lastPlayed', () => {
    expect(validateGameState({ ...validState, lastPlayed: 123 })).toBeNull();
  });

  it('accepts state without optional id', () => {
    const stateWithoutId = { ...validState };
    delete (stateWithoutId as Record<string, unknown>).id;
    const result = validateGameState(stateWithoutId);
    expect(result).not.toBeNull();
    expect(result?.id).toBeUndefined();
  });
});
