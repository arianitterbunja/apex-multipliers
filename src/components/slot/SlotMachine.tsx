import { useMemo, useState } from "react";
import { evaluate, randomGrid, type Grid, type SpinResult } from "@/game/engine";
import { Reel } from "./Reel";
import { Controls, BET_STEPS } from "./Controls";
import { Celebration } from "./Celebration";

const STOP_STAGGER = 250;
const BASE_SPIN = 1100;

export function SlotMachine() {
  const [grid, setGrid] = useState<Grid>(() => [["A","K","Q"],["J","crystal","A"],["K","x2","Q"],["Q","A","J"],["crystal","J","K"]]);
  const [spinningReels, setSpinningReels] = useState<boolean[]>(Array(5).fill(false));
  const [balance, setBalance] = useState(1000);
  const [betIdx, setBetIdx] = useState(1);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const bet = BET_STEPS[betIdx] ?? 1;
  const spinning = spinningReels.some(Boolean);

  const highlights = useMemo(() => {
    const s = new Set<string>();
    result?.wins.forEach((w) => w.cells.forEach(([r, c]) => s.add(`${r}-${c}`)));
    result?.multiplierCells.forEach(([r, c]) => s.add(`${r}-${c}`));
    return s;
  }, [result]);

  const spin = () => {
    if (spinning || balance < bet) return;
    setBalance((b) => +(b - bet).toFixed(2));
    setResult(null);
    setCelebrate(false);
    const next = randomGrid();
    setGrid(next);
    setSpinningReels(Array(5).fill(true));
    next.forEach((_, i) =>
      setTimeout(() => setSpinningReels((p) => p.map((v, j) => (j === i ? false : v))), BASE_SPIN + i * STOP_STAGGER),
    );
    setTimeout(() => {
      const r = evaluate(next, bet);
      setResult(r);
      if (r.total > 0) setBalance((b) => +(b + r.total).toFixed(2));
      if (r.total >= bet * 10 || r.multiplier > 0) setCelebrate(true);
    }, BASE_SPIN + 4 * STOP_STAGGER + 100);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-3 py-6 sm:gap-8 sm:py-10">
      <header className="text-center">
        <h1 className="font-display text-3xl font-black tracking-[0.15em] text-white [text-shadow:0_0_18px_#b967ff] sm:text-5xl">
          APEX <span className="text-[#4deeea] [text-shadow:0_0_18px_#4deeea]">MULTIPLIERS</span>
        </h1>
        <p className="mt-2 text-xs tracking-[0.3em] text-gray-400">5 LINES · 3+ MATCH · MULTIPLIERS STACK</p>
      </header>

      <div className="relative w-full rounded-2xl border border-[#b967ff]/40 bg-[#1f1638]/40 p-2 shadow-[0_0_60px_-10px_#b967ff] sm:p-4">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {grid.map((col, i) => (
            <Reel key={i} reelIndex={i} symbols={col} spinning={!!spinningReels[i]} highlights={highlights} />
          ))}
        </div>
        {celebrate && result && (
          <Celebration amount={result.total} multiplier={result.multiplier} big={result.total >= bet * 10} onClose={() => setCelebrate(false)} />
        )}
      </div>

      <div className="h-6 text-center font-display text-sm tracking-widest text-[#4deeea]">
        {result && (result.total > 0 ? `WIN ${result.total.toFixed(2)}${result.multiplier ? ` (×${result.multiplier})` : ""}` : "NO WIN — TRY AGAIN")}
      </div>

      <Controls
        balance={balance}
        bet={bet}
        lastWin={result?.total ?? 0}
        spinning={spinning}
        onBet={(d) => setBetIdx((i) => Math.min(BET_STEPS.length - 1, Math.max(0, i + d)))}
        onSpin={spin}
      />
      {balance < bet && !spinning && (
        <button onClick={() => setBalance(1000)} className="text-xs tracking-widest text-[#b967ff] underline">RELOAD 1000 CREDITS</button>
      )}
      <p className="text-center text-[0.65rem] text-gray-400">Play-money demo only. No real money.</p>
    </div>
  );
}
