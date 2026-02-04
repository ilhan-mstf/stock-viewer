export function RSRankCell({ value }: { value: number }) {
    // Value is current RS Rank (0-99).
    // The image shows a series of bars. Let's mock a "history" of ranks.
    // We'll generate 5 bars, with the last one being 'value'.

    // Deterministic-ish random for visual consistency or just random
    const bars = [
        Math.max(1, value - 10),
        Math.max(1, value - 5),
        Math.max(1, value + 5),
        Math.max(1, value - 2),
        value
    ].map(v => Math.min(99, v));

    return (
        <div className="flex items-end gap-[1px] h-[20px] w-[40px]">
            {bars.map((h, i) => {
                const heightPct = (h / 99) * 100;
                const isCurrent = i === bars.length - 1;
                return (
                    <div
                        key={i}
                        className={`w-[6px] ${isCurrent ? 'bg-green-400' : 'bg-green-800/50'}`}
                        style={{ height: `${heightPct}%` }}
                    />
                );
            })}
        </div>
    );
}
