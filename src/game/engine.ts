export type SymbolId = "crystal" | "A" | "K" | "Q" | "J" | "x2" | "x5" | "x10" | "x100";

export interface SymbolDef {
  id: SymbolId;
  label: string;
  weight: number;
  payout: number;
  multiplier?: number;
  tone: "blue" | "violet" | "white";
}

export const SYMBOLS: SymbolDef[] = [
  { id: "crystal", label: "◆", weight: 6, payout: 5, tone: "white" },
  { id: "A", label: "A", weight: 10, payout: 2, tone: "violet" },
  { id: "K", label: "K", weight: 12, payout: 1.5, tone: "blue" },
  { id: "Q", label: "Q", weight: 14, payout: 1, tone: "violet" },
  { id: "J", label: "J", weight: 16, payout: 0.5, tone: "blue" },
  { id: "x2", label: "2x", weight: 5, payout: 0, multiplier: 2, tone: "blue" },
  { id: "x5", label: "5x", weight: 3, payout: 0, multiplier: 5, tone: "violet" },
  { id: "x10", label: "10x", weight: 1.5, payout: 0, multiplier: 10, tone: "white" },
  { id: "x100", label: "100x", weight: 0.3, payout: 0, multiplier: 100, tone: "white" },
];

export const SYMBOL_MAP = Object.fromEntries(SYMBOLS.map((s) => [s.id, s])) as Record<SymbolId, SymbolDef>;

export const REELS = 5;
export const ROWS = 3;

export const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
];

const totalWeight = SYMBOLS.reduce((a, s) => a + s.weight, 0);

export function randomSymbol(rng = Math.random): SymbolId {
  let r = rng() * totalWeight;
  for (const s of SYMBOLS) {
    if ((r -= s.weight) <= 0) return s.id;
  }
  return "J";
}

export type Grid = SymbolId[][];

export function randomGrid(rng = Math.random): Grid {
  return Array.from({ length: REELS }, () => Array.from({ length: ROWS }, () => randomSymbol(rng)));
}

export interface LineWin {
  line: number;
  symbol: SymbolId;
  count: number;
  amount: number;
  cells: [number, number][];
}

export interface SpinResult {
  wins: LineWin[];
  baseWin: number;
  multiplier: number;
  total: number;
  multiplierCells: [number, number][];
}

const COUNT_FACTOR: Record<number, number> = { 3: 1, 4: 2, 5: 5 };

export function evaluate(grid: Grid, bet: number): SpinResult {
  const wins: LineWin[] = [];
  PAYLINES.forEach((line, li) => {
    const first = grid[0]![line[0]!] as SymbolId;
    if (SYMBOL_MAP[first].multiplier) return;
    let count = 1;
    while (count < REELS && grid[count]![line[count]!] === first) count++;
    if (count >= 3) {
      wins.push({
        line: li,
        symbol: first as SymbolId,
        count,
        amount: +(bet * SYMBOL_MAP[first as SymbolId].payout * (COUNT_FACTOR[count] ?? 1)).toFixed(2),
        cells: line.slice(0, count).map((row, reel) => [reel, row]),
      });
    }
  });
  const baseWin = wins.reduce((a, w) => a + w.amount, 0);
  const multiplierCells: [number, number][] = [];
  let multiplier = 0;
  grid.forEach((col, reel) =>
    col.forEach((id, row) => {
      const m = SYMBOL_MAP[id].multiplier;
      if (m) {
        multiplier += m;
        multiplierCells.push([reel, row]);
      }
    }),
  );
  const applied = baseWin > 0 && multiplier > 0 ? multiplier : 1;
  return {
    wins,
    baseWin,
    multiplier: baseWin > 0 ? multiplier : 0,
    total: +(baseWin * applied).toFixed(2),
    multiplierCells: baseWin > 0 ? multiplierCells : [],
  };
}
