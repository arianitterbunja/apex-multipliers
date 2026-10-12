import { Minus, Plus } from "lucide-react";

export const BET_STEPS = [0.5, 1, 2, 5, 10, 25, 50, 100];

export function Controls({
  balance, bet, lastWin, spinning, onBet, onSpin,
}: {
  balance: number; bet: number; lastWin: number; spinning: boolean;
  onBet: (dir: -1 | 1) => void; onSpin: () => void;
}) {
  const Stat = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div className="rounded-xl border border-white/10 bg-[#1f1638]/70 px-4 py-2 text-center">
      <div className="text-[0.65rem] tracking-[0.25em] text-gray-400">{label}</div>
      <div className={`font-display text-lg font-bold sm:text-xl ${accent ? "text-[#4deeea]" : "text-white"}`}>{value}</div>
    </div>
  );
  return (
    <div className="grid w-full grid-cols-2 items-center gap-3 sm:grid-cols-[1fr_auto_1fr_1fr]">
      <Stat label="BALANCE" value={balance.toFixed(2)} />
      <div className="order-last col-span-2 flex justify-center sm:order-none sm:col-span-1">
        <button
          onClick={onSpin}
          disabled={spinning || balance < bet}
          className="h-24 w-24 rounded-full bg-gradient-to-br from-[#4deeea] to-[#b967ff] font-display text-xl font-black tracking-widest text-black shadow-[0_0_40px_#b967ff] transition hover:scale-105 active:scale-95 disabled:opacity-50 sm:h-28 sm:w-28 cursor-pointer"
        >
          {spinning ? "···" : "SPIN"}
        </button>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#1f1638]/70 px-2 py-2 text-center">
        <div className="text-[0.65rem] tracking-[0.25em] text-gray-400">BET</div>
        <div className="flex items-center justify-between">
          <button aria-label="Ul bastin" disabled={spinning} onClick={() => onBet(-1)} className="rounded-md p-1 text-[#b967ff] hover:bg-white/10"><Minus size={18} /></button>
          <span className="font-display text-lg font-bold sm:text-xl">{bet.toFixed(2)}</span>
          <button aria-label="Rrit bastin" disabled={spinning} onClick={() => onBet(1)} className="rounded-md p-1 text-[#b967ff] hover:bg-white/10"><Plus size={18} /></button>
        </div>
      </div>
      <Stat label="WIN" value={lastWin.toFixed(2)} accent />
    </div>
  );
}
