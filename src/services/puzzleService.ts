import type { Puzzle, PuzzlePack, Difficulty, RawPuzzlePackJson } from '../models/puzzle';

const BASE_URL = import.meta.env.BASE_URL;

const packCache = new Map<Difficulty, PuzzlePack>();

const PACK_CONFIG: Record<Difficulty, { file: string; name: string }> = {
  easy: { file: 'easy_pack.json', name: 'Classic Easy' },
  medium: { file: 'medium_pack.json', name: 'Classic Medium' },
  hard: { file: 'hard_pack.json', name: 'Classic Hard' },
};

function mapRawPuzzle(raw: RawPuzzlePackJson['puzzles'][number], difficulty: Difficulty): Puzzle {
  return {
    id: raw.id,
    initialBoard: raw.initial,
    solutionBoard: raw.solution,
    difficulty,
  };
}

export async function loadPuzzlePack(difficulty: Difficulty): Promise<PuzzlePack> {
  const cached = packCache.get(difficulty);
  if (cached) return cached;

  const config = PACK_CONFIG[difficulty];
  const response = await fetch(`${BASE_URL}puzzles/${config.file}`);
  if (!response.ok) {
    throw new Error(`Failed to load puzzle pack: ${config.file} (${String(response.status)})`);
  }

  const raw = (await response.json()) as RawPuzzlePackJson;
  const pack: PuzzlePack = {
    id: raw.packId,
    name: config.name,
    puzzles: raw.puzzles.map((p) => mapRawPuzzle(p, difficulty)),
  };

  packCache.set(difficulty, pack);
  return pack;
}

export async function loadAllPacks(): Promise<PuzzlePack[]> {
  const [easy, medium, hard] = await Promise.all([
    loadPuzzlePack('easy'),
    loadPuzzlePack('medium'),
    loadPuzzlePack('hard'),
  ]);
  return [easy, medium, hard];
}

export function getPuzzleById(packs: PuzzlePack[], id: string): Puzzle | undefined {
  for (const pack of packs) {
    const found = pack.puzzles.find((p) => p.id === id);
    if (found) return found;
  }
  return undefined;
}

export function clearPuzzleCache(): void {
  packCache.clear();
}
