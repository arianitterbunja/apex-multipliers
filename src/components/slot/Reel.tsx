import { useEffect, useState } from "react";
import { randomSymbol, ROWS, type SymbolId } from "@/game/engine";
import { SymbolTile } from "./SymbolTile";

export function Reel({
  symbols,
  spinning,
  reelIndex,
  highlights,
}: {
  symbols: SymbolId[];
  spinning: boolean;
  reelIndex: number;
  highlights: Set<string>;
}) {
  const [display, setDisplay] = useState(symbols);

  useEffect(() => {
    if (!spinning) {
      setDisplay(symbols);
      return;
    }
    const t = setInterval(() => setDisplay(Array.from({ length: ROWS }, () => randomSymbol())), 70);
    return () => clearInterval(t);
  }, [spinning, symbols]);

  return (
    <div className={`flex flex-col gap-1.5 sm:gap-2 ${spinning ? "animate-reel-shake" : "animate-reel-stop"}`}>
      {display.map((id, row) => (
        <SymbolTile key={row} id={id} blur={spinning} highlight={!spinning && highlights.has(`${reelIndex}-${row}`)} />
      ))}
    </div>
  );
}
