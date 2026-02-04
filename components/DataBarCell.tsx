import { cn, formatPercentage } from "@/lib/utils";
import { TrendArrow } from "./TrendArrow";

interface DataBarCellProps {
    value: number;
    type?: 'bar' | 'fill'; // Bar chart style or full fill
}

export function DataBarCell({ value, type = 'fill' }: DataBarCellProps) {
    const isPositive = value >= 0;
    // Vivid colors for dark mode
    const bg = isPositive ? "bg-[#00C853]" : "bg-[#FF4D4D]";
    const text = "text-white";

    if (type === 'fill') {
        // Determine opacity based on magnitude logic? 
        // Or just solid? The image has solid blocks.
        return (
            <div className={cn("px-2 py-1 rounded-sm flex items-center justify-end font-mono font-bold", bg, text)}>
                {formatPercentage(value)}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-end font-mono text-white">
            <span className={cn("mr-1", isPositive ? "text-green-500" : "text-red-500")}>
                {formatPercentage(value)}
            </span>
        </div>
    );
}
