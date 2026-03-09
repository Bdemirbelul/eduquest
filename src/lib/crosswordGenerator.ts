import type {
  CrosswordDifficulty,
  CrosswordWordEntry,
} from "@/data/crosswordWords";
import { crosswordWords } from "@/data/crosswordWords";

export type Direction = "across" | "down";

export type PlacedWord = {
  id: string; // A1, D2 ...
  direction: Direction;
  row: number;
  col: number;
  answer: string;
  clue: string;
};

export type GeneratedPuzzle = {
  size: number;
  grid: (string | null)[][];
  words: PlacedWord[];
  difficulty: CrosswordDifficulty;
  level: number;
};

type InternalPlaced = Omit<PlacedWord, "id" | "clue"> & {
  clue: string;
};

const DEFAULT_SIZE = 10;

function emptyGrid(size: number): (string | null)[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
}

function canPlaceWord(
  grid: (string | null)[][],
  size: number,
  row: number,
  col: number,
  direction: Direction,
  answer: string,
  requireIntersection: boolean,
): boolean {
  const len = answer.length;
  if (direction === "across") {
    if (col + len > size) return false;
  } else if (row + len > size) return false;

  let hasIntersection = false;

  // Başlangıç ve bitiş hücrelerinin hemen yanlarında harf olmamalı
  if (direction === "across") {
    if (col > 0 && grid[row][col - 1]) return false;
    if (col + len < size && grid[row][col + len]) return false;
  } else {
    if (row > 0 && grid[row - 1][col]) return false;
    if (row + len < size && grid[row + len][col]) return false;
  }

  for (let i = 0; i < len; i += 1) {
    const r = row + (direction === "down" ? i : 0);
    const c = col + (direction === "across" ? i : 0);
    const existing = grid[r][c];
    const ch = answer[i];

    if (existing) {
      if (existing !== ch) return false; // farklı harf üzerine yazılamaz
      hasIntersection = true; // gerçek kesişim
    } else {
      // Komşuluk kuralları: yatay kelimede yukarı/aşağı; dikey kelimede sol/sağ boş olmalı
      if (direction === "across") {
        if (r > 0 && grid[r - 1][c]) return false;
        if (r < size - 1 && grid[r + 1][c]) return false;
      } else {
        if (c > 0 && grid[r][c - 1]) return false;
        if (c < size - 1 && grid[r][c + 1]) return false;
      }
    }
  }

  if (requireIntersection && !hasIntersection) return false;

  return true;
}

function placeWord(
  grid: (string | null)[][],
  size: number,
  row: number,
  col: number,
  direction: Direction,
  entry: CrosswordWordEntry,
): InternalPlaced {
  const answer = entry.answer;
  const len = answer.length;
  for (let i = 0; i < len; i += 1) {
    const r = row + (direction === "down" ? i : 0);
    const c = col + (direction === "across" ? i : 0);
    grid[r][c] = answer[i];
  }
  return {
    direction,
    row,
    col,
    answer,
    clue: entry.clue,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWordsForDifficulty(
  difficulty: CrosswordDifficulty,
  hedefAdet: number,
): CrosswordWordEntry[] {
  const havuz = crosswordWords.filter((w) => w.difficulty === difficulty);
  if (!havuz.length) return [];
  return shuffle(havuz).slice(0, hedefAdet);
}

function assignClueIds(placed: InternalPlaced[]): PlacedWord[] {
  const across = placed
    .filter((w) => w.direction === "across")
    .sort((a, b) => (a.row - b.row) || (a.col - b.col));
  const down = placed
    .filter((w) => w.direction === "down")
    .sort((a, b) => (a.col - b.col) || (a.row - b.row));

  const sonuc: PlacedWord[] = [];
  let sayacA = 1;
  let sayacD = 1;

  for (const w of across) {
    sonuc.push({
      id: `A${sayacA}`,
      direction: "across",
      row: w.row,
      col: w.col,
      answer: w.answer,
      clue: w.clue,
    });
    sayacA += 1;
  }
  for (const w of down) {
    sonuc.push({
      id: `D${sayacD}`,
      direction: "down",
      row: w.row,
      col: w.col,
      answer: w.answer,
      clue: w.clue,
    });
    sayacD += 1;
  }
  return sonuc;
}

export function generateCrossword(
  level: number,
  difficulty: CrosswordDifficulty,
): GeneratedPuzzle {
  const size = DEFAULT_SIZE;
  const grid = emptyGrid(size);

  const hedefAdet =
    difficulty === "easy" ? 5 : difficulty === "medium" ? 7 : 9;
  const minimumAdet = Math.max(3, Math.floor(hedefAdet * 0.6));

  const adaylar = pickWordsForDifficulty(difficulty, hedefAdet * 2);
  const placed: InternalPlaced[] = [];

  for (const entry of adaylar) {
    const answer = entry.answer;
    if (answer.length < 3 || answer.length > size) continue;

    let yerlesti = false;
    const orientations: Direction[] =
      Math.random() < 0.5 ? ["across", "down"] : ["down", "across"];

    for (const direction of orientations) {
      if (yerlesti) break;
      const maxRow = direction === "down" ? size - answer.length : size;
      const maxCol = direction === "across" ? size - answer.length : size;

      const startPositions: { row: number; col: number }[] = [];
      for (let r = 0; r < maxRow; r += 1) {
        for (let c = 0; c < maxCol; c += 1) {
          startPositions.push({ row: r, col: c });
        }
      }

      for (const pos of shuffle(startPositions)) {
        const requireIntersection = placed.length > 0;
        if (
          canPlaceWord(
            grid,
            size,
            pos.row,
            pos.col,
            direction,
            answer,
            requireIntersection,
          )
        ) {
          const p = placeWord(
            grid,
            size,
            pos.row,
            pos.col,
            direction,
            entry,
          );
          placed.push(p);
          yerlesti = true;
          break;
        }
      }
    }

    if (placed.length >= hedefAdet) break;
  }

  if (!placed.length || placed.length < minimumAdet) {
    // başarısız / zayıf yerleşim ise yeniden dene
    return generateCrossword(level, difficulty);
  }

  const words = assignClueIds(placed);

  return {
    size,
    grid,
    words,
    difficulty,
    level,
  };
}

