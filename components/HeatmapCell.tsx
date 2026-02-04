import { cn } from "@/lib/utils";

interface HeatmapCellProps {
    value: number | null;
    max?: number; // Optional max value to calculate intensity
    className?: string;
    format?: (val: number) => string;
}

export function HeatmapCell({ value, max = 100, className, format }: HeatmapCellProps) {
    if (value === null || value === undefined) return <div className={cn("text-gray-500", className)}>n/a</div>;

    // Simple sequential yellow -> orange scale
    // 0 -> Transparent
    // Max -> Orange
    // We can use an opacity on a background color
    const intensity = Math.min(Math.max(value / max, 0), 1);

    // Determine text color - User requested always black for simplicity
    const textColor = "text-gray-900";

    return (
        <div className={cn("relative px-2 py-1 flex items-center justify-end rounded-sm font-mono font-medium", className)}>
            <div
                className="absolute inset-0 bg-amber-500 rounded-sm"
                style={{ opacity: 0.15 + (intensity * 0.70) }} // Cap opacity at 0.85 so black text is always visible
            />
            <span className={cn("relative z-10", textColor)}>
                {format ? format(value) : value.toFixed(2)}
            </span>
        </div>
    );
}
