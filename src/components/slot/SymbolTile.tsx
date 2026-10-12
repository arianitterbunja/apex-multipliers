import { SYMBOL_MAP, type SymbolId } from "@/game/engine";
import { cn } from "@/lib/utils";

const toneClass = {
  blue: "text-[#4deeea] [text-shadow:0_0_12px_#4deeea]",
  violet: "text-[#b967ff] [text-shadow:0_0_12px_#b967ff]",
  white: "text-white [text-shadow:0_0_14px_rgba(255,255,255,0.8)]",
};

export function SymbolTile({ id, highlight, blur }: { id: SymbolId; highlight?: boolean; blur?: boolean }) {
  const s = SYMBOL_MAP[id];
  const isMult = !!s.multiplier;
  return (
    <div
      className={cn(
        "relative flex aspect-square w-full items-center justify-center rounded-lg border bg-[#1f1638]/60 font-display font-bold transition-all",
        isMult ? "border-[#b967ff]/60 text-[clamp(0.9rem,3.5vw,1.6rem)]" : "border-white/10 text-[clamp(1.4rem,6vw,3rem)]",
        toneClass[s.tone],
        blur && "blur-[2px]",
        highlight && "z-10 scale-105 border-[#4deeea] shadow-[0_0_24px_#4deeea] animate-pulse",
      )}
    >
      {id === "crystal" ? <span className="text-[1.2em]">◆</span> : s.label}
      {isMult && <span className="absolute bottom-1 text-[0.45rem] tracking-[0.2em] text-gray-400">MULTI</span>}
    </div>
  );
}
