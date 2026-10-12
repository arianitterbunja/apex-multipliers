export function Celebration({ amount, multiplier, big, onClose }: { amount: number; multiplier: number; big: boolean; onClose: () => void }) {
  return (
    <button onClick={onClose} className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-black/80 backdrop-blur-sm">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 rounded-full animate-spark"
          style={{
            left: `${(i * 37) % 100}%`,
            top: "50%",
            background: i % 3 ? "var(--neon-blue)" : "var(--neon-violet)",
            animationDelay: `${(i % 10) * 0.08}s`,
            ["--dx" as string]: `${((i * 53) % 200) - 100}px`,
          }}
        />
      ))}
      <div className="animate-win-pop font-display text-4xl font-black tracking-widest text-white [text-shadow:0_0_20px_var(--neon-violet),0_0_40px_var(--neon-blue)] sm:text-6xl">
        {big ? "BIG WIN" : "MULTIPLIER!"}
      </div>
      {multiplier > 0 && <div className="mt-2 font-display text-2xl text-[#b967ff]">×{multiplier}</div>}
      <div className="mt-3 font-display text-3xl font-bold text-[#4deeea] sm:text-5xl">+{amount.toFixed(2)}</div>
      <div className="mt-4 text-xs tracking-widest text-gray-400">TAP TO CONTINUE</div>
    </button>
  );
}
